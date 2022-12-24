import React from 'react'
import styled from 'styled-components/native'
import { useDateTimeConvert } from '~/Hooks/useDateTimeConvert'

export default function UserNoticeDate({ writedate }: { writedate: Date }) {
  const [currentTime] = useDateTimeConvert(writedate, 'JustDate')

  return <SoftText>{currentTime}</SoftText>
}

const SoftText = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font12};
`
