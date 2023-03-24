from django.shortcuts import render
from googleapiclient.discovery import build
import requests
from datetime import datetime
import numpy as np
import pandas as pd
import json
from tabulate import tabulate


#Function used to get user infos 
def getUserInfos(token):
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
        name = (response['given_name'] + '-' + response['family_name']).lower()
    return [
        { 'success': success }, 
        { 'email': user_email },
        { 'name': name }, 
        { 'id': user_id }
    ]
    

#Function used to get step datas
def getStepsGoogle(token, name, database):
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
    datas = resp.json()['bucket']
    database.child("bucket").child(name).set(datas)
    all_datas = database.child("bucket").get().val()

    # Formatting google fit datas
    for user, buckets in all_datas.items():
        if type(buckets) != str:
            df = pd.DataFrame(buckets)
            
            # Data extraction
            df2 = df.explode('dataset') # Explode dataset first and get the json representation
            json_struct = json.loads(df2.to_json(orient="records")) # Since datasets is in json, normalize the keys into colums
            df_flat = pd.json_normalize(json_struct)
            
            df_flat2 = df_flat.explode('dataset.point') # Then explode points (If any), and it will still return a json object
            json_struct_2 = json.loads(df_flat2.to_json(orient="records")) # And then normalize it
            df_flat3 = pd.json_normalize(json_struct_2)
            
            df_flat4 = df_flat3.explode('dataset.point.value') # Then explode points datas
            json_struct3 = json.loads(df_flat4.to_json(orient="records")) # Then normalize points
            df_flat5 = pd.json_normalize(json_struct3)
            
            df_flat5.drop(['endTimeMillis', 'dataset.point.value', 'dataset.point.dataTypeName', 'dataset.point.originDataSourceId', 'dataset.point.startTimeNanos', 'dataset.point.endTimeNanos', 'dataset.dataSourceId', 'dataset.point'], axis=1, inplace=True) # Drops the unwanted columns
            
            df_flat5['startTimeMillis'] = pd.to_datetime(df_flat5['startTimeMillis'], unit='ms') # Convert time to milliseconds

            df_flat5['dataset.point.value.intVal'] = df_flat5['dataset.point.value.intVal'].fillna(0) # Replace NaN with 0 in values
            col = df_flat5.pop("startTimeMillis") # Then invert cells
            df_flat5.insert(0, col.name, col)

            df_flat5['day'] = df_flat5['startTimeMillis'].dt.day # Create a new column named "Day"
            df_flat5['hour'] = df_flat5['startTimeMillis'].dt.hour # Create a new column named "Hour"

            df_mean = df_flat5.copy() # Create the dataframe which will hold the median values of the series
            df_mean2 = df_mean.groupby(['day', 'hour'], as_index=False)['dataset.point.value.intVal'].mean()

            df_month_grouper = df_flat5.copy() # Create the dataframe which will hold the values of the series aggregated per month-year
            df_month_grouper1 = df_month_grouper.groupby(pd.Grouper(key='startTimeMillis', freq='M'))
            df_month_grouper2 = [group.to_dict() for _,group in df_month_grouper1]
            
            output.append({ 'user_email': user, 'datas_month_grouper': df_month_grouper2, 'datas_mean': df_mean2.to_dict(), 'datas': df_flat5.to_dict() }) # Then send datas finally
        else: 
            output.append({ 'user_email': user, 'datas_month_grouper': {}, 'datas_mean': {}, 'datas': {} })

    return output
