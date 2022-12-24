import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'

// store

// hooks
import { emailRegexp } from '@Hooks/emailRegexp'
import { useAuthMainContext } from '~/Hooks/useContextHook'

// types
import { loginType } from 'authTypeModule'
import InputBundle from '../Common/InputBundle'
import useMutationHook from '~/Hooks/useMutationHook'
import usePasswordValidityCheck from '~/Hooks/usePasswordValidityCheck'

export function SignUpFirst({ navigation }: any): JSX.Element {
  // store
  const { signupInputText, setSignupInput, setSignUpValue } =
    useAuthMainContext()

  // hook
  const [emailValue, getEmailValue] = emailRegexp()

  // fetch
  // const { mutate, data, isError, isLoading, isSuccess } = useMutation('usercheck', (check:{}) => useFetch('/user/idexistcheck', 'post', check))
  // validate
  const type = usePasswordValidityCheck(
    signupInputText?.password,
    signupInputText?.rePassword
  )

  // fetch
  const { mutateAsync } = useMutationHook('post')

  // button active
  const [buttonActive, setButtonActive] = useState(false)

  // alert Text
  const [alertText, setAlertText] = useState<loginType.alertOrValue>({
    type: '',
    text: '',
  })

  const textMergeHandler = (type: string, text: string): void => {
    setSignupInput({ ...signupInputText, [type]: text })
  }

  const nextButtonHandler = (): void => {
    // 유효성 검사

    if (!emailValue) {
      setAlertText({ type: 'email', text: '이메일 형식을 다시 확인해주세요!' })
      return
    } else if (type === 'different') {
      setAlertText({ type: 'password', text: '비밀번호를 확인해주세요' })
      return
    } else if (type === 'none') {
      setAlertText({ type: 'rePassword', text: '비밀번호를 채워주세요' })
      return
    } else if (type === 'shortage') {
      setAlertText({
        type: 'rePassword',
        text: '비밀번호는 8자 이상 입력해주세요',
      })
      return
    }

    if (!buttonActive) return

    setSignUpValue(signupInputText)
    setAlertText({ type: '', text: '' })
    const data = { email: signupInputText?.email }

    mutateAsync({ url: '/user/idexistcheck', data }).then(result => {
      if ([200, 201].includes(result?.status)) {
        navigation.navigate('SignUpSecond')
      } else if ([400, 401, 404].includes(result?.status)) {
        setAlertText({
          type: 'rePassword',
          text: '이미 존재하거나 탈퇴한 회원입니다',
        })
      }
    })
  }

  useEffect(() => {
    getEmailValue(signupInputText.email) // 이메일 형식 정규식 치환
  }, [signupInputText])

  useEffect(() => {
    // 버튼 active ctrl
    const { email, password, rePassword } = signupInputText
    if (email.length > 4 && password.length > 7 && rePassword.length > 7) {
      setButtonActive(true)
    } else {
      setButtonActive(false)
    }
  }, [signupInputText])

  const InputArr = [
    {
      type: 'email',
      secure: false,
      placeholder: '이메일',
      removeBtn: false,
      maxLength: 999,
      value: signupInputText.email,
      alert: alertText,
    },
    {
      type: 'password',
      secure: true,
      placeholder: '비밀번호',
      removeBtn: false,
      maxLength: 30,
      value: signupInputText.password,
      alert: alertText,
    },
    {
      type: 'rePassword',
      secure: true,
      placeholder: '비밀번호 확인',
      removeBtn: false,
      maxLength: 30,
      value: signupInputText.rePassword,
      alert: alertText,
    },
  ]

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Layout>
        <SignUptWrap>
          <InputBundle
            data={InputArr}
            onChangeText={textMergeHandler}
            buttonActive={buttonActive}
            buttonText={'다음단계'}
            buttonOnPress={nextButtonHandler}
          />
        </SignUptWrap>
      </Layout>
    </TouchableWithoutFeedback>
  )
}

const Layout = styled.View`
  display: flex;
  flex: 1;
  background: ${({ theme }) => theme.color.gray12};
  padding: 16px;
`

const SignUptWrap = styled.View`
  margin-top: 52px;
`
