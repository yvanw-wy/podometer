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
import { Modal, Spin, notification } from 'antd';
import InputText from '../../components/InputText/InputText';
import iconsize from '../../assets/styles/iconsize';
import { CheckCircleFilled, LoadingOutlined } from '@ant-design/icons';


interface propsGoogleFit {
    setDatasGoogle: any
}
const GoogleFit = (props: propsGoogleFit) => {
    const { setDatasGoogle } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorForm, setErrorForm] = useState('');
    const [api, contextHolder] = notification.useNotification();


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

    const showModal = () => {
      setIsModalOpen(true);
    };


    const handleOk = () => {
      setIsModalOpen(false);
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };

    const sendMail = async () => {
      if(!email.length){
        setErrorForm('Veuillez renseigner un email')
      } 
      else {
        const savePatient = await dispatchAPI({
          type_request: 'GET', 
          url: 'account/registerpatient',
          datas: {
              email: email,
          }
          })
          if(savePatient.success){
            // Send a notification to the dashboard testifying that an email has been sent to the patient
            api.open({
              message: 'Email envoyé !',
              description:
                savePatient.message,
              icon: <CheckCircleFilled style={{ color: colors.PRIMARY_COLOR_BUTTON }} />,
            });
            setErrorForm('')
            handleCancel() 
          }
          else {
            setErrorForm(savePatient.message)
          }
      }
    }

  return (
    <View>
      {contextHolder}
      <TouchableOpacity style={styles.buttonContainer} onPress={() => showModal()}>
        <Text style={[fonts.TEXT_BUTTONS, {color: colors.TEXT_BUTTON, marginRight: spacing.SPACING_XXS}]}>Enregistrer Un Patient</Text>
        <PlusIcon width={25} height={24} color={colors.TEXT_BUTTON} />
      </TouchableOpacity>
      <Modal 
        title="Enregistrer un patient" 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel} 
        footer={[
          <TouchableOpacity style={styles.buttonContainerModal} disabled={isLoading} onPress={() => sendMail()}>
            {
              isLoading ?
                <Spin indicator={<LoadingOutlined style={{ fontSize: iconsize.iconsize_XXS, color: 'white' }} />}/>
                :
                <Text style={[fonts.TEXT_BUTTONS, {color: colors.TEXT_BUTTON, marginRight: spacing.SPACING_XXS}]}>Enregistrer ce patient</Text>
            }
          </TouchableOpacity>
        ]}
      >
        {
          errorForm.length > 1 && <Text style={styles.error}>{errorForm}</Text>
        }
        <View style={{ marginTop: spacing.SPACING_S }}></View>
        <InputText text={email} setText={setEmail} type="email" label="Email du patient" isModal={true} />
      </Modal>
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
  },
  buttonContainerModal: {
    backgroundColor: colors.PRIMARY_COLOR_BUTTON,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.SPACING_S,
    paddingHorizontal: spacing.SPACING_XXL,
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: spacing.SPACING_S
  },
  error: {
    color: colors.ERROR_COLOR,
    marginTop: spacing.SPACING_XS
  }
})