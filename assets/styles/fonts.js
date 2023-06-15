import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import colors from './colors'
import textStyle from './textsize'
import spacing from './spacing'

const fonts = StyleSheet.create({
    LOGO: {
        fontFamily: "Inter",
        fontSize: textStyle.TEXT_S,
        fontWeight: '600',
        lineHeight: "normal",
        letterSpacing: 5,
        color: colors.LOGO_COLOR
    },
    HEADER: {
        fontFamily: "Inter",
        fontSize: textStyle.TEXT_XXL,
        fontWeight: "600",
        lineHeight: "normal",
        color: colors.PRIMARY_TEXT_COLOR
    },
    INDICATORS: {
        fontFamily: "Inter",
        fontSize: textStyle.TEXT_xxl,
        fontWeight: "bold",
        lineHeight: "normal",
        color: colors.PRIMARY_COLOR_BUTTON
    },
    SECONDARY_INDICATORS: {
        fontFamily: "Inter",
        fontSize: textStyle.TEXT_S,
        lineHeight: "normal",
        color: colors.SECONDARY_TEXT_COLOR
    },
    TEXT_BUTTONS: {
        fontFamily: "Inter",
        fontSize: textStyle.TEXT_S,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    BUTTONS: {
        paddingVertical: spacing.SPACING_XL,
        paddingHorizontal: spacing.SPACING_XL
    },
    PROFILE_NAME: {
        fontFamily: "Inter",
        fontSize: textStyle.TEXT_L,
        color: colors.PRIMARY_TEXT_COLOR
    },
    PROFILE_EMAIL: {
        fontFamily: "Inter",
        fontSize: textStyle.TEXT_S,
        color: colors.SECONDARY_TEXT_COLOR
    }
})

export default fonts