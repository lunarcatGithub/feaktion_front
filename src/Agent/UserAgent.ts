import { useQuery } from 'react-query'
import useFetch from '~/Hooks/useAxiosFetch'

type ProfileType = {
  key: [key: string, value?: string | number | {}]
  url: string
  option?: {}
  params?: {}
}

export const getUserAgent = ({
  key,
  url,
  params,
  option,
}: ProfileType):
  | { data: any; isAuth: boolean; refetch: () => void }
  | undefined => {
  const resultQuery = useQuery(
    key,
    () => useFetch({ url, method: 'get' }),
    option
  )

  const isSuccess = resultQuery?.status
  const queryData = resultQuery.data?.data

  if (isSuccess !== 'success') return undefined
  switch (queryData?.statusCode) {
    case 200:
    case 201:
      return {
        isAuth: true,
        data: queryData?.data,
        refetch: resultQuery.refetch,
      }

    case 400:
    case 401:
      return undefined

    case 404:
      return undefined

    case 500:
    case 501:
      return { isAuth: false, data: [], refetch: () => {} }

    default:
      return { isAuth: false, data: [], refetch: () => {} }
  }
}
