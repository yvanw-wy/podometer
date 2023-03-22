from django.shortcuts import render
from googleapiclient.discovery import build
import requests
from datetime import datetime

#Function used to get user infos 
def getUserInfos(token):
    # Informations has been found, so we can proceed to get the email account by which the datas belongs to
    user_email = ''
    user_id = ''
    resp_account = requests.get(
        url = "https://www.googleapis.com/oauth2/v3/userinfo",
        headers = {
            "Authorization": "Bearer " + token,
        }
    )
    success = True
    if 'error' in resp_account.text:
        success = False
    else:
        user_email = resp_account.json()['email']
        user_id = resp_account.json()['sub']
    return [
        { 'success': success }, 
        { 'email': user_email }, 
        { 'id': user_id }
    ]
    

#Function used to get step datas
def getStepsGoogle(token, user_id, database):
    datas = []
    today_in_millis = int(datetime.now().timestamp()*1000)
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
            "startTimeMillis": 1677702000000, #From 1st march
            "endTimeMillis": today_in_millis, #Till today
            "Content-Type": "application/json"
        }
    )
    datas = resp.json()['bucket']
    database.child("bucket").child(user_id).set(datas)
    all_datas = database.child("bucket").get().val()

    return all_datas
