import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import fonts from '../../../assets/styles/fonts'
import spacing from '../../../assets/styles/spacing'
import BodyIcon from '../../../assets/svgs/BodyIcon'
import colors from '../../../assets/styles/colors'
import textStyle from '../../../assets/styles/textsize'
import iconsize from '../../../assets/styles/iconsize'
import MedianIcon from '../../../assets/svgs/MedianIcon'

interface indicator {
    number_of_patients: any,
    number_of_footsteps: any
}

const Hero = (props: indicator) => {
  const { number_of_patients, number_of_footsteps } = props;
  return (
    <View style={styles.heroContainer}>
        <View style={{ width: '50%' }}>
            <View style={{ width: 8 * spacing.SPACING_XXL }} >
                <Text style={fonts.HEADER}>Suivi des activités pédométriques</Text>
            </View>
        </View>
        <View style={{ width: '50%' }}>
            <View style={styles.indicator_container}>
                <BodyIcon width={iconsize.iconsize_S} height={iconsize.iconsize_XXL} color={colors.PRIMARY_COLOR_BUTTON} />
                <View style={{ marginLeft: spacing.SPACING_XS }}>
                    <Text style={[fonts.HEADER, { color: colors.PRIMARY_COLOR_BUTTON }]}>{number_of_patients}</Text>
                    <Text style={[fonts.TEXT_BUTTONS, { color: colors.SECONDARY_TEXT_COLOR, fontWeight: 'normal', fontSize: textStyle.TEXT_S }]}>Patients enregistrés</Text>
                </View>
            </View>
            <View style={[styles.indicator_container, { marginTop: spacing.SPACING_XS, position: 'relative', right: spacing.SPACING_M }]}>
                <MedianIcon width={iconsize.iconsize_XXL} height={iconsize.iconsize_XXL} color={colors.PRIMARY_COLOR_BUTTON} />
                <View style={{ marginLeft: spacing.SPACING_XS }}>
                    <Text style={[fonts.HEADER, { color: colors.PRIMARY_COLOR_BUTTON }]}>{number_of_footsteps}</Text>
                    <Text style={[fonts.TEXT_BUTTONS, { color: colors.SECONDARY_TEXT_COLOR, fontWeight: 'normal', fontSize: textStyle.TEXT_S }]}>Nombre moyen de pas/jour</Text>
                </View>
            </View>  
        </View>
    </View>
  )
}

export default Hero

const styles = StyleSheet.create({
    heroContainer: {
        marginVertical: spacing.SPACING_XL,
        display: 'flex',
        flexDirection: 'row'
    },
    indicator_container: {
        display: 'flex',
        flexDirection: 'row',
    }
})