import React from 'react'
import styled from 'styled-components/native'
import { InputText } from '../Input'
import { LargeButton } from '../Button'

type Props = {
  type: string
  _type: string
  secure: boolean
  placeholder: string
  removeBtn: boolean
  value: string
  alert: { type: string; text: string }
  maxLength: number
}

type HOCProps = {
  onChangeText: (type: string, text: string) => void
  buttonActive?: boolean
  buttonText?: string
  buttonOnPress?: () => void
  interval?: number
  data: Props[]
}

export default function InputBundle({
  data,
  onChangeText,
  buttonActive,
  buttonText,
  buttonOnPress,
  interval = 28,
}: HOCProps): JSX.Element {
  return (
    <>
      {data.map(
        (
          {
            type,
            _type,
            secure,
            placeholder,
            removeBtn,
            maxLength,
            value,
            alert,
          }: Props,
          i: number
        ): JSX.Element => (
          <InputLayout key={i}>
            <InputText
              secure={secure}
              placeholder={placeholder}
              removeBtn={removeBtn}
              maxLength={maxLength}
              onChangeText={text => onChangeText(type, text)}
              value={value}
              type={_type}
              multiline={type === 'intro' ? true : false}
              onPress={() => {}}
            />
            {alert.type === type && alert.text ? (
              <AlertText>{alert.text}</AlertText>
            ) : null}
          </InputLayout>
        )
      )}
      <ButtonWrap interval={interval}>
        <LargeButton
          active={buttonActive}
          buttonText={buttonText}
          onPress={buttonOnPress}
        />
      </ButtonWrap>
    </>
  )
}

const InputLayout = styled.View`
  padding: 4px 0;
`

const AlertText = styled.Text`
  color: ${({ theme }) => theme.color.red2};
  margin: 0 4px;
`

const ButtonWrap = styled.View<{ interval: number }>`
  margin-top: ${({ interval }) => `${interval}px`};
`
