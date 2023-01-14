import React, { Dispatch, useEffect, useState, SetStateAction } from 'react'
import styled from 'styled-components/native'
import Voice from '@react-native-community/voice'

// icons
import Mic from '@Icons/mic.svg'
import { useUploadContext } from '~/Hooks/useContextHook'

// hooks
// import useDebounce from '~/Hooks/useDebounce'

type props = {
  setPreviewMicVoice: (value: string) => void
  setMicVoice: Dispatch<SetStateAction<string>>
  removeRangeSelect: () => void
}

export default function MicEditor({
  setPreviewMicVoice,
  setMicVoice,
  removeRangeSelect,
}: props): JSX.Element {
  // store
  const { bodyInputDetect, setPartialOn, speechOn, setSpeechOn } =
    useUploadContext()

  const [micBtn, setMicBtn] = useState(false)

  const _onSpeechStart = () => {
    // console.log('onSpeechStart');
    setSpeechOn(true)
  }

  const _onSpeechEnd = (event: any) => {
    console.log('onSpeechEnd', event)
  }

  const _onSpeechResults = (event: any) => {
    setPartialOn(false)
    // console.log('1', event.value[0]);

    // previewAndvoiceHandle('voice', event.value[0]);
    try {
      setMicVoice(event.value[0] || '')
      setSpeechOn(false)
      setMicBtn(false)
    } catch {
      console.warn('warn')
    }

    // newTimer(event)
  }

  const _onSpeechError = async (event: any) => {
    console.log('Error', event?.error)
    setMicBtn(false)

    if (event.message === '7/No match') {
      await Voice.start('ko-KR')
      return
    }
    setSpeechOn(false)
  }

  const _onSpeechPartialResults = async (event: any) => {
    setPartialOn(true)
    // console.log('>>>>', event.value);
    setPreviewMicVoice(event.value[0])
  }

  const _onRecordVoice = () => {
    if (!micBtn) Voice.stop()
    Voice.start('ko-KR')
  }

  useEffect(() => {
    Voice.onSpeechStart = _onSpeechStart
    Voice.onSpeechResults = _onSpeechResults
    Voice.onSpeechError = _onSpeechError
    Voice.onSpeechPartialResults = _onSpeechPartialResults
    Voice.onSpeechEnd = _onSpeechEnd

    return () => {
      Voice.destroy().then(Voice.removeAllListeners)
    }
  }, [])

  useEffect(() => {
    if (!micBtn) return
    if (!bodyInputDetect) return
    _onRecordVoice()
  }, [micBtn])

  const micButton = bodyInputDetect
    ? {
        onPress: () => {
          setMicBtn(!micBtn), removeRangeSelect()
        },
        speechOn: speechOn,
      }
    : {}

  return (
    <MicButton {...micButton}>
      <Mic width={40} height={40} />
    </MicButton>
  )
}

const MicButton = styled.TouchableOpacity<
  { speechOn: boolean } | { speechOn: undefined }
>`
  width: 56px;
  height: 56px;
  border-radius: 50px;
  background: ${({ theme, speechOn }) =>
    speechOn ? theme.color.purple4 : theme.color.gray4};
  align-items: center;
  justify-content: center;
  z-index: 999;
`

const NoneWorkButton = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 50px;
  background: ${({ theme }) => theme.color.gray4};

  opacity: 0.5;
  align-items: center;
  justify-content: center;
  z-index: 999;
`
