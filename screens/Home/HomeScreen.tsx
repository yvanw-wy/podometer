import { StyleSheet, Text, View, Alert, Button, Platform } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import dispatchAPI from '../../api/apiContext'
import GoogleFit from '../../utils/Google/GoogleFit'

const HomeScreen = () => {
    let props_datas: any = {}
    const [datasGoogle, setDatasGoogle] = useState(props_datas);
    const [userInfo, setUserInfo] = useState(props_datas);
    const [accessToken, setAccessToken] = useState(props_datas);

  return (
    <View>
      {
        !Object.keys(accessToken).length ?
          <GoogleFit setDatasGoogle={setDatasGoogle} setUserInfo={setUserInfo} accessToken={accessToken} setAccessToken={setAccessToken} />
        :
        <>
          <Text>Authenticated with google API !</Text>
          <Text>datas - {userInfo.email}: {JSON.stringify(datasGoogle)}</Text>
        </>
      }
    </View>
  )
}

// Format datas to year-month-day hour
// Import library for activity cards
// Be able to post datas to the backend for ML purposes
// Workflow on IoS

export default HomeScreen

const styles = StyleSheet.create({})