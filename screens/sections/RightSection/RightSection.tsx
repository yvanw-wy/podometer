import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import colors from '../../../assets/styles/colors'
import spacing from '../../../assets/styles/spacing'
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import HeatMap from '../../../utils/HeatMap/HeatMap'
import { Spin, Divider } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import LineMap from '../../../utils/LineMap/LineMap'
import MultiLineMap from '../../../utils/MultiLineMap/MultiLineMap'

interface propsDatas {
  datasGoogle: any,
  selectedLevelGraph: any,
  setSelectedLevelGraph: any
}

const RightSection = (props: propsDatas) => {
  const { datasGoogle, selectedLevelGraph, setSelectedLevelGraph } = props;
  const [formattedDatas2, setFormattedDatas2] = useState([]);
  const style = useAnimatedStyle(() => {
    console.log("Running on the UI thread");
    return {
      opacity: 0.5
    };
  });
  const isActive = true;
  const isActive2 = false;

  useEffect(() => {
    console.log(selectedLevelGraph)
  }, [selectedLevelGraph])

  useEffect(() => {
    // Create the first array of average values
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
            month_scan.push(
              { Date: date, 
                scales: month['dataset.point.value.intVal'][key],
                category: "Activités de l'utilisateur" 
              },
              { Date: date, 
                scales: 6.951 * datasGoogle[i]['upper_bound'], // This is the constant applied so that the bounds matches the scales of number of steps of the user
                category: "Seuil maximal" 
              }
            )
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
      setFormattedDatas2(output)
    }
  }, [datasGoogle]);
    
  return (
    <View style={styles.rightContainer}>
      <View style={styles.carousel_container}>
      <View style={styles.topShadow}>
          <View style={styles.bottomShadow}>
            <View style={[styles.boxContainer, { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }]}>
              { 
                !datasGoogle.length ?
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
                :
                <>
                  {
                    selectedLevelGraph.length == 1 ?
                      <HeatMap datas_mean={datasGoogle[selectedLevelGraph[0]].datas_mean} width={450} height={340} legend hasAxis />
                    :
                      formattedDatas2.length && <MultiLineMap mustScale={false} month={formattedDatas2[selectedLevelGraph[0]].data_months[selectedLevelGraph[1]]} color={colors.PRIMARY_COLOR_BUTTON} background={colors.BACKGROUND_SCREEN} />
                  }
                </>
              }
          </View>
          </View>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', marginTop: spacing.SPACING_L }}>
          <TouchableOpacity style={[styles.button, { backgroundColor: isActive ? colors.PRESSED_BUTTON : colors.UNPRESSED_BUTTON, marginRight: spacing.SPACING_XS }]}></TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: isActive2 ? colors.PRESSED_BUTTON : colors.UNPRESSED_BUTTON, marginRight: spacing.SPACING_XS }]}></TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default RightSection

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
  rightContainer: {
    width: '50%'
  },
  carousel_container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  boxContainer: {
    backgroundColor: colors.BACKGROUND_SCREEN,
    borderRadius: 40/2,
    paddingVertical: spacing.SPACING_L,
    paddingHorizontal: spacing.SPACING_L,
    width: 500,
    height: 375,
    borderColor: colors.BACKGROUND_SCREEN,
    borderWidth: 1
  },
  button: {
    backgroundColor: 'white',
    width: 15,
    height: 15,
    borderRadius: 15/2
  }

})