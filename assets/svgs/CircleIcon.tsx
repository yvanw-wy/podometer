import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Circle } from 'react-native-svg';

interface propsSvg {
    color: any,
    width: any,
    height: any
}

const CircleIcon = (props: propsSvg) => {
    const { color, width, height } = props;
    return (
      <Svg width={width} height={height} viewBox="0 0 10 10" fill="none">
          <Circle cx="5" cy="5" r="5" fill={color}/>
      </Svg>
    )
}

export default CircleIcon

const styles = StyleSheet.create({})