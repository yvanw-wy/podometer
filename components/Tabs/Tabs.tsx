import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import colors from '../../assets/styles/colors';
import spacing from '../../assets/styles/spacing';

interface tabUser {
    name: any,
    isActive: any,
    firstIndex: any,
    isIcon: any,
    secondary: any,
    onPress: any
}

const Tabs = (props: tabUser) => {
  const { name, isActive, firstIndex, isIcon, secondary, onPress } = props;
  return (
    <>
        {
            isIcon ?
                !secondary ?
                <TouchableOpacity style={[styles.iconContainer, { marginLeft: firstIndex ? 0 : spacing.SPACING_S }]} onPress={onPress}>
                    {name}
                </TouchableOpacity>
                :
                <TouchableOpacity style={[styles.iconContainerSecondary, { marginLeft: firstIndex ? 0 : spacing.SPACING_S }]} onPress={onPress}>
                    {name}
                </TouchableOpacity>
            :
            <TouchableOpacity style={[styles.tabsContainer, { backgroundColor: isActive ? colors.PRIMARY_COLOR_BUTTON : colors.UNPRESSED_BUTTON, marginRight: spacing.SPACING_S }]} onPress={onPress}>
                <Text style={{ color: isActive ? 'white' : colors.PRIMARY_TEXT_COLOR, fontWeight: '600' }}>{name}</Text>
            </TouchableOpacity>
        }
    </>
  )
}

export default Tabs

const styles = StyleSheet.create({
    iconContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.UNPRESSED_BUTTON,
        marginLeft: 0,
        width: 40,
        height: 40,
        borderRadius: 40/2,
        justifyContent: 'center'
    },
    iconContainerSecondary: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: colors.SECONDARY_TEXT_COLOR,
        borderWidth: 1,
        marginLeft: 0,
        width: 40,
        height: 40,
        borderRadius: 40/2,
        justifyContent: 'center'
    },
    tabsContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.SPACING_S,
        paddingHorizontal: spacing.SPACING_L,
        borderRadius: spacing.SPACING_XXL,
    }
})