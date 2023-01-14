import React, { useEffect, useState } from 'react'

// hooks
import ViewContent from './ViewContent'
import useAsyncStorage from '~/Hooks/useAsyncStorage'
import { useViewerContext } from '~/Hooks/useContextHook'
import { useQuery } from 'react-query'
import useFetch from '~/Hooks/useAxiosFetch'
import {
    getFeakitonEpisode,
    getUploadedCoverAgent,
} from '~/Agent/FeaktionAgent'

type curReadItems = {
    fictionId: number
    episodeId?: number
    isRead: [{ read: number; episodeId: number }]
}

export default function View({ navigation, route }: any) {
    // store
    const {
        setEpisodePostId,
        episodePostId,
        adjustViewText,
        setAdjustViewText,
    } = useViewerContext()

    // route
    const {
        currentType,
        fictionId,
        episodeId,
        previewData,
        scroll,
        isUploaded,
    } = route?.params
    // 단편 view
    // 시리즈 view
    // 미리보기 view

    const [currentPage] = useState(currentType)
    const [currentFictionId] = useState(fictionId)
    const [currentEpisodeId] = useState(episodeId)
    const [currentScroll] = useState(scroll)
    const [isRead, setIsRead] = useState<any>(undefined)
    const [asyncHandler, _result] = useAsyncStorage()
    const [optAsyncHandler, _Optresult] = useAsyncStorage()
    const [curReadItems, setCurReadItems] = useState<curReadItems>()

    // fetch
    const fictionData = getUploadedCoverAgent({
        fictionId,
        option: { retry: true, enabled: currentType !== 'Preview' },
    })

    const fictions = fictionData?.data // cover data만 추출
    const epiId = fictions?.episode[0]?.episode_id // cover data 내의 episode id 추출

    const episodeData = getFeakitonEpisode({
        fictionId,
        episodeId: epiId,
        option: {},
    })

    // const episodeData = useQuery(
    //     [
    //         'episode',
    //         {
    //             fiction: fictionId,
    //             episode: episodePostId || episodeId || epiId,
    //         },
    //     ],
    //     () =>
    //         useFetch({
    //             url: `/feaktion/${fictionId}/episode/${
    //                 episodePostId || episodeId || epiId
    //             }`,
    //             method: 'get',
    //         }),
    //     { retry: true, enabled: episodePostId || epiId ? true : false }
    // )

    // useEffect(() => {
    //     episodeData?.refetch()
    // }, [epiId])

    // store
    useEffect(() => {
        asyncHandler('GET', JSON.stringify(fictionId))
        optAsyncHandler('GET', 'textOpt')
    }, [])

    useEffect(() => {
        if (!_result) return
        const parseData = JSON.parse(_result?.result)
        const lastParse = JSON.parse(parseData)
        setIsRead(lastParse)
    }, [_result])

    useEffect(() => {
        // 세팅한 초기 text opt 적용

        if (_Optresult) {
            const storageText = JSON.parse(JSON.parse(_Optresult?.result))
            setAdjustViewText({ ...adjustViewText, ...storageText })
        } else {
            setAdjustViewText(adjustViewText)
        }
    }, [_Optresult])

    useEffect(() => {
        setEpisodePostId(episodeId || epiId)
    }, [episodeId, epiId])

    // useEffect(() => {
    //   // 읽었는지 여부
    //   if (!episodePostId) return;
    //   // if(!isRead) return;

    //   const alreadyFilter = isRead?.isRead?.map(
    //     ({ episodeId }: { episodeId: number }) => episodeId,
    //   );
    //   if (alreadyFilter?.includes(episodePostId)) return;

    //   if (isRead?.isRead?.length === 0 || !isRead) {
    //     setCurReadItems({
    //       fictionId,
    //       isRead: [{ read: 0, episodeId: episodePostId }],
    //     });
    //   } else {
    //     isRead?.isRead?.map((items: curReadItems) => {
    //       if (items?.episodeId !== episodePostId) {
    //         // return
    //         setCurReadItems({
    //           fictionId,
    //           isRead: [...isRead?.isRead, { read: 0, episodeId: episodePostId }],
    //         });
    //       } else return;
    //     });
    //   }
    // }, [episodePostId, isRead]);

    useEffect(() => {
        if (!curReadItems) return
        asyncHandler(
            'SET',
            JSON.stringify(fictionId),
            JSON.stringify(curReadItems)
        )
    }, [isRead, curReadItems])
    return (
        <>
            {currentType !== 'Preview' ? (
                <ViewContent
                    navigation={navigation}
                    coverData={fictions}
                    fictionId={currentFictionId}
                    currentType={currentType}
                    episodeId={
                        currentPage === 'Short' ? episodeId : currentEpisodeId
                    }
                    scroll={currentScroll}
                    // isMe={fictions?.isWriter}
                    data={episodeData?.data}
                    isUploaded={isUploaded}
                />
            ) : (
                <ViewContent
                    navigation={navigation}
                    data={previewData}
                    fictionId={fictionId}
                    episodeId={episodeId}
                    currentType={currentType}
                />
            )}
        </>
    )
}
