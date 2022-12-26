import React from 'react'
import styled from 'styled-components/native'
import { ImageSourcePropType, ImageStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { useAppContext } from '~/Hooks/useContextHook'

type Props = {
  item: { id: number; images: string }
  style: ImageStyle
}
export default function Page({ item, style }: Props): JSX.Element {
  // context
  const { headerScroll } = useAppContext()

  const grdientColor = [
    'rgba(0, 0, 0, 1)',
    'rgba(0, 0, 0, 0.7)',
    'rgba(0, 0, 0, 0.2)',
    'rgba(0, 0, 0, 0)',
  ]

  return (
    <BannerLayoutButton onPress={() => console.log('!!!')} activeOpacity={1}>
      <>
        <Gradient colors={grdientColor} style={style} size={headerScroll} />
        <PageItem
          source={{ uri: 'https://picsum.photos/480/341' }}
          style={style}
        />
      </>
    </BannerLayoutButton>
  )
}

// banner interaction
const BannerLayoutButton = styled.TouchableOpacity`
  /* width:100%;
height:100%; */
`

const Gradient = styled(LinearGradient)<{ style: ImageStyle; size: number }>`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ style }) => style}px;
  height: ${({ size }) => 363 - -size + `px`};
  z-index: 999;
`

const PageItem = styled.Image`
  width: ${({ style }) => style}px;
  height: 100%;
`
