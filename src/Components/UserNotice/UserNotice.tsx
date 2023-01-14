import React, { SetStateAction, useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { useQuery, useQueryClient } from 'react-query'

// components
import { Header } from '../Header/Header'
import Dropdown from '../Popup/Dropdown'
import ImageSlider from '../Common/ImageSlider'
import ImageButton from '../UserNoticeUpload/ImageButton'
import ModalPopup from '../Popup/Modal'

// hooks
import { useDateTimeConvert } from '~/Hooks/useDateTimeConvert'
import { useConvertTags } from '~/Hooks/useConvertText'
import { useAppContext } from '~/Hooks/useContextHook'
import { useMutationHook } from '~/Hooks/useMutationHook'
import useOnLayout from '~/Hooks/useOnLayout'

// data
import { isNotMedropdownList, isMeNoticeDropDown } from '@Data/dropdownData'
import Config from 'react-native-config'
import useFetch from '~/Hooks/useAxiosFetch'

type noticeDataType = {
    id: number
    feaktion_id: number
    notice_title: string
    notice_body: string
    images: string[]
} | null

export default function UserNotice({ navigation, route }: any): JSX.Element {
    // context
    const { getImageUrl, putImageUrl } = useAppContext()

    // route
    const [currentNotice] = useState(route?.params)
    const [currentTime] = useDateTimeConvert(
        currentNotice?.data?.write_date,
        'JustDate'
    )

    // fetch
    const RemoveMutate = useMutationHook('delete')
    const url = `/feaktion/${currentNotice?.fictionId}/notice/${currentNotice?.noticeId}`

    // fetch
    const { data } = useQuery(
        [
            'Notice',
            {
                fiction: currentNotice?.fictionId,
                notice: currentNotice?.noticeId,
            },
        ],
        () =>
            useFetch({
                url,
                method: 'get',
            }),
        { retry: true }
    )

    const queryClient = useQueryClient()
    // hooks
    const [converted, convert] = useConvertTags()
    const [size, getSizeLayout] = useOnLayout('')

    // popup
    const [isPopup, setIsPopup] = useState(false)
    const [modalType, setModalType] = useState({ type: '', modalType: '' })
    const [isModal, setIsModal] = useState<boolean>(false)

    // image
    const [isVisible, setIsVisible] = useState(false)
    const [seletedImage, setSeletedImage] = useState(1)
    const [createdImage, setCreatedImage] = useState<
        { index: number; uri: string }[]
    >([])

    // data
    const [noticeData, setNoticeData] = useState<noticeDataType>(null)

    useEffect(() => {
        convert(noticeData?.notice_body || '')
    }, [noticeData])

    const navibuttonHandler = (type: string): void => {
        if (type === 'goback') navigation.goBack()
        setIsModal(true)
    }

    const modalMoveCtrl = (type: string) => {
        // const {id, feaktion_id} = currentNotice?.data
        if (type === 'remove') {
            setIsPopup(true)
            setModalType({ type: 'NoticeRemove', modalType: 'Popup' })
            // navigation.goBack();
        } // 작품 전체 삭제

        if (type === 'modify') {
            navigation.navigate('UploadFiction', {
                screen: 'UserNoticeUpload',
                params: {
                    type: 'MODIFY',
                    data: noticeData,
                },
            })
        }

        if (type === 'notification') {
            navigation.navigate('UploadFiction', {
                screen: 'UserNoticeUpload',
                params: {
                    data: { feaktion_id: noticeData?.feaktion_id },
                    title: noticeData?.notice_title,
                },
            })
        }

        setIsModal(false)
    }

    const modalHanddler = (modalType: string, select: string): void => {
        if (select === 'confirm') {
            RemoveMutate.mutateAsync({
                url: `/feaktion/${noticeData?.feaktion_id}/notice/${noticeData?.id}`,
                data: {},
            }).then(() => {
                setIsPopup(false)
                navigation.navigate('SideStack', { screen: 'FictionIndex' })
                queryClient.invalidateQueries([
                    'fiction',
                    noticeData?.feaktion_id,
                ])
            })
        }
        setIsPopup(false)
    }

    const imageHandler = (type: string, index: number): void => {
        setIsVisible(true)
        setSeletedImage(index)
    }

    useEffect(() => {
        if (![200, 201].includes(data?.status)) return
        setNoticeData(data?.data?.data)
    }, [data])

    useEffect(() => {
        // image 배열 가공
        const result = noticeData?.images?.map((uri: string, index: number) => {
            return { index, uri: getImageUrl + uri }
        })

        setCreatedImage(result || [])
    }, [noticeData])

    return (
        <>
            <Layout>
                <HeaderWrap onLayout={getSizeLayout}>
                    <Header
                        navigation={navigation}
                        route={{
                            name: 'UserNotice',
                            params: { title: '공지사항' },
                        }}
                        onPress={navibuttonHandler}
                    />
                </HeaderWrap>
                <ScrollWrap>
                    <TitleWrap>
                        <Title>{noticeData?.notice_title || ''}</Title>
                        <DateTitle>{currentTime}</DateTitle>
                    </TitleWrap>
                    <DescWrap>
                        <DescTitle>{converted}</DescTitle>
                    </DescWrap>
                </ScrollWrap>
                <BottomWrap horizontal={true} bounces={true}>
                    <BottomWrapInner>
                        {createdImage?.map(({ uri, index }) => (
                            <ImageButton
                                type="View"
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
            <Dropdown
                data={
                    currentNotice?.isWrite
                        ? isMeNoticeDropDown
                        : isNotMedropdownList
                }
                visible={isModal}
                onClose={() => setIsModal(false)}
                onPress={modalMoveCtrl}
                position={size?.y + size?.height - 12}
                type="smallDropdownPan"
            />
            <ModalPopup
                data={null}
                visible={isPopup}
                onClose={() => setIsPopup(false)}
                onPress={modalHanddler}
                type={modalType?.type}
                modalType={modalType?.modalType}
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

const ScrollWrap = styled.ScrollView`
    flex: 6;
    padding: 0 16px;
`

const TitleWrap = styled.View`
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin: 22px 0;
`

const DescWrap = styled.View``

const Title = styled.Text`
    color: ${({ theme }) => theme.color.gray1};
    font-size: ${({ theme }) => theme.fontSize.font14}; ;
`

const DateTitle = styled.Text`
    color: ${({ theme }) => theme.color.gray3};
    font-size: ${({ theme }) => theme.fontSize.font10};
`

const DescTitle = styled(Title)`
    line-height: 24px;
`

// bottom image

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
