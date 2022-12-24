import React from 'react'
import styled from 'styled-components/native'

export default function HideLayout({
  isHide,
  onPress,
}: {
  isHide: boolean
  onPress: (props: boolean) => void
}): JSX.Element {
  return (
    <>
      {isHide ? (
        <Layout activeOpacity={1} onPress={() => onPress(!isHide)} />
      ) : null}
    </>
  )
}

const Layout = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`
