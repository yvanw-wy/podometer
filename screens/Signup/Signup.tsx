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

const Signup = ({ navigation } : any) => {
    let props_datas: any = {}
    let props_array_datas: any = []
    const [email, setEmail] = useState()
    const [name, setName] = useState()
    const [kbis, setKbis] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [errorForm, setErrorForm] = useState('');
    const [isLoading, setIsLoading] = useState(false)
  
    useEffect(() => {
      setErrorForm('')
    }, [password, email, name, kbis, confirmPassword])
  
    const checkData = async () => {
      setIsLoading(true);
      if(confirmPassword !== password) {
        setErrorForm('Le mot de passe à confirmer ne correspond pas à celui que vous avez renseigné. Veuillez réessayer')
      }
      else {
        const saveDoctor = await dispatchAPI({
        type_request: 'GET', 
        url: 'account/registerdoctor',
        datas: {
            email: email,
            password: password,
            name: name,
            kbis: kbis
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
                <Text style={fonts.HEADER}>Enregistrement</Text>
                {
                  errorForm.length > 1 && <Text style={styles.error}>{errorForm}</Text>
                }
              </View>
              <View>
                <InputText text={name} setText={setName} type="family-name" label="Nom et Prénom" />
                <InputText text={email} setText={setEmail} type="email" label="Email" />
                <InputText text={kbis} setText={setKbis} type="text" label="Kbis (Siret de l'entreprise)" />
                <InputText text={password} setText={setPassword} type="password" label="Mot de passe" />
                <InputText text={confirmPassword} setText={setConfirmPassword} type="password" label="Confirmer le mot de passe" />
                <TouchableOpacity style={styles.buttonContainer} disabled={isLoading} onPress={() => checkData()}>
                  {
                    isLoading ?
                      <Spin indicator={<LoadingOutlined style={{ fontSize: iconsize.iconsize_XXS, color: 'white' }} />}/>
                      :
                      <Text style={[fonts.TEXT_BUTTONS, {color: colors.TEXT_BUTTON, marginRight: spacing.SPACING_XXS}]}>Se connecter</Text>
                  }
                </TouchableOpacity>
                <View style={{ maxWidth: 400, marginTop: spacing.SPACING_XXS, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: colors.TEXT_INPUT }}>Vous avez déja un compte ?</Text>
                  <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => navigation.navigate("Login")}>
                    <Text style={{ color: colors.TEXT_INPUT, textDecorationLine: 'underline' }}>Connectez-vous</Text>
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
  
  export default Signup
  
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