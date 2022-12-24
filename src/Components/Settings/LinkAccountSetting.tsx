import React, { useState } from 'react'
import styled from 'styled-components/native'
import CustomTabButton from '../CustomTabButton'
import { Header } from '../Header/Header'

export default function LinkAccountsSetting({ navigation }: any): JSX.Element {
  const [naverLink, setNaverLink] = useState(false)
  const [googleLink, setGoogleLink] = useState(false)

  const tabButtonArr = [
    {
      index: 0,
      title: '소셜 아이디 연동',
      buttonList: [
        {
          _index: 0,
          _title: '네이버 연동',
          _type: 'Toggle',
          method: () => setNaverLink(!naverLink),
          toggle: naverLink,
        },
        {
          _index: 1,
          _title: '구글 연동',
          _type: 'Toggle',
          method: () => setGoogleLink(!googleLink),
          toggle: googleLink,
        },
      ],
    },
    {
      index: 1,
      title: '계정',
      buttonList: [
        {
          _index: 0,
          _title: '회원 탈퇴',
          _type: '',
          method: () => navigation.navigate('WithdrawalSetting'),
          toggle: false,
        },
      ],
    },
  ]

  return (
    <Layout>
      <HeaderWrap>
        <Header
          navigation={navigation}
          route={{ name: 'LinkAccountsSetting', params: { title: '계정연동' } }}
          onPress={() => navigation.goBack()}
        />
      </HeaderWrap>
      <LayoutInnser>
        {tabButtonArr?.map(({ index, title, buttonList }) => (
          <ButtonBoxLayout key={index}>
            <ButtonBoxTitle>{title}</ButtonBoxTitle>
            {buttonList?.map(({ _index, _title, _type, method, toggle }) => (
              <TabWrap key={_index}>
                <CustomTabButton
                  type={_type}
                  onPress={method}
                  title={_title}
                  toggle={toggle}
                />
              </TabWrap>
            ))}
          </ButtonBoxLayout>
        ))}
      </LayoutInnser>
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
  flex: 1;
  background: ${({ theme }) => theme.color.gray12};
`
const LayoutInnser = styled.View`
  padding: 24px 0;
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
