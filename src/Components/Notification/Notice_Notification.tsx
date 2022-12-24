import React from 'react'
import styled from 'styled-components/native'

// components
import ContentToScrollConnetion from '../Common/ContentToScrollConnetion'

export default function NoticeNotification({ navigation }: any) {
  const VerticalItems = [
    {
      id: 0,
      date: '2021-05-17T03:24:00',
      images: undefined,
      noti: '',
      notiType: 'notice',
      detailType: 'notice',
      targetUser: 'qwee',
      contentId: 'awrcdscdfg',
      adminTitle:
        '2021년 07월 26일 부터 개인정보처리 방침 개정이 있겠습니다. 해당 내용은 마이보드 설정에서 보실 수 있습니다',
    },
    {
      id: 1,
      date: '2021-05-17T03:24:00',
      images: undefined,
      noti: '',
      notiType: 'notice',
      detailType: 'event',
      targetUser: 'admin',
      contentId: 'awrcdscdfg',
      adminTitle: '🎈[유저 참여 이벤트]🎈 상금이 무려 50원?!',
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
