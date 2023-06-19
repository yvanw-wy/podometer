import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Heatmap } from '@ant-design/plots';
import { Divider } from 'antd'
import colors from '../../assets/styles/colors';


const dict_to_array = (datas : any) => { // This function parses dict datas received from the back end into the front
    let output: any = [];
    const days = Object.values(datas['day']);
    const hours = Object.values(datas['hour']);
    const values = Object.values(datas['dataset.point.value.intVal']);
    for (let i = 0; i < days.length; i++) {
        output.push({
            day: days[i].toString(),
            value: parseInt(values[i]),
            hour: hours[i].toString(),
        })
    }
    return output
}

const months = [ "janvier", "février", "mars", "avril", "mai", "juin", 
           "juillet", "août", "septembre", "octobre", "novembre", "décembre" ];

interface propsHeatMap {
    datas_mean: any,
    width: any,
    height: any,
    legend: any,
    hasAxis: any,
}

const HeatMap = (props: propsHeatMap) => {
  const { datas_mean, width, height, legend, hasAxis } = props;
  const [refactoredMean, setRefactoredMean] = useState([]);
  const [rawDatasMonthly, setRawDatasMonthly] = useState([]);
  const [monthIndex, setMonthIndex] = useState([]);

  useEffect(() => {
    const datas_mean_refactored = dict_to_array(datas_mean);
    // const output_month : any = []
    // const trackMonth : any = []
    // datas_month_grouper.map((month_grouper : any) => {  
    //     const month_refactored = dict_to_array(month_grouper)
    //     const date = new Date(Object.values(month_grouper['startTimeMillis'])[0]);
    //     output_month.push(month_refactored)
    //     trackMonth.push(months[date.getMonth()])
    // })
    // setMonthIndex(trackMonth)
    // setRawDatasMonthly(output_month)
    setRefactoredMean(datas_mean_refactored);
  }, [datas_mean]);

  const config = {
    // type: 'density' as any,
    xField: 'hour' as any,
    yField: 'day' as any,
    colorField: 'value' as any,
    color: [colors.BACKGROUND_SCREEN,  '#C3C3F0',  '#8F8FED', '#5053DE', '#3A3FE1'] as any,
    legend: false as any,
    tickLine: null,
    line: null,
    yAxis: {
        label: {
            formatter: (value : any, index : any) => {
                if(!hasAxis){
                    return ''
                }
                else if(value === '1'){
                    return "1j"     
                }
                else if(value === '15'){
                    return "15j"     
                }
                else if(value === '29'){
                    return "29j"     
                }
                return ''
            },
            min: 1,
            max: 30
        },
        grid: {
            line: null as any
        },
    },
    xAxis: {
        grid: {
            line: null as any
        },
        line: false as any,
        label: {
            formatter: (value : any, index : any) => {
                if(!hasAxis){
                    return ''
                }
                else if(value === '0'){
                    return "0h"     
                }
                else if(value === '12'){
                    return "12h"     
                }
                else if(value === '22'){
                    return "22h"     
                }
                return ''
            },                    
            min: 0,
            max: 24,
            maxLimit: 24
        }
    },
    interactions: !hasAxis ? false : [
        {
          type: 'element-active',
        },
    ] as any,
  };

  return (
    <>
        {
            refactoredMean.length ?
                <Heatmap data={refactoredMean} {...config} width={width} height={height} autoFit={false} />
            :
            <Text>Loading</Text>    
        }
    </>
    // <View style={styles.heatMapContainer as any}>
    //     <View>
    //         <Text style={styles.textHeatMap as any}>Carte d'activités moyenne</Text>
    //         <Heatmap data={refactoredMean} {...config} width={500} height={300} autoFit={false} />
    //     </View>
    //     {/* {
    //         rawDatasMonthly.map((data : any, index: any) => {
    //             return (
    //                 <View style={styles.subHeatMap as any}>
    //                     <Divider type='vertical' />
    //                     <Text style={styles.textHeatMap as any}>Carte d'activités - mois de {monthIndex[index]}</Text>
    //                     <Heatmap 
    //                         key={index}
    //                         data={data}
    //                         {...config}
    //                         width={500} 
    //                         height={300}
    //                         autoFit={false}
    //                     />
    //                     <Divider type='vertical' />
    //                 </View>
    //             )
    //         })
    //     } */}
    // </View>
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