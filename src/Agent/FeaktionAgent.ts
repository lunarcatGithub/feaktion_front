import { useMutation, useQuery } from 'react-query'
import useFetch from '~/Hooks/useAxiosFetch'
import { GenreReturnType } from '~/Utils/genreFilterUtil'

type PropsType = {
    option?: {}
    params?: {}
}

export type MainDataType = {
    recent: {}
    interest_genres: {}
    novels: {}
    shorts: {}
} | null

export type GenreDataType =
    | {
          data: {}
          refetch: () => void
      }
    | {}

// const getQuery = ({ params, option }: PropsType) => {
//   return useQuery(
//     ['fiction'],
//     () => useFetch({ url: '/feaktion', method: 'get', data: params }),
//     option
//   )
// }

export const getNovelsAgent = ({
    params,
    option,
}: PropsType): { data: MainDataType; refetch: () => void } | undefined => {
    const resultQuery = useQuery(
        ['fiction'],
        () => useFetch({ url: '/feaktion', method: 'get', data: params }),
        option
    )
    const isSuccess = resultQuery.status
    const queryData = resultQuery.data?.data

    if (isSuccess !== 'success') return undefined
    if (resultQuery.data === null) return undefined
    switch (queryData?.statusCode) {
        case 200:
        case 201:
            return { data: queryData.data, refetch: resultQuery.refetch }

        case 400:
        case 401:
            return undefined

        case 404:
            return undefined

        case 500:
        case 501:
            return undefined

        default:
            break
    }
}

type PatchGenreType = {
    mutate: any
    data: GenreReturnType
}

export const patchGenreAgent = async ({
    mutate,
    data,
}: PatchGenreType): Promise<GenreDataType> => {
    const resultQuery = await mutate.mutateAsync({
        url: `/user/interest`,
        data,
    })
    const statusCode = resultQuery.status

    if (resultQuery.data === null) return {}
    switch (statusCode) {
        case 200:
        case 201:
            return { data: resultQuery.data, refetch: resultQuery.refetch }

        case 400:
        case 401:
            return {}

        case 404:
            return {}

        case 500:
        case 501:
            return {}

        default:
            return {}
    }
}

export const getUploadedCoverAgent = ({ fictionId, option }: any) => {
    const resultQuery: any = useQuery(
        ['fiction', fictionId],
        () => useFetch({ url: `/feaktion/${fictionId}`, method: 'get' }),
        option
    )

    const isSuccess = resultQuery.status
    const queryData = resultQuery.data
    if (isSuccess !== 'success') return {}
    switch (queryData.status) {
        case 200:
        case 201:
            return { data: queryData.data.data, refetch: queryData.refetch }

        case 400:
        case 401:
            return {}

        case 404:
            return {}

        case 500:
        case 501:
            return {}

        default:
            break
    }
}

export const getReadFeaktionAgent = async ({ mutate, option, url }: any) => {
    // const resultQuery: any = useQuery(['readed'], () =>
    //   useFetch({ url: `/feaktion/readed`, method: 'get' }),
    //   option
    // )

    const resultQuery = await mutate.mutateAsync({
        url,
    })

    const statusCode = resultQuery.status

    if (resultQuery.data === null) return {}
    switch (statusCode) {
        case 200:
        case 201:
            return { data: resultQuery.data, refetch: resultQuery.refetch }

        case 400:
        case 401:
            return {}

        case 404:
            return {}

        case 500:
        case 501:
            return {}

        default:
            break
    }
}

export const getFeakitonEpisode = ({ fictionId, episodeId }: any) => {
    const resultQuery: any = useQuery(
        ['episode', { fictionId, episodeId }],
        () =>
            useFetch({
                url: `/feaktion/${fictionId}/episode/${episodeId}`,
                method: 'get',
            }),
        { retry: true, enabled: episodeId ? true : false }
    )

    const isSuccess = resultQuery.status
    const queryData = resultQuery.data
    console.log('queryData', queryData)
    if (isSuccess !== 'success') return {}
    switch (queryData.status) {
        case 200:
        case 201:
            return { data: queryData.data.data, refetch: queryData.refetch }

        case 400:
        case 401:
            return {}

        case 404:
            return {}

        case 500:
        case 501:
            return {}

        default:
            break
    }
}
