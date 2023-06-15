import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Path } from 'react-native-svg';

interface propsSvg {
    color: any,
    width: any,
    height: any
}

const ArrowLeftIcon = (props: propsSvg) => {
  const { color, width, height } = props;
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M15.705 16.59L11.125 12L15.705 7.41L14.295 6L8.29498 12L14.295 18L15.705 16.59Z" fill={color}/>
    </Svg>
  )
}

export default ArrowLeftIcon

const styles = StyleSheet.create({})