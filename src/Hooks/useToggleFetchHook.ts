import { useEffect, useState } from 'react'
import { UseMutationResult, useQueryClient } from 'react-query'

// hooks
import { MethodMytateEnum, useMutationHook } from '~/Hooks/useMutationHook'

type props = {
    type: 'like' | 'pick'
    initid: number | null
}

export default function useToggleFetchHook({
    type,
    initid,
}: props): [
    like: boolean,
    likeBtnHandler: (fictionId: number, episodeId?: number) => void,
    PostMutate: any
] {
    const queryClient = useQueryClient()

    // useState
    const [toggle, setToggle] = useState(false)
    const [currentMutate, setCurrentMutate] = useState<MethodMytateEnum>(
        MethodMytateEnum.DELETE
    )
    const [targetId, setTargetId] = useState(0)

    // fetch
    const PostMutate = useMutationHook(currentMutate)

    const likeBtnHandler = (fictionId: number, episodeId?: number): void => {
        if (PostMutate?.isLoading) return
        let url = ''
        let data: {} = {}

        if (type === 'pick') {
            if (toggle) {
                // 좋아요 해제
                url = `/feaktion/favorite`
                data = { favorite_id: initid }
            } else {
                // 좋아요
                url = `/feaktion/${fictionId}/favorite`
            }
        } else if (type === 'like') {
            url = `/feaktion/${fictionId}/episode/${episodeId}/like`
            data = { like_id: initid || null }
        }

        PostMutate.mutateAsync({ url, data }).then(result => {
            const {
                data: { data },
                status,
            } = result
            if (![200, 201].includes(status)) return
            setToggle(!toggle)
            setTargetId(data?.like_id)

            if (type === 'like') {
                queryClient.invalidateQueries([
                    'episode',
                    { fiction: fictionId, episode: episodeId },
                ])
            } else {
                queryClient.invalidateQueries(['fiction', fictionId])
            }
        })
    }

    useEffect(() => {
        if (!initid) return
        setTargetId(initid || 0)
        setToggle(true)
    }, [initid])

    useEffect(() => {
        // like detect
        setCurrentMutate(
            toggle ? MethodMytateEnum.DELETE : MethodMytateEnum.POST
        )
    }, [toggle])

    return [toggle, likeBtnHandler, PostMutate]
}
