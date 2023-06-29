import { StyleSheet, Text, View, Platform, Button, TouchableOpacity, BackHandler } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import React, { useEffect, useState, useCallback } from 'react'
import dispatchAPI from '../../api/apiContext';
import colors from '../../assets/styles/colors';
import fonts from '../../assets/styles/fonts';
import spacing from '../../assets/styles/spacing';
import PlusIcon from '../../assets/svgs/PlusIcon';
import { Modal, Spin, notification } from 'antd';
import InputText from '../../components/InputText/InputText';
import iconsize from '../../assets/styles/iconsize';
import { CheckCircleFilled, LoadingOutlined } from '@ant-design/icons';

WebBrowser.maybeCompleteAuthSession();

const SaveGoogle = ({ route, navigation } : any) => {
    const { id } = route.params;
    // const id = 5;
    // console.log(id);
    const [message, setMessage] = useState("Authentication en cours...")

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
        promptAsync()
    }, [promptAsync])

    

    useEffect(() => {

      const evalToken = async () => {
        let token;
        let refreshToken;
        if (fullResult?.type === 'success') {
          token = fullResult.authentication?.accessToken;
          refreshToken = fullResult.authentication?.refreshToken
          
          // Store these tokens in the db, and store this new user in the db
          const saveUser = await dispatchAPI({
            type_request: 'GET', 
            url: 'googlefit/registeruser',
            datas: {
              token: token,
              refreshToken: refreshToken,
              idDoctor: id
            }
          })
          if(saveUser[0].success){
            setMessage("Enregistrement réussi ! Vous pouvez fermer cette page !")
            // Here we must save that user in the db, with the doctor ID associated
            setTimeout(() => {
            }, 2000)
          }
          else {
            setMessage("Echec d'enregistrement ! Veuillez réessayer")
          }
        }
      }
      evalToken();
    }, [fullResult]);


  return (
    <View style={{ display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 25 }}>{message}</Text>
    </View>
  )
}

export default SaveGoogle

const styles = StyleSheet.create({})