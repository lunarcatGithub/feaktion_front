import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components/native'
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler'
import useOnLayout from '~/Hooks/useOnLayout'
import IndexCover from '../Common/IndexCover'
import { Header } from '../Header/Header'

// data
import {
  isMeModalList,
  isNotMedropdownList,
  isMeCoverModify,
} from '~/Data/dropdownData'
import { StyleSheet } from 'react-native'
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import theme from '~/Styles/Theme'

type modal = {
  data: {
    index: number
    desc: string
    value: string
  }[]
  position: number
  type: string
  dropdownType: string
}

type props = {
  coverData: { isWriter: boolean; feaktion_title: string }
  fictionId: number
  setToastPush: Dispatch<SetStateAction<string>>
  setIsModal: Dispatch<SetStateAction<boolean>>
  setDropdownType: Dispatch<SetStateAction<modal>>
  navigation: any
  data: { isWriter: boolean; feaktion_title: string }
  currentType: string
  isUploaded: string
}

export default function ViewIndexCover({
  coverData,
  fictionId,
  setToastPush,
  navigation,
  currentType,
  setIsModal,
  setDropdownType,
  data,
  isUploaded,
}: props): JSX.Element {
  // ref
  const moveAnime: SharedValue<number> = useRef(useSharedValue(0)).current

  // fetch

  // store

  // scroll controll
  const [_size, _getSizeLayout] = useOnLayout('')
  const [scrollHandle, setScrollHandle] = useState(0)
  const [initDistance, setInitDistance] = useState(0)
  const [isUpOrDown, setisUpOrDown] = useState('down')

  const gestureHandler = (
    e: GestureEvent<PanGestureHandlerEventPayload>
  ): void => {
    const { translationX, translationY } = e.nativeEvent

    if (translationX < translationY && translationY > 8) {
      setisUpOrDown('down')
      if (_size?.y >= 0) {
        setScrollHandle(0)
      } else {
        setScrollHandle(-200 + initDistance + translationY)
      }
    } else if (translationX > translationY && translationX > -20) {
      setisUpOrDown('up')

      setScrollHandle(initDistance + translationY)
    }
  }

  const previewHeaderCtrl = (type: string, value: string): void => {
    if (type === 'goback') navigation.goBack()
    if (type === 'second') {
      navigation.goBack()
    }
  }

  const restoreScrollHandler = () => {
    let distant: number
    moveAnime.value = scrollHandle
    if (scrollHandle >= -120 && isUpOrDown === 'down') {
      // setScrollHandle(0);
      distant = 0
    } else {
      // setScrollHandle(-200);
      distant = -200
    }

    if (scrollHandle <= -80 && isUpOrDown === 'up') {
      // setScrollHandle(-200);
      // moveAnime.value = withTiming(-200, {duration:500});
      distant = -200
    } else {
      // setScrollHandle(0);
      distant = 0
    }
    moveAnime.value = withTiming(distant, { duration: 500 })
  }

  const viewerheaderCtrl = (type: string) => {
    if (type === 'goback') {
      // avoid move to text editor
      if (
        isUploaded &&
        ['Episode', 'EpisodeModify', 'Short', 'ShortModify'].includes(
          isUploaded
        )
      ) {
        navigation.popToTop(3)
      } else {
        navigation.goBack()
      }
    }

    if (type === 'first') {
      setIsModal(true)
      const params: modal = {
        data: isNotMedropdownList,
        position: 35,
        type: 'smallDropdownPan',
        dropdownType: 'general',
      }

      if (coverData?.isWriter) {
        setDropdownType({ ...params, data: isMeModalList })
      } else {
        setDropdownType({ ...params, data: isNotMedropdownList })
      }
    }
  }

  const animatedStyles = useAnimatedStyle(() => {
    return {
      top: moveAnime.value,
    }
  })

  useEffect(() => {
    moveAnime.value = withDelay(2000, withTiming(-200, { duration: 500 }))
  }, [])

  return (
    <>
      <PanGestureHandler
        onBegan={e => setInitDistance(Number(e.nativeEvent.y))}
        onEnded={restoreScrollHandler}
        onGestureEvent={currentType === 'Short' ? gestureHandler : undefined}>
        <HeaderWrap>
          <Header
            navigation={navigation}
            route={{
              name: `${
                currentType === 'Preview'
                  ? 'Preview'
                  : data?.isWriter
                  ? 'MyViewer'
                  : 'Viewer'
              }`,
              params: {
                title:
                  currentType === 'Preview'
                    ? '미리보기'
                    : data?.feaktion_title || coverData?.feaktion_title,
              },
            }}
            onPress={
              currentType === 'Preview' ? previewHeaderCtrl : viewerheaderCtrl
            }
          />
        </HeaderWrap>
      </PanGestureHandler>
      {currentType === 'Short' ? (
        <Dummy>
          <PanGestureHandler
            onGestureEvent={gestureHandler}
            onEnded={restoreScrollHandler}>
            <Animated.View
              onLayout={_getSizeLayout}
              style={[
                styles.moveLayout,
                animatedStyles,
                { backgroundColor: theme.color.gray12, top: scrollHandle },
              ]}>
              <IndexCover
                setToastPush={setToastPush}
                fictionId={fictionId}
                fictionData={coverData}
                onPress={() => console.log('')}
                type="View"
              />
            </Animated.View>
          </PanGestureHandler>
        </Dummy>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  moveLayout: {
    position: 'absolute',
    left: 0,
    right: 0,
    display: 'flex',
    width: '100%',
    // background:${({ theme }) => theme.color.gray12};
    zIndex: 9999999999,
    paddingTop: 18,
    paddingBottom: 18,
  },
})
const Dummy = styled.View`
  z-index: 99999;
`

// header
const HeaderWrap = styled.View`
  width: 100%;
`

// IndexWrap
const IndexWrap = styled.View<{ scrolling: number }>`
  position: absolute;
  top: ${({ scrolling }) => scrolling + `px`};
  left: 0;
  right: 0;
  display: flex;
  width: 100%;
  background: ${({ theme }) => theme.color.gray12};
  z-index: 9999999999;
  padding: 18px 0;
`
