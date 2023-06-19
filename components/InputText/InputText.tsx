import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import colors from '../../assets/styles/colors';
import spacing from '../../assets/styles/spacing';

interface propsInput {
    text: any,
    setText: any,
    type: any,
    label: any,
    isModal: any

}

const InputText = (props: propsInput) => {
  const { text, setText, type, label, isModal } = props;

  
  return (
    <View>
      <Text style={{ color: colors.PRIMARY_TEXT_COLOR, fontWeight: '600' }}>{label}</Text>
      <TextInput 
        style={[styles.textInput, { borderWidth: 1, borderColor: colors.TEXT_INPUT, maxWidth: isModal ? '100%': 400 }]} 
        placeholder={label} 
        onChangeText={(value) => setText(value)}
        placeholderTextColor={colors.PLACEHOLDER_INPUT}
        secureTextEntry={type=="password" ? true : false}
        autoComplete={type}
     />
    </View>
  )
}

export default InputText

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 1,
        borderColor: colors.TEXT_INPUT,
        borderRadius: 5,
        padding: spacing.SPACING_S,
        marginVertical: spacing.SPACING_XS
    }
})