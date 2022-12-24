import React from 'react'
import styled from 'styled-components/native'

// hooks
import { useDateTimeConvert } from '~/Hooks/useDateTimeConvert'

type props = {
  type: string
  items: {
    title: string
    scene: string
    index: number
    date?: Date | undefined
  }
}

export default function AccordionPart({ type, items }: props): JSX.Element {
  const { title, scene, index } = items

  const [sceneTime] = useDateTimeConvert(items?.date, 'JustDate')

  return (
    <>
      <SoftText styling={type}>{title ? title : `SCENE${index + 1}`}</SoftText>
      {type === 'Saved' ? (
        <SoftText styling={type}>{sceneTime}</SoftText>
      ) : null}
    </>
  )
}
// theme.fontSize.font14
const SoftText = styled.Text<{ styling?: string }>`
  color: ${({ theme }) => theme.color.gray3};

  ${({ theme, styling }) => {
    if (styling === 'Index') {
      return `font-size:${theme.fontSize.font12}`
    } else if (styling === 'Saved') {
      return `font-size:${theme.fontSize.font14}`
    } else {
      return `font-size:${theme.fontSize.font10}`
    }
  }}
`
