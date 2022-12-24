import React, { useState } from 'react'
import styled from 'styled-components/native'
import CustomTabButton from '../CustomTabButton'
import { Header } from '../Header/Header'

export default function NotificationSetting({ navigation }: any): JSX.Element {
  const [notiAllow, setNotiAllow] = useState(false)
  const [likeMyFiction, setLikeMyFiction] = useState(false)
  const [preferenceMyFiction, setPreferenceMyFiction] = useState(false)
  const [commentMyFiction, setCommentMyFiction] = useState(false)
  const [commentReply, setCommentReply] = useState(false)
  const [preferredNoti, setPreferredNoti] = useState(false)

  const tabButtonArr = [
    {
      index: 0,
      title: '계정',
      buttonList: [
        {
          _index: 0,
          line: true,
          _title: '알림 허용',
          _type: 'Toggle',
          method: () => setNotiAllow(!notiAllow),
          toggle: notiAllow,
        },
        {
          _index: 1,
          _title: '내 작품 좋아요',
          _type: 'Toggle',
          method: () => setLikeMyFiction(!likeMyFiction),
          toggle: likeMyFiction,
        },
        {
          _index: 2,
          _title: '내 작품 선호',
          _type: 'Toggle',
          method: () => setPreferenceMyFiction(!preferenceMyFiction),
          toggle: preferenceMyFiction,
        },
        {
          _index: 3,
          _title: '내 작품 댓글',
          _type: 'Toggle',
          method: () => setCommentMyFiction(!commentMyFiction),
          toggle: commentMyFiction,
        },
        {
          _index: 4,
          _title: '댓글 답글',
          _type: 'Toggle',
          method: () => setCommentReply(!commentReply),
          toggle: commentReply,
        },
        {
          _index: 5,
          _title: '선호작품 업로드 알림',
          _type: 'Toggle',
          method: () => setPreferredNoti(!preferredNoti),
          toggle: preferredNoti,
        },
      ],
    },
  ]

  const navigationHandler = (type: 'goback'): void => {
    if (type === 'goback') navigation.goBack()
  }

  return (
    <Layout>
      <HeaderWrap>
        <Header
          navigation={navigation}
          route={{
            name: 'NotificationSetting',
            params: { title: '알림 설정' },
          }}
          onPress={navigationHandler}
        />
      </HeaderWrap>

      <LayoutInner>
        {tabButtonArr?.map(({ index, title, buttonList }) => (
          <ButtonBoxLayout key={index}>
            <ButtonBoxTitle>{title}</ButtonBoxTitle>
            {buttonList?.map(
              ({ _index, _title, _type, method, toggle, line }) => (
                <TabWrap key={`keys__${_index}`}>
                  <CustomTabButton
                    key={_index}
                    type={_type}
                    onPress={method}
                    title={_title}
                    toggle={toggle}
                  />
                  {line && <DummyLine />}
                </TabWrap>
              )
            )}
          </ButtonBoxLayout>
        ))}
      </LayoutInner>
    </Layout>
  )
}
// header
const HeaderWrap = styled.View`
  display: flex;
  width: 100%;
  height: 48px;
`

const Layout = styled.View`
  background: ${({ theme }) => theme.color.gray12};
  flex: 1;
`

const LayoutInner = styled.View`
  padding: 20px 0;
`

const ButtonBoxLayout = styled.View`
  margin-bottom: 32px;
  flex-direction: column;
`

const ButtonBoxTitle = styled.Text`
  padding: 4px 16px;
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font12};
`

const TabWrap = styled.View`
  padding: 0 16px;
`

const DummyLine = styled.View`
  margin: 8px 16px;
  height: 1px;
  background: ${({ theme }) => theme.color.gray6};
`
