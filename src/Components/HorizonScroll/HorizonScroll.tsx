import React from 'react'
import styled from 'styled-components/native'

// components
import ScrollPages from './ScrollPages'

// types
import { MainType } from '../types/FictionType'

type Props = {
  // items: MainType['recent'] | MainType['interest_genres'];
  items: Pick<MainType, 'recent' | 'interest_genres'>
  navi: any
  onPress: (props: {
    fictionType: 'Fiction' | 'Short'
    navi: string
    fictionId: number
  }) => void
}

export default function HorizonScroll({
  items,
  navi,
  onPress,
}: Props): JSX.Element {
  // enum type
  return (
    <LayoutFlatList
      automaticallyAdjustContentInsets={false}
      contentContainerStyle={{
        paddingHorizontal: 10,
      }}
      data={items}
      decelerationRate="fast"
      horizontal
      keyExtractor={(_, index) => `page__${index}`}
      renderItem={({ item }) => {
        return <ScrollPages items={item} navi={navi} onPress={onPress} />
      }}
      // snapToInterval={0}
      snapToAlignment="start"
      showsHorizontalScrollIndicator={false}
    />
  )
}

const LayoutFlatList = styled.FlatList``
