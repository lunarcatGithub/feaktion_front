import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/native'

// components
import Popup from './Popup'
import ToastPopup from './ToastPopup'
import ModalList from './ModalList'
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { Dimensions, StyleSheet } from 'react-native'

type modal = {
  data:
    | {
        index: number
        desc: string
        value: string
      }[]
    | null
  visible: boolean
  onPress: (type: string, value: string) => void
  onClose: () => void
  type: string
  modalType: string
}

export default function ModalPopup({
  data,
  visible,
  onPress,
  onClose,
  type,
  modalType,
}: modal): JSX.Element {
  const windowHeight = Math.floor(Dimensions.get('window').height)

  // ref
  const moveModal: SharedValue<number> = useRef(useSharedValue(-300)).current

  useEffect(() => {
    if (visible) {
      moveModal.value = withTiming(0, { duration: 200 })
    } else {
      moveModal.value = withTiming(-300, { duration: 300 })
    }
  }, [visible, moveModal])

  const animatedStyles = useAnimatedStyle(() => {
    return {
      bottom: moveModal.value,
    }
  })

  const divideHandler = () => {
    if (modalType === 'Popup') {
      return <Popup onPress={onPress} type={type} modalType={modalType} />
    } else if (modalType === 'ToastPopup') {
      return (
        <ToastPopup
          data={data}
          onPress={onPress}
          modalType={modalType}
          type={type}
        />
      )
    } else if (modalType === 'ModalList') {
      return <ModalList data={data} onPress={onPress} type={type} />
    } else return
  }

  return (
    <>
      {visible ? (
        <HOL>
          <OutLayout
            onPress={() => {
              onPress('Layout', 'close')
              onClose()
            }}
          />
          {modalType !== 'ToastPopup' ? (
            <GeneralModal>
              <ModalWrap onPress={() => onPress('Popdown', '')}>
                {divideHandler()}
              </ModalWrap>
            </GeneralModal>
          ) : null}
        </HOL>
      ) : null}
      {modalType === 'ToastPopup' ? (
        <Animated.View style={[toastPopup(), animatedStyles]}>
          <ModalWrap onPress={() => onPress('Popdown', '')}>
            {divideHandler()}
          </ModalWrap>
        </Animated.View>
      ) : null}
    </>
  )
}

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
  background: rgba(0, 0, 0, 0.6);
`

const GeneralModal = styled.View`
  display: flex;
  padding: 0 40px;
`

const ModalWrap = styled.TouchableOpacity`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`
