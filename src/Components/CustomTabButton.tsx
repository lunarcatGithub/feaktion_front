import React from 'react'
import styled from 'styled-components/native'

// icons
import Arrow from '@Icons/down.svg'
import { SmallToggleButton } from './ToggleButton'

type Props = {
  title: string
  type: string
  toggle?: boolean
  onPress: () => void
}

export default function CustomTabButton({
  title = '',
  type = '',
  toggle = false,
  onPress,
}: Props): JSX.Element {
  const buttonType = () => {
    if (type === 'Arrow') {
      return (
        <Arrow
          width={20}
          height={20}
          style={{ transform: [{ rotate: '270deg' }] }}
        />
      )
    } else if (type === 'Toggle') {
      return <SmallToggleButton toggle={toggle} />
    } else {
      return <></>
    }
  }

  return (
    <LayoutButton onPress={onPress}>
      <TitleText numberOfLines={1}>{title}</TitleText>
      {buttonType()}
    </LayoutButton>
  )
}
const LayoutButton = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 36px;
  justify-content: space-between;
  align-items: center;
`

const TitleText = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  font-size: ${({ theme }) => theme.fontSize.font14};
  font-family: ${({ theme }) => theme.font.notoMedium};
`
