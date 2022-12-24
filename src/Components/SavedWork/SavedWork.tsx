import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'

// components
import { Header } from '../Header/Header'
import NoContent from '../Common/NoContent'
import AccordionBundle from '../Common/AccordionBundle'

// hooks
import useAsyncStorage from '~/Hooks/useAsyncStorage'

const saved = [
  {
    episode_title: '프롤로그',
    episode_updatedate: '2021-05-17T03:24:00',
    scenes: [{ id: 0, title: 'scenes1', scene: '2021-05-17T03:24:00' }],
  },
  {
    episode_title: '이야기의 시작',
    episode_updatedate: '2021-05-10T03:24:00',
    scenes: [
      { id: 0, title: '바람처럼', scene: '2021-05-17T03:24:00' },
      { id: 1, title: '바위처럼', scene: '2021-05-17T03:24:00' },
    ],
  },
  {
    episode_title: '하이라이트 부분',
    episode_updatedate: '2021-05-01T03:24:00',
    scenes: [
      { id: 1, title: '중', scene: '2021-05-17T03:24:00' },
      { id: 2, title: '강', scene: '2021-05-17T03:24:00' },
    ],
  },
  {
    episode_title: '이야기 마지막',
    episode_updatedate: '2020-05-17T03:24:00',
    scenes: [{ id: 0, title: '바람처럼', scene: '2021-05-17T03:24:00' }],
  },
  {
    episode_title: '에필로그',
    episode_updatedate: '2022-05-17T03:24:00',
    scenes: [
      { id: 0, title: '바람처럼', scene: '2021-05-17T03:24:00' },
      { id: 1, title: '바람처럼', scene: '2021-05-17T03:24:00' },
      { id: 2, title: '바람처럼', scene: '2021-05-17T03:24:00' },
    ],
  },
]

export default function SavedWork({ navigation, route }: any): JSX.Element {
  const [currentSort, setCurrentSort] = useState('latest')
  const [savedData, setSavedData] = useState(saved)

  // hook
  const [asyncHandler, result] = useAsyncStorage()
  const [multiAsyncHandler, multiResult] = useAsyncStorage()

  const accordionDataHandler = (type: string, value: string | number): void => {
    if (typeof value === 'number') return
    if (type === 'sort') {
      setCurrentSort(value)
    } else if (type === 'accordion') {
      if (Object.keys(multiResult?.result).length === 0) return
      // 저장한 데이터
      // const parseData = JSON.parse(multiResult?.result);
      // console.log(parseData);
      const arrayParse = multiResult?.result.map(item => item[1])
      navigation.navigate('UploadFiction', {
        screen: 'FictionEditor',
        params: {
          fictionId: JSON.stringify(0),
          postData: 'NovelSaved',
          fictionData: {},
          type: 'saved',
          title: '',
        },
      })
      return
    }
  }

  const dateSorting = (pre, cur) => {
    return new Date(pre.episode_updatedate) - new Date(cur.episode_updatedate)
  }

  const savedDataHandler = () => {
    const syncData = result?.result
    const Reg = /SaveFiction/g
    const resultSave = syncData?.filter(item => {
      if (item.match(Reg)) return item
    })
    multiAsyncHandler('MULTIGET', resultSave)
  }

  useEffect(() => {
    if (currentSort === 'latest') {
      const resultSort = saved.sort((a, b) => dateSorting(a, b))
      setSavedData(resultSort)
    } else {
      const resultSort = saved.sort((a, b) => dateSorting(b, a))
      setSavedData(resultSort)
    }
  }, [currentSort])

  useEffect(() => {
    asyncHandler('GETALL')
  }, [])

  useEffect(() => {
    if (result?.result) {
      savedDataHandler()
    }
  }, [result?.result])

  const sortButton = [
    { index: 0, value: 'latest', desc: '작성순' },
    { index: 1, value: 'old', desc: '오래된순' },
  ]

  return (
    <Layout>
      <HeaderWrap>
        <Header
          navigation={navigation}
          route={{ name: 'SavedWork', params: { title: '저장된 에피소드' } }}
          onPress={() => navigation.goBack()}
        />
      </HeaderWrap>
      {savedData?.length > 0 ? (
        <AccordionBundle
          sort={sortButton}
          data={savedData}
          onPress={accordionDataHandler}
          active={currentSort}
          type="Saved"
        />
      ) : (
        <NoContent
          firstText="저장된 에피소드가 없습니다"
          secondText="지금 바로 새로운 작품을 등록해보세요!"
        />
      )}
    </Layout>
  )
}

const Layout = styled.View`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: auto;
  background: ${({ theme }) => theme.color.gray12};
`

// header
const HeaderWrap = styled.View`
  display: flex;
  width: 100%;
  height: 48px;
`
