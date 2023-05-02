import numpy as np
import pandas as pd
import json
from datetime import datetime, date
import os
import math
import pickle

array_activities = ['AU_REPOS', 'ACTIVITE_INTENSE', 'MARCHE_PASSIVE']

def preprocess_datas(df):
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
    return df_flat5


def missing_datas(df):
    return df

counter = 0
def inactivity_user(row):
    global counter
    if row['dataset.point.value.intVal'] == 0:
        if row['hour'] == 0:
            counter = 0 # Reinitialize track
        else:
            counter += 1 # Keep track of the inactivity
    return counter

def classify_activity(df):
    df_user = df.copy()
    df_user['hour'] = df_user['startTimeMillis'].dt.hour # Create a new column named "Hour"
    df_user["startTimeMillis"] = pd.to_datetime(df_user["startTimeMillis"]).dt.date
    df_user = df_user[df_user['startTimeMillis'] == date.today()]
    df_user['inactivity'] = df_user.apply(inactivity_user, axis=1) # Create a new column named "Inactivity" to capture the inactivity tracking in hours
    if df_user.size == 0:
        return "NO_DATA"
    else:
        today_activity = df_user.iloc[-1]
        value = today_activity['dataset.point.value.intVal']
        inactivity = today_activity['inactivity']
        actual_data = pd.DataFrame({ 'dataset.point.value.intVal': value, 'inactivity': inactivity }, index=[0])

        model_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "./model/classified_activities.pickle")
        with open(model_path, 'rb') as f:
            knn = pickle.load(f)
        y_pred = knn.predict(actual_data)
        output = array_activities[y_pred[0]]
        print(output)
        return output



def data_viz_front(df):
    df['day'] = df['startTimeMillis'].dt.day # Create a new column named "Day"
    df['hour'] = df['startTimeMillis'].dt.hour # Create a new column named "Hour"

    df_mean = df.copy() # Create the dataframe which will hold the median values of the series
    df_mean2 = df_mean.groupby(['day', 'hour'], as_index=False)['dataset.point.value.intVal'].mean()

    df_month_grouper = df.copy() # Create the dataframe which will hold the values of the series aggregated per month-year
    df_month_grouper = df_month_grouper.groupby(pd.Grouper(key='startTimeMillis', freq='M'))
    df_month_grouper = [group.to_dict() for _,group in df_month_grouper]
    return [df_month_grouper, df_mean2] 


def check_alert(df, confidence_datas, database, id):
    success = False
    if confidence_datas['is_checked'] == False:
        df_single_month = df.copy() # Create the dataframe which will hold the median values of the df
        month_compare = datetime.now().month
        df_single_month = df_single_month[df_single_month['startTimeMillis'].dt.month == month_compare] # Filter records by the actual month
        df_single_month = df_single_month.groupby(pd.Grouper(key='startTimeMillis', freq='D')).sum()
        df_single_month = df_single_month.iloc[:-1] 
        if df_single_month.size != 0:
            mean_value_month = df_single_month.mean().mean() # Getting the mean value of the actual month
            scale_mean = confidence_datas['mean'] - mean_value_month
            if confidence_datas['lower_bound'] > scale_mean or scale_mean > confidence_datas['upper_bound']:
                success = True
        database.child("threshold").child(id).update({ 'is_checked': True })
    return success

def set_confidence_thresholds(df):
    df_single_month = df.copy() # Create the copy of the dataframe for getting the last 6 months
    df_single_month = df_single_month.groupby(pd.Grouper(key='startTimeMillis', freq='M')).mean()
    df_single_month = df_single_month.sort_values(by='startTimeMillis', ascending=False)
    df_single_month = df_single_month.iloc[:-1]
    df_single_month = df_single_month.head(6)
    data_archive_firebase = []
    data_archive_firebase.extend(df_single_month['dataset.point.value.intVal'].tolist())    
    mean_archive = np.mean(data_archive_firebase) # Mean of means
    data_dist = []

    for i in data_archive_firebase: # Simple way to get distance between means
        data_dist.append(mean_archive - i)
    mean_of_distances = np.mean(data_dist) # Mean of distances
    std_of_distances = np.std(data_dist) # Std of distances
    length_table= len(data_dist) # Length of the table of distances
    
    lower_bound = mean_of_distances - (2.561*std_of_distances/math.sqrt(length_table))
    upper_bound = mean_of_distances + (2.561*std_of_distances/math.sqrt(length_table))

    return [lower_bound, upper_bound, mean_archive]