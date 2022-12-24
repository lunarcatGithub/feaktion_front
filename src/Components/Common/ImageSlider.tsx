import React from 'react'
import styled from 'styled-components/native'
import { Dimensions, FlatList } from 'react-native'

export default function ImageSlider({ data, visible, onPress, number }: any) {
  const windowWidth = Math.floor(Dimensions.get('window').width)

  return (
    <>
      {visible ? (
        <HOL>
          <Layout onPress={onPress} />
          <LayoutInner>
            <PageSlider
              initialScrollIndex={number}
              automaticallyAdjustContentInsets={false}
              data={data}
              decelerationRate="fast"
              horizontal
              keyExtractor={(item: any) => `page__${item?.index}`}
              pagingEnabled
              renderItem={({ item }: any) => (
                <ImageWrapper
                  windowWidth={windowWidth}
                  onPress={onPress}
                  activeOpacity={1}>
                  <Image source={{ uri: item?.uri }} resizeMode="contain" />
                </ImageWrapper>
              )}
              snapToAlignment="start"
              showsHorizontalScrollIndicator={false}
            />
          </LayoutInner>
        </HOL>
      ) : null}
    </>
  )
}

const HOL = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
`

const Layout = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background: rgba(0, 0, 0, 0.6);
`

const LayoutInner = styled.View`
  z-index: 9999;
`

const PageSlider = styled.FlatList``

const ImageWrapper = styled.TouchableOpacity<{ windowWidth: number }>`
  width: ${({ windowWidth }) => `${windowWidth}px`};
`

const Image = styled.Image`
  width: 100%;
  height: 100%;
`
