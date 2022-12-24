import React from 'react'
import styled from 'styled-components/native'

// components
import ContentToScrollConnetion from '../Common/ContentToScrollConnetion'

export default function PreferenceNotification({ navigation }: any) {
  const VerticalItems = [
    {
      id: 0,
      date: '2021-05-17T03:24:00',
      images: undefined,
      noti: '',
      notiType: 'preference',
      detailType: 'preference',
      targetUser: 'zzfqq',
      contentId: 'awrcdscdfg',
      contentTitle: '이 것은 신작 소설',
      contentSeries: 10,
    },
    {
      id: 1,
      date: '2021-05-17T03:24:00',
      images: undefined,
      noti: '',
      notiType: 'preference',
      detailType: 'newWork',
      targetUser: 'zzfqq',
      contentId: 'awrcdscdfg',
      contentTitle: '하늘이 높히 평가하는 소설',
      contentSeries: 10,
    },
  ]

  return (
    <Layout>
      <ContentToScrollConnetion
        VerticalItems={VerticalItems}
        noTitle={'알림이 없습니다'}
        navi="AllNotification"
      />
    </Layout>
  )
}

const Layout = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.color.gray12};
`
