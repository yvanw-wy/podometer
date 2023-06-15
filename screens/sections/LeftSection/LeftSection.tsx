import { FlatList, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import Tabs from '../../../components/Tabs/Tabs'
import ArrowLeftIcon from '../../../assets/svgs/ArrowLeftIcon'
import iconsize from '../../../assets/styles/iconsize'
import colors from '../../../assets/styles/colors'
import ArrowRightIcon from '../../../assets/svgs/ArrowRightIcon'
import spacing from '../../../assets/styles/spacing'
import Cards from '../../../components/Cards/Cards'
import Animated, { useEvent } from 'react-native-reanimated'
import { Spin, Divider } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

interface tabChooseUser {
  indexActive: any,
  setIndexActive: any,
  datasGoogle: any,
  selectedLevelGraph: any,
  setSelectedLevelGraph: any
}
const array_type = [
  {
    id: 'AU_REPOS',
    name: 'En état de repos'
  },
  {
    id: 'ACTIVITE_INTENSE',
    name: 'Activité physique intense'
  },
  {
    id: 'MARCHE_PASSIVE',
    name: 'En état de marche'
  },
  {
    id: 'NO_DATA',
    name: 'Pas de données actuellement'
  }
]

let propsArray = [
  {
    id: '1',
    name: 'Yvan wonkap',
    status: 'AU_REPOS',
    datas: []
  },
  {
    id: '2',
    name: 'Ganesh minkeng',
    status: 'MARCHE_PASSIVE',
    datas: []
  },
  {
    id: '3',
    name: 'Ganesh minkeng',
    status: 'MARCHE_PASSIVE',
    datas: []
  },
  {
    id: '4',
    name: 'Ganesh minkeng',
    status: 'MARCHE_PASSIVE',
    datas: []
  },
  {
    id: '5',
    name: 'Ganesh minkeng',
    status: 'MARCHE_PASSIVE',
    datas: []
  },
  {
    id: '6',
    name: 'Ganesh minkeng',
    status: 'MARCHE_PASSIVE',
    datas: [],
  }
] as any;

const LeftSection = (props: tabChooseUser) => {
  const { indexActive, setIndexActive, datasGoogle, selectedLevelGraph, setSelectedLevelGraph } = props;
  let [refTabIndex, setRefTabIndex] = useState(-1);
  let [refCardIndex, setRefCardIndex] = useState(0);
  const scrollXTab = useRef(0);
  const scrollXCard = useRef(0);
  const refTab = useRef(null)
  const refCard = useRef(null)
  let cst_Tab = 105
  let cst_Card = 255

  const formattedName = (name : string) => {
    const splitName = name.split(" ", 2);
    const formatted = `${splitName[0]} ${splitName[1][0].toUpperCase()}.`;
    return formatted
  }
  
  const nextContentTab = () => {
    if(refTabIndex < propsArray.length - 1){
      setRefTabIndex(refTabIndex + 1);
    }
  }

  const prevContentTab = () => {
    if(refTabIndex > -1){
      setRefTabIndex(refTabIndex - 1);
    }
  }

  const prevContentCard = () => {
    if(refCardIndex > 0){
      const newIndex = refCardIndex - 1
      setRefCardIndex(newIndex);
      setSelectedLevelGraph([newIndex])
    }
  }

  const nextContentCard = () => {
    if(refCardIndex < propsArray.length - 1){
      const newIndex = refCardIndex - 1
      setRefCardIndex(newIndex);
      setSelectedLevelGraph([newIndex])
    }
  }

  useEffect(() => {
    refTab.current?.scrollTo({x: cst_Tab * refTabIndex, animated: true});
  }, [refTabIndex])

  useEffect(() => {
    refCard.current?.scrollTo({x: cst_Card * refCardIndex, animated: true});
  }, [refCardIndex])

  return (
    <View style={[styles.leftcontainer, { justifyContent: 'center' }]}>
      { 
        !datasGoogle.length ?
          <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
          </View>
        :
        <>
          <View style={styles.tabscontainer}>
            <Tabs 
              isIcon={true}
              name={
                    <ArrowLeftIcon 
                      width={iconsize.iconsize_M} 
                      height={iconsize.iconsize_XL} 
                      color={colors.SECONDARY_TEXT_COLOR} 
                  />} 
              isActive={false} 
              firstIndex={true} 
              secondary={false}
              onPress={() => prevContentTab()}
            />
            <ScrollView 
              ref={refTab}
              pagingEnabled 
              showsHorizontalScrollIndicator={false} 
              horizontal
              scrollEnabled
              style={{
                marginLeft: spacing.SPACING_M
              }}
            >
              <Tabs 
                isIcon={false} 
                name={"Tous"} 
                isActive={refTabIndex===-1} 
                firstIndex={false} 
                secondary={false} 
                onPress={() => setRefTabIndex(-1)}
              />
              <FlatList
                data={datasGoogle} 
                keyExtractor={(item : any) => item.user_id}
                renderItem={({item, index} : any) => {
                  const formatted = formattedName(item.user_name)
                  return (
                    <Tabs 
                      key={index} 
                      isIcon={false} 
                      name={formatted} 
                      isActive={index === refTabIndex} 
                      firstIndex={false} 
                      secondary={false}
                      onPress={() => setRefTabIndex(index)} 
                    />
                  )
                }}
                showsHorizontalScrollIndicator={false}
                horizontal
                pagingEnabled
              />
            </ScrollView>
            <Tabs 
              isIcon={true} 
              name={
                    <ArrowRightIcon 
                      width={iconsize.iconsize_M} 
                      height={iconsize.iconsize_XL} 
                      color={colors.SECONDARY_TEXT_COLOR} 
                    />}
              isActive={false}
              firstIndex={false} 
              secondary={false}
              onPress={() => nextContentTab()}
            />
          </View>
          <View style={[styles.tabscontainer, { width: 760 }]}>
            <Tabs 
              isIcon={true} 
              name={
                    <ArrowLeftIcon 
                    width={iconsize.iconsize_M} 
                    height={iconsize.iconsize_XL} 
                    color={colors.SECONDARY_TEXT_COLOR} 
                  />} 
              isActive={indexActive===-1} 
              firstIndex={true} 
              secondary={false} 
              onPress={() => prevContentCard()}
            />
            <ScrollView 
              ref={refCard}
              pagingEnabled 
              showsHorizontalScrollIndicator={false} 
              horizontal
              scrollEnabled
            >
              <FlatList
                data={datasGoogle} 
                keyExtractor={(item : any) => item.user_id}
                renderItem={({item, index} : any) => {
                  const formatted = formattedName(item.user_name)
                  const status = array_type.filter((type) => type.id === item.features.type_activity)[0].name
                  return (
                    <Cards 
                      key={item.user_id} 
                      name={formatted} 
                      status={status} 
                      firstIndex={false} 
                      data={item.datas_mean} 
                      isActive={index === refCardIndex}
                      onPress={() => {
                        setSelectedLevelGraph([index])
                        setRefCardIndex(index)
                      }}
                    />
                  )
                }}
                showsHorizontalScrollIndicator={false}
                horizontal
                pagingEnabled
                contentContainerStyle={{ paddingVertical: spacing.SPACING_XS }}
              />
            </ScrollView>
            <Tabs 
              isIcon={true} 
              name={
                    <ArrowRightIcon 
                      width={iconsize.iconsize_M} 
                      height={iconsize.iconsize_XL} 
                      color={colors.SECONDARY_TEXT_COLOR} 
                    />} 
              isActive={indexActive===-1} 
              firstIndex={false} 
              secondary={false}
              onPress={() => nextContentCard()}
            />
          </View>
        </>
      }
    </View>
  )
}

export default LeftSection

const styles = StyleSheet.create({
  leftcontainer: {
    width: '50%',
  },
  tabscontainer: {
    width: 445,
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: spacing.SPACING_XXL,
  }
})