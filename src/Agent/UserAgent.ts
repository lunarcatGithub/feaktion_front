import { useQuery } from 'react-query'
import useFetch from '~/Hooks/useAxiosFetch'

type ProfileType = {
  key: [key: string, value?: string | number | {}]
  url: string
  option?: {}
  params?: {}
}

const getQuery = ({ key, url, params, option }: ProfileType) => {
  return useQuery(
    key,
    () => useFetch({ url, method: 'get', data: params }),
    option
  )
}

export const getUserAgent = (
  props: ProfileType
): { data: any; refetch: () => void } | undefined => {
  const resultQuery = getQuery(props)
  const isSuccess = resultQuery?.status
  const queryData = resultQuery.data?.data

  if (isSuccess !== 'success') return undefined
  switch (queryData?.statusCode) {
    case 200 || 201:
      return { data: queryData?.data, refetch: resultQuery.refetch }

    case 400 || 401:
      return undefined

    case 404:
      return undefined

    case 500 || 501 || 502:
      return undefined

    default:
      break
  }
}
