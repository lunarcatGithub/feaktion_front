import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { useMutation, useQuery } from 'react-query'

// hooks
import useFetch from '~/Hooks/useAxiosFetch'
import { useHeaderContext } from '~/Hooks/useContextHook'

// components
import ContentToScrollConnection from '../Common/ContentToScrollConnetion'
import useMutationHook from '~/Hooks/useMutationHook'

export default function UsersSearch({ navigation, type }: any): JSX.Element {
  const [searchData, setSearchData] = useState('')

  // fetch
  const { data, mutate } = useMutationHook('get')

  // store
  const { searchValue } = useHeaderContext()
  const [timer, setTimer] = useState<NodeJS.Timeout>()

  const titleHandler = (): string => {
    if (searchData.length <= 0) {
      return '검색어를 입력해 주세요'
    } else if (data) {
      const {
        data: { data: searchResult },
      } = data

      if ((searchData.length > 0, searchResult.length <= 0)) {
        return `"${searchData}"에 대한 검색 유저가 없습니다`
      }
      return ''
    }
    return ''
  }

  const goToOtherUserPage = ({ id, navi }: { id: number; navi: string }) => {
    if (navi === 'UsersSearch') {
      navigation.navigate('SideStack', {
        screen: 'UserBoard',
        params: { userId: id, type: 'otherUser' },
      })
    }
  }

  useEffect(() => {
    // 디바운싱 - 마지막 호출만 적용 (call api)
    if (timer) {
      clearTimeout(timer)
    }
    const newTimer = setTimeout(() => {
      setSearchData(searchValue)
      if (searchValue && type === 'user') {
        mutate({
          url: '/search/user',
          params: { keyword: searchValue, type: 'user' },
        })
      }
    }, 500)

    setTimer(newTimer)
  }, [searchValue])

  return (
    <Layout>
      <ContentToScrollConnection
        VerticalItems={data?.data?.data}
        noTitle={titleHandler}
        navi="UsersSearch"
        naviPress={goToOtherUserPage}
      />
    </Layout>
  )
}

const Layout = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.color.gray12};
`
