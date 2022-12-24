import React, { useEffect } from 'react'
import styled from 'styled-components/native'
import { Platform, Keyboard, StatusBar } from 'react-native'

export const KeyboardAvoid = ({ children }: any) => {
  // const BAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
  // const BAR_HEIGHT = StatusBar.currentHeight;
  const BAR_HEIGHT = 0

  useEffect(() => {
    if (Platform.OS === 'ios') return
    StatusBar.setBackgroundColor('#000000')
    StatusBar.setBarStyle('light-content')
    StatusBar.setTranslucent(false)
  }, [])

  return (
    <>
      <StatusBarView height={BAR_HEIGHT}>
        <SafeareaStyleTop />
      </StatusBarView>
      <SafeareaStyle>
        <KeyboardAvoidStyle
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {children}
        </KeyboardAvoidStyle>
      </SafeareaStyle>
    </>
  )
}

const SafeareaStyleTop = styled.SafeAreaView`
  flex: 0;
`

const StatusBarView = styled.View<{ height: number | undefined }>`
  /* background: ${({ theme }) => theme.color.black0}; */
  height: ${({ height }) => height && `${height}px`};
`

const SafeareaStyle = styled.SafeAreaView`
  flex: 1;
  background: #000000;
`

const KeyboardAvoidStyle = styled.KeyboardAvoidingView`
  flex: 1;
`
