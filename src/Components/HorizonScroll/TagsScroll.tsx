import React from 'react'
import styled from 'styled-components/native'
import TagsPages from './TagsPages'

type Props = {
  items: { index: number; value: string; title: string }[]
  select: {
    selectGenre: string
    setSelectGenre: React.Dispatch<React.SetStateAction<string>>
  }
}

export default function TagsScroll({ items, select }: Props) {
  return (
    <LayoutFlatList
      automaticallyAdjustContentInsets={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
      }}
      data={items}
      decelerationRate="fast"
      horizontal
      keyExtractor={(_, i) => `page__${i}`}
      renderItem={({ item }) => <TagsPages items={item} select={select} />}
      // snapToInterval={0}
      snapToAlignment="start"
      showsHorizontalScrollIndicator={false}
    />
  )
}

const LayoutFlatList = styled.FlatList``
