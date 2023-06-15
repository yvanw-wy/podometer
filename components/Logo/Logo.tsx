import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import fonts from '../../assets/styles/fonts'
import colors from '../../assets/styles/colors'

interface propsLogo {
  isLogin: any
}

const Logo = (props: propsLogo) => {
  const { isLogin } = props;

  return (
    <View style={styles.container}>
      <Text style={fonts.LOGO}>PODO</Text>
      <Text style={[fonts.LOGO, { color: isLogin === true ? colors.ALT_LOGO_COLOR : colors.LOGO_COLOR }]}>MÈTRE</Text>
    </View>
  )
}

export default Logo

const styles = StyleSheet.create({
    logoText: {

    },
    container: {
        display: 'flex',
        flexDirection: 'row',
    }
})