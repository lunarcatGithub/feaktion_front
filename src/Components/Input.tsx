import React, { Fragment, useState } from 'react'
import styled from 'styled-components/native'
import theme from '~/Styles/Theme'
import { Platform } from 'react-native'

// icons
import RemoveBtn from '@Icons/removeX.svg'
import Enter from '@Icons/enter.svg'

type props = {
  _ref?: any
  secure?: boolean
  placeholder: string
  removeBtn?: boolean
  maxLength?: number
  onChangeText: (value: string) => void
  onPress: (type: string) => void
  value: string | undefined
  multiline?: boolean
  autoFocus?: boolean
  type?: string
  onEndEditing?: () => void
}

export function InputText({
  _ref,
  secure = false,
  placeholder = '',
  removeBtn = false,
  maxLength = 100,
  onChangeText,
  onPress,
  value = '',
  multiline = false,
  autoFocus = false,
  type = '',
  onEndEditing,
}: props): JSX.Element {
  const [textLength, setTextLength] = useState(0)

  const effectButtonHandler = () => {
    if (type === 'limitNumber' || type === 'mutiline') {
      return (
        <TextView>
          <LimitNumber numAlert={textLength === maxLength}>
            {`${textLength}/${maxLength}`}
          </LimitNumber>
        </TextView>
      )
    } else {
      if (textLength === 0) return
      return <RemoveView styling={type}>{typeEndterAndRemove(type)}</RemoveView>
    }
  }

  const typeEndterAndRemove = (type: string): JSX.Element | JSX.Element[] => {
    if (type === 'removeBtn' || removeBtn) {
      return (
        <Button
          onPress={() => {
            onChangeText('')
            setTextLength(0)
          }}>
          <RemoveBtn width={24} height={24} />
        </Button>
      )
    } else if (type === 'enter') {
      return (
        <Fragment>
          <OpacityWrap>
            <Button
              onPress={() => {
                onChangeText('')
                setTextLength(0)
              }}>
              <RemoveBtn width={16} height={16} />
            </Button>
          </OpacityWrap>
          <Button onPress={() => onPress('enter')}>
            <Enter width={24} height={24} />
          </Button>
        </Fragment>
      )
    } else {
      return <></>
    }
  }

  return (
    <Layout>
      <InputLayout
        ref={_ref}
        onBlur={onEndEditing}
        autoFocus={autoFocus}
        secureTextEntry={secure}
        placeholder={placeholder}
        placeholderTextColor={`${theme.color.gray2}`}
        maxLength={maxLength}
        onChangeText={text => {
          onChangeText(text)
          setTextLength(text.length)
        }}
        value={value}
        multiline={multiline}
        styling={type}
        style={{ textAlignVertical: 'top' }}
        platformIos={Platform.OS === 'ios'}
        editable
      />
      {effectButtonHandler()}
    </Layout>
  )
}
const Layout = styled.View`
  position: relative;
`

const InputLayout = styled.TextInput<{ styling: string; platformIos: boolean }>`
  width: 100%;
  color: ${({ theme }) => theme.color.white};
  font-size: ${({ theme }) => theme.fontSize.font14};

  ${({ styling, theme, platformIos }) => {
    if (
      styling === 'removeBtn' ||
      styling === 'limitNumber' ||
      styling === ''
    ) {
      return `
      padding:16px 58px 16px 16px;
      height:48px;
      background:${theme.color.gray6};
      border-radius: 4px;
      `
    } else if (styling === 'enter') {
      return `
      max-height:140px;
      ${
        platformIos
          ? `padding:16px 77px 20px 16px;`
          : `padding:16px 77px 10px 16px;`
      }
      background:${theme.color.gray10};
      border-radius: 0px;
      `
    } else {
      return `
      padding:16px 16px 36px 16px;
      height:192px;
      background:${theme.color.gray6};
      border-radius: 4px;
      `
    }
  }};
`

const TextView = styled.View`
  position: absolute;
  right: 15px;
  bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const RemoveView = styled(TextView)<{ styling: string }>`
  flex-direction: row;
  bottom: ${({ styling }) => (styling === 'enter' ? `16px` : `14px`)};
`

const OpacityWrap = styled.View`
  margin-right: 16px;
  justify-content: center;
  align-items: center;
  opacity: 0.65;
`

const Button = styled.TouchableOpacity`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
`

const LimitNumber = styled.Text<{ numAlert: boolean }>`
  color: ${({ theme, numAlert }) =>
    numAlert ? theme.color.gray1 : theme.color.gray3};
  font-size: ${({ theme }) => theme.fontSize.font12};
  letter-spacing: 0.5px;
`
