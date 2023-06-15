from django.shortcuts import render
from googleapiclient.discovery import build
from googlefit.models import Doctors
from googlefit.serializers import DoctorSerializer
import requests
from datetime import datetime, timedelta
import time
import numpy as np
import pandas as pd
import json
import sys
import os
import ast
fpath = os.path.join(os.path.dirname(__file__), 'utils')
sys.path.append(fpath)
import analysis
from rest_framework import viewsets

# To utilitize the doctors REST APIS (GET, POST, PUT, DELETE)
# To access the api, go to the endpoint: /doctors/doctors
class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctors.objects.all()
    serializer_class = DoctorSerializer

#Function used to save patients infos in firebase db
def saveUserInfos(database, token, refreshToken):
    # First, get user informations from the token: User email, name, id
    resp_account = requests.get(
        url = "https://www.googleapis.com/oauth2/v3/userinfo",
        headers = {
            "Authorization": "Bearer " + token,
        }
    )
    success = True
    user_id = ''
    if 'error' in resp_account.text:
        success = False
    else:
        response = resp_account.json()
        user_email = response['email']
        user_id = response['sub']
        name = (response['given_name'] + ' ' + response['family_name']).lower()
        user = database.child("users").child(user_id).get().val()
        if user is None:
            database.child("users").child(user_id).set({
                'user_email': user_email,
                'name': name,
                'created_at': time.time(),
                'accessToken': token,
                'refreshToken': refreshToken
            })
            database.child("threshold").child(user_id).set({
                'lower_bound': -1325.0327543564667,
                'upper_bound': 1325.0327543564667,
                'mean': 9211.479326676907,
                'is_checked': True
            })
        else:
            # Change only the tokens in the document of the user
            database.child("users").child(user_id).update({ 
                'accessToken': token,
                'refreshToken': refreshToken
            })
    return [
        { 'success': success },
        { 'id': user_id }
    ]

def getNewAccessToken(refreshToken, id, database, date, startTime):
    # Get new access token from the refresh token
    resp_account = requests.post(
        url = "https://oauth2.googleapis.com/token",
        json = {
            "client_secret": "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",
            "client_id": "416461471791-gi4p17cbm45tv9tfau8ahkutv263ns7d.apps.googleusercontent.com",
            "refresh_token": refreshToken,
            "grant_type": "refresh_token"
        }
    )
    json_resp = ast.literal_eval(resp_account.text)
    newAccessToken = json_resp['access_token']
    # Update the newly generated access token in the db of the user
    database.child("users").child(id).update({ 
        'accessToken': newAccessToken
    })
    # Get new datas from that token
    resp = fetchStepsGoogle(newAccessToken, date, startTime)
    
    return resp

def fetchStepsGoogle (token, date, startTime):
    resp = requests.post(
        url = "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
        headers = {
            "Authorization": "Bearer " + token,
        },
        json = {
            "aggregateBy": [
                {
                    "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
                }
            ],
            "bucketByTime": { 
                "durationMillis": 3600000 
            },
            "startTimeMillis": startTime, #From 1st march : 1677702000000
            "endTimeMillis": date, #Till today
            "Content-Type": "application/json"
        }
    )
    return resp

#Function used to get step datas
def getStepsGoogle(database):
    output = []
    output_bucket = []
    output_mean = []
    output_days = []
    today_in_millis = int(datetime.now().timestamp()*1000)
    current_date = datetime.today()
    delta = timedelta(days=45)  # 1.5 months is approximately 45 days
    target_date = current_date - delta
    estimatedStartDate = int(target_date.timestamp()*1000)


    # First, get all user datas from firebase
    users = database.child("users").get().val()
    for user, user_data in users.items():
        startTime = 0
        # Get the last time their datas has been fetched and use this last time as the startimeMillis parameter of googleFit to fetch their datas
        # If this user doesn't have any data yet, the startTimeMillis is just 1.5 month before the date of today
        getUserStartTime = database.child("bucket").child(user).get().val()
        last_index = len(getUserStartTime) if getUserStartTime else 0
        new_index = last_index
        if getUserStartTime is None:
            startTime = estimatedStartDate
        else:
            # Only extract the last dataset from that db
            lastDataset = getUserStartTime[-1]
            startTimeLastDataset = lastDataset.get('startTimeMillis')
            startTime = startTimeLastDataset

        # Get user informations using his access token
        token = user_data['accessToken']
        refreshToken = user_data['refreshToken']
        id = user
        resp = fetchStepsGoogle(token, today_in_millis, startTime)
        if 'error' in resp.text:
            # Check if it's the access token the problem. Then ask a new one, from the refreshToken
            json_error = ast.literal_eval(resp.text)
            status = json_error['error']['status']
            if status == 'UNAUTHENTICATED':
               # Obtain a new access token and get the datas
               resp = getNewAccessToken(refreshToken, id, database, today_in_millis, startTime)
               datas = resp.json()['bucket']
               i = new_index
               while i < len(datas) :
                    database.child("bucket").child(id).child(i).set(datas[i])  # Setting the new datas to the db
                    i += 1
        else :
            datas = resp.json()['bucket']
            i = new_index
            while i < len(datas) :
                database.child("bucket").child(id).child(i).set(datas[i])  # Setting the new datas to the db
                i += 1
    steps_datas = database.child("bucket").get().val() # Getting all datas from the user
    
    # Formatting google fit datas
    for user, buckets in steps_datas.items():
        if type(buckets) != str:

            # Query first of all user informations referring to that id
            user_infos = database.child("users").child(user).get().val() # Getting all user infos
            confidence_interval = database.child("threshold").child(user).get().val() # Getting it's threshold informations
            
            #Transforming datas to dataframes
            df = pd.DataFrame(buckets)
            
            # Preprocessing
            df = analysis.preprocess_datas(df)

            # Function for handling missing datas
            df = analysis.missing_datas(df)

            # Alert unusual activities (If any)
            should_alert = analysis.check_alert(df, confidence_interval, database, user) 

            # Classifiy actual activity
            activity_type = analysis.classify_activity(df)

            # Function useful to rearrange the dataframe format for data viz in the front-end
            [df_month_grouper, df_mean2] = analysis.data_viz_front(df)
            
            output.append({ 
                'user_name': user_infos['name'], 
                'user_id': user, 
                'datas_month_grouper': df_month_grouper, 
                'datas_mean': df_mean2.to_dict(), 
                'datas': df.to_dict(), 
                'features': {
                    'should_alert': should_alert,
                    'type_activity': activity_type
                }
            }) # Then send datas finally
            
        else: 
            output.append({ 
                'user_name': '', 
                'user_id': 0, 
                'datas_month_grouper': {}, 
                'datas_mean': {}, 
                'datas': {},
                'features': {
                    'should_alert': False,
                    'type_activity': 'NONE'
                } 
            })

    return output
