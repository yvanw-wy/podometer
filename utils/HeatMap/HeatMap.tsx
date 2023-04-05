import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Heatmap } from '@ant-design/plots';
import { Divider } from 'antd'

interface propsHeatMap {
    datas_mean: any
    datas_month_grouper: any
}

const dict_to_array = (datas : any) => { // This function parses dict datas received from the back end into the front
    let output: any = [];
    const days = Object.values(datas['day']);
    const hours = Object.values(datas['hour']);
    const values = Object.values(datas['dataset.point.value.intVal']);
    for (let i = 0; i < days.length; i++) {
        output.push({
            day: days[i],
            value: values[i],
            hour: hours[i],
        })
    }
    return output
}

const months = [ "janvier", "février", "mars", "avril", "mai", "juin", 
           "juillet", "août", "septembre", "octobre", "novembre", "décembre" ];

const HeatMap = (props: propsHeatMap) => {
  const { datas_mean, datas_month_grouper } = props;
  const [refactoredMean, setRefactoredMean] = useState([]);
  const [rawDatasMonthly, setRawDatasMonthly] = useState([]);
  const [monthIndex, setMonthIndex] = useState([]);

  useEffect(() => {
    const datas_mean_refactored = dict_to_array(datas_mean);
    const output_month : any = []
    const trackMonth : any = []
    datas_month_grouper.map((month_grouper : any) => {  
        const month_refactored = dict_to_array(month_grouper)
        const date = new Date(Object.values(month_grouper['startTimeMillis'])[0]);
        output_month.push(month_refactored)
        trackMonth.push(months[date.getMonth()])
    })
    setMonthIndex(trackMonth)
    setRawDatasMonthly(output_month)
    setRefactoredMean(datas_mean_refactored);
  }, []);

  const config = {
    type: 'density' as any,
    xField: 'hour' as any,
    yField: 'day' as any,
    colorField: 'value' as any,
    color: '#F51D27-#FA541C-#FF8C12-#FFC838-#FAFFA8-#80FF73-#12CCCC-#1890FF-#6E32C2' as any,
    legend: {
      position: 'bottom',
    } as any,
    meta: {
        hour: {
            formatter: (value : any, index : any) => value + "h",
            min: 0,
            max: 24,
            maxLimit: 24
        } as any,
        day: {
            formatter: (value : any, index : any) => value + "j",
            min: 1,
            max: 30
        } as any
    }
  };

  return (
    <View style={styles.heatMapContainer as any}>
        <View>
            <Text style={styles.textHeatMap as any}>Carte d'activités moyenne</Text>
            <Heatmap data={refactoredMean} {...config} width={500} height={300} autoFit={false} />
        </View>
        {
            rawDatasMonthly.map((data : any, index: any) => {
                return (
                    <View style={styles.subHeatMap as any}>
                        <Divider type='vertical' />
                        <Text style={styles.textHeatMap as any}>Carte d'activités - mois de {monthIndex[index]}</Text>
                        <Heatmap 
                            key={index}
                            data={data}
                            {...config}
                            width={500} 
                            height={300}
                            autoFit={false}
                        />
                        <Divider type='vertical' />
                    </View>
                )
            })
        }
    </View>
  )
}

export default HeatMap

const styles = StyleSheet.create({
    heatMapContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    textHeatMap: {
        fontSize: 18
    },
    subHeatMap: {
        marginLeft: 40,
        marginRight: 40
    }
})