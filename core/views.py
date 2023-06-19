from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from googlefit.views import *
import pyrebase
from googlefit.models import Doctors
from googlefit.serializers import DoctorSerializer
from django.contrib.auth.hashers import make_password, check_password

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

# Login an doctor 
def login (req):
    email = req.GET.get('email', '')
    password = req.GET.get('password', '')
    iduser = 0
    doctors = DoctorSerializer(Doctors.objects.filter(email = email), many=True).data
    resp = JsonResponse({}, safe=False)
    if len(doctors) == 0:
        resp = JsonResponse({ 'success': False, 'message': "L'email que vous avez renseigné n'existe pas dans la db, veuillez réessayer"}, safe=False)
    else:
        dbpass = list(doctors[0].items())[3][1]
        # Compare passwords using sha256 encrypting method
        # hashed = make_password('test', 'password', 'pbkdf2_sha256')
        # Defaut password for the dummy doctor is 'test'
        is_match = check_password(password, dbpass)
        if is_match == False:
            resp = JsonResponse({ 'success': False, 'message': "Le mot de passe que vous avez mentionné est invalide. Veuillez réessayer"}, safe=False)
        else:
            id = list(doctors[0].items())[0][1]
            name = list(doctors[0].items())[1][1]
            resp = JsonResponse({ 'success': True, 'message': {
                'id': id,
                'name': name
            }}, safe=False)
    return resp
    

# Sign up a doctor
def signup (req):
    name = req.GET.get('name', '')
    email = req.GET.get('email', '')
    password = req.GET.get('password', '')
    kbis = req.GET.get('password', '')
    refreshToken = 'QSDQSD'
    iduser = 0
    doctors = DoctorSerializer(Doctors.objects.filter(email = email), many=True).data
    resp = JsonResponse({}, safe=False)
    if len(doctors) != 0:
        resp = JsonResponse({ 'success': False, 'message': "L'email que vous avez renseigné existe déja dans la db, veuillez changer d'addresse ou veuillez vous connecter"}, safe=False)
    else:
        # Compare passwords using sha256 encrypting method
        hashedpass = make_password(password, 'password', 'pbkdf2_sha256')
        print(hashedpass)
        doctor = Doctors(
            name = name,
            email = email,
            password = hashedpass,
            kbis = kbis,
            refreshToken = refreshToken
        )
        doctor.save()
        id = doctor.id
        resp = JsonResponse({ 'success': True, 'message': {
            'id': id,
            'name': name
        }}, safe=False)
    return resp

# Register a patient
def registerpatient (req):
    email = req.GET.get('email', '')
    print(email)
    resp = JsonResponse({ 'success': True, 'message': "Un email a été envoyé à ce patient pour qu'il s'enregistre !"}, safe=False)
    return resp