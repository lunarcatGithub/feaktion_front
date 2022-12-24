import { useMutation } from 'react-query'
import useFetch from './useAxiosFetch'

type methodType = 'get' | 'post' | 'delete' | 'patch' | 'put'

export default function useMutationHook(
  method: methodType,
  type?: 'image' | ''
): any {
  return useMutation(
    ({
      url,
      params,
      data,
      headers,
    }: {
      url: string
      params?: {} | FormData | null
      data?: {}
      headers?: any
    }) => useFetch({ url, method, type, headers, params, data }),
    {
      onMutate: params => {
        console.log('onMutate', params)
        return params
        // variable : {loginId: 'xxx', password; 'xxx'}
      },
      onError: (error, params, context) => {
        console.log('error', error, params)

        // error
      },
      onSuccess: (data, params, context) => {
        console.log('success', data, params, context)
      },
      onSettled: () => {
        console.log('end')
      },
    }
  )
}
