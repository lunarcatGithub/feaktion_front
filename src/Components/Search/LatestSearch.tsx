import React from 'react'
import styled from 'styled-components/native'

// components
import ContentToScrollConnetion from '../Common/ContentToScrollConnetion'

export default function LatestSearch({ navigation }: any) {
  const VerticalItems = [
    {
      id: 0,
      date: '2021-05-17T03:24:00',
      images: undefined,
      title:
        '판타지작품을 길게 늘어뜨리면 과연 어디까지 연결되고 또 ㅇjoding되는 부분이 있을지 고민이 됩니다.',
      artistName: '나는작가다',
      like: 72,
      ficPick: 8742,
      view: 8123,
      series: 215,
    },
    {
      id: 1,
      date: '2021-05-17T03:24:00',
      images: undefined,
      title: '오만과 편견',
      artistName: '안녕하세요',
      like: 72,
      ficPick: 8742,
      view: 231,
      series: 3,
    },
    {
      id: 2,
      date: '2021-05-17T03:24:00',
      images: undefined,
      title: '제일 긴 타이틀 테스트용 입니다',
      artistName: '슈슉슈슉.슉',
      like: 72,
      ficPick: 8742,
      view: 5511,
      series: 215,
    },
    {
      id: 3,
      date: '2021-05-17T03:24:00',
      images: undefined,
      title: '어느국가의 왕국재건기',
      artistName: '무야호~',
      like: 72,
      ficPick: 8742,
      view: 412,
      series: 4,
    },
    {
      id: 4,
      date: '2021-05-17T03:24:00',
      images: undefined,
      title: '판타지작품',
      artistName: '홀리몰리',
      like: 72,
      ficPick: 8742,
      view: 8123,
      series: 151,
    },
    {
      id: 5,
      date: '2021-05-17T03:24:00',
      images: undefined,
      title: '오만과편견',
      artistName: '나는작가다',
      like: 72,
      ficPick: 8742,
      view: 8123,
      series: 25,
    },
  ]

  return (
    <Layout>
      <ContentToScrollConnetion
        VerticalItems={VerticalItems}
        noTitle={'검색결과 작품이 없습니다'}
        navi="LatestSearch"
      />
    </Layout>
  )
}

const Layout = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.color.gray12};
`
