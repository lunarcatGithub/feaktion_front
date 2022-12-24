import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { Animated, ViewStyle } from 'react-native'
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs'

// components
import TabButton from '../TabButton'
import { Header } from '../Header/Header'
import { useHeaderContext } from '~/Hooks/useContextHook'

interface TopTabBarExtends extends MaterialTopTabBarProps {
  type: string
}

export default function TabBar({
  state,
  navigation,
  type,
}: TopTabBarExtends): JSX.Element {
  // store
  const { setSearchValue } = useHeaderContext()

  const [tabArr, setTabArr] = useState<{}[]>([])

  // for animation
  const [translateValue] = useState(new Animated.Value(0))
  const [currentWidth, setCurrentWidth] = useState(0)
  const [toValue, setToValue] = useState(0)

  const nameToTitleConvert = (name: string, id: number) => {
    let title
    if (type === 'ContentsArchive') {
      if (name === 'Preferred') {
        title = '선호작'
      } else if (name === 'Continue') {
        title = '이어보기'
      }
    } else if (type === 'Search') {
      if (name === 'TrendSearch') {
        title = '인기'
      } else if (name === 'LatestSearch') {
        title = '작품'
      } else if (name === 'UsersSearch') {
        title = '유저'
      }
    } else if (type === 'Notification') {
      if (name === 'AllNotification') {
        title = '전체'
      } else if (name === 'CommentNotification') {
        title = '댓글'
      } else if (name === 'FeaktionNotification') {
        title = '작품'
      } else if (name === 'NoticeNotification') {
        title = '새소식'
      }
    }

    return { id, name, title }
  }

  const moveHandler = (type: string) => {
    if (type === 'goback') navigation.goBack()
  }

  const searchTextHandler = (e: any) => {
    setSearchValue(e)
  }

  useEffect(() => {
    const makeArr = state?.routeNames?.map((name, i) =>
      nameToTitleConvert(name, i)
    )
    console.log(makeArr)
    setTabArr(makeArr)
  }, [state?.routes])

  useEffect(() => {
    Animated.spring(translateValue, {
      toValue,
      damping: 10,
      mass: 1,
      stiffness: 100,
      overshootClamping: true,
      restDisplacementThreshold: 0.001,
      restSpeedThreshold: 0.001,
      useNativeDriver: true,
    }).start()
    // setCurrentTab(state?.index);
  }, [state, translateValue, toValue, type])

  return (
    <Layout>
      <HeaderWrap>
        <Header
          navigation={navigation}
          route={{ name: type }}
          onPress={moveHandler}
          onChangeText={searchTextHandler}
        />
      </HeaderWrap>
      <LayoutInner>
        {tabArr?.map(
          (tabArr: { id: number }): JSX.Element => (
            <TabButton
              key={tabArr.id}
              {...tabArr}
              navigation={navigation}
              isFocused={tabArr.id === state.index}
              setCurrentWidth={setCurrentWidth}
              setToValue={setToValue}
            />
          )
        )}
      </LayoutInner>
      <IndicatorBar
        as={Animated.View}
        style={{
          transform: [{ translateX: translateValue }] as any,
          width: currentWidth,
        }}
      />
    </Layout>
  )
}

const Layout = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  background: ${({ theme }) => theme.color.gray12};
`

const LayoutInner = styled.View`
  display: flex;
  flex-direction: row;
  height: 46px;
  width: 100%;
`

const HeaderWrap = styled.View`
  display: flex;
  width: 100%;
  height: 48px;
`

const IndicatorBar = styled.View<{ style: ViewStyle }>`
  width: 100%;
  height: 2px;
  background-color: ${({ theme }) => theme.color.purple4};
  z-index: 999;
`
