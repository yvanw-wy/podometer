from __future__ import absolute_import, unicode_literals
from celery import shared_task
from celery.utils.log import get_task_logger
import numpy as np
import pandas as pd
import json
import datetime as dt
from datetime import date
import os
import pyrebase
from .utils.analysis import *

logger = get_task_logger(__name__)

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

def diff_month(d1, d2):
    return abs((d1.year - d2.year) * 12 + d1.month - d2.month)


@shared_task(name="alert_activity")
def alert_activity():
    users = database.child("users").get().val()
    thresholds = database.child("threshold").get().val()
    
    for individual_threshold in thresholds.items():
        listed_user = list(individual_threshold)
        user_id = listed_user[0]
        database.child("threshold").child(user_id).update({ 'is_checked': False })
    logger.info("Task done !!!")
        
    for user in users.items():
        listed_user = list(user)
        user_id = listed_user[0]
        start_date = listed_user[1]['created_at']
        start_date = dt.datetime.fromtimestamp(start_date)
        today = date.today()
        result = diff_month(today, start_date)
        if result % 6 == 0 and result != 0:
            steps_datas = database.child("bucket").child(user_id).get().val()
            
            #Transforming datas to dataframes
            df = pd.DataFrame(steps_datas)

            # Preprocessing
            df = preprocess_datas(df)

            # Function for handling missing datas
            df = missing_datas(df)

            # Setting new confidence thresholds
            [lower_bound, upper_bound, mean] = set_confidence_thresholds(df)

            database.child("threshold").child(user_id).update({ 
                'lower_bound': lower_bound,
                'upper_bound': upper_bound,
                'mean': mean
            })
    logger.info("Task done x 2 !!!")
    