import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Line, Area } from '@ant-design/plots'
import colors from '../../assets/styles/colors'


interface propsLineMap {
    color: any,
    background: any
}

const LineMap = (props: propsLineMap) => {
    const { color, background } = props;

    let props_array_datas: any = []
    const [data, setData] = useState(props_array_datas);
    useEffect(() => {
        asyncFetch();
    }, []);

    const scale = (number : any, [inMin , inMax] : any, [outMin, outMax] : any) => {
        return (number - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
    }

    const asyncFetch = () => {
        fetch('https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json')
            .then((response) => response.json())
            .then((json) => {
                const max = Math.max(...json.map((o : any) => o.scales))
                const output = [] as any
                json.map((data : any) => {
                    let newObj = {
                        Date: null,
                        scales: null
                    };
                    newObj.Date = data.Date;
                    newObj.scales = scale(data.scales, [0, max], [0, 5])
                    output.push(newObj)
                })
                setData(output)
            })
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    };

    const config = {
        data,
        padding: 'auto' as any,
        xField: 'Date' as any,
        yField: 'scales' as any,
        legend: null as any,
        height: 40 as any,
        color: color as any,
        areaStyle: () => {
            return {
              fill: `l(270) 0:${background} 0.5:${colors.PRESSED_BUTTON} 1:#1890ff`,
            };
        },
        yAxis: {
            label: {
              formatter: (v : any) => '',
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
            label: false as any,
        },
        animation: {
            appear: {
              animation: 'path-in' as any,
              duration: 1000 as any,
            },
        },
        tooltip: false as any,
        smooth: true as any
    };
  return (
    <View>
      <Area {...config} />
    </View>
  )
}

export default LineMap

const styles = StyleSheet.create({})