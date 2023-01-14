import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'

// icons
import Back from '@Icons/back.svg'

type Props = {
    navigation: any
    title: string
    onPress: (prams: string) => void
    optionButton: {
        type: string
        button: any
        method: () => void
    }[]
}

export default function Header({
    navigation,
    title,
    optionButton = [],
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

    const sideButtonHandler = (): JSX.Element[] | null => {
        if (optionButton.length === 0) return null
        return optionButton.map(({ button, method }, index) => (
            <IconButton key={index.toString()} onPress={method}>
                {button}
            </IconButton>
        ))
    }

    return (
        <HeaderWrap>
            <GnbLayout>
                <LeftLayoutWrap>
                    <BackButton onPress={() => onPress('goback')}>
                        <Back width={24} height={24} />
                    </BackButton>
                    <Text>{title}</Text>
                </LeftLayoutWrap>
                <Iconwrap>{sideButtonHandler()}</Iconwrap>
            </GnbLayout>
        </HeaderWrap>
    )
}

const HeaderWrap = styled.View`
    display: flex;
    width: 100%;
    height: 48px;
    padding: 0 16px;
`

const GnbLayout = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 48px;
    background: ${({ theme }) => theme.color.gray12};
`

const BackButton = styled.TouchableOpacity``

const Text = styled.Text`
    color: ${({ theme }) => theme.color.gray1};
    font-size: ${({ theme }) => theme.fontSize.font16};
    font-family: ${({ theme }) => theme.font.notoMedium};
    margin-left: 8px;
`

// left layout
const LeftLayoutWrap = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const Iconwrap = styled.View`
    display: flex;
    flex-direction: row;
`

// button handler
const IconButton = styled.TouchableOpacity`
    padding: 0 8px;
`
