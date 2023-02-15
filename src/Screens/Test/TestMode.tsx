import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'
// gesture
import {
    Gesture,
    GestureDetector,
    GestureEvent,
    PanGestureHandler,
    PanGestureHandlerEventPayload,
    GestureHandlerRootView,
    TapGestureHandler,
    PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'

import { StyleSheet } from 'react-native'
import Animated, {
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
    useAnimatedGestureHandler,
    withSpring,
} from 'react-native-reanimated'

export default function TestMode(): JSX.Element {
    const displayView = () => {
        return (
            <ModeDisplayWrap>
                <ModeDisplay>TestMode</ModeDisplay>
            </ModeDisplayWrap>
        )
    }

    return (
        <GestureHandlerRootView>
            <Layout>
                {displayView()}
                <LayoutInner>
                    <SandBox />
                </LayoutInner>
            </Layout>
        </GestureHandlerRootView>
    )
}

const SandBox = () => {
    const pressed = useSharedValue(false)
    // const animationGestureHandler = useAnimatedGestureHandler({
    //     onStart(event, context) {},
    //     onActive({ translationY }, context) {
    //         console.log('event', translationY)
    //         // movePosition.value = translationY
    //     },
    //     onEnd(event, context) {},
    // })

    const gesture = Gesture.Tap()
        .onBegin(() => {
            console.log('tab')
            pressed.value = true
        })
        .onEnd(() => {
            console.log('tab end')
            pressed.value = false
        })

    // const uas = useAnimatedStyle(() => {
    //     return {
    //         backgroundColor: color,
    //         transform: [{ scale: withSpring(test ? 1.2 : 1) }],
    //     }
    // }, [])

    return (
        // <PanGestureHandler onGestureEvent={animationGestureHandler}>
        //     <Animated.View
        //         // onLayout={_getSizeLayout}
        //         style={[
        //             styles.moveLayout,
        //             {
        //                 backgroundColor: '#999',
        //                 // top: movePosition.value,
        //             },
        //         ]}>
        //         <TestBox />
        //     </Animated.View>
        // </PanGestureHandler>
        <GestureDetector gesture={gesture}>
            <LayoutInner>
                <Button onPress={() => setTest(!test)}>
                    <Text>test</Text>
                </Button>
                <Animated.View
                    style={[
                        styles.moveLayout,
                        uas,
                        {
                            transform: [{ scale: 1 }],
                        },
                    ]}
                />
            </LayoutInner>
        </GestureDetector>
    )
}

const styles = StyleSheet.create({
    moveLayout: {
        width: 120,
        height: 120,
        backgroundColor: '#FEEF86',
    },
})

const Layout = styled.ScrollView`
    background-color: #9889;
`

const LayoutInner = styled.View`
    width: 100%;
`

const ModeDisplayWrap = styled.View`
    width: 100%;
    height: 60px;
`

const ModeDisplay = styled.Text`
    color: black;
    font-size: 16px;
    font-weight: 700;
`

const TestBox = styled.View`
    width: 120px;
    height: 120px;
`

const Button = styled.TouchableOpacity`
    width: 40px;
    height: 40px;
    background-color: blue;
`

const Text = styled.Text`
    color: black;
    font-size: 14px;
    font-weight: 500;
`
