import { useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import bufferHandler from '~/Utils/bufferConvert'
import genreFilterUtil from '~/Utils/genreFilterUtil'
import imageSend from '~/Utils/imageSend'
import { useAppContext, useUploadContext } from './useContextHook'
import { useMutationHook } from './useMutationHook'

type imagePromise = {
    index: number
    name: string
    buff: ArrayBufferLike
    type: string
}[]

type episodeParams = {
    episode_title: string
    writer_comment: string
    scenes: {
        title: string
        scene: string
        image: string
    }[]
}

type props = {
    fictionId: number | string | null
    navigation: any
    divideType: string
    episodeParams?: episodeParams
    sceneBackground?: imagePromise
    removedTags?: number[]
}

function useFictionUploadHook(): [
    dataHandler: (props: props) => void,
    alertText: { type: string; text: string }
] {
    const [alertText, setAlertText] = useState({ type: '', text: '' })

    // stroe
    const {
        setUploadFictionId,
        saveGenre,
        selectGenre,
        bufferResult,
        removeTagsList,
        setBufferResult,
        newFictionCover,
        setNewFictionCover,
        currentType,
        modifyUploadData,
        currentEpisodeId,
        initFictionData,
        setSelectGenre,
        setSaveTags,
    } = useUploadContext()

    const { putImageUrl, oneMorePickGenre } = useAppContext()

    const imageMutate = useMutationHook('put', 'image')
    const postOrPatchMutate = useMutationHook(
        ['FictionModify', 'ShortModify'].includes(currentType)
            ? 'patch'
            : 'post'
    )
    const episodeAsync = useMutationHook(
        currentType === 'EpisodeModify' ? 'patch' : 'post'
    ) // patch도 염두해두기
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!newFictionCover?.image[0]) return
        imageHandler()
    }, [newFictionCover])

    const imageHandler = async () => {
        const image = newFictionCover?.image[0]
        const _bufferResult = await bufferHandler([
            {
                index: 0,
                uri: image?.uri,
                base64: image?.base64,
                type: image?.type,
            },
        ])

        setBufferResult(_bufferResult)
    }

    const dataHandler = async ({
        fictionId,
        navigation,
        divideType,
        episodeParams,
        sceneBackground,
    }: any) => {
        const typeHandler = () => {
            if (['FictionModify', 'Fiction'].includes(currentType)) {
                return 'novel'
            } else if (['ShortModify', 'Short'].includes(currentType)) {
                return 'short'
            }
        }

        const handleType = ['FictionModify', 'ShortModify'].includes(
            currentType
        )
            ? 'MODIFY'
            : 'NEW'

        const params = {
            feaktion_title: newFictionCover?.title,
            feaktion_description: newFictionCover?.desc,
            genres: genreDataHandler({ type: handleType }),
            tags: tagsDataHandler({ type: handleType }),
            feaktion_type: typeHandler(),
            feaktion_pub: newFictionCover?.isPrivate ? 'private' : 'public',
            feaktion_thumb:
                bufferResult[0]?.name || modifyUploadData?.feaktion_thumb || '', // modify
            removed_tags: tagsDataHandler({ type: 'REMOVED' }),
            removed_genres: genreDataHandler({ type: 'REMOVED' }) || [],
        }

        if (divideType === 'cover') {
            if (!selectGenre || selectGenre?.length === 0) {
                setAlertText({
                    type: 'genre',
                    text: '장르는 1개 이상 선택해주세요',
                })
                return
            }

            if (!newFictionCover?.title) {
                setAlertText({
                    type: 'title',
                    text: '작품 제목을 입력해주세요',
                })
                return
            }
        }

        setAlertText({ type: '', text: '' })

        try {
            if (
                ['FictionModify', 'ShortModify', 'Short', 'Fiction'].includes(
                    currentType
                )
            ) {
                await coverHandler(
                    params,
                    navigation,
                    sceneBackground,
                    episodeParams,
                    fictionId
                )
                isSuccessFetching()
                return
            } else if (['Episode', 'EpisodeModify'].includes(currentType)) {
                await episodeFetch(
                    {},
                    navigation,
                    sceneBackground,
                    episodeParams,
                    fictionId
                )
                isSuccessFetching()
                return
            }
        } catch (err) {
            console.log(err)
        }
    }

    const isSuccessFetching = () => {
        setNewFictionCover(initFictionData) // 업로드 이후 커버 데이터 초기화
        setSelectGenre([]) // 업로드 이후 장르 초기화
        setSaveTags([]) // 업로드 이후 태그 초기화
    }

    const coverHandler = async (
        params: {},
        navigation: any,
        sceneBackground: imagePromise,
        episodeParams: episodeParams,
        fictionId: number
    ) => {
        return postOrPatchMutate
            ?.mutateAsync({
                url: `/feaktion${
                    ['FictionModify', 'ShortModify'].includes(currentType)
                        ? '/' + fictionId
                        : ''
                }`,
                data: params,
            })
            .then((data: any) => {
                if ([200, 201].includes(data?.status)) {
                    // success post or patch
                    setUploadFictionId(
                        JSON.stringify(data?.data?.data?.feaktion_id)
                    )

                    // if modify and no change image then active fn
                    if (
                        ['FictionModify', 'ShortModify'].includes(
                            currentType
                        ) &&
                        !bufferResult[0]?.name
                    ) {
                        // 이미지 안바꿨다는 뜻
                    } else {
                        imageSend(bufferResult, putImageUrl, imageMutate)
                    }

                    if (['ShortModify', 'Short'].includes(currentType)) {
                        // Episode handler
                        episodeFetch(
                            data,
                            navigation,
                            sceneBackground,
                            episodeParams,
                            fictionId
                        )
                        return
                    }

                    if (['Fiction', 'FictionModify'].includes(currentType)) {
                        const feaktionId = data?.data?.data?.feaktion_id

                        queryClient.invalidateQueries(['fiction', feaktionId])
                        navigation.navigate('SideStack', {
                            screen: 'FictionIndex',
                            params: {
                                fictionId: JSON.stringify(feaktionId),
                                postData: currentType,
                                isUploaded: currentType,
                            },
                        })
                    }
                }
            })
    }

    const episodeFetch = async (
        data: any,
        navigation: any,
        sceneBackground: any,
        episodeParams: any,
        fictionId: number
    ) => {
        const divideData =
            currentType === 'Short' ? data?.data?.data?.feaktion_id : fictionId // patch도 고려해야함
        const divideUrl =
            currentType === 'EpisodeModify'
                ? `/feaktion/${divideData}/episode/${currentEpisodeId}`
                : `/feaktion/${divideData}/episode`

        episodeAsync
            .mutateAsync({ url: divideUrl, data: episodeParams })
            .then(result => {
                // cover 만들자마자 바로 Episode
                const { data, status } = result

                if (![200, 201].includes(status)) return
                imageSend(sceneBackground, putImageUrl, imageMutate)

                if (
                    [
                        'Short',
                        'ShortModify',
                        'Episode',
                        'EpisodeModify',
                    ].includes(currentType)
                ) {
                    currentType === 'EpisodeModify' &&
                        queryClient.invalidateQueries([
                            'episode',
                            {
                                fiction: divideData,
                                episode: data?.data?.episode_id,
                            },
                        ])

                    navigation.navigate('SideStack', {
                        screen: 'Viewer',
                        params: {
                            fictionId: divideData,
                            episodeId: data?.data?.episode_id,
                            currentType:
                                currentType === 'Short' ? 'Short' : 'Story',
                            isUploaded: currentType,
                        },
                    })
                }
                queryClient.invalidateQueries(['fiction'])
            })
            .catch(err => console.log(err))
    }

    const tagsDataHandler = ({
        type,
    }: {
        type: 'NEW' | 'MODIFY' | 'REMOVED'
    }): string[] | number[] | null => {
        // 수정했을 때 추가된 데이터만 서버로 post
        const originTagsData = modifyUploadData?.feaktion_tag?.map(
            ({ tag }: { tag: string | number }) => tag
        )

        const filtering = newFictionCover?.tag?.filter(value => {
            if (value) {
                return !originTagsData?.includes(value)
            }
        })

        const addTags =
            newFictionCover?.tag ||
            modifyUploadData?.feaktion_tag
                ?.map(({ tag }: { tag: string | number }) => tag)
                .join(' ')

        switch (type) {
            case 'REMOVED':
                return removeTagsList
            case 'NEW':
                return addTags
            case 'MODIFY':
                return filtering

            default:
                return []
        }
    }

    const genreDataHandler = ({
        type,
    }: {
        oneMorePickGenre?: { genre: string; id: number }[]
        type: 'NEW' | 'MODIFY' | 'REMOVED'
    }) => {
        // 수정 삭제 장르 유틸 함수
        const params = genreFilterUtil({
            userSelectData: selectGenre,
            fetchedData: oneMorePickGenre,
            type: 'COVER',
        })

        const genlist = selectGenre?.map(({ value }) => value)

        switch (type) {
            case 'NEW':
                return genlist
            case 'MODIFY':
                return params.genres
            case 'REMOVED':
                return params.removed_genres

            default:
                return []
        }
    }

    return [dataHandler, alertText]
}

export default useFictionUploadHook
