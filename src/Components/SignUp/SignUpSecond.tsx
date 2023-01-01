import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'
import { TouchableWithoutFeedback, Keyboard } from 'react-native'

// components
import { MiddleToggleButton } from '../ToggleButton'
import { CheckBox } from '../CheckBox'
import { LargeButton } from '../Button'
import { InputText } from '../Input'

// hooks
import { useAppContext, useAuthMainContext } from '~/Hooks/useContextHook'

// types
import { loginType } from 'authTypeModule'
import { signupAgent, signupType } from '~/Agent/AuthAent'
import { MethodMytateEnum, useMutationHook } from '~/Hooks/useMutationHook'
import Header from '../Header/HeaderComponent'
import { NavigationScreenType } from '~/Router/types/NavigationType'

export default function SignUpSecond({ navigation }: any): JSX.Element {
  // store
  const { pickGender, setPickGender } = useAppContext()
  const { signupSecondInput, setSignupSecondInput, signUpValue } =
    useAuthMainContext()

  const signupMutate = useMutationHook(MethodMytateEnum.POST)

  // button active
  const [buttonActive, setButtonActive] = useState(false)

  // alert Text
  const [alertText, setAlertText] = useState<loginType.alertOrValue>({
    type: '',
    text: '',
  })

  const [allCheck, setAllCheck] = useState(false)
  const [serviceCheck, setServiceCheck] = useState(false)
  const [termCheck, setTermCheck] = useState(false)

  const GenreDataSendHandler = (type: string): void => {
    // genre 선택시 배열 랜덤용
    if (type === 'left') {
      setPickGender('Female')
    } else if (type === 'right') {
      setPickGender('Male')
    }
  }

  const toggleAgreeHandler = (type: string): void => {
    if (type === 'All') {
      setAllCheck(!allCheck)
    } else if (type === 'Service') {
      setServiceCheck(!serviceCheck)
    } else if (type === 'Terms') {
      setTermCheck(!termCheck)
    }
  }

  const textMergeHandler = (type: string, text: string): void => {
    // onChange Text
    const value =
      type === 'userId'
        ? text.replace(/[^A-Za-z|0-9]/gi, '')
        : text.replace(/\s/g, '')
    setSignupSecondInput({ ...signupSecondInput, [type]: value })
  }

  const signUpButtonHandler = async (): Promise<void> => {
    // navigation & 경고 text 부분

    const params: signupType = {
      signupSecondInput,
      signUpValue,
      pickGender,
      termCheck,
      serviceCheck,
      mutate: signupMutate,
    }

    if (signupSecondInput?.nickname?.length <= 1) {
      setAlertText({
        type: 'nickname',
        text: '닉네임은 2 ~ 20자 내로 설정할 수 있습니다',
      })
      return
    } else if (signupSecondInput?.userId?.length <= 5) {
      setAlertText({
        type: 'userId',
        text: '아이디는 6 ~ 20자 내로 설정할 수 있습니다',
      })
      return
    } else if (Object.keys(signupSecondInput).length === 0) {
      setAlertText({
        type: 'nickname',
        text: '닉네임 혹은 아이디를 작성해주세요!',
      })
      return
    } else if (!allCheck) {
      setAlertText({
        type: 'agree',
        text: '약관에 동의하지 않으면 서비스 이용이 힘들 수 있습니다',
      })
      return
    }

    // setAlertText({ type: '', text: '' })
    if (!buttonActive) return

    const result = await signupAgent({ ...params })

    if (result.type === '') {
      navigation.navigate(NavigationScreenType.AUTH, {
        screen: NavigationScreenType.LOGIN,
      })
    }

    setAlertText(result)
  }

  useEffect(() => {
    // 버튼 active ctrl
    const { nickname, userId } = signupSecondInput
    if (nickname.length > 1 && userId.length > 5 && allCheck) {
      setButtonActive(true)
    } else {
      setButtonActive(false)
    }
  }, [signupSecondInput, allCheck])

  useEffect(() => {
    if (!serviceCheck || !termCheck) {
      setAllCheck(false)
    } else if (serviceCheck && termCheck) {
      setAllCheck(true)
    }
  }, [serviceCheck, termCheck])

  useEffect(() => {
    if (!allCheck) {
      setServiceCheck(false)
      setTermCheck(false)
    } else if (allCheck) {
      setServiceCheck(true)
      setTermCheck(true)
    }
  }, [allCheck])

  const naviHandler = (type: string) => {
    if (type === 'All') return
    if (type === 'Service') navigation.navigate('PolicyTerms')
    if (type === 'Terms') navigation.navigate('PolicyPrivacy')
  }

  const checkBoxArr = [
    {
      type: 'All',
      toggle: allCheck,
      checkText: '전체 약관 동의',
      divide: true,
    },
    {
      type: 'Service',
      toggle: serviceCheck,
      checkText: '서비스 이용 약관',
      divide: false,
    },
    {
      type: 'Terms',
      toggle: termCheck,
      checkText: '개인정보 처리방침',
      divide: false,
      alert: alertText,
    },
  ]

  const InputArr = [
    {
      type: 'nickname',
      secure: false,
      placeholder: '닉네임 (20자 내외)',
      removeBtn: false,
      maxLength: 20,
      value: signupSecondInput.nickname,
      alert: alertText,
    },
    {
      type: 'userId',
      secure: false,
      placeholder: '아이디 (20자 내외)',
      removeBtn: false,
      maxLength: 20,
      value: signupSecondInput.userId,
      alert: alertText,
    },
  ]

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Layout>
        <Header
          navigation={navigation}
          name="SignUpSecond"
          title="프로필 입력하기"
          onPress={() => {}}
        />
        <LayoutInner>
          <SignUpSecondWrap>
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
                    onPress={() => console.log('')}
                  />
                  {alert.type === type && alert.text ? (
                    <AlertText>{alert.text}</AlertText>
                  ) : null}
                </InputLayout>
              )
            )}
            {/* <SignUpSecondInput alertType='' /> */}
          </SignUpSecondWrap>
          <GenderWrap>
            <GenderText>성별</GenderText>
            <MiddleToggleButtonWrap>
              <MiddleToggleButton
                buttonText1="여성"
                buttonText2="남성"
                onPress={GenreDataSendHandler}
              />
            </MiddleToggleButtonWrap>
          </GenderWrap>
          <AllCheckBoxWrap>
            {checkBoxArr?.map(
              ({ type, toggle, checkText, divide, alert }, i) => (
                <CheckBoxLayout key={i}>
                  <CheckBoxWrap>
                    <CheckBox
                      onPress={toggleAgreeHandler}
                      type={type}
                      toggle={toggle}
                    />
                    <Button onPress={() => naviHandler(type)}>
                      <CheckBoxText>{checkText}</CheckBoxText>
                    </Button>
                  </CheckBoxWrap>
                  {divide ? <DivideLine /> : null}
                  {alert?.type === 'agree' && alert.text ? (
                    <AlertText>{alert.text}</AlertText>
                  ) : null}
                </CheckBoxLayout>
              )
            )}
            <ButtonWrap>
              <LargeButton
                active={buttonActive}
                buttonText={'회원가입'}
                onPress={() => signUpButtonHandler()}
              />
            </ButtonWrap>
          </AllCheckBoxWrap>
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

const InputLayout = styled.View`
  padding: 4px 0;
`

const SignUpSecondWrap = styled.View`
  margin-top: 52px;
`

const GenderWrap = styled.View`
  margin-top: 32px;
`

const GenderText = styled.Text`
  color: ${({ theme }) => theme.color.gray2};
  /* font-family: ${({ theme }) => theme.font.robotoMedium}; */
  font-size: ${({ theme }) => theme.fontSize.font14};
`

const MiddleToggleButtonWrap = styled.View`
  margin-top: 8px;
`

// checkbox
const AllCheckBoxWrap = styled.View`
  margin-top: 58px;
`
const CheckBoxLayout = styled.View``

const CheckBoxWrap = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`

const CheckBoxText = styled.Text`
  font-size: ${({ theme }) => theme.fontSize.font14};
  /* font-family: ${({ theme }) => theme.font.ptdMedium}; */
  color: ${({ theme }) => theme.color.white};
  margin-left: 8px;
`

const Button = styled.TouchableWithoutFeedback``

const DivideLine = styled.View`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.color.gray4};
  margin: 4px 0 18px 0;
`

// button
const ButtonWrap = styled.View`
  margin-top: 32px;
`

// alert
const AlertText = styled.Text`
  color: ${({ theme }) => theme.color.red2};
  margin: 0 4px;
`
