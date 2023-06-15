import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Path } from 'react-native-svg';

interface propsSvg {
    color: any,
    width: any,
    height: any
}
const PlusIcon = (props: propsSvg) => {
  const { color, width, height } = props;
  return (
    <Svg width={width} height={height} viewBox="0 0 25 24" fill="none">
        <Path d="M19.5 13H13.5V19H11.5V13H5.5V11H11.5V5H13.5V11H19.5V13Z" fill={color}/>
    </Svg>
  )
}

export default PlusIcon

const styles = StyleSheet.create({})