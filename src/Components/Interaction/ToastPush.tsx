import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'
import theme from '~/Styles/Theme'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated'
import { LayoutChangeEvent, StyleSheet } from 'react-native'

// hooks
import { useAppContext } from '~/Hooks/useContextHook'

export default function ToastPush({ type }: { type: string }): JSX.Element {
  const { animationMove, setAnimationMove } = useAppContext()

  const [layoutSize, setLayoutSize] = useState(0)

  const offset = useRef(useSharedValue(50)).current
  const widthSpread = useRef(useSharedValue(0)).current
  const opacityCtrl = useRef(useSharedValue(0)).current

  const titleHandler = (): string | undefined => {
    switch (type) {
      case 'NOTCOMPLETE':
        return '곧 서비스 예정입니다'

      case 'COMMENTLENGTH':
        return '2자 이상 입력해주세요'

      case 'NEWCOVER':
        return '작품 표지 생성완료'

      case 'MODIFYCOVER':
        return '작품 표지 수정완료'

      case 'NEWEPISODE':
        return '에피소드 생성 완료'

      case 'SUCCESSCOMMENT':
        return '댓글을 달았습니다'

      case 'REMOVECOMMENT':
        return '댓글을 삭제했습니다'

      case 'PICKON':
        return '선호하는 드는 작품에 추가했습니다'

      case 'PICKOFF':
        return '선호하는 작품에서 제외했습니다'

      case 'PATCHCOMMENT':
        return '댓글을 수정했습니다'

      case 'CHANGEDPASSWORD':
        return '비밀번호를 변경했습니다'

      case 'CHANGEDUSERINFORM':
        return '프로필을 수정했습니다'

      default:
        'NOTCOMPLETE'
        break
    }
  }

  const animationLayout = (e: LayoutChangeEvent): void => {
    const { width } = e.nativeEvent.layout
    setLayoutSize(width)
  }

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offset.value }],
      width: widthSpread.value,
    }
  })

  const textAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacityCtrl.value,
    }
  })

  useEffect(() => {
    if (animationMove.type === type && animationMove?.bool) {
      offset.value = withSpring(
        animationMove.value,
        {
          damping: 20,
          stiffness: 200,
        },
        () => {
          opacityCtrl.value = withTiming(1)
          widthSpread.value = withTiming(layoutSize, {}, () => {
            opacityCtrl.value = withDelay(2000, withTiming(0))
            widthSpread.value = withDelay(
              2000,
              withTiming(0, {}, () => {
                offset.value = withTiming(50, {
                  duration: 300,
                })
              })
            )
          })
        }
      )
    }
    // setAnimationMove({...animationMove, bool:false});
  }, [animationMove.type, animationMove?.bool, layoutSize, type])

  useEffect(() => {
    if (animationMove?.bool) {
      const time = setTimeout(() => {
        setAnimationMove({ ...animationMove, bool: false, loading: false })
      }, 3000)
      return () => clearTimeout(time)
    }
  }, [animationMove?.bool, opacityCtrl, widthSpread, offset])

  return (
    <Layout>
      <LayoutInner>
        <Animated.View style={[styles.container, animatedStyles]} />
        <Dummy onLayout={animationLayout}>
          <Text>{titleHandler()}</Text>
        </Dummy>
        <Animated.View style={[styles.viewContainer, animatedStyles]}>
          <TextInner size={layoutSize}>
            <Animated.Text style={[styles.textStyle, textAnimatedStyles]}>
              {titleHandler()}
            </Animated.Text>
          </TextInner>
        </Animated.View>
      </LayoutInner>
    </Layout>
  )
}
const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    // backgroundColor:theme.color.gray6,
    transform: [{ translateX: 32 }],
    borderRadius: 50,
  },
  viewContainer: {
    height: 32,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: theme.color.gray6,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  textStyle: {
    fontSize: 12,
    color: theme.color.gray1,
  },
})

const Layout = styled.View`
  height: 0;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  z-index: 999;
  background: white;
`

const LayoutInner = styled.View``
const TextInner = styled.View<{ size: number }>`
  justify-content: center;
  align-items: center;
  min-width: ${({ size }) => `${size}px`};
`

const Text = styled.Text`
  font-size: ${({ theme }) => theme.fontSize.font12};
  color: ${({ theme }) => theme.color.gray1};
  flex-shrink: 1;
`

const Dummy = styled.View`
  opacity: 0;
  padding: 0 16px;
`
