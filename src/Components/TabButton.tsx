import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { LayoutChangeEvent } from 'react-native'

// store
import { useHeaderContext } from '~/Hooks/useContextHook'

type Props = {
  name: string
  title: string
  navigation: any
  isFocused: boolean
  setCurrentWidth: (params: number) => void
  setToValue: (params: number) => void
}
export default function TabButton({
  name,
  title,
  navigation,
  isFocused,
  setCurrentWidth,
  setToValue,
}: Props): JSX.Element {
  // store

  const [layout, setLayout] = useState<{ x: number; width: number }>()
  const { setSearchValue } = useHeaderContext()

  const getLayoutSize = (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout
    setLayout({ x, width })
  }

  useEffect(() => {
    if (isFocused && layout) {
      setToValue(layout.x)
      setCurrentWidth(layout.width)
    }
  }, [isFocused, layout, setToValue, setCurrentWidth])

  return (
    <TopTabButton
      onPress={() => {
        setSearchValue('')
        navigation.navigate(name)
      }}
      onLayout={getLayoutSize}>
      <TextTitle focus={isFocused}>{title}</TextTitle>
    </TopTabButton>
  )
}

const TopTabButton = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`

const TextTitle = styled.Text<{ focus: boolean }>`
  color: ${({ theme, focus }) =>
    focus ? theme.color.gray1 : theme.color.gray4};
  font-family: ${({ theme }) => theme.font.notoMedium};
  font-size: ${({ theme }) => theme.fontSize.font14};
`
