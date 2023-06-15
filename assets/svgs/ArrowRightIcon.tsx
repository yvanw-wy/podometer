import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Path } from 'react-native-svg';

interface propsSvg {
    color: any,
    width: any,
    height: any
}

const ArrowRightIcon = (props: propsSvg) => {
  const { color, width, height } = props;
  return (
    <Svg width={width} height={height} viewBox="0 0 30 30" fill="none">
        <Path d="M10.3687 20.7375L16.0937 15L10.3687 9.2625L12.1312 7.5L19.6312 15L12.1312 22.5L10.3687 20.7375Z" fill={color}/>
    </Svg>
  )
}

export default ArrowRightIcon

const styles = StyleSheet.create({})