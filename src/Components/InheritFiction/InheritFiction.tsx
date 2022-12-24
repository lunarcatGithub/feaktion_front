import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'

// components
import { Header } from '../Header/Header'
import VerticalScroll from '~/Components/VerticalScroll/VerticalScroll'

// data
import { useQuery } from 'react-query'
import useFetch from '~/Hooks/useAxiosFetch'

export default function InheritFiction({
  navigation,
  route,
}: any): JSX.Element {
  // fetch
  const { data, refetch } = useQuery(
    ['myfeaktions'],
    () =>
      useFetch({
        url: `/feaktion/myfeaktions?type=novel`,
        method: 'get',
      }),
    { retry: true }
  )

  const [feaktionData, setFeaktionData] = useState([])

  useEffect(() => {
    const feaktionData = data?.data?.data
    // 작품
    setFeaktionData(feaktionData)
  }, [data])

  const moreButtonHandler = (
    position: string | number,
    id?: number | string,
    type?: number | string,
    feaktionType?: string
  ) => {
    if (typeof position === 'string') return
    console.log('>>>', id, type, feaktionType)

    if (feaktionType === 'novel' && type === 'fiction') {
      navigation.navigate('SideStack', {
        screen: 'FictionIndex',
        params: { currentType: 'Story', fictionId: id },
      })
    } else if (feaktionType === 'short' && type === 'fiction') {
      navigation.navigate('SideStack', {
        screen: 'Viewer',
        params: { currentType: 'Short', fictionId: id },
      })
    } else if (type === 'user') {
      navigation.navigate('SideStack', {
        screen: 'UserBoard',
        params: { userId: id },
      })
    }
  }

  return (
    <Layout>
      <HeaderWrap>
        <Header
          navigation={navigation}
          route={{ name: 'InheritFiction', params: { title: '작품 이어쓰기' } }}
          onPress={() => navigation.goBack()}
        />
      </HeaderWrap>
      {feaktionData?.length <= 0 ? (
        <NoConetentWrap>
          <Text>작품이 없습니다</Text>
        </NoConetentWrap>
      ) : (
        <VerticalLayout>
          <VerticalScroll
            type="InheritFiction"
            size="Small"
            navi="inheritFiction"
            items={feaktionData}
            onPress={moreButtonHandler}
            reFresh={() => {}}
          />
        </VerticalLayout>
      )}
    </Layout>
  )
}

const Layout = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.color.gray12};
`

// header
const HeaderWrap = styled.View`
  display: flex;
  width: 100%;
  height: 48px;
`

const NoConetentWrap = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 160px;
`

const Text = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font14};
  line-height: 20px;
`

// list render
const VerticalLayout = styled.View`
  display: flex;
  width: 100%;
  height: 100%;
`
