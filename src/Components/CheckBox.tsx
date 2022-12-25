import React from 'react'
import styled from 'styled-components/native'

//icons
import Check from '@Icons/check.svg'

type props = {
  onPress: (type: string) => void
  type: string
  toggle: boolean | undefined
}

export function CheckBox({
  onPress,
  type = '',
  toggle = false,
}: props): JSX.Element {
  return (
    <CheckBoxLayout>
      <CheckBoxButton
        toggle={toggle}
        onPress={() => {
          onPress(type)
        }}>
        <CheckIconWrap>
          <Check width={16} height={10} />
        </CheckIconWrap>
      </CheckBoxButton>
    </CheckBoxLayout>
  )
}

const CheckBoxLayout = styled.View`
  width: 20px;
  height: 20px;
`

const CheckBoxButton = styled.TouchableOpacity<{ toggle: boolean }>`
  display: flex;
  width: 100%;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.color.purple4};
  background-color: ${({ theme, toggle }) =>
    toggle ? theme.color.purple4 : 'inherit'};
  border-radius: 4px;
`

const CheckIconWrap = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`
