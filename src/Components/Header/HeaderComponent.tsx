import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'

// icons
import Back from '@Icons/back.svg'

type Props = {
  navigation: any
  name: string
  title: string
  onPress: () => void
}

export default function Header({
  navigation,
  name,
  title,
  onPress,
}: Props): JSX.Element {
  // const [title, setTitle] = useState<string>()

  // const DivideTitle = () => {
  //   if (name === 'DoLogin') {
  //     setTitle('로그인하기')
  //   } else if (name === 'SignUp') {
  //     setTitle('회원가입')
  //   } else if (name === 'SignUpSecond') {
  //     setTitle('정보 입력 하기')
  //   } else if (name === 'GenreSelect') {
  //     setTitle('선호 장르 선택')
  //   } else if (name === 'RePassword') {
  //     setTitle('비밀번호 재설정')
  //   }
  // }

  // useEffect(() => {
  //   DivideTitle()
  // }, [name])

  return (
    <HeaderWrap>
      <GnbLayout>
        <BackButton onPress={() => navigation.goBack()}>
          <Back width={24} height={24} />
        </BackButton>
        <Text>{title}</Text>
      </GnbLayout>
    </HeaderWrap>
  )
}

const HeaderWrap = styled.View`
  display: flex;
  width: 100%;
  height: 48px;
`

const GnbLayout = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  /* justify-content: space-between; */
  width: 100%;
  height: 48px;
  background: ${({ theme }) => theme.color.gray12};
  padding-left: 16px;
`

const BackButton = styled.TouchableOpacity``

const Text = styled.Text`
  color: ${({ theme }) => theme.color.gray1};
  font-size: ${({ theme }) => theme.fontSize.font16};
  font-family: ${({ theme }) => theme.font.notoMedium};
  margin-left: 8px;
`
