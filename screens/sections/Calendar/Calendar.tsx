import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import fonts from '../../../assets/styles/fonts'
import colors from '../../../assets/styles/colors'
import ArrowLeftIcon from '../../../assets/svgs/ArrowLeftIcon'
import Tabs from '../../../components/Tabs/Tabs'
import ArrowRightIcon from '../../../assets/svgs/ArrowRightIcon'
import iconsize from '../../../assets/styles/iconsize'
import spacing from '../../../assets/styles/spacing'
import { Divider, Spin } from 'antd'
import textStyle from '../../../assets/styles/textsize'
import LineMap from '../../../utils/LineMap/LineMap'
import { LoadingOutlined } from '@ant-design/icons'

const months = [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
           "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ];

interface PropsTabsDate {
  activeTab: any,
  startIndex: any,
  endIndex: any,
  months: any
}

const SuperTabsDate = (props: PropsTabsDate) => {
  const { activeTab, endIndex, startIndex, months } = props;
  const lists = []
  for(let i = startIndex; i < endIndex + 1; i++) {
    lists.push(<TabsDate index={i} isActiveTab={i === activeTab} />)
  }
  return (
    <View style={styles.datesContainer}>
      { lists }
    </View>
  )
}

interface PropsTabDate {
  index: any,
  isActiveTab: any,
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
  endIndex: any,
  setActiveTab: any,
  months: any
}  

interface PropsCalendar {
  datasGoogle: any, 
  selectedLevelGraph: any, 
  setSelectedLevelGraph: any
}

interface PropsCardsDate2 {
  index: any,
  isActiveTab: any,
  setActiveTab: any,
  month: any,
  monthIndex: any
}

const Calendar = (props: PropsCalendar) => {
  const { datasGoogle, selectedLevelGraph, setSelectedLevelGraph } = props
  const [formattedDatas, setFormattedDatas] = useState([])
  const [formatted_months_user, setFormated_months_user] = useState({})
  const [activeTab, setActiveTab] = useState(-1);

  const SuperCardsDate = (props : propsCardsDate) => {
    const { activeTab, endIndex, startIndex, setActiveTab, months } = props;
    const lists = []
    const length_months = months.data_months.length
    let iterator = 0;
    for(let i = startIndex; i < endIndex + 1; i++) {
      lists.push(<CardsDate index={i} isActiveTab={i === activeTab} monthIndex={iterator} setActiveTab={setActiveTab} month={iterator < length_months ? months.data_months[iterator] : []} />)
      iterator++;
    }
    return (
      <View style={styles.mapsContainer}>
        { lists }
      </View>
    )
  }
  
  const CardsDate = (props: PropsCardsDate2) => {
    const { index, isActiveTab, setActiveTab, month, monthIndex } = props;

    const setActualMonth = (index : any, monthIndex: any) => {
      setSelectedLevelGraph([selectedLevelGraph[0], monthIndex])
      setActiveTab(index)
    }
    return (
      <View style={[styles.topShadow, { marginRight: spacing.SPACING_M }]}>
        <View style={styles.bottomShadow}>
          <TouchableOpacity style={[styles.cardContainer, { backgroundColor: isActiveTab && colors.PRIMARY_COLOR_BUTTON }]} onPress={() => setActualMonth(index, monthIndex)}>
            <View style={styles.headMap}>
              <Text style={{ color: isActiveTab ? 'white' : colors.PRIMARY_TEXT_COLOR, fontWeight: '600' }}>{ index === -1 ? "Tous les mois" : "1-31" }</Text>
              <Text style={[fonts.TEXT_BUTTONS, { textAlign: 'left', color: isActiveTab ? 'white' : colors.SECONDARY_TEXT_COLOR, fontWeight: '600', fontSize: textStyle.TEXT_XS }]}>0 alertes</Text>
            </View>
            <View style={{ marginTop: spacing.SPACING_XS, width: '100%', height: 40 }}>
              <LineMap mustScale={true} month={month} color={isActiveTab ? 'white' : colors.PRIMARY_COLOR_BUTTON} background={isActiveTab ? colors.PRIMARY_COLOR_BUTTON: colors.BACKGROUND_SCREEN} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  useEffect(() => {
    // Create the first array of average values
    if(datasGoogle){
      if(datasGoogle.length){
        const nbr_users = datasGoogle.length
        const output = []
        for(let i = 0; i < datasGoogle.length; i++){
          const user =  {
            lower_bound: datasGoogle[i]['lower_bound'],
            upper_bound: datasGoogle[i]['upper_bound'],
            mean: datasGoogle[i]['mean'],
            data_months: [],
            first_month: 0,
            last_month: 2,
            name_user: datasGoogle[i]['user_name']
          }
          let init = 0;
          datasGoogle[i].month_datas.map((month : any) => {
            let month_scan = []
            for (const key in month.startTimeMillis) {
              const date = month.startTimeMillis[key]
              month_scan.push({ Date: date, scales: month['dataset.point.value.intVal'][key] })
            }
            if(init === 0){
              user.first_month = new Date(month_scan[0]['Date']).getMonth()
            }
            init = 1
            user.last_month = new Date(month_scan[month_scan.length - 1]['Date']).getMonth() + 5
            user.data_months.push(month_scan)
          })
          output.push(user)
        }
        setFormattedDatas(output)
      }
    }
  }, [datasGoogle]);

  useEffect(() => {
    if(formattedDatas.length) {
      const user = formattedDatas[selectedLevelGraph[0]]
      setFormated_months_user(user)
    }
  }, [formattedDatas, selectedLevelGraph])

  return (
    <View>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Text style={[fonts.HEADER]}>Année, </Text>
        <Text style={[fonts.HEADER, { color: colors.SECONDARY_TEXT_COLOR }]}>2022</Text>
        <Tabs onPress={() => {}} isIcon={true} name={<ArrowRightIcon width={iconsize.iconsize_M} height={iconsize.iconsize_XL} color={colors.SECONDARY_TEXT_COLOR} />} isActive={0} firstIndex={false} secondary={true} />
      </View>
      {
        Object.keys(formatted_months_user).length ?
        <View>
          <SuperTabsDate activeTab={activeTab} startIndex={formatted_months_user?.first_month} endIndex={formatted_months_user?.last_month} months={formatted_months_user} />
          <Divider />
          <SuperCardsDate activeTab={activeTab} setActiveTab={setActiveTab} startIndex={formatted_months_user?.first_month} endIndex={formatted_months_user?.last_month} months={formatted_months_user} />
        </View>
        :
        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
        </View>
      }
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