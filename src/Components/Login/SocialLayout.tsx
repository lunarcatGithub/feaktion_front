import React from 'react'
import styled from 'styled-components/native'

// icons
import NaverIcon from '@Icons/naver.svg'
import GoogleIcon from '@Icons/google.svg'
import KakaoIcon from '@Icons/kakao_small.svg'

// store

// hooks
import { useAppContext } from '~/Hooks/useContextHook'

export function SocialLayout(): JSX.Element {
  const { animationMove, setAnimationMove } = useAppContext()

  const developing = () => {
    if (animationMove?.loading) return
    setAnimationMove({
      type: 'NOTCOMPLETE',
      value: -80,
      bool: true,
      loading: true,
    })
  }

  return (
    <SocialLoginWarp>
      <SocialTitleWrap>
        <TitleLine />
        <SocialTitle>소셜 로그인</SocialTitle>
        <TitleLine />
      </SocialTitleWrap>
      <SocialButtonWrap>
        <DevButton>
          <KakaoButtonWrapButton onPress={developing}>
            <KakaoIcon width={20} height={20} />
          </KakaoButtonWrapButton>
        </DevButton>
        <DevButton>
          <ButtonWrapButton onPress={developing}>
            <NaverIcon width={40} height={40} />
          </ButtonWrapButton>
        </DevButton>
        <ButtonWrapButton onPress={developing}>
          <GoogleIcon width={40} height={40} />
        </ButtonWrapButton>
      </SocialButtonWrap>
      {/* <SocialButtonWrap>
          <LargeButton
            active={true}
            buttonText={'네이버 계정으로 로그인'}
            onPress={() => {}}
            social='NAVER'
          />
          <LargeButton
            active={true}
            buttonText={'구글 계정으로 로그인'}
            onPress={() => {}}
            social='GOOGLE'
          />
        </SocialButtonWrap> */}
    </SocialLoginWarp>
  )
}
const SocialLoginWarp = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
`

const SocialTitleWrap = styled.View`
  display: flex;
  flex-direction: row;
`

const SocialTitle = styled.Text`
  color: ${({ theme }) => theme.color.gray2};
  font-size: ${({ theme }) => theme.fontSize.font12};
  padding: 0 10px;
`

const TitleLine = styled.View`
  display: flex;
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.color.gray4};
  margin-bottom: 8px;
  flex: 1;
`

const SocialButtonWrap = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 16px;
  width: 100%;
`

const DevButton = styled.View`
  opacity: 0.4;
`

const ButtonWrapButton = styled.TouchableOpacity`
  margin: 0 6px;
`

const KakaoButtonWrapButton = styled(ButtonWrapButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: #fee500;
  border-radius: 50px;
`
