import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import fonts from '../../assets/styles/fonts';
import colors from '../../assets/styles/colors';
import textStyle from '../../assets/styles/textsize';

interface profile {
  name: any,
  email: any
}

const Profile = (props: profile) => {
  const { name, email } = props;
  return (
    <View style={styles.profileContainer}>
      <Text style={[fonts.TEXT_BUTTONS, { color: colors.PRIMARY_TEXT_COLOR, fontWeight: 'normal', fontSize: textStyle.TEXT_M }]}>{name}</Text>
      <Text style={[fonts.TEXT_BUTTONS, { color: colors.SECONDARY_TEXT_COLOR, fontWeight: 'normal', fontSize: textStyle.TEXT_S }]}>{email}</Text>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
    profileContainer: {
      alignItems: 'flex-end'
    }
})