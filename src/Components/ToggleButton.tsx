import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { Animated, ViewStyle } from 'react-native'

type Props = {
  buttonText1: string
  buttonText2: string
  onPress: (type: string) => void
}

export function MiddleToggleButton({
  buttonText1 = '',
  buttonText2 = '',
  onPress,
}: Props): JSX.Element {
  const [active, setActive] = useState('left')

  return (
    <ButtonWrap>
      <ToggleButton
        value="left"
        toggle={active}
        onPress={() => {
          onPress('left')
          setActive('left')
        }}>
        <ToggleButtonText styling={'left' === active}>
          {buttonText1}
        </ToggleButtonText>
      </ToggleButton>
      <ToggleButton
        value="right"
        toggle={active}
        onPress={() => {
          onPress('right')
          setActive('right')
        }}>
        <ToggleButtonText styling={'right' === active}>
          {buttonText2}
        </ToggleButtonText>
      </ToggleButton>
    </ButtonWrap>
  )
}

const ButtonWrap = styled.View`
  display: flex;
  width: 100%;
  height: 48px;
  flex-direction: row;
  background: ${({ theme }) => theme.color.gray6};
  border-radius: 4px;
`

const ToggleButton = styled.TouchableOpacity<{ toggle: string; value: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  border: ${({ theme, toggle, value }) =>
    value === toggle && `2px solid ${theme.color.purple4}`};
  border-radius: ${({ value }) =>
    value === 'left' ? `4px 0 0 4px` : `0 4px 4px 0`};
`

const ToggleButtonText = styled.Text<{ styling: boolean }>`
  color: ${({ theme, styling }) =>
    styling ? theme.color.purple4 : theme.color.gray2};
`

export function SmallToggleButton({
  toggle,
}: {
  toggle: boolean
}): JSX.Element {
  const [translateValue] = useState(new Animated.Value(1))
  const [toValue, setToValue] = useState(0)

  useEffect(() => {
    Animated.spring(translateValue, {
      toValue,
      mass: 0.1,
      stiffness: 300,
      overshootClamping: false,
      useNativeDriver: true,
    }).start()
  }, [translateValue, toValue])

  useEffect(() => {
    if (toggle) {
      setToValue(16)
    } else {
      setToValue(0)
    }
  }, [toggle])

  return (
    <ButtonLayout styling={toggle}>
      <Tama
        styling={toggle}
        as={Animated.View}
        style={{
          transform: [{ translateX: translateValue }],
        }}
      />
    </ButtonLayout>
  )
}

const ButtonLayout = styled.View<{ styling: boolean }>`
  width: 30px;
  height: 16px;
  background: ${({ theme, styling }) =>
    styling ? theme.color.purple4 : theme.color.gray4};
  border-radius: 25px;
`

const Tama = styled.View<{ styling: boolean; style: ViewStyle }>`
  width: 16px;
  height: 16px;
  border-radius: 50px;
  background: ${({ theme, styling }) =>
    styling ? theme.color.gray1 : theme.color.gray3};
`
