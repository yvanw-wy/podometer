import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
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

interface propsDatas {
  datasGoogle: any,
  selectedLevelGraph: any,
  setSelectedLevelGraph: any
}

const RightSection = (props: propsDatas) => {
  const { datasGoogle, selectedLevelGraph, setSelectedLevelGraph } = props;
  const style = useAnimatedStyle(() => {
    console.log("Running on the UI thread");
    return {
      opacity: 0.5
    };
  });
  const isActive = true;
  const isActive2 = false;
    
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
                <HeatMap datas_mean={datasGoogle[selectedLevelGraph[0]].datas_mean} width={450} height={340} legend hasAxis />
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