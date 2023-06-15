import { StyleSheet, Text, View, Platform, Button, TouchableOpacity } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import React, { useEffect, useState, useCallback } from 'react'
import { _deleteDatas, _retrieveDatas, _storeDatas } from '../LocalStorage/LocalStorage';
import dispatchAPI from '../../api/apiContext';
import colors from '../../assets/styles/colors';
import fonts from '../../assets/styles/fonts';
import spacing from '../../assets/styles/spacing';
import PlusIcon from '../../assets/svgs/PlusIcon';

WebBrowser.maybeCompleteAuthSession();

interface propsGoogleFit {
    setDatasGoogle: any
}
const GoogleFit = (props: propsGoogleFit) => {
    const { setDatasGoogle } = props;

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
        const getDatas = async () => {
          try {
            const datas_google = await dispatchAPI({
                type_request: 'GET', 
                url: 'googlefit/getdatas',
                datas: {
                  
                }
            })
            setDatasGoogle(datas_google);
          }
          catch (e) {
          }
        };
        getDatas();
    }, []);

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
              refreshToken: refreshToken
            }
          })
          if(saveUser[0].success){
            console.log("A new user has been created !")
          }
          else {
            console.log("This user already exists !")
          }
        }
      }
      evalToken();
    }, [fullResult]);

  return (
    <View>
      <TouchableOpacity style={styles.buttonContainer} disabled={!request} onPress={() => promptAsync()}>
        <Text style={[fonts.TEXT_BUTTONS, {color: colors.TEXT_BUTTON, marginRight: spacing.SPACING_XXS}]}>Enregistrer un patient</Text>
        <PlusIcon width={25} height={24} color={colors.TEXT_BUTTON} />
      </TouchableOpacity>
    </View>
  )
}

export default GoogleFit

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: colors.PRIMARY_COLOR_BUTTON,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.SPACING_S,
    paddingHorizontal: spacing.SPACING_XXL,
    borderRadius: spacing.SPACING_XXL
  }
})