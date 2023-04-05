import { StyleSheet, Text, View, Platform, Button } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import React, { useEffect, useState, useCallback } from 'react'
import { _deleteDatas, _retrieveDatas, _storeDatas } from '../LocalStorage/LocalStorage';
import dispatchAPI from '../../api/apiContext';

WebBrowser.maybeCompleteAuthSession();

interface propsGoogleFit {
    setDatasGoogle: any,
    setUserInfo: any,
    setAccessToken: any,
    accessToken: any,
    setDatasHeatMap: any
}
const GoogleFit = (props: propsGoogleFit) => {
    const { setDatasGoogle, setUserInfo, setAccessToken, accessToken, setDatasHeatMap } = props;

    const [request, fullResult, promptAsync] = Google.useAuthRequest({
      selectAccount: true,
      clientId: '416461471791-gi4p17cbm45tv9tfau8ahkutv263ns7d.apps.googleusercontent.com',
      webClientId: '416461471791-gi4p17cbm45tv9tfau8ahkutv263ns7d.apps.googleusercontent.com',
      iosClientId: '416461471791-bvtj37omcs3nk3p28agcp807ap86s9rd.apps.googleusercontent.com',
      androidClientId: '416461471791-4cf0sdetn5544b3mgp6utmjoieadnchb.apps.googleusercontent.com',
      scopes: [
        'https://www.googleapis.com/auth/fitness.activity.read', 
        'https://www.googleapis.com/auth/fitness.blood_pressure.read', 
        'https://www.googleapis.com/auth/fitness.body.read', 
        'https://www.googleapis.com/auth/fitness.oxygen_saturation.read', 
        'https://www.googleapis.com/auth/fitness.sleep.read',
        'https://www.googleapis.com/auth/userinfo.profile',
        'openid',
        'https://www.googleapis.com/auth/userinfo.email'
      ],
      redirectUri: Platform.OS === 'web' ? 'http://localhost:19006' : 'https://auth.expo.io/yvanw/podometer-app/',
      clientSecret: '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',
      responseType: "code",
      prompt: 'consent',
      extraParams: {
        access_type: "offline"
      },
    });

    useEffect(() => {
        // Read cookies to check if there is an access token, and if so, return it
        const fetchToken = async () => {
            const token = await _retrieveDatas('accessToken');
            if(token){
                setAccessToken(token);
                getDatas(token)
            }
        }
        fetchToken();
    }, []);

    useEffect(() => {

      const evalToken = async () => {
        if(!Object.keys(accessToken).length){
            let token;
            let refreshToken;
            if (fullResult?.type === 'success') {
                token = fullResult.authentication?.accessToken;
                refreshToken = fullResult.authentication?.refreshToken
                setAccessToken(token);
                getDatas(token);
                // Store access token in localStorage
                const storeToken = await _storeDatas(token, 'accessToken');
                const storeRefreshToken = await _storeDatas(refreshToken, 'refreshToken');
            }
        }
      }
      evalToken();
    }, [fullResult, accessToken]);

    const getUserInfo = async (token : any) => {
      try {

      } catch (error) {
        // Add your own error handler here
      }
    };

    const getDatas = async (token : any) => {
      try {
        const user_google = await dispatchAPI({
            type_request: 'GET', 
            url: 'googlefit/getuser',
            datas: {
                token: token,
            }
        })
        console.log(user_google)
        if(!user_google[0].success){
            await _deleteDatas('accessToken');
            setAccessToken({});
        }
        else {
            setUserInfo(user_google);
            const datas_gootle = await dispatchAPI({
                type_request: 'GET', 
                url: 'googlefit/getdatas',
                datas: {
                    token: token,
                    id: user_google[1].id
                }
            })
            setDatasGoogle(datas_gootle);  
            setDatasHeatMap(datas_gootle);
        }
      }
      catch (e) {
      }
    };

  return (
    <View>
        <Button title={"Authenticate"}  disabled={!request} onPress={() => promptAsync()} />
        <Text>Click on the link up below to authenticate on Google</Text>
    </View>
  )
}

export default GoogleFit

const styles = StyleSheet.create({})