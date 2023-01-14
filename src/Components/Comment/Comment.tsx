import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'

// components
import { Header } from '../Header/Header'
import { InputText } from '../Input'
import CommentUser from './CommentUser'
import { Line100 } from '~/Symbols/Line100'

// hooks
import { useMutationHook } from '~/Hooks/useMutationHook'
import { useAppContext, useViewerContext } from '~/Hooks/useContextHook'

// store
import ToastPush from '../Interaction/ToastPush'
import NoContent from '../Common/NoContent'
import Dropdown from '../Popup/Dropdown'

// data
import { isNotMedropdownList, isMeModalList } from '@Data/dropdownData'
import ModalPopup from '../Popup/Modal'
import { useQuery, useQueryClient } from 'react-query'
import useInfinityScroll from '~/Hooks/useInfinityScroll'
import { RefObject } from 'react'
import { Platform, TextInput } from 'react-native'
import { reportFictionList } from '~/Data/reportData'
import useFetch from '~/Hooks/useAxiosFetch'

type commentType = {
    comment_id: number
    user_id: number | string
    comment_body: string
    comment_updatedate: Date
}[]

type modalData = { index: number; desc: string; value: string }[] | null

export default function Comment({ navigation, route }: any): JSX.Element {
    // modal
    const [isModal, setIsModal] = useState(false) // small modal
    const [isBigModal, setIsBigModal] = useState(false) // big modal
    const [layoutXY, setLayoutXY] = useState(0)
    const [currentCommentId, setCurrentCommentId] = useState(0)
    const [dropDownData, setDropDownData] = useState<
        {
            index: number
            desc: string
            value: string
        }[]
    >()

    const [modalType, setModalType] = useState<{
        data: modalData
        type: string
        modalType: string
    }>({
        data: null,
        modalType: 'popup',
        type: 'FictionRemove',
    })

    // store
    const { episodePostId, fictionPostId, viewData } = useViewerContext()
    const { animationMove, setAnimationMove } = useAppContext()

    // value
    const [commentValue, setCommentValue] = useState('')
    const [currentStack] = useState(route?.name)
    const [commentMode, setCommentMode] = useState<'post' | 'delete' | 'patch'>(
        'post'
    )

    // hooks
    const [scrollComment, getCommentData, page, setPage] = useInfinityScroll(10)

    // fetch
    const { data, refetch } = useQuery(
        ['episodeComment', { fiction: fictionPostId, episode: episodePostId }],
        () =>
            useFetch({
                url: `/feaktion/${fictionPostId}/episode/${episodePostId}/comment`,
                method: 'get',
            }),
        { retry: true }
    )

    const postMutate = useMutationHook(commentMode)
    const queryClient = useQueryClient()

    // comment data
    const [commentData, setCommentData] = useState<commentType>([])

    // ref
    const commentRef: RefObject<TextInput> = useRef(null)

    const reactHandler = (
        type: string,
        isMe: boolean,
        position = 0,
        id = 0
    ): void => {
        if (type === 'Reply') {
            navigation.navigate('UploadFiction', { screen: 'Reply' })
        } else if (type === 'Master') {
            return
        } else if (type === 'More') {
            // modal control
            setLayoutXY(position)
            setIsModal(true)
            setCurrentCommentId(id)
            setDropDownData(isMe ? isMeModalList : isNotMedropdownList)
        }
    }

    const commentModalCtrl = (type: string) => {
        if (type === 'remove') removeComment() // remove comment
        if (type === 'modify') modifyComment() // modify comment
        if (type === 'report') {
            // report comment
            setModalType({
                data: reportFictionList,
                type: 'CommentReport',
                modalType: 'ToastPopup',
            })
            setIsBigModal(true)
        }
        return
    }

    const removeComment = () => {
        // before remove comment
        setCommentMode('delete')
        setModalType({ data: null, type: 'CommentRemove', modalType: 'Popup' })
        setIsBigModal(true)
        setIsModal(false)
    }

    const modifyComment = () => {
        // modify
        setIsModal(false)
        setCommentMode('patch')

        scrollComment?.map(
            ({
                comment_id,
                comment_body,
            }: {
                comment_id: number
                comment_body: string
            }) => {
                if (comment_id === currentCommentId) {
                    commentRef?.current?.focus()
                    setCommentValue(comment_body)
                }
            }
        )
    }

    const modalHandler = (type: string, trigger: string) => {
        // remove and patch cancel comment
        if (type === 'CommentRemove' && trigger === 'confirm') {
            handleCommentData('delete')
        } else if (type === 'CommentPatchCancel') {
            if (trigger === 'confirm') {
                setCommentMode('post')
                setCommentValue('')
            } else return
        } else if (type === 'ToastPopup') {
            // 향후 개발
        }
        setIsModal(false)
        setIsBigModal(false)
    }

    const navigationHandler = (type: string) => {
        if (type === 'goback') navigation.goBack()
    }

    const submitComment = (type: string) => {
        if (animationMove.loading) return
        if (type === 'enter') {
            if (commentMode === 'post') {
                if (commentValue?.length <= 1) {
                    if (animationMove.loading) return
                    try {
                        setAnimationMove({
                            type: 'COMMENTLENGTH',
                            value: -130,
                            bool: true,
                            loading: true,
                        })
                    } catch {
                        throw Error('toast animation error')
                    }
                    return
                } else {
                    handleCommentData('post')
                }
            } else if (commentMode === 'patch') {
                handleCommentData('patch')
            }
        }
    }

    const handleCommentData = (type: string): void => {
        let params
        let url
        let toast: string
        if (type === 'post') {
            params = { comment_body: commentValue }
            url = `/feaktion/${fictionPostId}/episode/${episodePostId}/comment`
            toast = 'SUCCESSCOMMENT'
        } else if (type === 'delete') {
            params = {}
            url = `/feaktion/${fictionPostId}/episode/${episodePostId}/comment/${currentCommentId}`
            toast = 'REMOVECOMMENT'
        } else {
            params = { comment_body: commentValue }
            url = `/feaktion/${fictionPostId}/episode/${episodePostId}/comment/${currentCommentId}`
            toast = 'PATCHCOMMENT'
        }

        postMutate
            ?.mutateAsync({ url, params })
            .then(({ data: { data }, status }) => {
                if (type === 'post') {
                    if ([200, 201].includes(status)) {
                        // const resultData = {
                        //   comment_id:data?.comment_id,
                        //   user_id:data?.user_id,
                        //   comment_body:data?.comment_body,
                        //   comment_updatedate:data?.comment_updatedate
                        // };
                        // setCommentData([resultData, ...commentData]);
                        // queryClient?.invalidateQueries(['episodeComment']);
                    }
                } else if (type === 'delete') {
                    const result = commentData?.filter(
                        ({ comment_id }) => comment_id !== currentCommentId
                    )
                    setCommentData(result)
                }

                setCommentMode('post')
                setCommentValue('') // 전송 후 input text 제거
                setIsBigModal(false)
            })
            .then(() => {
                // setCommentData([])
                refetch()
                // queryClient?.invalidateQueries(['episodeComment']);
                queryClient?.invalidateQueries([
                    'episode',
                    { fiction: fictionPostId, episode: episodePostId },
                ])
                setAnimationMove({
                    type: toast,
                    value: -130,
                    bool: true,
                    loading: true,
                })
            })
    }

    const patchFocusHandler = () => {
        if (commentMode === 'patch') {
            setModalType({
                data: null,
                type: 'CommentPatchCancel',
                modalType: 'Popup',
            })
            setIsBigModal(true)
            setIsModal(false)
        }
    }

    useEffect(() => {
        if (![200, 201].includes(data?.status)) return
        setCommentData(data?.data?.data)
    }, [data?.data?.data])

    const reachDetectHandle = () => {
        // infinyscroll handle
        setPage(() => page + 1)
    }

    useEffect(() => {
        if (!commentData) return
        getCommentData(commentData)
    }, [commentData])

    const dropdownPosition = () => {
        return Platform.OS === 'ios' ? 80 : 100
    }

    const ReplyForm = () => {
        if (currentStack === 'Comment') return

        return (
            <>
                <ReplyWrap>
                    <CommentUser
                        item={scrollComment}
                        onPress={reactHandler}
                        type={'Master'}
                    />
                </ReplyWrap>
                <Line100 top={18} bottom={24} />
            </>
        )
    }

    return (
        <>
            <Layout>
                <HeaderWrap>
                    <Header
                        navigation={navigation}
                        route={{
                            name: 'Comment',
                            params: {
                                title: `댓글 (${commentData?.length || 0})`,
                            },
                        }}
                        onPress={navigationHandler}
                    />
                </HeaderWrap>
                {scrollComment?.length === 0 ? (
                    <NoContent
                        firstText="댓글이 없습니다"
                        secondText="첫 댓글을 달아보세요!"
                    />
                ) : null}
                {ReplyForm()}
                <FlatList
                    automaticallyAdjustContentInsets={false}
                    contentContainerStyle={{
                        paddingVertical: 24,
                    }}
                    data={scrollComment}
                    decelerationRate="fast"
                    keyExtractor={(_, i) => `pages__${i}`}
                    renderItem={({ item }) => (
                        <ContentWrap>
                            <CommentUser
                                item={item}
                                onPress={reactHandler}
                                type={currentStack}
                            />
                        </ContentWrap>
                    )}
                    snapToAlignment="start"
                    showsHorizontalScrollIndicator={false}
                    onEndReached={reachDetectHandle}
                    onEndReachedThreshold={1}
                />
                <>
                    <InputText
                        _ref={commentRef}
                        secure={false}
                        placeholder="댓글쓰기"
                        removeBtn={false}
                        maxLength={300}
                        onChangeText={setCommentValue}
                        onPress={submitComment}
                        value={commentValue}
                        autoFocus={true}
                        multiline={true}
                        onEndEditing={patchFocusHandler}
                        type="enter"
                    />
                </>
            </Layout>
            <Dropdown
                data={dropDownData}
                visible={isModal}
                onClose={() => setIsModal(false)}
                onPress={commentModalCtrl}
                position={layoutXY + dropdownPosition()}
                type="smallDropdownPan"
                modalType="general"
            />
            <ModalPopup
                data={modalType?.data}
                visible={isBigModal}
                onClose={() => setIsBigModal(false)}
                onPress={modalHandler}
                type={modalType?.type}
                modalType={modalType?.modalType}
            />
            {[
                'COMMENTLENGTH',
                'SUCCESSCOMMENT',
                'REMOVECOMMENT',
                'PATCHCOMMENT',
            ].map((items, index) => (
                <ToastPushWrap key={`keys__${index}`}>
                    <ToastPush type={items} />
                </ToastPushWrap>
            ))}
        </>
    )
}
const ToastPushWrap = styled.View``

const Layout = styled.View`
    position: relative;
    flex: 1;
    flex-direction: column;
    background: ${({ theme }) => theme.color.gray12};
`

// header
// header - tab
const HeaderWrap = styled.View`
    display: flex;
    width: 100%;
    height: 48px;
`

const ReplyWrap = styled.View`
    padding: 24px 16px 0 16px;
`

const FlatList = styled.FlatList`
    flex: 1;
    padding: 0 16px;
`

const ContentWrap = styled.View`
    padding: 12px 0;
`
