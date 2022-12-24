import React from 'react'
import styled from 'styled-components/native'

type props = {
  bottom?: number
  top?: number
  color?: string
}

export function Line100({ bottom = 0, top = 0, color }: props) {
  return <DummyLine top={top} bottom={bottom} color={color} />
}

const DummyLine = styled.View<props>`
  margin-top: ${({ top }) => (top ? `${top}px` : `0px`)};
  margin-bottom: ${({ bottom }) => (bottom ? `${bottom}px` : `0px`)};
  width: 100%;
  border: 1px solid ${({ theme, color }) => (color ? color : theme.color.gray6)};
`
