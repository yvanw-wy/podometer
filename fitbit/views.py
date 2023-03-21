from django.shortcuts import render
import base64
import hashlib
import html
import json
import os
import re
import urllib.parse
import requests
from datetime import datetime

#Setting up the fitbit API

#Function used to generate the code the code verifier
def generateCodeVerifier():
    code_verifier = base64.urlsafe_b64encode(os.urandom(40)).decode('utf-8')
    code_verifier = re.sub('[^a-zA-Z0-9]+', '', code_verifier)
    return code_verifier

#Function used to generate the code challenge from a code verifier
def generateCodeChallenge(code_verifier):
    code_challenge = hashlib.sha256(code_verifier.encode('utf-8')).digest()
    code_challenge = base64.urlsafe_b64encode(code_challenge).decode('utf-8')
    code_challenge = code_challenge.replace('=', '')
    return code_challenge

#Function used to build the url in order to request authorization to Fitbut User datas
def generateAuthorizationURl(code_challenge):
    client_id = "23QTLC"
    fitbit_url = "https://api.fitbit.com/oauth2"
    url = fitbit_url + "/authorize?client_id=" + client_id + "&response_type=code&code_challenge=" + code_challenge + "&code_challenge_method=S256&scope=activity%20heartrate%20location%20nutrition%20oxygen_saturation%20profile%20respiratory_rate%20settings%20sleep%20social%20temperature%20weight"
    return url

#Function used to exchange the Authorization Code for the Access and Refresh Tokens
def getTokens(authorization_code, code_verifier):
    client_id = "23QTLC"
    fitbit_url = "https://api.fitbit.com/oauth2"
    resp = requests.post(
        url = fitbit_url + "/token",
        data = {
            "client_id": client_id,
            "Content-Type": "application/x-www-form-urlencoded",
            "code": authorization_code,
            "code_verifier": code_verifier, 
            "grant_type": "authorization_code"
        }
    )
    accessToken = resp.json().get('access_token')
    refreshToken = resp.json().get('refresh_token')
    user_id = resp.json().get('user_id')
    return [accessToken, refreshToken, user_id]


#Function used to get a new access token from the Refresh token
def getNewAccessToken(refresh_token):
    client_id = "23QTLC"
    fitbit_url = "https://api.fitbit.com/oauth2"
    resp = requests.post(
        url = fitbit_url + "/token",
        data = {
            "client_id": client_id,
            "Content-Type": "application/x-www-form-urlencoded",
            "refresh_token": refresh_token, 
            "grant_type": "refresh_token"
        }
    )
    accessToken = resp.json().get('access_token')
    refreshToken = resp.json().get('refresh_token')
    user_id = resp.json().get('user_id')
    return [accessToken, refreshToken, user_id]

#Function used to get User Datas from the Fitbit API using an access token
def getUserDatas(accessToken, userID):
    fitbit_url = "https://api.fitbit.com/"
    today = datetime.today().strftime('%Y-%m-%d')
    resp = requests.get(
        url = fitbit_url + "/1/user/" + userID + "/activities/steps/date/" + today + "/1m.json",
        headers = {
            "Authorization": "Bearer " + accessToken,
        }
    )
    return resp.json()
