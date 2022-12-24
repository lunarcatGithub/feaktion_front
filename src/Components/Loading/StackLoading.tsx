import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/native'

// icons
import Star from '@Icons/Loading/star.svg'
import StarLight from '@Icons/Loading/starLight.svg'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native'

export default function StackLoading() {
  const firstOpacity = useRef(useSharedValue(0.3)).current
  const secondOpacity = useRef(useSharedValue(0.3)).current
  const thirdOpacity = useRef(useSharedValue(0.3)).current

  const firstStyles = useAnimatedStyle(() => {
    return {
      opacity: firstOpacity.value,
    }
  })

  const secondStyles = useAnimatedStyle(() => {
    return {
      opacity: secondOpacity.value,
    }
  })

  const thirdStyles = useAnimatedStyle(() => {
    return {
      opacity: thirdOpacity.value,
    }
  })

  const animateHandler = items => {
    // 최종 렌더링
    const { index, width, height, top, left, delay, animate, animationValue } =
      items

    setTimeout(() => {
      animationValue.value = withRepeat(
        withTiming(1, { duration: 700 }),
        -1,
        true
      )
    }, delay)
    // () => clearTimeout(time);

    return (
      <Animated.View
        key={`key__${index}`}
        style={[{ position: 'absolute', top, left }, animate]}>
        <StarLight width={width} height={height} />
      </Animated.View>
    )
  }

  const starAnime = [
    {
      index: 0,
      width: 34,
      height: 35,
      top: 8,
      left: -3,
      delay: 700,
      animate: firstStyles,
      animationValue: firstOpacity,
    },
    {
      index: 1,
      width: 17,
      height: 18,
      top: 0,
      left: 25,
      delay: 450,
      animate: secondStyles,
      animationValue: secondOpacity,
    },
    {
      index: 2,
      width: 11,
      height: 12,
      top: 32,
      left: 34,
      delay: 150,
      animate: thirdStyles,
      animationValue: thirdOpacity,
    },
  ]

  return (
    <Layout>
      <LayoutCenter>
        {starAnime?.map(item => animateHandler(item))}
      </LayoutCenter>
    </Layout>
  )
}

const AnimeLayout = styled.View``

const Layout = styled.View`
  position: absolute;
  justify-content: center;
  align-items: center;
  flex: 1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #222;
  opacity: 0.8;
  z-index: 99999999999999;
`

const LayoutCenter = styled.View`
  position: relative;
  width: 50px;
  height: 50px;
`

const StarWrap = styled.View<{ positionTop: number; positionLeft: number }>`
  position: absolute;
  top: ${({ positionTop }) => `${positionTop}px`};
  left: ${({ positionLeft }) => `${positionLeft}px`};
`
