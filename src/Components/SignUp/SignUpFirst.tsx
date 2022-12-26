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
import { MethodMytateEnum, useMutationHook } from '~/Hooks/useMutationHook'
import usePasswordValidityCheck from '~/Hooks/usePasswordValidityCheck'
import { signupValidateChecktAgent } from '~/Agent/AuthAent'
import Header from '../Header/HeaderComponent'

export function SignUpFirst({ navigation }: any): JSX.Element {
  // store
  const { signupInputText, setSignupInput, setSignUpValue } =
    useAuthMainContext()

  // hook
  const [emailValue, getEmailValue] = emailRegexp()

  // validate
  const type = usePasswordValidityCheck(
    signupInputText?.password,
    signupInputText?.rePassword
  )

  // fetch
  const signupMutate = useMutationHook(MethodMytateEnum.POST)

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

  const nextButtonHandler = async (): Promise<void> => {
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

    const result = await signupValidateChecktAgent({
      email: signupInputText?.email,
      mutate: signupMutate,
    })

    if (result?.type === 'SignUpSecond') {
      // 유효성 체크한 회원가입 정보 넘기기
      setSignUpValue(signupInputText)
      navigation.navigate('SignUpSecond')
      return
    }

    setAlertText(result)
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
  console.log('alertText', alertText)
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Layout>
        <Header
          navigation={navigation}
          name="SignUp"
          title="회원가입"
          onPress={() => {}}
        />
        <LayoutInner>
          <SignUptWrap>
            <InputBundle
              data={InputArr}
              onChangeText={textMergeHandler}
              buttonActive={buttonActive}
              buttonText={'다음단계'}
              buttonOnPress={nextButtonHandler}
            />
          </SignUptWrap>
        </LayoutInner>
      </Layout>
    </TouchableWithoutFeedback>
  )
}

const Layout = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.color.gray12};
`

const LayoutInner = styled.View`
  padding: 16px;
`

const SignUptWrap = styled.View`
  margin-top: 52px;
`
