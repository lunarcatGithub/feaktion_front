import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react'
import styled from 'styled-components/native'
import LinearGradient from 'react-native-linear-gradient'
import { Dimensions, StyleSheet, LayoutChangeEvent } from 'react-native'
import Animated, {
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated'

// store
import { adjustText } from '~/Store/ViewStore'
import { useViewerContext } from '~/Hooks/useContextHook'

type props = {
    data: {
        item: {
            title: string
            scene: string
            image: { uri: string }
            size: number
            index: number
            epititle: string
        }
    }
    currentType: string
    currentView: number
    setLayoutHeight: Dispatch<
        SetStateAction<{ height: number; index: number }[]>
    >
    layoutheight: {}[]
}

export default function ViewList({
    data,
    currentType,
    currentView,
    layoutheight,
    setLayoutHeight: setLayoutheight,
}: props): JSX.Element {
    const { title, scene, index, epititle } = data?.item
    const windowHeight = Math.floor(Dimensions.get('window').height)

    const [backgroundColor, setBackgroundColor] = useState<string[]>([
        `rgba(0,0,0,0)`,
        `rgba(0,0,0,0)`,
    ])

    // text handle
    // store
    const { adjustViewText } = useViewerContext()

    const [pragraph, setPragraph] = useState<string | null>(null)

    // animation
    const opacityImage: SharedValue<number> = useRef(useSharedValue(0)).current
    const opacityText: SharedValue<number> = useRef(useSharedValue(0)).current

    const animatedStyles = useAnimatedStyle(() => {
        return {
            opacity: opacityImage.value,
        }
    })

    const animatedDesc = useAnimatedStyle(() => {
        return {
            opacity: opacityText.value,
        }
    })

    // preview는 index 1부터 시작함
    const _index = currentType === 'Preview' ? index - 1 : index

    useEffect(() => {
        // animation
        if (currentView === _index) {
            opacityImage.value = withDelay(
                400,
                withTiming(1, { duration: 400 })
            )
            opacityText.value = withDelay(
                1300,
                withTiming(1, { duration: 400 })
            )
        }
    }, [currentView])

    useEffect(() => {
        // 현재 페이지에서 벗어나면 다시 0
        if (currentView !== _index) {
            opacityImage.value = 0
            opacityText.value = 0
        }
    }, [currentView])

    useEffect(() => {
        let color: { first: number; second: number; last: number }

        switch (adjustViewText?.backcolor) {
            case '#E0E0E0':
                color = { first: 224, second: 224, last: 224 }
                break

            case '#121212':
                color = { first: 18, second: 18, last: 18 }
                break

            case '#284648':
                color = { first: 40, second: 70, last: 72 }
                break

            case '#000000':
                color = { first: 0, second: 0, last: 0 }
                break

            case '#414141':
                color = { first: 65, second: 65, last: 65 }
                break

            case 'image':
                color = { first: 0, second: 0, last: 0 }
                break

            default:
                color = { first: 0, second: 0, last: 0 }
                break
        }

        const opacity =
            adjustViewText?.backcolor === 'image'
                ? [0.1, 0.3, 0.5, 0.6, 0.7, 0.8, 0.9]
                : [1, 1]

        const { first, second, last } = color
        const isBackground = [
            ...opacity.map(num => `rgba(${first}, ${second}, ${last}, ${num})`),
        ]

        setBackgroundColor(isBackground)
    }, [adjustViewText, data?.item, currentView])

    useEffect(() => {
        const verticalCount = []
        for (let i = 0; i < adjustViewText?.spacepragraph; i++) {
            verticalCount.push('\n')
        }

        const foundPos = scene.replace(/(\n|\r\n)/g, verticalCount.join(''))
        setPragraph(foundPos)
    }, [adjustViewText?.spacepragraph])

    const titleHandler = () => {
        const divideType = currentType === 'Preview' ? index === 1 : index === 0
        return (
            <ContentLayout height={windowHeight}>
                <LayoutContainer>
                    <Animated.View
                        style={[styles.animationStyle, animatedDesc]}>
                        {divideType ? (
                            <EpisodeTitle styling={adjustViewText?.backcolor}>
                                {epititle}
                            </EpisodeTitle>
                        ) : null}
                        <TitleText styling={adjustViewText?.backcolor}>
                            {title}
                        </TitleText>
                    </Animated.View>
                </LayoutContainer>
            </ContentLayout>
        )
    }

    const heightGetSize = (e: LayoutChangeEvent) => {
        const _layoutheight = []
        const { layout } = e.nativeEvent
        _layoutheight.push({ index, height: layout.height })
        console.log('layoutheight ==>', layoutheight, _layoutheight)
        setLayoutheight([...layoutheight, ..._layoutheight])
    }
    return (
        <Animated.View
            style={[styles.backgroundStyle, animatedStyles]}
            onLayout={heightGetSize}>
            <LinearGradient
                colors={backgroundColor}
                style={{ height: windowHeight, marginTop: -1 }}>
                {titleHandler()}
            </LinearGradient>
            <TextDesc
                fontCtrl={adjustViewText}
                noBackground={true}
                height={windowHeight / 2}>
                <Animated.View style={animatedDesc}>
                    <DescText fontCtrl={adjustViewText}>{scene}</DescText>
                </Animated.View>
            </TextDesc>
            <TitleWrap />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    backgroundStyle: {
        // width:`100%`,
        flex: 1,
        zIndex: 99999,
    },
    animationStyle: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 80,
        zIndex: 99999,
    },
})

const TitleWrap = styled.View`
    /* flex:1; */
    height: 100%;
    background-color: ${({ theme }) => theme.color.gray12};
`

const LayoutContainer = styled.View`
    width: 100%;
    height: 100%;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 80px;
    z-index: 99999;
`

const ContentLayout = styled.View<{ height: number; type?: string }>`
    height: ${({ height }) => height / 2 + `px`};
    background-color: ${({ type }) => {
        if (type === 'scene') {
            return `rgba(0,0,0,0.1)`
        }
    }};
    z-index: 999;
`

const TitleText = styled.Text<{ styling: string }>`
    color: ${({ theme, styling }) =>
        styling === 'image' ? theme.color.gray1 : theme.color.gray3};
    font-size: ${({ theme }) => theme.fontSize.font14};
    font-family: ${({ theme }) => theme.font.notoMedium};
    padding: 14px;
`

const EpisodeTitle = styled.Text<{ styling: string }>`
    color: ${({ theme, styling }) =>
        styling === 'image' ? theme.color.gray1 : theme.color.gray3};
    font-size: ${({ theme }) => theme.fontSize.font20};
    font-family: ${({ theme }) => theme.font.notoMedium};
    line-height: 24px;
`

const DescText = styled.Text<{ fontCtrl: adjustText }>`
    padding: 12px 0;
    font-size: ${({ fontCtrl }) => fontCtrl?.textsize + `px`};
    color: ${({ theme, fontCtrl }) =>
        fontCtrl?.backcolor === 'image'
            ? theme.color.gray3
            : theme.color.gray1};
    line-height: ${({ fontCtrl }) => fontCtrl?.spaceline + `px`};
    font-family: ${({ theme }) => theme.font.notoRegular};
`

const TextDesc = styled.View<{
    fontCtrl: adjustText
    noBackground: boolean
    height: number
}>`
    height: 100%;
    width: 100%;
    background-color: ${({ fontCtrl, noBackground, theme }) => {
        if (noBackground) {
            if (fontCtrl?.backcolor === 'image') {
                return `rgba(0,0,0,0.9)`
            } else {
                return fontCtrl?.backcolor
            }
        } else {
            return theme.color.gray12
        }
    }};

    padding-left: ${({ fontCtrl }) => fontCtrl?.pragraphwidth + `px`};
    padding-right: ${({ fontCtrl }) => fontCtrl?.pragraphwidth + `px`};
    padding-bottom: ${({ height }) => height / 1.5 + 'px'};
`
