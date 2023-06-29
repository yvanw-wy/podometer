import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Line, Area } from '@ant-design/plots'
import colors from '../../assets/styles/colors'


interface propsLineMap {
    color: any,
    background: any,
    month: any,
    mustScale: any
}


const MultiLineMap = (props: propsLineMap) => {
    const { color, background , month, mustScale} = props;
    let props_array_datas: any = []
    const [data, setData] = useState(props_array_datas);
    useEffect(() => {
        asyncFetch();
    }, [month]);

    const scale = (number : any, [inMin , inMax] : any, [outMin, outMax] : any) => {
        return (number - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
    }

    const parseDatas = (json : any) => {
        const max = Math.max(...json.map((o : any) => o.scales))
        const output = [] as any
        json.map((data : any) => {
            let newObj = {
                Date: null,
                scales: null,
                category: null
            };
            newObj.Date = data.Date;
            newObj.category = data.category;
            if(mustScale){
                newObj.scales = scale(data.scales, [0, max], [0, 5])
            }
            else {
                newObj.scales = data.scales
            }
            output.push(newObj)
        })
        return output
    }

    const asyncFetch = () => {
        // console.log(month)
        if(month.length){
            const output = parseDatas(month)
            setData(output)
        }
        else {
            fetch('https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json')
            .then((response) => response.json())
            .then((json) => {
                const output = parseDatas(json)
                setData(output)
            })
            .catch((error) => {
                console.log('fetch data failed', error);
            });
        }
    };

    const config = {
        data,
        padding: 'auto' as any,
        xField: 'Date' as any,
        yField: 'scales' as any,
        legend: null as any,
        height: 340 as any,
        width: 450 as any,
        color: [color, '#ff4d4f'] as any,
        seriesField: 'category' as any,
        areaStyle: () => {
            return {
              fill: `l(270) 0:${background} 0.5:${colors.PRESSED_BUTTON} 1:#1890ff`,
            };
        },
        yAxis: {
            label: {
              formatter: (v : any) => v,
            },
            grid: {
                line: null as any
            },
            title: {
                text: 'Nombre de pas',
                style: {
                  fontSize: 16,
                },
            },
        },
        xAxis: {
            label: {
                formatter: (v : any) => {
                    const date = new Date(v)
                    const day = date.getDate()
                    if(day % 5 === 0){
                        return day + 'j'
                    }
                    else {
                        return ''
                    }
                },
            },
            grid: {
                line: null as any
            },
            line: false as any,
            title: {
                text: 'Jours du mois',
                style: {
                  fontSize: 16,
                },
            },
        },
        animation: {
            appear: {
              animation: 'path-in' as any,
              duration: 2000 as any,
            },
        },
        tooltip: false as any,
        smooth: true as any
    };
  return (
    <View>
      <Line {...config} />
    </View>
  )
}

export default MultiLineMap

const styles = StyleSheet.create({})