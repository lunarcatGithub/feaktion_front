import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'

// icons
import Naver from '@Icons/naver.svg'
import Google from '@Icons/google.svg'
import PureGoogle from '@Icons/pure_google.svg'

type Props = {
  active: boolean
  buttonText: string
  onPress(): void
  social?: 'NAVER' | 'GOOGLE' | ''
}

export function LargeButton({
  active = false,
  buttonText = '',
  onPress,
  social = '',
}: Props): JSX.Element {
  const [iconLayout, setIconLayout] = useState<JSX.Element>()

  const DivideIcon = () => {
    if (social === 'NAVER') {
      setIconLayout(
        <IconWrap>
          <Naver width={40} height={40} />
        </IconWrap>
      )
    } else if (social === 'GOOGLE') {
      setIconLayout(
        <IconWrap>
          <PureGoogle width={20} height={20} />
        </IconWrap>
      )
    } else {
      return
    }
  }

  useEffect(() => {
    DivideIcon()
  }, [])

  return (
    <LargeButtonLayout
      styling={active}
      social={social}
      onPress={() => onPress()}>
      {iconLayout}
      <ButtonText social={social}>{buttonText}</ButtonText>
    </LargeButtonLayout>
  )
}

export function ExtraButton({ active = false, buttonText = '', onPress }) {
  return (
    <ExtraButtonLayout
      styling={active}
      onPress={() => onPress('button')}
      social="">
      <ButtonText>{buttonText}</ButtonText>
    </ExtraButtonLayout>
  )
}
// layout
const LargeButtonLayout = styled.TouchableOpacity<{
  styling: boolean
  social: 'NAVER' | 'GOOGLE' | ''
}>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  border-radius: 4px;
  background: ${({ theme, styling, social }) => {
    if (styling) {
      if (social === 'NAVER') {
        return theme.color.naver
      } else if (social === 'GOOGLE') {
        return theme.color.white
      } else {
        return theme.color.purple4
      }
    } else {
      return theme.color.gray4
    }
  }};
`

const ExtraButtonLayout = styled(LargeButtonLayout)`
  background: ${({ theme, styling }) =>
    styling ? theme.color.purple4 : theme.color.gray2};
  border-radius: 0px;
  height: 60px;
`

const ButtonText = styled.Text<{ social?: string }>`
  font-size: ${({ theme }) => theme.fontSize.font14};
  color: ${({ theme, social }) => {
    if (social === 'GOOGLE') {
      return theme.color.gray2
    } else if (social === 'NAVER') {
      return theme.color.white
    } else {
      return theme.color.gray1
    }
  }};
  font-family: ${({ theme }) => theme.font.notoMedium};
`

const IconWrap = styled.View`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 100%;
  top: 0;
  left: 8px;
  right: 0;
  bottom: 0;
`
