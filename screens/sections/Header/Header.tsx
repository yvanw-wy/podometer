import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Logo from '../../../components/Logo/Logo'
import GoogleFit from '../../../utils/Google/GoogleFit'
import Profile from '../../../components/Profile/Profile'
import spacing from '../../../assets/styles/spacing'

interface propsGoogleFit {
  setDatasGoogle: any,
  isLogin: any,
  name: any,
  email: any
}

const Header = (props: propsGoogleFit) => {
  const { setDatasGoogle, isLogin, name, email } = props;

  return (
    <View style={[styles.headerContainer, { justifyContent: isLogin ? 'center': 'space-between', position: isLogin ? 'absolute' : 'relative', zIndex: 1, top: isLogin ? spacing.SPACING_XXL : 0 }]}>
      <Logo isLogin={isLogin} />
      <>
        {
          !isLogin &&
          <>
            <GoogleFit setDatasGoogle={setDatasGoogle} />
            <Profile name={name} email={email} />
          </>
        }
      </>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  }
})