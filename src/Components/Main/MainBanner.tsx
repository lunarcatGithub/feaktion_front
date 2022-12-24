import React from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'
import Carousel from '../Carousel/Carousel'

const Banners = [
  { id: 0, images: 'https://picsum.photos/480/341' },
  { id: 1, images: 'https://picsum.photos/480/342' },
  { id: 2, images: 'https://picsum.photos/480/343' },
  { id: 3, images: 'https://picsum.photos/480/344' },
]

export default function MainBanner(): JSX.Element {
  const screenWidth = Math.round(Dimensions.get('window').width)

  return (
    <Banner>
      <Carousel gap={0} offset={0} pages={Banners} pageWidth={screenWidth} />
    </Banner>
  )
}

// banner
const Banner = styled.View`
  width: 100%;
`
