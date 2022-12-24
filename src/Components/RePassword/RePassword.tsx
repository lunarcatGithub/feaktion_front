import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

// components
import { InputText } from '../Input'
import { LargeButton } from '../Button'

// hooks
import { emailRegexp } from '@Hooks/emailRegexp'

export default function RePassword({ navigation }: any) {
  const [value, setRegexp] = emailRegexp()

  const [emailValue, setEmailValue] = useState<string>('')

  // button active
  const [buttonActive, setButtonActive] = useState<boolean>(false)
  // alert Text
  const [alertText, setAlertText] = useState<{ text: string }>({ text: '' })

  const findPasswordHandler = (email: string) => {
    setEmailValue(email)
    if (!buttonActive) return
    if (!email) {
      setAlertText({ text: '이메일 정보를 찾을 수 없습니다' })
      return
    }
    navigation.navigate('Login')
  }

  useEffect(() => {
    setRegexp(emailValue)
  }, [emailValue])

  useEffect(() => {
    setButtonActive(value)
  }, [value])

  return (
    <Layout>
      <TextWrap>
        <DescriptText>
          가입시 등록한 이메일 주소를 입력해주세요{'\n'}
          비밀번호를 재설정할 수 있는 링크를 메일로 보내드립니다
        </DescriptText>
      </TextWrap>
      <InputText
        secure={false}
        placeholder={'이메일을 입력해주세요'}
        removeBtn={true}
        onChangeText={value => findPasswordHandler(value)}
        value={emailValue}
        onPress={() => console.log('')}
      />
      {alertText.text ? <AlertText>{alertText.text}</AlertText> : null}
      <ButtonWrap>
        <LargeButton
          active={buttonActive}
          buttonText={'계정 찾기'}
          onPress={findPasswordHandler}
        />
      </ButtonWrap>
    </Layout>
  )
}

const Layout = styled.View`
  flex-direction: column;
  flex: 1;
  background: ${({ theme }) => theme.color.gray12};
  padding: 16px;
`
const TextWrap = styled.View`
  flex-direction: column;
  margin-top: 56px;
  margin-bottom: 16px;
`
const DescriptText = styled.Text`
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font12};
  line-height: 16px;
`

const AlertText = styled.Text`
  color: ${({ theme }) => theme.color.red2};
  margin: 0 4px;
`

const ButtonWrap = styled.View`
  margin-top: 28px;
`
