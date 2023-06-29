import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Scatter } from '@ant-design/plots'

interface propsScatter {
    day: any,
    colors: any,
    background: any
}

const ScatterChart = (props: propsScatter) => {
    const { day, colors, background } = props;
    let props_array_datas: any = []
    const [data, setData] = useState(props_array_datas);

    useEffect(() => {
        asyncFetch();
    }, [day]);


    const asyncFetch = () => {
        if(day.length){
            setData(day)
        }
        else {
            fetch('https://gw.alipayobjects.com/os/bmw-prod/3e4db10a-9da1-4b44-80d8-c128f42764a8.json')
            .then((response) => response.json())
            .then((json) => {
                setData(json)
                console.log(json)
            })
            .catch((error) => {
                console.log('fetch data failed', error);
            });
        }
    }

    const config = {
        data,
        xField: 'x',
        yField: 'y',
        colorField: 'type_activity',
        size: 5,
        shape: 'circle',
        
        yAxis: {
            grid: {
                line: null as any
            },
            line: false as any,
            title: {
                text: 'Nombre de pas/h',
                style: {
                    fontSize: 16,
                },
            },
        },
        xAxis: {
            grid: {
                line: null as any
            },
            line: false as any,
            title: {
                text: 'Heures du jour',
                style: {
                    fontSize: 16,
                },
            },
            label: {
                formatter: (v : any) => {
                    return v + 'h'
                }
            }
        },
        height: 340 as any,
        width: 450 as any,
        regressionLine: {
            type: 'quad', // linear, exp, loess, log, poly, pow, quad
        }
    };

  return (
    <View>
      <Scatter {...config} />;
    </View>
  )
}

export default ScatterChart

const styles = StyleSheet.create({})