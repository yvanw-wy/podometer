import { StyleSheet, Text, View, Alert, Button, Platform } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import dispatchAPI from '../../api/apiContext'
import GoogleFit from '../../utils/Google/GoogleFit'
import HeatMap from '../../utils/HeatMap/HeatMap'
import { Spin, Divider } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const HomeScreen = () => {
    let props_datas: any = {}
    let props_array_datas: any = []
    const [datasGoogle, setDatasGoogle] = useState(props_datas);
    const [userInfo, setUserInfo] = useState(props_datas);
    const [accessToken, setAccessToken] = useState(props_datas);
    const [datasHeatMap, setDatasHeatMap] = useState(props_array_datas);

  return (
    <View>
      {
        !Object.keys(accessToken).length ?
          <GoogleFit setDatasGoogle={setDatasGoogle} setDatasHeatMap={setDatasHeatMap} setUserInfo={setUserInfo} accessToken={accessToken} setAccessToken={setAccessToken} />
        :
        <>
          { datasGoogle.length ?
            datasGoogle.map((data: any, id: any) => {
              return (
                <View key={id}>
                  {
                    Object.keys(data.datas).length ? 
                      <View>
                        <Text style={{ textAlign: 'center', fontSize: '1.5rem' }}>Datas - {data.user_email}</Text>
                        <HeatMap datas_mean={data.datas_mean} datas_month_grouper={data.datas_month_grouper} />
                        <Divider />
                      </View>

                    :
                      <></>
                  }
                </View>
              )
            })
            :
            <Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
          }
        </>
      }
    </View>
  )
}

// Git push
// Workflow on IoS
// Comparison between each heat map


export default HomeScreen

const styles = StyleSheet.create({})