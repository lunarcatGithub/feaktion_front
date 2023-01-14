import React, { useState, useEffect, ReactElement } from 'react'
import styled from 'styled-components/native'
import { TextInput } from 'react-native'
import theme from '~/Styles/Theme'

// icons
import Back from '@Icons/back.svg'
import Search from '@Icons/search.svg'
import UploadPlus from '@Icons/uploadPlus.svg'
import Notification from '@Icons/notification.svg'
import Gearwheel from '@Icons/gearwheel.svg'
import MoreMenu from '@Icons/moreMenu.svg'
import Down from '@Icons/down.svg'
import Bookmark from '@Icons/bookmark.svg'
import Skeleton from '../Common/Skeleton'

type props = {
    navigation: any
    name: string
    onPress: (type?: string, name?: string) => void
    title?: { title: string }
    onChangeText?: () => void
}

export default function GoBackHeader({
    navigation,
    name,
    title,
    onPress,
    onChangeText,
}: props): JSX.Element {
    // console.log('title', title)
    // console.log('name', name)
    const [headerTitle, setHeaderTitle] = useState<string | undefined>('')
    const [inputText, setInputText] = useState<ReactElement<TextInput>>()
    const confirm = ['UploadCover', 'UserNoticeUpload', 'FictionScene']

    const secondBtn = [
        'UploadCoverEdit',
        'FictionSceneModify',
        'EditorWorkCheck',
        'Preview',
        'MyFictionList',
        'FictionIndex',
        'UserBoard',
    ]

    const uploadBtn = [
        'UploadCoverEdit',
        'FictionSceneModify',
        'EditorWorkCheck',
    ]

    const searchBtn = [
        'uploadBtn',
        'MyFictionList',
        'FictionIndex',
        'UserBoard',
    ]

    const sideButtonHandler = () => {
        if (['Notification', 'Comment'].includes(name)) {
            return <></>
        } else {
            return (
                <>
                    <FirstButton
                        onPress={() => pressIconHandler('first', name)}>
                        {firstButtonHandler()}
                    </FirstButton>
                    {secondBtn.includes(name) ? (
                        <SecondButton
                            styling={uploadBtn.includes(name)}
                            onPress={() => pressIconHandler('second', name)}>
                            {secondButtonHandler()}
                        </SecondButton>
                    ) : null}
                </>
            )
        }
    }

    const firstButtonHandler = () => {
        if (name === 'MyBoard') {
            return <Gearwheel width={24} height={24} />
        } else if (searchBtn.includes(name)) {
            return <Search width={24} height={24} />
        } else if (confirm.includes(name)) {
            return <TextBtn type="active">완료</TextBtn>
        } else if (secondBtn.includes(name)) {
            return <TextBtn>{fictionUploadTextHandler(name)}</TextBtn>
        } else if (name === 'Viewer') {
            // return <Bookmark width={24} height={24} />
            return <MoreMenu width={24} height={24} />
        } else if (['UserNotice', 'MyViewer']?.includes(name)) {
            return <MoreMenu width={24} height={24} />
        } else if (
            ['FictionEditorShort', 'FictionEditorSerise'].includes(name)
        ) {
            return <TextBtn>투고하기</TextBtn>
        } else if (name === 'SHORTMODIFY') {
            return <TextBtn>수정하기</TextBtn>
        } else {
            return <></>
        }
    }

    const moreMenuList = ['OtherFictionList', 'FictionIndex', 'SavedWork']

    const secondButtonHandler = () => {
        if (uploadBtn.includes(name)) {
            return <TextBtn type="active">완료</TextBtn>
        } else if (name === 'MyFictionList') {
            return <UploadPlus width={24} height={24} />
        } else if (moreMenuList.includes(name)) {
            return <MoreMenu width={24} height={24} />
        } else if (name === 'UserBoard') {
            return <Notification width={24} height={24} />
        } else if (name === 'Preview') {
            return <TextBtn type="active">투고하기</TextBtn>
        }
    }

    const fictionUploadTextHandler = (name: string): string => {
        if (name === 'EditorWorkCheck' || name === 'Preview') {
            return '임시저장'
        } else if (['FictionSceneModify', 'UploadCoverEdit'].includes(name)) {
            return '삭제'
        } else {
            return ''
        }
    }

    const searchList = [
        'Search',
        'MyFictionList',
        'ContentsArchive',
        'OtherBoard',
    ]

    const pressIconHandler = (position: string, navi: string) => {
        // 단순 navigation

        if (position === 'first' && searchList.includes(navi)) {
            // include search
            navigation.navigate('Search')
        } else {
            onPress(position, navi)
        }
    }

    useEffect(() => {
        if (name === 'ContentsArchive') {
            setHeaderTitle('보관함')
        } else if (name === 'ModifyPasswordSetting') {
            setHeaderTitle('비밀번호 변경')
        } else if (name === 'ModifyProfileSetting') {
            setHeaderTitle('프로필 수정')
        } else if (name === 'Search') {
            setInputText(<InputText />)
        } else if (name === 'Notification') {
            setHeaderTitle('알림')
        } else if (['FictionEditor', 'NovelSaved']?.includes(name)) {
            setHeaderTitle('')
        } else {
            setHeaderTitle(title?.title)
        }
    }, [name, title])

    const skeletonHandler = () => {
        if (headerTitle) {
            return <Text>{headerTitle}</Text>
        } else {
            if (['FictionEditorShort', 'Search']?.includes(name)) {
                return
            } else {
                return <Skeleton width={150} height={26} />
            }
        }
    }

    const FictionEditorHandler = () => {
        if (!title?.title) return <Skeleton width={150} height={26} />
        return (
            <GeneralButton onPress={() => onPress('')} activeOpacity={1}>
                <TextWrap>
                    <Text numberOfLines={1}>{title?.title}</Text>
                </TextWrap>
                <DownWrap>
                    <Down width={16} height={16} />
                </DownWrap>
            </GeneralButton>
        )
    }

    return (
        <GnbLayout>
            <ButtonTextWrap>
                <BackButton onPress={() => onPress('goback', name)}>
                    <Back width={24} height={24} />
                </BackButton>
                {['FictionEditor'].includes(name) && FictionEditorHandler()}
                {skeletonHandler()}
                {inputText ? (
                    <InputTextWrap>
                        <InputText
                            autoFocus={true}
                            placeholder="검색"
                            placeholderTextColor={`${theme.color.gray2}`}
                            onChangeText={onChangeText}
                        />
                    </InputTextWrap>
                ) : null}
            </ButtonTextWrap>
            <Iconwrap>{sideButtonHandler()}</Iconwrap>
        </GnbLayout>
    )
}

const GnbLayout = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 48px;
    background: ${({ theme }) => theme.color.gray12};
    padding: 0 16px;
`
const ButtonTextWrap = styled.View`
    flex-direction: row;
    align-items: center;
    flex: 1;
`

const BackButton = styled.TouchableOpacity``

const TextWrap = styled.View`
    padding-right: 20px;
`

const Text = styled.Text`
    color: ${({ theme }) => theme.color.gray1};
    font-size: ${({ theme }) => theme.fontSize.font16};
    font-family: ${({ theme }) => theme.font.notoMedium};
    letter-spacing: 0.25px;
    margin-left: 8px;
`

const Iconwrap = styled.View`
    display: flex;
    flex-direction: row;
`

const FirstButton = styled.TouchableOpacity`
    padding: 0 8px;
`

const SecondButton = styled(FirstButton)<{ styling: boolean }>`
    padding: 0;
    margin-left: ${({ styling }) => (styling ? `12px` : `0px`)};
`

const GeneralButton = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

const InputTextWrap = styled.View`
    flex: 1;
    justify-content: center;
`

const InputText = styled.TextInput`
    margin-left: 8px;
    color: ${({ theme }) => theme.color.gray1};
    font-size: ${({ theme }) => theme.fontSize.font14};
`

const TextBtn = styled.Text<{ type?: string }>`
    color: ${({ theme, type }) =>
        type === 'active' ? theme.color.purple4 : theme.color.gray3};
    font-size: ${({ theme }) => theme.fontSize.font14};
    font-family: ${({ theme }) => theme.font.notoMedium};
    line-height: 18px;
`

// down button
const DownWrap = styled.View`
    margin-left: 8px;
`
