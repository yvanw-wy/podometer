import { StyleSheet, Text, View, Alert, Button, Platform, Dimensions } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import dispatchAPI from '../../api/apiContext'
import GoogleFit from '../../utils/Google/GoogleFit'
import HeatMap from '../../utils/HeatMap/HeatMap'
import Logo from '../../components/Logo/Logo'
import Header from '../sections/Header/Header'
import colors from '../../assets/styles/colors'
import spacing from '../../assets/styles/spacing'
import LeftSection from '../sections/LeftSection/LeftSection'
import RightSection from '../sections/RightSection/RightSection'
import Calendar from '../sections/Calendar/Calendar'
import Hero from '../sections/Hero/Hero'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const HomeScreen = ({ route, navigation } : any) => {
  // const { name, email } = route.params;
  const name = "test"
  const email = "test2"
  let props_datas: any = {}
  let props_array_datas: any = []
  const [datasGoogle, setDatasGoogle] = useState(props_datas);
  const [tabUserActive, setTabUserActive] = useState(0);
  // Each value in the selectedLevelGraph array represents the index of the patient and the level of detail we want to reach
  // Eg: [0] means: display the 1st user's aggregated datas, [1] means: display the second user data ,...
  // But [0, 0] means: display the 1st user's 1st month data, [0, 1] means: display the 1st user second month datas
  // And [0, 0, 0] means: display the 1st 1ser 1st month 1st day datas, ... 
  const [selectedLevelGraph, setSelectedLevelGraph] = useState([0]); 

  return (
    <View style={{
      backgroundColor: colors.BACKGROUND_SCREEN,
      paddingVertical: spacing.SPACING_M,
      paddingHorizontal: spacing.SPACING_L,
      height: '100%'
    }}>
      <Header setDatasGoogle={setDatasGoogle} isLogin={false} name={name} email={email} />
      <Hero number_of_patients={2} number_of_footsteps={10000} />
      <View style={styles.bodyContainer}>
        <LeftSection indexActive={tabUserActive} setIndexActive={setTabUserActive} datasGoogle={datasGoogle} selectedLevelGraph={selectedLevelGraph} setSelectedLevelGraph={setSelectedLevelGraph} />
        <RightSection datasGoogle={datasGoogle} selectedLevelGraph={selectedLevelGraph} setSelectedLevelGraph={setSelectedLevelGraph} />
      </View>
      <Calendar />
    </View>
  )
}


export default HomeScreen

const styles = StyleSheet.create({
  bodyContainer: {
    display: 'flex',
    flexDirection: 'row'
  }
})