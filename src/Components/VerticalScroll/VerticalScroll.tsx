import React from 'react'
import styled from 'styled-components/native'

// components
import ListContent from '../Common/ListContent'
import ListUsers from '../Common/ListUsers'
import ListNotification from '../Common/ListNotification'

// types
import { MainType } from '../types/FictionType'

type Props = {
  items: any
  // items: Pick<MainType, 'novels'>;
  navi: string
  type:
    | 'coverIndex'
    | 'Preferred'
    | 'Continue'
    | 'InheritFiction'
    | 'Search'
    | ''

  buttonPress: (props: {
    userId: number
    position: number
    type: string
  }) => void
  naviPress: (props: { id: number; navi: string; contentType?: string }) => void
  reFresh: () => void
  onEndReached?: () => void
}

export default function VerticalScroll({
  items,
  navi = '',
  type,
  naviPress,
  buttonPress,
  reFresh,
  onEndReached,
}: Props): JSX.Element {
  const listUsersList = ['AllNotification', 'CommentNotification']

  //////////////////////////
  // 스크롤 UI 컴포넌트 분기점 //
  /////////////////////////

  const itemsRenderDivide = (item: any) => {
    if (navi === 'UsersSearch') {
      // 유저 검색 화면 컴포넌트
      return <ListUsers items={item} navi={navi} naviPress={naviPress} />
    }

    if (listUsersList.includes(navi)) {
      // 알림 화면 컴포넌트
      return <ListNotification items={item} />
    }

    return (
      // 기타 스크롤 컴포넌트
      <ListContent
        items={item}
        navi={navi}
        type={type}
        naviPress={naviPress}
        buttonPress={buttonPress}
      />
    )
  }

  return (
    <LayoutFlatList
      automaticallyAdjustContentInsets={false}
      contentContainerStyle={{
        paddingVertical: 24,
      }}
      data={items}
      decelerationRate="fast"
      keyExtractor={(_, i) => `page__${i}`}
      renderItem={({ item }) => itemsRenderDivide(item)}
      snapToAlignment="start"
      showsHorizontalScrollIndicator={false}
      onRefresh={reFresh}
      refreshing={false}
      onEndReached={onEndReached}
    />
  )
}

const LayoutFlatList = styled.FlatList`
  flex-grow: 0;
  flex: 1;
`
