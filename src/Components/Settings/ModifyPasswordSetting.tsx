import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

// components
import InputBundle from '../Common/InputBundle'
import { Header } from '../Header/Header'

// hooks
import usePasswordValidityCheck from '~/Hooks/usePasswordValidityCheck'
import useAsyncStorage from '~/Hooks/useAsyncStorage'
import useMutationHook from '~/Hooks/useMutationHook'

// components
import ToastPush from '../Interaction/ToastPush'

// store
import { useAppContext } from '~/Hooks/useContextHook'

export default function ModifyPasswordSetting({
  navigation,
}: any): JSX.Element {
  const { animationMove, setAnimationMove } = useAppContext()
  const [userProfile, setUserProfile] = useState({ id: '', password: '' })

  // hooks
  const [asyncHandler, _result] = useAsyncStorage()

  const [modifyPassword, setModifyPassword] = useState({
    origin: '',
    password: '',
    rePassword: '',
  })

  // fetch
  const patchMutate = useMutationHook('patch')
  const postMutate = useMutationHook('post')

  // button active
  const [buttonActive, setButtonActive] = useState(false)

  // alert Text
  const [alertText, setAlertText] = useState({ type: '', text: '' })

  // validate
  const type = usePasswordValidityCheck(
    modifyPassword?.password,
    modifyPassword?.rePassword
  )

  // hooks
  const textMergeHandler = (type: string, text: string): void => {
    if (type === 'origin') {
      setModifyPassword({ ...modifyPassword, origin: text })
    } else if (type === 'password') {
      setModifyPassword({ ...modifyPassword, password: text })
    } else if (type === 'rePassword') {
      setModifyPassword({ ...modifyPassword, rePassword: text })
    }
  }

  const changePasswordHandler = (): void => {
    if (modifyPassword?.origin?.length <= 7) {
      setAlertText({
        type: 'origin',
        text: '비밀번호는 8자 이상 입력해주세요',
      })
      return
    } else if (type === 'different') {
      setAlertText({ type: 'password', text: '비밀번호가 서로 달라요' })
      return
    } else if (type === 'none') {
      setAlertText({
        type: 'rePassword',
        text: '비밀번호는 8자 이상 입력해주세요',
      })
      return
    } else if (type === 'shortage') {
      setAlertText({
        type: 'rePassword',
        text: '비밀번호는 8자 이상 입력해주세요',
      })
      return
    } else if (modifyPassword?.origin === modifyPassword?.password) {
      setAlertText({
        type: 'rePassword',
        text: '비밀번호가 이전과 동일합니다',
      })
      return
    }

    if (!buttonActive) return
    patchPassword() // 비번변경
    setAlertText({ type: '', text: '' })
  }

  const patchPassword = () => {
    const data = {
      password: modifyPassword?.origin,
      new_password: modifyPassword?.password,
    }

    const checkPssword = {
      email: userProfile?.id,
      password: modifyPassword?.origin,
    }
    postMutate
      ?.mutateAsync({ url: '/user/signin', data: checkPssword })
      .then(({ status }: { status: number }) => {
        // 원래 비밀번호 맞는지 검증
        if ([200, 201].includes(status)) {
          patchMutate
            ?.mutateAsync({ url: `/user/changepassword`, data })
            .then(({ status }: { status: number }) => {
              // 비밀번호 변경
              if ([200, 201].includes(status)) {
                setModifyPassword({ origin: '', password: '', rePassword: '' })
                if (animationMove?.loading) return
                setAnimationMove({
                  type: 'CHANGEDPASSWORD',
                  value: -80,
                  bool: true,
                  loading: true,
                })
              }
            })
        } else {
          // 비밀번호가 틀렸을 때
          setAlertText({ type: 'origin', text: '기존의 비밀번호와 다릅니다' })
          return
        }
      })
  }

  useEffect(() => {
    // 버튼 active ctrl
    const { origin, password, rePassword } = modifyPassword
    if (origin.length > 4 && password.length > 7 && rePassword.length > 7) {
      setButtonActive(true)
    } else {
      setButtonActive(false)
    }
  }, [modifyPassword])

  useEffect(() => {
    asyncHandler('GET', 'profile')
  }, [animationMove?.loading])

  useEffect(() => {
    if (!_result?.result) return
    const getUserProfile = JSON?.parse(_result?.result)
    setUserProfile(JSON.parse(getUserProfile))
  }, [_result])

  const InputArr = [
    {
      type: 'origin',
      secure: true,
      placeholder: '기존 비밀번호',
      removeBtn: modifyPassword.origin.length > 2,
      maxLength: 30,
      value: modifyPassword.origin,
      alert: alertText,
    },
    {
      type: 'password',
      secure: true,
      placeholder: '비밀번호',
      removeBtn: modifyPassword.password.length > 2,
      maxLength: 30,
      value: modifyPassword.password,
      alert: alertText,
    },
    {
      type: 'rePassword',
      secure: true,
      placeholder: '비밀번호 확인',
      removeBtn: modifyPassword.rePassword.length > 2,
      maxLength: 30,
      value: modifyPassword.rePassword,
      alert: alertText,
    },
  ]

  return (
    <>
      <Layout>
        <HeaderWrap>
          <Header
            navigation={navigation}
            route={{
              name: 'ModifyPasswordSetting',
              params: { title: '비밀번호 수정' },
            }}
            onPress={() => navigation.goBack()}
          />
        </HeaderWrap>

        <LayoutInner>
          <SignUptWrap>
            <InputBundle
              data={InputArr}
              onChangeText={textMergeHandler}
              buttonActive={buttonActive}
              buttonText={'변경하기'}
              buttonOnPress={changePasswordHandler}
            />
          </SignUptWrap>
        </LayoutInner>
      </Layout>
      <ToastPush type="CHANGEDPASSWORD" />
    </>
  )
}

// header
const HeaderWrap = styled.View`
  display: flex;
  width: 100%;
  height: 48px;
`

const Layout = styled.View`
  display: flex;
  flex: 1;
  background: ${({ theme }) => theme.color.gray12};
`

const LayoutInner = styled.View`
  padding: 16px;
`

const SignUptWrap = styled.View`
  margin-top: 52px;
`
