import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Svg, { Path } from 'react-native-svg';

interface propsSvg {
    color: any,
    width: any,
    height: any
}
const BodyIcon = (props: propsSvg) => {
  const { color, width, height } = props;
  return (
    <Svg width={width} height={height} viewBox="0 0 15 38" fill="none">
        <Path d="M7.17806 7.17289C9.16753 7.17289 11.1955 5.46432 11.1955 3.65186C11.1955 1.84325 9.26758 0 7.27426 0C5.28479 0 3.30685 1.88558 3.30685 3.69804C3.30685 5.50665 5.18858 7.17289 7.17806 7.17289Z" fill={color}/>
        <Path d="M14.9436 17.6513V12.2254C14.9436 10.4515 15.0705 10.6208 14.9436 9.51251C14.4549 8.15413 13.4813 7.7039 12.5039 7.7039H8.10931C6.14677 7.7039 5.19628 7.6962 3.24144 7.6962C2.26402 7.6962 1.62908 7.63848 0.905636 8.24648C-0.0833294 9.28547 0.0167214 9.37398 0.0167214 12.2716V17.7975C0.0167214 19.229 -0.244951 21.4532 1.30199 21.4532C2.76812 21.4532 2.75273 20.4835 2.75273 19.0404C2.75273 17.0009 2.74888 16.4699 2.74888 15.2654C2.74888 13.9494 2.66807 13.7262 2.95283 13.7262C3.24144 13.7262 3.23759 13.7454 3.23759 15.1423C3.23759 16.4391 3.22605 34.7023 3.22605 35.7567C3.22605 36.661 3.74555 37.6307 5.21553 37.6307C6.68166 37.6307 7.29351 36.8341 7.29351 35.9298V26.425C7.29351 25.5207 7.32814 25.082 7.56672 25.082C7.813 25.082 7.78222 25.5207 7.78222 26.425V35.926C7.78222 36.4878 8.42485 37.7115 9.89099 37.7115C10.8684 37.7115 11.765 36.5494 11.765 35.9452C11.765 32.3241 11.7881 16.2198 11.7881 15.0807C11.7881 14.465 11.7304 13.68 11.9805 13.68C12.2306 13.68 12.2229 13.8917 12.2229 14.7844V18.267C12.2229 20.649 12.6231 21.2724 13.5967 21.2724C15.0705 21.2724 14.9436 18.9481 14.9436 17.6513Z" fill={color}/>
    </Svg>
  )
}

export default BodyIcon

const styles = StyleSheet.create({})