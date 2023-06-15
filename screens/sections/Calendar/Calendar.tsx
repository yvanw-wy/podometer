import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import fonts from '../../../assets/styles/fonts'
import colors from '../../../assets/styles/colors'
import ArrowLeftIcon from '../../../assets/svgs/ArrowLeftIcon'
import Tabs from '../../../components/Tabs/Tabs'
import ArrowRightIcon from '../../../assets/svgs/ArrowRightIcon'
import iconsize from '../../../assets/styles/iconsize'
import spacing from '../../../assets/styles/spacing'
import { Divider } from 'antd'
import textStyle from '../../../assets/styles/textsize'
import LineMap from '../../../utils/LineMap/LineMap'

const months = [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
           "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ];

interface PropsTabsDate {
  activeTab: any,
  startIndex: any,
  endIndex: any
}

const SuperTabsDate = (props: PropsTabsDate) => {
  const { activeTab, endIndex, startIndex } = props;
  const lists = []
  for(let i = startIndex; i < endIndex + 1; i++) {
    lists.push(<TabsDate index={i} isActiveTab={i === activeTab} />)
  }
  return (
    <View style={styles.datesContainer}>
      <TabsDate index={-1} isActiveTab={activeTab === -1} />
      { lists }
    </View>
  )
}

interface PropsTabDate {
  index: any,
  isActiveTab: any
}

const TabsDate = (props: PropsTabDate) => {
  const { index, isActiveTab } = props;
  return (
    <View style={styles.dateText}>
      <Text style={[fonts.TEXT_BUTTONS, { textAlign: 'left', color: colors.SECONDARY_TEXT_COLOR, fontWeight: 'normal', fontSize: textStyle.TEXT_S,  }]}>{ index === -1 ? 'Moyenne' : months[index]}</Text>
      {
        isActiveTab && <View style={styles.active}></View>
      }
    </View>
  )
}

interface propsCardsDate {
  activeTab: any,
  startIndex: any,
  endIndex: any
}

const SuperCardsDate = (props : propsCardsDate) => {
  const { activeTab, endIndex, startIndex } = props;
  const lists = []
  for(let i = startIndex; i < endIndex + 1; i++) {
    lists.push(<CardsDate index={i} isActiveTab={i === activeTab} />)
  }
  return (
    <View style={styles.mapsContainer}>
      <CardsDate index={-1} isActiveTab={activeTab === -1} />
      { lists }
    </View>
  )
}

interface PropsCardsDate {
  index: any,
  isActiveTab: any
}
const CardsDate = (props: PropsCardsDate) => {
  const { index, isActiveTab } = props;
  return (
    <View style={[styles.topShadow, { marginRight: spacing.SPACING_M }]}>
      <View style={styles.bottomShadow}>
        <TouchableOpacity style={[styles.cardContainer, { backgroundColor: isActiveTab && colors.PRIMARY_COLOR_BUTTON }]}>
          <View style={styles.headMap}>
            <Text style={{ color: isActiveTab ? 'white' : colors.PRIMARY_TEXT_COLOR, fontWeight: '600' }}>{ index === -1 ? "Tous les mois" : "1-31" }</Text>
            <Text style={[fonts.TEXT_BUTTONS, { textAlign: 'left', color: isActiveTab ? 'white' : colors.SECONDARY_TEXT_COLOR, fontWeight: '600', fontSize: textStyle.TEXT_XS }]}>0 alertes</Text>
          </View>
          <View style={{ marginTop: spacing.SPACING_XS, width: '100%', height: 40 }}>
            <LineMap color={isActiveTab ? 'white' : colors.PRIMARY_COLOR_BUTTON} background={isActiveTab ? colors.PRIMARY_COLOR_BUTTON: colors.BACKGROUND_SCREEN} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
    
  )
}  

const startIndex = 3;
const endIndex = 9;

const Calendar = () => {
  const [activeTab, setActiveTab] = useState(0)
  return (
    <View>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Text style={[fonts.HEADER]}>Année, </Text>
        <Text style={[fonts.HEADER, { color: colors.SECONDARY_TEXT_COLOR }]}>2022</Text>
        <Tabs onPress={() => {}} isIcon={true} name={<ArrowRightIcon width={iconsize.iconsize_M} height={iconsize.iconsize_XL} color={colors.SECONDARY_TEXT_COLOR} />} isActive={0} firstIndex={false} secondary={true} />
      </View>
      <View>
        <SuperTabsDate activeTab={5} startIndex={startIndex} endIndex={endIndex} />
        <Divider />
        <SuperCardsDate activeTab={5} startIndex={startIndex} endIndex={endIndex} />
      </View>
    </View>
  )
}

export default Calendar

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
  mapsContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  cardContainer: {
    borderRadius: 40/2,
    paddingVertical: spacing.SPACING_L,
    paddingHorizontal: spacing.SPACING_L,
    width: 215,
    height: 120,
    borderColor: colors.BACKGROUND_SCREEN,
    borderWidth: 1
  },
  datesContainer: {
    marginTop: spacing.SPACING_L,
    display: 'flex',
    flexDirection: 'row'
  },
  headMap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dateText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 215,
    marginRight: spacing.SPACING_M
  },
  active: {
    backgroundColor: colors.PRIMARY_COLOR_BUTTON,
    width: 10,
    height: 10,
    borderRadius: 10/2,
    marginLeft: spacing.SPACING_XS
  }
})