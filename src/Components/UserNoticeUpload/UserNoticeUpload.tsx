import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import theme from '@Styles/Theme'
import { Platform } from 'react-native'
import { useQueryClient } from 'react-query'

// components
import { Header } from '../Header/Header'
import ImageSlider from '../Common/ImageSlider'
import ImageButton from './ImageButton'

// icons
import UploadPlus from '@Icons/uploadPlus.svg'

// utils
import bufferHandler from '@Utils/bufferConvert'

// hooks
import useCropImagePicker from '~/Hooks/useCropImagePicker'
import { useMutationHook } from '~/Hooks/useMutationHook'
import { useAppContext } from '~/Hooks/useContextHook'
import imageSend from '~/Utils/imageSend'

// type
type imageType = {
    index: number
    uri: string | undefined
    base64: string | undefined
    type: string
}[]

type imagePromise = {
    index: number
    name: string
    buff: ArrayBufferLike
    type: string
}[]

export default function UserNoticeUpload({
    navigation,
    route,
}: any): JSX.Element {
    // context
    const { putImageUrl } = useAppContext()

    // router
    const [routeData] = useState(route?.params)

    // data
    const [noticeData, setNoticeData] = useState({ title: '', desc: '' })
    const [createdImage, setCreatedImage] = useState<imageType>([])
    const [currentNum, setCurrentNum] = useState(0)
    const [isVisible, setIsVisible] = useState(false)

    const [seletedImage, setSeletedImage] = useState(1)

    //arlert
    const [alert, setAlert] = useState({ type: '', text: '' })

    // hook
    const [imageUri, cameraImagePickHandler] = useCropImagePicker()

    const valueManufacturing = (type: string, text: string): void => {
        setNoticeData({ ...noticeData, [type]: text })
    }

    // fetch
    const postMutate = useMutationHook('post')
    const imageMutate = useMutationHook('put', 'image')
    const patchMutate = useMutationHook('patch')
    const queryClient = useQueryClient()

    const inputData = [
        {
            index: 0,
            value: noticeData?.title,
            type: 'title',
            placeHolder: '공지 제목을 입력해 주세요',
        },
        {
            index: 1,
            value: noticeData?.desc,
            type: 'desc',
            placeHolder: '내용을 입력해 주세요',
        },
    ]

    const removeImageHandler = (num: number): void => {
        const removeData: any = createdImage?.filter(data => {
            if (num !== data?.index) {
                return data
            }
        })
        setCreatedImage(removeData)
    }

    const navigationHandler = async (type: string) => {
        if (type === 'goback') navigation.goBack()

        // return;
        if (type === 'first') {
            // const key = uuid.v4();
            const isOk = await dataSendHandler()
            if (isOk !== 'ok') return
            if (routeData?.type === 'MODIFY') {
                const { feaktion_id, id } = routeData?.data
                const data = {
                    notice_title: noticeData?.title,
                    notice_body: noticeData?.desc,
                    // images:[key]
                }
                patchMutate
                    ?.mutateAsync({
                        url: `/feaktion/${feaktion_id}/notice/${id}`,
                        data,
                    })
                    .then(result => {
                        const { status, data } = result

                        if (![200, 201].includes(status)) return
                        navigation.navigate('UploadFiction', {
                            screen: 'UserNotice',
                            params: { currentType: 'PatchNotice', data },
                        })
                        queryClient.invalidateQueries([
                            'Notice',
                            { fiction: feaktion_id, notice: id },
                        ]) // index로 돌아갈 때 공지 cache reset
                    })
            } else {
                const { feaktion_id } = routeData

                try {
                    const bufferResult = await bufferHandler(createdImage)

                    const data = {
                        notice_title: noticeData?.title,
                        notice_body: noticeData?.desc,
                        images: bufferResult?.map(
                            ({ name }: { name: string }) => name
                        ),
                    }

                    await postMutate
                        ?.mutateAsync({
                            url: `/feaktion/${feaktion_id}/notice`,
                            data,
                        })
                        .then(result => {
                            const { status } = result
                            if (![200, 201].includes(status)) return
                        })

                    imageSend(bufferResult, putImageUrl, imageMutate)

                    navigation.navigate('SideStack', {
                        screen: 'FictionIndex',
                        params: {
                            currentType: 'Notice',
                            data: {},
                        },
                    })
                    queryClient.invalidateQueries(['fiction', feaktion_id]) // index로 돌아갈 때 공지 cache reset
                } catch (err) {
                    console.error(`Something error where upload notice! ${err}`)
                }
            }
        }
    }

    const dataSendHandler = async () => {
        if (noticeData?.title?.length <= 1) {
            setAlert({
                type: 'title',
                text: '제목은 최소 2자 이상 입력해주세요',
            })
            return 'error'
        } else if (noticeData?.desc?.length <= 9) {
            setAlert({
                type: 'desc',
                text: '내용은 최소 10자 이상 입력해주세요',
            })
            return 'error'
        } else {
            return 'ok'
        }
    }

    const imageHandler = (type: string, index: number): void => {
        if (type === 'Select') {
            // image 선택시
            setIsVisible(true)
            setSeletedImage(index)
        } else {
            // image 삭제시
            removeImageHandler(index)
        }
    }

    useEffect(() => {
        if (!imageUri?.uri) return
        setCurrentNum(() => currentNum + 1)
        setCreatedImage([
            ...createdImage,
            {
                index: currentNum,
                uri: imageUri?.uri || undefined,
                base64: imageUri?.base64 || undefined,
                type: imageUri?.type,
            },
        ])
    }, [imageUri])

    useEffect(() => {
        // 글 작성 시작할 때 alert 초기화
        setAlert({ type: '', text: '' })
    }, [noticeData])

    useEffect(() => {
        // 수정할 때 초기 데이터 삽입
        if (routeData?.type === 'MODIFY') {
            setNoticeData({
                title: routeData?.data?.notice_title,
                desc: routeData?.data?.notice_body,
            })
            //   const modifiedImage = routeData?.data?.images((image:string, index:number) => {
            //     return {
            //       index:currentNum,
            //       uri:imageUri?.uri || undefined,
            //       base64:imageUri?.base64 || undefined,
            //       type:imageUri?.type
            //     }
            //   })
            // setCreatedImage(modifiedImage);
        }
    }, [])

    const noticeTitleHandler = () => {
        if (routeData?.type === 'MODIFY') {
            return '공지 수정하기'
        } else {
            return routeData?.title || routeData?.data?.notice_title
        }
    }

    return (
        <>
            <Layout>
                <HeaderWrap>
                    <Header
                        navigation={navigation}
                        route={{
                            name: 'UserNoticeUpload',
                            params: { title: noticeTitleHandler() },
                        }}
                        onPress={navigationHandler}
                    />
                </HeaderWrap>
                <LayoutInner>
                    {inputData?.map(({ index, value, type, placeHolder }) => (
                        <TextInputWrap key={`keys__${index}`} os={Platform.OS}>
                            <TextInput
                                onChangeText={text =>
                                    valueManufacturing(type, text)
                                }
                                value={value}
                                placeholder={placeHolder}
                                placeholderTextColor={theme.color.gray3}
                                multiline={type === 'desc' ? true : false}
                                maxLength={type === 'desc' ? 2000 : 100}
                            />
                            {alert.type === type && alert.text ? (
                                <AlertText>{alert.text}</AlertText>
                            ) : null}
                        </TextInputWrap>
                    ))}
                </LayoutInner>
                <BottomWrap horizontal={true} bounces={true}>
                    <BottomWrapInner>
                        <Button onPress={cameraImagePickHandler}>
                            <UploadPlus width={24} height={24} />
                        </Button>
                        {createdImage?.map(({ index, uri }) => (
                            <ImageButton
                                type="Upload"
                                index={index}
                                uri={uri}
                                onPress={imageHandler}
                            />
                        ))}
                    </BottomWrapInner>
                </BottomWrap>
            </Layout>
            <ImageSlider
                data={createdImage}
                onPress={() => setIsVisible(false)}
                visible={isVisible}
                number={seletedImage}
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
    flex: 6;
    padding: 12px 16px 0 16px;
`

const TextInputWrap = styled.View<{ os: string }>`
    margin: ${({ os }) => (os === 'android' ? `0` : `12px`)};
`

const TextInput = styled.TextInput`
    color: ${({ theme }) => theme.color.gray1};
    font-size: ${({ theme }) => theme.fontSize.font14};
    align-items: center;
`

const BottomWrap = styled.ScrollView`
    flex: 1;
`

const BottomWrapInner = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    margin: 0 8px;
`

const Button = styled.TouchableOpacity`
    width: 80px;
    height: 80px;
    margin: 0 8px;
    border-radius: 4px;
    overflow: hidden;
    background: ${({ theme }) => theme.color.gray6};
    justify-content: center;
    align-items: center;
`

// 경고 텍스트

const AlertText = styled.Text`
    color: ${({ theme }) => theme.color.red2};
    margin: 0 4px;
`
