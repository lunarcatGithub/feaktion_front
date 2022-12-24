import React from 'react'
import styled from 'styled-components/native'

// components
import ContentToScrollConnetion from '../Common/ContentToScrollConnetion'

export default function CommentNotification({ navigation }: any) {
  const VerticalItems = [
    {
      id: 0,
      date: '2021-05-17T03:24:00',
      images: undefined,
      noti: '',
      notiType: 'comment',
      detailType: 'comment',
      targetUser: 'taehee1234',
      contentId: 'awrcdscdfg',
    },
    {
      id: 1,
      date: '2021-05-17T03:24:00',
      images: undefined,
      noti: '',
      notiType: 'comment',
      detailType: 'reply',
      targetUser: 'adasdasd',
      contentId: 'awrcdscdfg',
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
