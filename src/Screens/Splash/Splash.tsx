import React from 'react'
import styled from 'styled-components/native'

// image
import splashImage from '../../Assets/Images/Splash.png'

export default function Splash(): JSX.Element {
  return (
    <Layout>
      <SplashImage source={splashImage} resizeMode="cover" />
    </Layout>
  )
}

const Layout = styled.View`
  flex: 1;
`

const SplashImage = styled.Image`
  width: 100%;
  height: 100%;
`
