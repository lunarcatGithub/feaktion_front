import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'

// components
import { LargeButton } from '../Button'
import { InputText } from '../Input'
import { Header } from '../Header/Header'
import { useMutation } from 'react-query'

// hooks
import useFetch from '~/Hooks/useAxiosFetch'
import useAsyncStorage from '~/Hooks/useAsyncStorage'
import ModalPopup from '../Popup/Modal'
import { useAuthContext } from '~/Hooks/useContextHook'

export default function WithdrawalSetting({ navigation }: any): JSX.Element {
  // button active
  const [buttonActive, setButtonActive] = useState(false)
  const [textValue, setTextValue] = useState('')
  const [alertText, setAlertText] = useState('')

  // reducer
  const { setUserToken } = useAuthContext()

  // hooks
  const [asyncHandler, result] = useAsyncStorage()

  // fetch
  const mutation = useMutation((danger: {}) =>
    useFetch({ url: '/users', method: 'delete', data: danger })
  )

  // popup
  const [isPopup, setIsPopup] = useState(false)

  const modalHanddler = async (
    modalType: string,
    select: string
  ): Promise<void> => {
    if (select === 'cancel') {
      setIsPopup(false)
      return
    }

    await mutation?.mutateAsync({ password: textValue })
    setIsPopup(false)
    if (mutation?.data) {
      asyncHandler('SET', 'token', JSON.stringify(false))
      await setUserToken(false)
      return
    } else {
      setAlertText('비밀번호가 틀립니다')
    }
  }

  useEffect(() => {
    // 버튼 active ctrl
    if (textValue.length > 7) {
      setButtonActive(true)
    } else {
      setButtonActive(false)
    }
  }, [textValue])

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Layout>
          <HeaderWrap>
            <Header
              navigation={navigation}
              route={{
                name: 'WithdrawalSetting',
                params: { title: '회원 탈퇴' },
              }}
              onPress={() => console.log('')}
            />
          </HeaderWrap>
          <LayoutInner>
            <InputWrap>
              <TitleWrap>
                <TitleText>
                  탈퇴할 경우 모든 데이터가 소실되며{'\n'} 복구가 불가능합니다
                </TitleText>
              </TitleWrap>
              <InputLayout>
                <InputText
                  secure={true}
                  placeholder={'본인 확인을 위한 비밀번호 입력'}
                  removeBtn={true}
                  maxLength={999}
                  onChangeText={text => setTextValue(text)}
                  value={textValue}
                  onPress={() => console.log('')}
                />
                {alertText ? <AlertText>{alertText}</AlertText> : null}
              </InputLayout>
              <LargeButton
                buttonText={'탈퇴하기'}
                active={buttonActive}
                onPress={() => setIsPopup(true)}
              />
            </InputWrap>
          </LayoutInner>
        </Layout>
      </TouchableWithoutFeedback>
      <ModalPopup
        data={null}
        visible={isPopup}
        onClose={() => setIsPopup(false)}
        onPress={modalHanddler}
        type="Widthdrawal"
        modalType="Popup"
      />
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
  flex: 1;
  background: ${({ theme }) => theme.color.gray12};
`

const LayoutInner = styled.View`
  padding: 16px;
`

// title
const TitleWrap = styled.View`
  margin: 16px 0;
`

const TitleText = styled.Text`
  line-height: 16px;
  color: ${({ theme }) => theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font12};
`

const InputWrap = styled.View`
  margin-top: 30px;
  margin-bottom: 50px;
`

const InputLayout = styled.View`
  margin-bottom: 36px;
`

// 경고 텍스트

const AlertText = styled.Text`
  color: ${({ theme }) => theme.color.red2};
  margin: 0 4px;
`
