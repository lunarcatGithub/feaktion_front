import React from 'react'
import styled from 'styled-components/native'

// image
import splashScreen from '@Images/splash_screen.png'

export default function SplashScreen() {
  return (
    <Layout>
      <SplashImage source={splashScreen} />
    </Layout>
  )
}

const Layout = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.color.black0};
`

const SplashImage = styled.Image`
  width: 100%;
  height: auto;
`
