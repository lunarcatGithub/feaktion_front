import { useQuery } from 'react-query'
import useFetch from '~/Hooks/useAxiosFetch'

type NovelsType = {
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

const getQuery = ({ key, url, params, option }: NovelsType) => {
  return useQuery(
    key,
    () => useFetch({ url, method: 'get', data: params }),
    option
  )
}

export const getNovelsAgent = (
  props: NovelsType
): { data: MainDataType; refetch: () => void } | undefined => {
  const resultQuery = getQuery(props)
  const isSuccess = resultQuery.status
  const queryData = resultQuery.data?.data
  // const loginResult = await mutate?.mutateAsync({
  //   url: '/feaktion/novels',
  //   params: { take },
  // })

  if (isSuccess !== 'success') return undefined
  if (resultQuery.data === null) return undefined
  switch (queryData?.statusCode) {
    case 200 || 201:
      return { data: queryData.data, refetch: resultQuery.refetch }

    case 400 || 401:
      return undefined

    case 404:
      return undefined

    case 500 || 501:
      return undefined

    default:
      break
  }
}
