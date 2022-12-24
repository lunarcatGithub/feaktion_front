import styled from 'styled-components/native'
import React from 'react'
type props = {
  children?: JSX.Element
  width: number
  height: number
  border?: number
  margin?: number
}
function Skeleton({ width, height, border = 8, margin = 0 }: props) {
  return (
    <SkeletonLayout
      width={width}
      height={height}
      border={border}
      margin={margin}
    />
  )
}

export default Skeleton

const SkeletonLayout = styled.View<{
  width: number
  height: number
  border: number
  margin: number
}>`
  width: ${({ width }) => width + `px`};
  height: ${({ height }) => height + `px`};
  background: ${({ theme }) => theme.color.gray8};
  border-radius: ${({ border }) => border + `px`};
  margin-bottom: ${({ margin }) => margin + `px`};
`
