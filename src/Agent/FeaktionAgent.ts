import { useMutation, useQuery } from 'react-query'
import useFetch from '~/Hooks/useAxiosFetch'
import { GenreReturnType } from '~/Utils/genreFilterUtil'

type PropsType = {
  key: [key: string, value?: string | number | {}]
  url: string
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
  | undefined

const getQuery = ({ key, url, params, option }: PropsType) => {
  return useQuery(
    key,
    () => useFetch({ url, method: 'get', data: params }),
    option
  )
}

export const getNovelsAgent = (
  props: PropsType
): { data: MainDataType; refetch: () => void } | undefined => {
  const resultQuery = getQuery(props)
  const isSuccess = resultQuery.status
  const queryData = resultQuery.data?.data

  console.log('getNovelsAgent render test')
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

export const patchhGenreAgent = async ({
  mutate,
  data,
}: PatchGenreType): Promise<GenreDataType> => {
  const resultQuery = await mutate.mutateAsync({
    url: `/user/interest`,
    data,
  })
  const statusCode = resultQuery.status

  if (resultQuery.data === null) return undefined
  switch (statusCode) {
    case 200:
    case 201:
      return { data: resultQuery.data, refetch: resultQuery.refetch }

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
