from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from googlefit.views import *
import pyrebase
from googlefit.models import Doctors
from googlefit.serializers import DoctorSerializer
from django.contrib.auth.hashers import make_password, check_password
import smtplib
from email.message import EmailMessage
import urllib.parse
from urllib.parse import urlparse, urlunparse, parse_qs, urlencode, quote_plus
from datetime import datetime, timedelta

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



# Constructing signing up link using encoded user's email
users = database.child("users").get().val()
new_email = 'audbemo3@gmail.com'
link_signup = 'https://bouzou.files.wordpress.com/2021/02/grimace-073....jpg?w=210' + urllib.parse.quote(new_email)

# generating message to user
def sending_message():
    for user, content in users.items():
        email = content['user_email']
        if new_email != email:
            print("Mail absent")
            # Authentification and configuration of STMP server
            smtp_server = 'smtp.gmail.com'
            smtp_port = 587
            smtp_username = 'audrey.nkowa@2024.icam.fr'
            smtp_password = 'dmxvbwaokokfhunq'
            
            # Email message creation
            msg = EmailMessage()
            msg['Subject'] = 'Enregistrez-vous dès maintenant pour votre suivi médical à distance'
            msg['From'] = 'audrey.nkowa@2024.icam.fr'
            msg['To'] = new_email
            
            # Message content
            msg.set_content('Cher(e) patient(e), \n\nVotre médecin traitant vous a recommandé notre plateforme de suivi médical à distance. Veuillez cliquer sur le lien suivant pour vous inscrire; \n\n' + link_signup +' \n\nMerci de votre collaboration. \n\nCordialement.')

            # Sending email via SMTP
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(smtp_username, smtp_password)
                server.send_message(msg)
            break
        else:
            print("Mail present")

# creating expiration
def add_expiration(url, expiration_minutes):
    parsed_url = urlparse(url)
    query_params = parse_qs(parsed_url.query)
    query_params['expiration'] = int(datetime.now().timestamp()) + expiration_minutes * 60
    encoded_params = urlencode(query_params, doseq=True)
    modified_url = urlunparse(parsed_url._replace(query=quote_plus(encoded_params)))
    return modified_url

# Vérifying if Url expired
def is_expired(url):
    parsed_url = urlparse(url)
    query_params = parse_qs(parsed_url.query)
    expiration = query_params.get('expiration', [None])[0]
    if expiration:
        expiration_timestamp = int(expiration)
        return datetime.now().timestamp() > expiration_timestamp
    return False

# creating expiration time
url = link_signup
url_with_expiration = add_expiration(url, 1)  # Add 60 minutes expiration
print("URL avec expiration :", url_with_expiration)

# Verifying if url expired
if is_expired(url_with_expiration):
    print("L'URL a expiré.")
else:
    print("L'URL est encore valide.")