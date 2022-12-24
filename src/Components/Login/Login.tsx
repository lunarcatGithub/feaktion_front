import React, { useState, useContext, useEffect, useCallback } from 'react'
import styled from 'styled-components/native'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'

// components
import { LargeButton } from '~/Components/Button'
import { SocialLayout } from '~/Components/Login/SocialLayout'
import { InputText } from '../Input'

// hooks
import useMutationHook from '~/Hooks/useMutationHook'
import { useAuthMainContext } from '~/Hooks/useContextHook'
import useAsyncStorage from '~/Hooks/useAsyncStorage'

// store
import { AuthContext } from '~/App'

// types
import { loginType } from 'authTypeModule'
import axios from 'axios'

export default function Login({ navigation }: any): JSX.Element {
  // reducer
  const { setUserToken } = useContext(AuthContext)
  // const { setSignUpValue } = useContext(AppContext);
  const { loginInput, setLoginInput } = useAuthMainContext()

  // button active
  const [buttonActive, setButtonActive] = useState<boolean>(false)

  // alert Text
  const [alertText, setAlertText] = useState<loginType.alertOrValue>({
    type: '',
    text: '',
  })

  // fetch
  // const { data, isLoading, isError, mutateAsync } = useMutation((user:{}) => useFetch('/user/signin', 'post', user))
  const loginMutate = useMutationHook('post')

  // hooks
  const [asyncHandler, _result] = useAsyncStorage()

  const textMergeHandler = (type: string, text: string): void => {
    if (type === 'userId') {
      setLoginInput({ ...loginInput, userId: text })
    } else if (type === 'password') {
      setLoginInput({ ...loginInput, password: text })
    }
  }

  const LoginHandler = (): void => {
    // axios({ method: 'GET', url: `localhost:3000` });

    // 로그인 & alert text
    const { userId, password } = loginInput
    if (!userId || userId.length === 0) {
      setAlertText({
        type: 'userId',
        text: '아이디 또는 이메일을 입력해 주세요',
      })
    } else if (!password || password.length < 7) {
      setAlertText({ type: 'password', text: '최소 8자 이상 입력해 주세요' })
      return
    } else {
      loginMutate
        ?.mutateAsync({
          url: '/user/signin',
          data: { email: userId, password },
        })
        .then((data: { status: number }) => loginAfterHandler(data))
      return
    }

    if (!buttonActive) return
  }

  const signupHandler = () => {
    // 경고 메시지 초기화
    setAlertText({
      type: '',
      text: '',
    })
    navigation.navigate('SignUp')
  }

  const loginAfterHandler = (data: { status: number }) => {
    const { userId } = loginInput
    if ([200, 201].includes(data?.status)) {
      asyncHandler('SET', 'token', JSON.stringify(true))
      asyncHandler('SET', 'profile', JSON.stringify({ id: userId }))

      setUserToken(true)
      return
    } else if ([404].includes(data?.status)) {
      setAlertText({
        type: 'userId',
        text: '탈퇴했거나 존재하지 않는 아이디입니다',
      })
      return
    } else if ([400, 401].includes(data?.status)) {
      setAlertText({
        type: 'userId',
        text: '로그인 입력 정보를 다시 확인해 주세요',
      })
      return
    } else if ([500, 501, 502].includes(data?.status)) {
      setAlertText({
        type: 'userId',
        text: '서버에 문제가 발생했습니다. 잠시 후 다시 로그인해주세요',
      })
      return
    }
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

  useEffect(() => {
    asyncHandler('GET', 'token')
  }, [])

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Layout>
          <LoginInputWrap>
            {InputArr?.map(
              (
                {
                  type,
                  secure,
                  placeholder,
                  removeBtn,
                  maxLength,
                  value,
                  alert,
                },
                i
              ) => (
                <InputLayout key={i}>
                  <InputText
                    secure={secure}
                    placeholder={placeholder}
                    removeBtn={removeBtn}
                    maxLength={maxLength}
                    onChangeText={text => textMergeHandler(type, text)}
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
          <SocialLayout />
          <DoSignUpTitleWrap>
            <Title>아직 계정이 없으신가요? </Title>
            <SignUpButton onPress={() => signupHandler()}>
              <ButtonTitle>회원가입</ButtonTitle>
            </SignUpButton>
          </DoSignUpTitleWrap>
        </Layout>
      </TouchableWithoutFeedback>
      {/* { isLoading ? <StackLoading /> : null } */}
    </>
  )
}

const Layout = styled.View`
  display: flex;
  flex: 1;
  background: ${({ theme }) => theme.color.gray12};
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
