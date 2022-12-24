import React from 'react'
import styled from 'styled-components/native'

type props = {
  firstText: string
  secondText?: string
  positionTop?: number
}

export default function NoContent({
  firstText,
  secondText,
  positionTop = 160,
}: props): JSX.Element {
  return (
    <NoConetentWrap positionTop={positionTop}>
      <Text>{firstText}</Text>
      <Text>{secondText}</Text>
    </NoConetentWrap>
  )
}

const NoConetentWrap = styled.View<{ positionTop: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: ${({ positionTop }) => `${positionTop}px`};
`

const Text = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font14};
  line-height: 22px;
`
