import React from 'react'
import styled from 'styled-components/native'

// component
import { LargeButton } from '~/Components/Button'
import { SocialLayout } from '../Login/SocialLayout'

// icons
import Logo from '@Icons/logo.svg'

// components
import ToastPush from '../Interaction/ToastPush'
import { Platform } from 'react-native'

export function AuthMain({ navigation }: any): JSX.Element {
  const goDivide = (type: string): void => {
    if (type === 'login') {
      navigation.navigate('DoLogin')
    } else if (type === 'signup') {
      navigation.navigate('SignUp')
    }
  }

  return (
    <>
      <Layout>
        <LogoWrap>
          {/* <Logo width={200} height={50} /> */}
          <Text styling={Platform.OS === 'ios'}>
            향후 삽입할 말을 {'\n'}선정해서 작성할 예정이니 {'\n'}지금은
            테스트용입니다
          </Text>
          {/* <Text>선정해서 작성할 예정이니</Text>
      <Text>지금은 테스트용입니다</Text> */}
        </LogoWrap>
        <InteractionWrap>
          <ButtonAllWrap>
            {/* <LargeButton
          active={true}
          buttonText={'네이버 계정으로 로그인'}
          onPress={() => goDivide('naver')}
          social='NAVER'
        />
        <LargeButton
          active={true}
          buttonText={'구글 계정으로 로그인'}
          onPress={() => goDivide('google')}
          social='GOOGLE'
        /> */}
            <ButtonWrap>
              <LargeButton
                active={true}
                buttonText={'로그인하기'}
                onPress={() => goDivide('login')}
              />
            </ButtonWrap>
            <ButtonWrap>
              <LargeButton
                active={false}
                buttonText={'회원가입'}
                onPress={() => goDivide('signup')}
              />
            </ButtonWrap>
          </ButtonAllWrap>
          <SocialLayout />
        </InteractionWrap>
      </Layout>
      <ToastPush type="NOTCOMPLETE" />
    </>
  )
}
// styled
const Layout = styled.View`
  display: flex;
  flex-direction: column;
  flex: 1;
  background: ${({ theme }) => theme.color.gray12};
  padding: 16px;
`

const LogoWrap = styled.View`
  display: flex;
  justify-content: center;
  flex: 6;
`

const MainLogoInner = styled.View`
  width: 100%;
  height: 100%;
`

const InteractionWrap = styled.View`
  display: flex;
  flex: 4;
`

const ButtonAllWrap = styled.View`
  display: flex;
  justify-content: space-between;
  margin-bottom: 56px;
`

const ButtonWrap = styled.View`
  padding: 4px 0;
`

const Text = styled.Text<{ styling: boolean }>`
  font-size: 28px;
  font-weight: bold;
  padding: 4px 0;
  color: ${({ theme }) => theme.color.white};
  line-height: ${({ styling }) => (styling ? '38px' : '44px')};
`
