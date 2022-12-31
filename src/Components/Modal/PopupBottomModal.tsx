import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

export type ValueEnum = 'short' | 'fiction' | 'inheritFiction'

type Props = {
  visible: boolean
  onClose: () => void
  onTrigger: ({ value, navi }: { value: string; navi: string }) => void
}

const newFiction = [
  { desc: '단편 작품 쓰기', navi: 'UploadCover', value: 'short' },
  { desc: '새 연재 추가하기', navi: 'UploadCover', value: 'fiction' },
  {
    desc: '기존 연재 이어쓰기',
    navi: 'InheritFiction',
    value: 'inheritFiction',
  },
  // { index: 3, desc: "저장한 에피소드 불러오기", value: "savedFiction" },
]

export default function PopupBottomModal({
  visible,
  onClose,
  onTrigger,
}: Props) {
  // ref
  const moveModal: SharedValue<number> = useRef(useSharedValue(-300)).current
  const test = useSharedValue(-300)

  useEffect(() => {
    if (visible) {
      test.value = withTiming(0, { duration: 200 })
    } else {
      test.value = withTiming(-300, { duration: 300 })
    }
  }, [visible])

  const animatedStyles = useAnimatedStyle(() => {
    return {
      bottom: moveModal.value,
    }
  })

  const toastPopup = () => {
    return {
      position: 'absolute',
      display: 'flex',
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 9999,
      justifyContent: 'flex-end',
    }
  }

  return (
    <>
      {visible ? (
        <HOL>
          <OutLayout
            onPress={() => {
              onClose()
            }}
          />
        </HOL>
      ) : null}
      {/* <Animated.View style={[toastPopup(), animatedStyles]}> */}
      {visible && (
        <Layout style={toastPopup()}>
          <ButtonWrap>
            {newFiction?.map(({ desc, value, navi }, index) => (
              <Button
                onPress={() => onTrigger({ value, navi })}
                key={`key__${index}`}>
                <ButtonText>{desc}</ButtonText>
              </Button>
            ))}
          </ButtonWrap>
        </Layout>
      )}
      {/* </Animated.View> */}
    </>
  )
}

const HOL = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
`

const OutLayout = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
`

const Layout = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.color.gray6};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  z-index: 99999;
`

const ButtonWrap = styled.View`
  flex-direction: column;
  padding: 24px 0;
`

const Button = styled.TouchableOpacity`
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 14px 0;
`

// text
const ButtonText = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  font-size: ${({ theme }) => theme.fontSize.font14};
`

const ModalWrap = styled.View`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`
