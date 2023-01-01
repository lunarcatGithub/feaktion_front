import { useMutation } from 'react-query'
import useFetch from './useAxiosFetch'

export enum MethodMytateEnum {
  GET = 'get',
  POST = 'post',
  DELETE = 'delete',
  PATCH = 'patch',
  PUT = 'put',
}
export type mutateCallbackType = {
  url: string
  params?: {} | FormData | null
  data?: {}
  headers?: any
}

export function useMutationHook(
  method: MethodMytateEnum,
  type?: 'image' | ''
): any {
  return useMutation(
    ({ url, params, data, headers }: mutateCallbackType) =>
      useFetch({ url, method, type, headers, params, data })
    // {
    //   onMutate: params => {
    //     console.log('onMutate', params)
    //     return params
    //     // variable : {loginId: 'xxx', password; 'xxx'}
    //   },
    //   onError: (error, params) => {
    //     console.log('error', error, params)
    //     // error
    //   },
    //   onSuccess: (data, params, context) => {
    //     console.log('success', data, params, context)
    //   },
    //   onSettled: () => {
    //     console.log('onSettled end')
    //   },
    // }
  )
}
