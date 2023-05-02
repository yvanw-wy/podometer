from django.shortcuts import render
from googleapiclient.discovery import build
import requests
from datetime import datetime
import time
import numpy as np
import pandas as pd
import json
import sys
import os
fpath = os.path.join(os.path.dirname(__file__), 'utils')
sys.path.append(fpath)
import analysis


#Function used to get user infos 
def getUserInfos(database, token):
    # Informations has been found, so we can proceed to get the email account by which the datas belongs to
    user_email = ''
    name = ''
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
        response = resp_account.json()
        user_email = response['email']
        user_id = response['sub']
        name = (response['given_name'] + ' ' + response['family_name']).lower()
        # Check if this user exists already in the db: If not so, create a new one:
        user = database.child("users").child(user_id).get().val()
        if user is None:
            # Save user datas in the db of users
            database.child("users").child(user_id).set({
                'user_email': user_email,
                'name': name,
                'created_at': time.time()
            })
            database.child("threshold").child(user_id).set({
                'lower_bound': -1325.0327543564667,
                'upper_bound': 1325.0327543564667,
                'mean': 9211.479326676907,
                'is_checked': True
            })
    return [
        { 'success': success },
        { 'id': user_id }
    ]
    

#Function used to get step datas
def getStepsGoogle(token, id, database):
    output = []
    output_mean = []
    output_days = []
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
    steps_datas = []
    if 'error' in resp.text:
        steps_datas = database.child("bucket").get().val() # Getting just all datas from the user
    else:
        datas = resp.json()['bucket']
        database.child("bucket").child(id).set(datas)  # Setting the new datas to the db
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
