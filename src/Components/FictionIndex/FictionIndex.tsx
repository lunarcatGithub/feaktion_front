import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import useFetch from '@Hooks/useAxiosFetch'
import { useQuery, useQueryClient } from 'react-query'

// components
import SpreadLayoutButton from '../SpreadLayoutButton'
import { ExtraButton } from '../Button'
import AccordionBundle from '../Common/AccordionBundle'
import IndexCover from '../Common/IndexCover'
import { Header } from '../Header/Header'
import Dropdown from '../Popup/Dropdown'
import ToastPush from '../Interaction/ToastPush'
import ModalPopup from '../Popup/Modal'

// hooks
import useOnLayout from '~/Hooks/useOnLayout'
import {
    useAppContext,
    useUploadContext,
    useViewerContext,
} from '~/Hooks/useContextHook'
import { MethodMytateEnum, useMutationHook } from '@Hooks/useMutationHook'
import useAsyncStorage from '~/Hooks/useAsyncStorage'

// data
import {
    isMedropdownList,
    isNotMedropdownList,
    isMeModalList,
} from '@Data/dropdownData'
import NoContent from '../Common/NoContent'
import { sortButton } from '@Data/fictionIndexData'
import { reportFictionList } from '~/Data/reportData'
import { uploadType } from '~/Store/UploadStore'

export default function FictionIndex({ navigation, route }: any) {
    // context
    const { isWrite, setIsWrite, setCurEpisodeCount, setViewFictionData } =
        useViewerContext()
    const { setUploadFictionId, setCurrentType: setCurrentType } =
        useUploadContext()
    const { genreMaleArr, genreFemaleArr, setAnimationMove } = useAppContext()

    // fetch
    const [fictionId] = useState(route?.params?.fictionId)
    const { data } = useQuery(
        ['fiction', fictionId],
        () => useFetch({ url: `/feaktion/${fictionId}`, method: 'get' }),
        { retry: true }
    )

    const RemoveMutate = useMutationHook(MethodMytateEnum.DELETE)
    const queryClient = useQueryClient()

    // data state
    const [currentSort, setCurrentSort] = useState('latest')
    const [fictionData, setFictionData] = useState<any>()

    const [isModal, setIsModal] = useState<boolean>(false)
    const [genreTags, setGenreTags] = useState<string[]>([])

    // hooks
    const [size, getSizeLayout] = useOnLayout('')
    const [asyncHandler, _result] = useAsyncStorage()

    // popup
    const [isPopup, setIsPopup] = useState(false)
    const [modalType, setModalType] = useState<{
        data: null | any
        type: string
        modalType: string
    }>({ data: null, type: '', modalType: '' })
    const [toastPush, setToastPush] = useState('')

    const naviHandler = (type: string, _id?: number | string) => {
        if (type === 'last') {
            return
            // navigation.navigate('UploadFiction', {screen:'Comment', params:{fictionId}});
        } else if (type === 'notice') {
            // 공지사항 navigation
            if (typeof _id === 'string') return
            const data = fictionData?.feaktion_notice?.filter(
                ({ id }: { id: number }) => id === _id
            )

            navigation.navigate('UploadFiction', {
                screen: 'UserNotice',
                params: {
                    fictionId: data[0]?.feaktion_id,
                    noticeId: data[0]?.id,
                    isWrite,
                },
            })
        } else {
            if (isWrite) {
                // 내 작품일 경우 => 작품 이어쓰기
                navigation.navigate('UploadFiction', {
                    screen: 'FictionEditor',
                    params: {
                        fictionId,
                        title: fictionData?.feaktion_title || '',
                        postData: 'FictionEditorSerise',
                    },
                })
                setCurrentType(uploadType.EPISODE)
            } else {
                // 작품 이어보기
                const sortEpisodeArr = fictionData?.episode.sort(
                    (
                        a: {
                            episode_id: number
                        },
                        b: {
                            episode_id: number
                        }
                    ) => a?.episode_id - b?.episode_id
                )
                navigation.navigate('SideStack', {
                    screen: 'Viewer',
                    params: {
                        currentType: 'Viewer',
                        fictionId,
                        episodeId: sortEpisodeArr[0]?.episode_id,
                    },
                })
            }
        }
    }

    useEffect(() => {
        // view 진입 시 에피소드를 위한 id 부여
        setUploadFictionId(fictionId)
    }, [])

    useEffect(() => {
        // data fetch 관리,

        if ([404, 500].includes(data?.status)) {
            setModalType({ data: null, type: '404error', modalType: 'Popup' })
            setIsPopup(true)

            return
        }

        const datas = data?.data?.data
        datas?.episode?.map((items: any, i: number) => {
            items.id = i + 1
        })
        const episodeList = datas?.episode?.map(
            ({ episode_id }: { episode_id: number }) => episode_id
        )

        setCurEpisodeCount(episodeList) // episode 다음화를 위한 episode list logic
        setFictionData(datas)
        setViewFictionData(datas?.episode) // viewer bottom navi list
        setIsWrite(datas?.isWriter)
    }, [data])

    useEffect(() => {
        setToastPush(route?.params?.postData)
    }, [route?.params])

    useEffect(() => {
        // animation
        if (!['NEWCOVER', 'MODIFYCOVER']?.includes(toastPush)) return
        setAnimationMove({
            type: toastPush,
            value: -130,
            bool: true,
            loading: true,
        })
    }, [route?.params?.postData])

    const accordionDataHandler = (
        type: string,
        value: string | number,
        index?: number
    ): void => {
        if (type === 'sort') {
            if (typeof value === 'number') return
            setCurrentSort(value)
        } else if (type === 'accordion') {
            navigation.navigate('SideStack', {
                screen: 'Viewer',
                params: {
                    currentType: 'Viewer',
                    fictionId,
                    episodeId: value,
                    scroll: index,
                },
            })
        } else if (type === 'longPress') {
            // 향후 기획 변경시 고려
            // if(typeof(value) === 'string')return; // type guard
            // setIsPopup(true);
            // setModalType({data:null, type: 'MoreMenu', modalType:'ModalList'});
            // setSelectEpisodeId(value);
        } else if (type === 'scene') {
            navigation.navigate('SideStack', {
                screen: 'Viewer',
                params: {
                    currentType: 'Viewer',
                    fictionId,
                    episodeId: value,
                    scroll: index,
                },
            })
        }
    }

    useEffect(() => {
        asyncHandler('GET', JSON.stringify(fictionId))
    }, [navigation])

    const modalCtrl = (type: string): void => {
        if (['MODIFYCOVER'].includes(toastPush)) {
            navigation.pop(2)
        }

        if (type === 'goback') {
            // console.log('navigation?.getParent?.dangerouslyGetState', navigation?.getParent?.dangerouslyGetState)
            // cover 생성하고 에피소드로 왔을 때 뒤로가기 할 경우 main으로 이동
            const routeArr: string[] = navigation
                ?.getParent()
                ?.dangerouslyGetState()?.routes

            const resultIndex = routeArr.findIndex(
                (data: any): boolean => data?.name === 'UploadFiction'
            )
            if (resultIndex >= 0) {
                navigation.pop(2)
            } else {
                navigation.goBack()
            }
        }
        if (type === 'second') setIsModal(!isModal)
        if (type === 'first')
            navigation.navigate('Search', { screen: 'LatestSearch' })
    }

    const modalMoveCtrl = (type: string) => {
        setIsModal(false)
        if (type === 'report') {
            setModalType({
                data: reportFictionList,
                type: 'FictionIndex',
                modalType: 'ToastPopup',
            })
            setIsPopup(true)
            return
        }

        if (type === 'remove') {
            // 작품 전체 삭제
            setIsPopup(true)
            setModalType({
                data: null,
                type: 'FictionRemove',
                modalType: 'Popup',
            })
            return
        }

        if (type === 'notification') {
            navigation.navigate('UploadFiction', {
                screen: 'UserNoticeUpload',
                params: {
                    type: 'UploadNotice',
                    feaktion_id: fictionId,
                    title: fictionData?.feaktion_title,
                },
            })
            return
        }

        if (type === 'modify') {
            navigation.navigate('UploadFiction', {
                screen: 'UploadCover',
                params: {
                    fictionId,
                    fictionData,
                    title: fictionData?.feaktion_title,
                    postData: 'Modify',
                },
            })
            setCurrentType(uploadType.FICTIONMODIFY)
            setIsModal(false)
            return
        }
    }

    const modalHandler = (modalType: string, select: string): void => {
        setIsModal(false)
        if (select === 'cancel') {
            setIsPopup(false)
            return
        }

        if (modalType === 'FictionRemove' && select === 'confirm') {
            // 작품 전체 삭제
            RemoveMutate.mutateAsync({
                url: `/feaktion/${fictionId}`,
                data: {},
            }).then(() => {
                setIsPopup(false)
                navigation.navigate('Bottom', { screen: 'Main' })
                queryClient.invalidateQueries(['fiction'])
            })
        }

        if (modalType === '404error' && select === 'confirm') {
            navigation.goBack()
            setIsPopup(false)
        }

        if (modalType === 'MoreMenu') {
            if (select === 'remove') {
                setModalType({
                    data: isWrite ? isMeModalList : isNotMedropdownList,
                    type: 'EpisodeRemove',
                    modalType: 'Popup',
                })
            }
        }

        if (modalType === 'EpisodeRemove' && select === 'confirm') {
            // moremenu에서의 팝업을 여기서 처리
            // RemoveMutate.mutateAsync({url:`/feaktion/${fictionId}/episode/${selectEpisodeId}`, params:{}})
            // .then(() => {
            //   queryClient.invalidateQueries(['fiction', fictionId]);
            //   setIsPopup(false);
            // } );
        }

        if (modalType === 'Layout') setIsPopup(false)
    }

    useEffect(() => {
        if (!fictionData) return
        const filtering = fictionData?.feaktion_genre?.map(
            ({ genre }: { genre: string }) => genre
        )

        const genrePick = [...genreMaleArr, ...genreFemaleArr]
            .map(({ value, title }) => {
                if (filtering?.includes(value)) return title
            })
            .filter(data => data)
        const tagsPick = fictionData?.feaktion_tag?.map(
            ({ tag }: { tag: string }) => {
                if (tag) {
                    return tag
                } else return ''
            }
        )

        setGenreTags(filtering ? [...genrePick, ...tagsPick] : genrePick)
    }, [fictionData])

    useEffect(() => {
        setIsPopup(false)
        setIsModal(false)
    }, [])

    const spreadArr = [
        { index: 0, value: fictionData?.feaktion_description, type: 'text' },
        { index: 1, value: genreTags, type: 'tags' },
        { index: 2, value: fictionData?.feaktion_notice, type: 'notification' },
    ]

    return (
        <>
            <Layout>
                <HeaderWrap onLayout={getSizeLayout}>
                    <Header
                        navigation={navigation}
                        route={{
                            name: 'FictionIndex',
                            params: {
                                title: fictionData?.feaktion_user?.id
                                    ? `@${fictionData?.feaktion_user?.id}`
                                    : '',
                                type: 'Myindex',
                            },
                        }}
                        onPress={modalCtrl}
                    />
                </HeaderWrap>
                <LayoutWrap>
                    <IndexWrap>
                        <IndexCover
                            onPress={naviHandler}
                            fictionData={fictionData}
                            fictionId={fictionId}
                            setToastPush={setToastPush}
                            type="index"
                        />
                    </IndexWrap>
                    {spreadArr?.map(({ index, value, type }) => (
                        <LayoutWrap key={`keyesss__${index}`}>
                            <DescTagsWrap type={type}>
                                <SpreadLayoutButton
                                    value={value}
                                    type={type}
                                    onPress={naviHandler}
                                />
                            </DescTagsWrap>
                            <LineDummy />
                        </LayoutWrap>
                    ))}
                    {fictionData?.episode?.length !== 0 ? (
                        <>
                            <AccordionBundle
                                sort={sortButton}
                                data={fictionData?.episode}
                                onPress={accordionDataHandler}
                                active={currentSort}
                                type="Index"
                            />
                            <Dummy />
                        </>
                    ) : (
                        <NoContent
                            firstText={'에피소드가 없습니다'}
                            secondText={isWrite ? '이야기를 시작해보세요!' : ''}
                            positionTop={100}
                        />
                    )}
                </LayoutWrap>
                {fictionData?.episode?.length === 0 && !isWrite ? null : (
                    <ExtraButton
                        active={true}
                        buttonText={isWrite ? '이어쓰기' : '첫 편 보기'}
                        onPress={naviHandler}
                    />
                )}
            </Layout>
            <Dropdown
                data={isWrite ? isMedropdownList : isNotMedropdownList}
                visible={isModal}
                onClose={() => setIsModal(false)}
                onPress={modalMoveCtrl}
                position={size?.y + size?.height - 12}
                type="smallDropdownPan"
            />
            <ModalPopup
                data={modalType?.data}
                visible={isPopup}
                onClose={() => setIsPopup(false)}
                onPress={modalHandler}
                type={modalType?.type}
                modalType={modalType?.modalType}
            />
            {['PICKOFF', 'PICKON', 'NEWCOVER', 'MODIFYCOVER'].map(
                (items, index) => (
                    <ToastPushWrap key={`keys__${index}`}>
                        <ToastPush type={items} />
                    </ToastPushWrap>
                )
            )}
        </>
    )
}
const ToastPushWrap = styled.View``

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

const LayoutWrap = styled.ScrollView`
    flex: 1;
`

const DescTagsWrap = styled.View<{ type: string }>`
    flex: 1;
    ${({ type }) => {
        if (type === 'text') {
            return `padding:14px 16px;`
        } else {
            return `padding:12px 16px;`
        }
    }}
`

// lines
const LineDummy = styled.View`
    width: 100%;
    border-bottom-width: 1px;
    border-bottom-color: ${({ theme }) => theme.color.gray6};
`

// IndexWrap
const IndexWrap = styled.View`
    margin-top: 24px;
`

// Dummy

const Dummy = styled.View`
    width: 100%;
    padding: 80px 0;
`
