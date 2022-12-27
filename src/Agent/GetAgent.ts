import React from 'react'
import { useQuery } from 'react-query'
import useFetch from '~/Hooks/useAxiosFetch'

type Props = {
  key: [key: string, value?: string | number | {}]
  url: string
  option?: {}
  params?: {}
}

export default function getAgent({ key, url, params, option }: Props) {
  return useQuery(
    key,
    () => useFetch({ url, method: 'get', data: params }),
    option
  )
}
