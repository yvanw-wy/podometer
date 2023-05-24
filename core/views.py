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

def index (req):
    resp = JsonResponse({"Text": "Hello world !!"}, safe=False)
    return resp

#Save UserDatas
def registerUserGoogle (req):
    accessToken = req.GET.get('token', '')
    refreshToken = req.GET.get('refreshToken', '')
    print(accessToken)
    print("...")
    print(refreshToken)
    
    #save user infos in the db
    [state, user_id] = saveUserInfos(database, accessToken, refreshToken)
    # Get the steps of this specific user

    resp = JsonResponse([state, user_id], safe=False)
    return resp

# Return user datas
def getDatasGoogle (req):
    datas = getStepsGoogle(database)
    resp = JsonResponse(datas, safe=False)
    return resp
