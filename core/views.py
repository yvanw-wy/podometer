from django.shortcuts import render
from fitbit.views import *
from django.http import JsonResponse, HttpResponse
from fitbit.models import Fitbit
from googlefit.views import *
from fitbit.serializers import FitbitSerializer
import pyrebase

config = {
    'apiKey': "AIzaSyBpwYU7VlAGmVZ_15euXRk9TI_xHbBbvm4",
    'authDomain': "podometer-firebase.firebaseapp.com",
    'projectId': "podometer-firebase",
    'storageBucket': "podometer-firebase.appspot.com",
    'messagingSenderId': "818739425442",
    'appId': "1:818739425442:web:9954bad1ca89d9653e27fb",
    'databaseURL': "https://podometer-firebase-default-rtdb.firebaseio.com",
}

firebase = pyrebase.initialize_app(config)
database = firebase.database()

#Workflow for handling Fitbit API (If any) in the future
#It uses auth code grant (oauth2)
def authAndGetData(req):
    payload = {}
    payload['url'] = ''
    payload['isDirect'] =  False
    payload['code_verifier'] =  ''
    payload['previous_code_verifier'] = ''
    payload['access_token'] = ''
    payload['refresh_token'] = ''
    datas_fitbit = []

    #Fitbit workflow
    accessTokenFibit = req.COOKIES.get('access_token', '')
    userIDFitbit = req.COOKIES.get('user_id', '')
    refreshTokenFitbit = req.COOKIES.get('refresh_token', '')
    hasTokenFitbit = False
    codeVerifierFitbit = ''
    if len(accessTokenFibit) < 10:
        #If the user doesn't have an access token of Fibtit
        codeVerifierFitbit = generateCodeVerifier()
        previous_code_verifier = req.COOKIES.get('code_verifier')
        code_challenge = generateCodeChallenge(codeVerifierFitbit)
        url = generateAuthorizationURl(code_challenge)
        
        authorization_code = req.GET.get('code', '')
        if len(authorization_code) > 10: 
            print("Code: " + previous_code_verifier)
            print("Authorization: " + authorization_code)
            [accessTokenFibit, refreshTokenFitbit, userIDFitbit] = getTokens(authorization_code, previous_code_verifier)
            hasTokenFitbit = True
            datas_fitbit = getUserDatas(accessTokenFibit, userIDFitbit)

        payload.update({
            'url': url,
            'isDirect': hasTokenFitbit,
            'code_verifier': codeVerifierFitbit,
            'previous_code_verifier': previous_code_verifier,
            'access_token': accessTokenFibit,
            'refresh_token': refreshTokenFitbit
        })
    else:
        datas_fitbit = getUserDatas(accessTokenFibit, userIDFitbit)
        error_type = 'None'
        if datas_fitbit.get('success') == False:
            error_type = datas_fitbit['errors'][0].get('errorType')
            if error_type == 'expired_token':
                refreshTokenFitbit = req.COOKIES.get('refresh_token', '')
                [accessTokenFibit, refreshTokenFitbit, userIDFitbit] = getNewAccessToken(refreshTokenFitbit)
                hasTokenFitbit = True
                datas_fitbit = getUserDatas(accessTokenFibit, userIDFitbit)
        payload.update({
            'isDirect': True
        })
    return [payload, datas_fitbit, accessTokenFibit, hasTokenFitbit,codeVerifierFitbit, refreshTokenFitbit, userIDFitbit]


# In the index page, 
# - handle Fitbit authentication (If any) in the future
def index (req):    
    [payload, datas_fitbit, accessTokenFibit, hasTokenFitbit,codeVerifierFitbit, refreshTokenFitbit, userIDFitbit] = authAndGetData(req)
    payload['datas_fitbit'] = datas_fitbit

    print(payload.get('user_info'))
    resp = JsonResponse(payload)
    if len(accessTokenFibit) < 10 or hasTokenFitbit == True:
        if len(accessTokenFibit) < 10:
            resp.set_cookie(key='code_verifier', value=codeVerifierFitbit)
        resp.set_cookie(key='access_token', value=accessTokenFibit)
        resp.set_cookie(key='refresh_token', value=refreshTokenFitbit)
        resp.set_cookie(key='user_id', value=userIDFitbit)
    return resp

# Return user informations
def getUserGoogle (req):
    token = req.GET.get('token', '')
    [state, user_id] = getUserInfos(database, token)
    resp = JsonResponse([state, user_id], safe=False)
    return resp

# Return user datas
def getDatasGoogle (req):
    token = req.GET.get('token', '')
    id = req.GET.get('id', '')
    datas = getStepsGoogle(token, id, database)
    resp = JsonResponse(datas, safe=False)
    return resp
