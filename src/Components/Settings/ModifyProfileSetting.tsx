import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'

// componenst
import InputBundle from '../Common/InputBundle'
import { Header } from '../Header/Header'
import ToastPush from '../Interaction/ToastPush'

// hooks
import useCropImagePicker from '@Hooks/useCropImagePicker'
import { useAppContext } from '~/Hooks/useContextHook'
import { useMutationHook } from '~/Hooks/useMutationHook'

// icons
import Plus from '@Icons/uploadPlus.svg'
import bufferHandler from '~/Utils/bufferConvert'
import imageSend from '~/Utils/imageSend'
import { useQuery, useQueryClient } from 'react-query'
import useFetch from '~/Hooks/useAxiosFetch'

export default function ModifyProfileSetting({ navigation }: any): JSX.Element {
    // store
    const {
        userProfile,
        setUserProfile,
        animationMove,
        setAnimationMove,
        putImageUrl,
        getImageUrl,
    } = useAppContext()

    const [modifyProfile, setModifyProfile] = useState({
        nickName: '',
        intro: '',
    })

    // fetch
    const patchMutate = useMutationHook('patch')

    // fetch
    const userData = useQuery(
        ['myprofile'],
        () =>
            useFetch({
                url: `/user`,
                method: 'get',
            }),
        { retry: true }
    )

    const imageMutate = useMutationHook('put', 'image')
    const queryClient = useQueryClient()

    // hooks
    const [imageUri, cameraImagePickHandler] = useCropImagePicker()

    // get image
    // const [imageUri, setImageUri] = useState<string | undefined>('');

    // button active
    const [buttonActive, setButtonActive] = useState(false)

    // alert Text
    const [alertText, setAlertText] = useState({ type: '', text: '' })

    const textMergeHandler = (type: string, text: string): void => {
        if (type === 'nickName') {
            setModifyProfile({ ...modifyProfile, nickName: text })
        } else if (type === 'intro') {
            setModifyProfile({ ...modifyProfile, intro: text })
        }
    }

    const changeProfileHandler = (): void => {
        if (modifyProfile?.nickName?.length < 2) {
            setAlertText({ type: 'nickName', text: '2자 이상 입력해 주세요' })
            return
        } else if (!modifyProfile.intro) {
            setAlertText({ type: 'intro', text: '자기소개 입력해 주세요' })
            return
        }

        if (!buttonActive) return
        // setSignUpValue(modifyPassword);
        changePassword()
        queryClient.invalidateQueries(['myProfile'])
    }

    const changePassword = async () => {
        // if (
        //   modifyProfile?.nickName === userProfile?.nickname &&
        //   modifyProfile?.intro === userProfile?.intro
        // )
        //   return;

        try {
            const bufferResult = await bufferHandler([
                {
                    index: 0,
                    uri: imageUri?.uri,
                    base64: imageUri?.base64,
                    type: imageUri?.type,
                },
            ])

            const params = {
                nickname: modifyProfile?.nickName,
                intro: modifyProfile?.intro,
                profile: bufferResult[0]?.name, // just one
            }

            await patchMutate
                ?.mutateAsync({ url: `/user`, data: params })
                .then(({ status }) => {
                    if ([200, 201].includes(status)) {
                        setAlertText({ type: '', text: '' })
                        if (animationMove?.loading) return
                        setAnimationMove({
                            type: 'CHANGEDUSERINFORM',
                            value: -80,
                            bool: true,
                            loading: true,
                        })
                    }
                })

            imageSend(bufferResult, putImageUrl, imageMutate)
            queryClient.invalidateQueries(['myProfile']) // index로 돌아갈 때 공지 cache reset
            navigation.goBack()
        } catch (err) {
            console.log(`something patch error ${err}`)
        }
    }

    useEffect(() => {
        // 버튼 active ctrl
        const { nickName, intro } = modifyProfile
        if (nickName.length > 2 && intro.length < 150) {
            setButtonActive(true)
        } else {
            setButtonActive(false)
        }
    }, [modifyProfile])

    useEffect(() => {
        if (!userData) return
        const userInfo = userData?.data
        if ([200, 201].includes(userInfo?.status)) {
            setUserProfile(userInfo?.data?.data)
        }
    }, [userData])

    useEffect(() => {
        setModifyProfile({
            nickName: userProfile.nickname || '',
            intro: userProfile.intro || '',
        })
    }, [userProfile])

    const InputArr = [
        {
            type: 'nickName',
            _type: 'removeBtn',
            secure: false,
            placeholder: '닉네임',
            removeBtn: modifyProfile.nickName.length > 2,
            maxLength: 20,
            value: modifyProfile.nickName,
            alert: alertText,
        },
        {
            type: 'intro',
            _type: 'mutiline',
            secure: false,
            placeholder: '자기소개',
            removeBtn: modifyProfile.intro.length > 2,
            maxLength: 150,
            value: modifyProfile.intro,
            alert: alertText,
        },
    ]

    return (
        <>
            <Layout>
                <HeaderWrap>
                    <Header
                        navigation={navigation}
                        route={{
                            name: 'ModifyProfileSetting',
                            params: { title: '프로필 수정' },
                        }}
                        onPress={() => navigation.goBack()}
                    />
                </HeaderWrap>

                <LayoutInner>
                    <ProfileWrap>
                        <ProfileImageWrap>
                            <ProfileInnerImage>
                                <Profile
                                    source={{
                                        uri:
                                            imageUri?.uri ||
                                            getImageUrl + userProfile?.profile,
                                    }}
                                />
                            </ProfileInnerImage>
                            <ProfileAddButton onPress={cameraImagePickHandler}>
                                <Plus width={20} height={20} />
                            </ProfileAddButton>
                        </ProfileImageWrap>
                    </ProfileWrap>
                    <UserIntroWrap>
                        <InputBundle
                            data={InputArr}
                            onChangeText={textMergeHandler}
                            buttonActive={buttonActive}
                            buttonText={'변경하기'}
                            buttonOnPress={changeProfileHandler}
                        />
                    </UserIntroWrap>
                </LayoutInner>
            </Layout>
            <ToastPush type="CHANGEDUSERINFORM" />
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
    padding: 0 16px;
`

const ProfileWrap = styled.View`
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 25px;
`

const ProfileImageWrap = styled.View`
    position: relative;
`

const ProfileInnerImage = styled.View``

const Profile = styled.Image`
    width: 80px;
    height: 80px;
    border-radius: 50px;
    background: ${({ theme }) => theme.color.gray6};
`

const ProfileAddButton = styled.TouchableOpacity`
    position: absolute;
    bottom: 0;
    right: 0;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    background: ${({ theme }) => theme.color.gray4};
`

const UserIntroWrap = styled.View`
    margin-top: 32px;
`
