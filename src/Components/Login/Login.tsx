import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'

// components
import { LargeButton } from '~/Components/Button'
import { SocialLayout } from '~/Components/Login/SocialLayout'
import { InputText } from '../Input'

// hooks
import { MethodMytateEnum, useMutationHook } from '~/Hooks/useMutationHook'
import { useAuthMainContext } from '~/Hooks/useContextHook'
import useAsyncStorage from '@Hooks/useAsyncStorage'

// types
import { loginType } from 'authTypeModule'
import { loginAgent } from '~/Agent/AuthAent'
import Header from '../Header/HeaderComponent'

export default function Login({ navigation }: any): JSX.Element {
  const { loginInput, setLoginInput } = useAuthMainContext()
  const [asyncStorageHandler, _result] = useAsyncStorage()

  // button active
  const [buttonActive, setButtonActive] = useState<boolean>(false)

  // alert Text
  const [alertText, setAlertText] = useState<loginType.alertOrValue>({
    type: '',
    text: '',
  })

  // fetch
  const loginMutate = useMutationHook(MethodMytateEnum.POST)

  const loginInputTextHandler = (type: string, text: string): void => {
    if (type === 'userId') {
      setLoginInput({ ...loginInput, userId: text })
    } else if (type === 'password') {
      setLoginInput({ ...loginInput, password: text })
    }
  }

  const LoginHandler = async () => {
    // 로그인 & alert text
    const { userId, password } = loginInput

    // 버튼 활성화 안되어있을 경우
    if (buttonActive === false) return

    // 입력란이 비어있을 경우
    if (!userId || userId.length === 0) {
      setAlertText({
        type: 'userId',
        text: '아이디 또는 이메일을 입력해 주세요',
      })
      return
    }
    // 8자 미만 미입력 경우
    if (!password || password.length < 7) {
      setAlertText({ type: 'password', text: '최소 8자 이상 입력해 주세요' })
      return
    }

    //
    const loginFetchResult = await loginAgent({
      userId,
      password,
      mutate: loginMutate,
    })
    if (loginFetchResult.type === '') {
      // asyncStorageHandler("SET", "token", )
    }
    setAlertText(loginFetchResult)
    return
  }

  const signupHandler = () => {
    // 경고 메시지 초기화
    setAlertText({
      type: '',
      text: '',
    })
    navigation.navigate('SignUp')
  }

  useEffect(() => {
    // 버튼 active ctrl
    const { userId, password } = loginInput
    if (userId?.length > 3 && password?.length > 7) {
      setButtonActive(true)
    } else {
      setButtonActive(false)
    }
  }, [loginInput])

  const InputArr = [
    {
      type: 'userId',
      secure: false,
      placeholder: '아이디 또는 이메일',
      removeBtn: false,
      maxLength: 60,
      value: loginInput.userId,
      alert: alertText,
    },
    {
      type: 'password',
      secure: true,
      placeholder: '비밀번호',
      removeBtn: false,
      maxLength: 30,
      value: loginInput.password,
      alert: alertText,
    },
  ]

  const inputLayoutArea = () => {
    return (
      <LoginInputWrap>
        {InputArr?.map(
          (
            { type, secure, placeholder, removeBtn, maxLength, value, alert },
            i
          ) => (
            <InputLayout key={i}>
              <InputText
                secure={secure}
                placeholder={placeholder}
                removeBtn={removeBtn}
                maxLength={maxLength}
                onChangeText={text => loginInputTextHandler(type, text)}
                value={value}
                type="removeBtn"
                onPress={() => console.log('')}
              />
              {alert.type === type && alert.text ? (
                <AlertText>{alert.text}</AlertText>
              ) : null}
            </InputLayout>
          )
        )}
        <TextButtonWrap>
          <TextButton onPress={() => navigation.navigate('RePassword')}>
            <RePassword>비밀번호 재설정</RePassword>
          </TextButton>
        </TextButtonWrap>
        <LargeButton
          buttonText={'로그인하기'}
          active={buttonActive}
          onPress={() => LoginHandler()}
        />
      </LoginInputWrap>
    )
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Layout>
        <Header
          navigation={navigation}
          name="DoLogin"
          title="로그인하기"
          onPress={() => {}}
        />
        <LayoutInner>
          {inputLayoutArea()}
          <SocialLayout />
          <DoSignUpTitleWrap>
            <Title>아직 계정이 없으신가요? </Title>
            <SignUpButton onPress={() => signupHandler()}>
              <ButtonTitle>회원가입</ButtonTitle>
            </SignUpButton>
          </DoSignUpTitleWrap>
        </LayoutInner>
      </Layout>
    </TouchableWithoutFeedback>
  )
}

const Layout = styled.View`
  display: flex;
  flex: 1;
  background: ${({ theme }) => theme.color.gray12};
`

const LayoutInner = styled.View`
  display: flex;
  padding: 0 16px;
  flex-direction: column;
  justify-content: space-between;
`

const InputLayout = styled.View`
  padding: 4px 0;
`

const LoginInputWrap = styled.View`
  margin-top: 56px;
  margin-bottom: 50px;
`

const TextButtonWrap = styled.View`
  margin: 4px 4px 26px 4px;
  flex-direction: row;
  flex-wrap: wrap;
`

const TextButton = styled.TouchableOpacity`
  width: auto;
`

const RePassword = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font14};
  border-bottom-width: 1px;
  border-color: ${({ theme }) => theme.color.gray3};
`

// 경고 텍스트

const AlertText = styled.Text`
  color: ${({ theme }) => theme.color.red2};
  margin: 0 4px;
`

// 회원가입 부분
const DoSignUpTitleWrap = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 58px;
`

const Title = styled.Text`
  color: ${({ theme }) => theme.color.gray2};
  font-size: ${({ theme }) => theme.fontSize.font12};
`

const ButtonTitle = styled.Text`
  color: ${({ theme }) => theme.color.purple4};
  font-size: ${({ theme }) => theme.fontSize.font12};
`

const SignUpButton = styled.TouchableOpacity``

const SocialButton = styled.TouchableOpacity`
  margin: 0 12px;
`
