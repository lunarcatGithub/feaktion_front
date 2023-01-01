import React from 'react'
import styled from 'styled-components/native'

export default function SplashScreen() {
  return (
    <Layout>
      <SplashImage source={require('@Images/splash_screen.png')} />
    </Layout>
  )
}

const Layout = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.color.black0};
  z-index: 9999999;
`

const SplashImage = styled.Image`
  width: 300px;
  height: 100%;
  resize: contain;
`
