import React from 'react'
// import Slider from 'react-native-slider'
import theme from '~/Styles/Theme'

type props = {
  value: number
  onValueChange: (num: number) => void
  minimumValue: number
  maximumValue: number
  step: number
}

export default function ScrollBar({
  value,
  onValueChange,
  minimumValue,
  maximumValue,
  step,
}: props) {
  return (
    <></>
    // <Slider
    //   minimumValue={minimumValue}
    //   maximumValue={maximumValue}
    //   thumbTintColor={theme.color.gray3}
    //   thumbStyle={{ width: 12, height: 12 }}
    //   minimumTrackTintColor={theme.color.gray3}
    //   trackStyle={{
    //     height: 4,
    //     borderRadius: 0,
    //     backgroundColor: theme.color.gray6,
    //   }}
    //   value={value}
    //   onValueChange={onValueChange}
    //   step={step}
    // />
  )
}
