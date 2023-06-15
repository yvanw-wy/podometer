import { StyleSheet, Text, View, Alert, Button, Platform, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import dispatchAPI from '../../api/apiContext'
import GoogleFit from '../../utils/Google/GoogleFit'
import HeatMap from '../../utils/HeatMap/HeatMap'
import Logo from '../../components/Logo/Logo'
import Header from '../sections/Header/Header'
import colors from '../../assets/styles/colors'
import spacing from '../../assets/styles/spacing'
import LeftSection from '../sections/LeftSection/LeftSection'
import RightSection from '../sections/RightSection/RightSection'
import Calendar from '../sections/Calendar/Calendar'
import Hero from '../sections/Hero/Hero'
import { Col, Image, Row, Spin } from 'antd'
import fonts from '../../assets/styles/fonts'
import InputText from '../../components/InputText/InputText'
import PlusIcon from '../../assets/svgs/PlusIcon'
import { _storeDatas } from '../../utils/LocalStorage/LocalStorage'
import { LoadingOutlined } from '@ant-design/icons'
import iconsize from '../../assets/styles/iconsize'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LoginScreen = ({ navigation } : any) => {
  let props_datas: any = {}
  let props_array_datas: any = []
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [errorForm, setErrorForm] = useState('');
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setErrorForm('')
  }, [password, email])

  const checkData = async () => {
    setIsLoading(true);
    const saveDoctor = await dispatchAPI({
      type_request: 'GET', 
      url: 'account/logindoctor',
      datas: {
        email: email,
        password: password
      }
    })
    if(saveDoctor.success){
      setErrorForm('')
      // Save the doctor id in the session storage
      _storeDatas(saveDoctor.message.id, 'doctor_id').then(() => {
          navigation.navigate("Home", {
            name: saveDoctor.message.name,
            email: email
          })
      })
    }
    else {
      setErrorForm(saveDoctor.message)
    }
    setIsLoading(false);

  }

  return (
    <View style={{
      backgroundColor: colors.BACKGROUND_SCREEN,
      height: '100%'
    }}>
      <Header setDatasGoogle={[]} isLogin={true} name="" email="" />
      <Row style={{ height: '100%' }}>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <View style={{ paddingVertical: spacing.SPACING_XXL, paddingHorizontal: spacing.SPACING_XXL } as any}>
            <View style={{ width: 8 * spacing.SPACING_XXL, marginTop: 4 * spacing.SPACING_XXL, marginBottom: spacing.SPACING_XXL }} >
              <Text style={fonts.HEADER}>Connexion</Text>
              {
                errorForm.length > 1 && <Text style={styles.error}>{errorForm}</Text>
              }
            </View>
            <View>
              <InputText text={email} setText={setEmail} type="text" label="Email" />
              <InputText text={password} setText={setPassword} type="password" label="Password" />
              <TouchableOpacity style={styles.buttonContainer} disabled={isLoading} onPress={() => checkData()}>
                {
                  isLoading ?
                    <Spin indicator={<LoadingOutlined style={{ fontSize: iconsize.iconsize_XXS, color: 'white' }} />}/>
                    :
                    <Text style={[fonts.TEXT_BUTTONS, {color: colors.TEXT_BUTTON, marginRight: spacing.SPACING_XXS}]}>Se connecter</Text>
                }
              </TouchableOpacity>
              <View style={{ maxWidth: 400, marginTop: spacing.SPACING_XXS, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: colors.TEXT_INPUT }}>Vous n'avez pas de compte ?</Text>
                <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => navigation.navigate("Signup")}>
                  <Text style={{ color: colors.TEXT_INPUT, textDecorationLine: 'underline' }}>Enregistrez-vous</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ backgroundColor: colors.BACKGROUND_SCREEN_IMAGE, height: '100%' }}>
          <View style={{ justifyContent: 'center', 'alignItems': 'center', height: '100%' }}>
            <Image
              width={"70%"}
              src={require("../../assets/images/medecin_man.png")}
              preview={false}
            />
          </View>
        </Col>
      </Row>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: colors.PRIMARY_COLOR_BUTTON,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.SPACING_S,
    paddingHorizontal: spacing.SPACING_XXL,
    borderRadius: 5,
    justifyContent: 'center',
    maxWidth: 400,
    marginTop: spacing.SPACING_S
  },
  error: {
    color: colors.ERROR_COLOR,
    marginTop: spacing.SPACING_XS
  }
})