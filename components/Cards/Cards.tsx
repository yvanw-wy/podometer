import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import colors from '../../assets/styles/colors'
import spacing from '../../assets/styles/spacing'
import textStyle from '../../assets/styles/textsize'
import fonts from '../../assets/styles/fonts'
import HeatMap from '../../utils/HeatMap/HeatMap'

interface tabUser {
    name: any,
    firstIndex: any,
    status: any;
    data: any,
    isActive: any,
    onPress: any
}

const Cards = (props: tabUser) => {
  const { name, status, firstIndex, data, isActive, onPress } = props;
  return (
    <View style={[styles.topShadow, { marginLeft: firstIndex ? 0 : spacing.SPACING_M, marginRight: spacing.SPACING_XS }]}>
        <View style={styles.bottomShadow}>
            <TouchableOpacity style={[styles.cardContainer]} onPress={onPress}>
                <View style={styles.topContainer}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: colors.PRIMARY_TEXT_COLOR, fontWeight: '600' }}>{name}</Text>
                        {
                            isActive && <View style={styles.active}></View>
                        }
                    </View>
                    <Text style={[fonts.TEXT_BUTTONS, { textAlign: 'left', color: colors.SECONDARY_TEXT_COLOR, fontWeight: 'normal', fontSize: textStyle.TEXT_XS }]}>Statut: {status}</Text>
                </View>
                <View style={{ marginTop: spacing.SPACING_S }}>
                    <View style={{ width: '100%', height: 205 }}>
                        <HeatMap datas_mean={data} width={250} height={205} legend={false} hasAxis={false} />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default Cards

const styles = StyleSheet.create({
    topShadow: {
        shadowOffset: {
            width: 6,
            height: 8
        },
        shadowOpacity: 6,
        shadowRadius: 16,
        shadowColor: colors.SHADOWS.TOP_SHADOW,
        borderRadius: 40/2,
    },
    bottomShadow: {
        shadowOffset: {
            width: -3,
            height: -3
        },
        shadowOpacity: 16,
        shadowRadius: 16,
        shadowColor: colors.SHADOWS.BOTTOM_SHADOW,
        borderRadius: 40/2,
    },
    cardContainer: {
        backgroundColor: colors.BACKGROUND_SCREEN,
        borderRadius: 40/2,
        paddingVertical: spacing.SPACING_L,
        paddingHorizontal: spacing.SPACING_L,
        width: 300,
        height: 300,
        borderColor: colors.BACKGROUND_SCREEN,
        borderWidth: 1
    },
    topContainer: {

    },
    mapContainer: {

    },
    active: {
        backgroundColor: colors.PRIMARY_COLOR_BUTTON,
        width: 10,
        height: 10,
        borderRadius: 10/2,
        marginLeft: spacing.SPACING_XS
    }
})