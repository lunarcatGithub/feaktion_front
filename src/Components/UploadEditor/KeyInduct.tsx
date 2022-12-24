import React, { useEffect } from 'react'
import styled from 'styled-components/native'
import { Keyboard } from 'react-native'

// icons
import KeyBoard from '@Icons/keyboard.svg'
import Enter from '@Icons/enter.svg'

import { useUploadContext } from '~/Hooks/useContextHook'

type props = {
  keyinductHandler: (value: string | Element, keyType: string) => void
  previewMicVoice: string
  setHeaderHide: (value: boolean) => void
}

export default function KeyInduct({
  keyinductHandler,
  previewMicVoice,
  setHeaderHide,
}: props): JSX.Element {
  // store
  const { speechOn } = useUploadContext()

  const keyInductList = [
    { index: 0, title: '"', value: 'Quotation' },
    { index: 1, title: `'`, value: 'SingleQuotation' },
    { index: 2, title: `?`, value: 'Question' },
    { index: 3, title: `!`, value: 'Exclamation' },
    { index: 4, title: `,`, value: 'Comma' },
    { index: 5, title: `.`, value: 'Period' },
    { index: 6, title: <Enter width={18} height={18} />, value: 'ChangeLine' },
  ]

  const _keyboardDidShow = () => setHeaderHide(false)

  const _keyboardDidHide = () => setHeaderHide(true)

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow)
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide)
  }, [])

  return (
    <BottomLayout layout={speechOn}>
      {!speechOn ? (
        <>
          <Dummy />
          <KeyInductWrap>
            {keyInductList?.map(({ index, title, value }) => (
              <KeyButton
                key={`key__${index}`}
                onPress={() => keyinductHandler(title, value)}>
                <KeyText>{title}</KeyText>
              </KeyButton>
            ))}
          </KeyInductWrap>
          <Button onPress={() => Keyboard.dismiss()}>
            <KeyBoard width={40} height={28} />
          </Button>
        </>
      ) : (
        <TextPreview>
          <KeyText>{previewMicVoice}</KeyText>
        </TextPreview>
      )}
    </BottomLayout>
  )
}

const BottomLayout = styled.View<{ layout: boolean }>`
  flex-direction: row;
  background: ${({ theme }) => theme.color.gray10};
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 48px;
`

const KeyButton = styled.TouchableOpacity`
  width: 28px;
  height: 28px;
  margin: 0 4px;
  border-radius: 4px;
  background: ${({ theme }) => theme.color.gray4};
  align-items: center;
  justify-content: center;
`

const TextPreview = styled.View`
  flex: 1;
  padding: 0 16px;
`

const KeyText = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  font-size: ${({ theme }) => theme.fontSize.font14};
`

const KeyInductWrap = styled.View`
  align-items: center;
  flex-direction: row;
`

const Button = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`

// dummy
const Dummy = styled.View`
  width: 40px;
`
