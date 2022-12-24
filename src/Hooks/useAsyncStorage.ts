import { useState } from 'react'
import AsyncStorage from '@react-native-community/async-storage'

export default function useAsyncStorage(): [
  (type: string, key?: string | string[], value?: string | undefined) => void,
  (
    | {
        err?: Error | undefined
        result: string
      }
    | undefined
  )
] {
  const [_result, setResult] = useState<{
    err?: Error | undefined
    result: string | string[]
  }>()

  const asyncHandler = async (
    type: string,
    key?: string | string[] | undefined,
    value?: string | []
  ): Promise<void> => {
    console.log('async_storage', key, value)
    switch (type) {
      case 'SET':
        if (!key || Array.isArray(key)) return
        await AsyncStorage.setItem(key, JSON.stringify(value))
        break

      case 'GET':
        if (!key || Array.isArray(key)) return
        await AsyncStorage.getItem(key, (err, result) => {
          if (!result) return
          setResult({ err, result })
        })
        break

      case 'REMOVE':
        if (!key || Array.isArray(key)) return
        await AsyncStorage.removeItem(key)
        break

      case 'GETALL':
        await AsyncStorage.getAllKeys((err, result) => {
          setResult({ err, result })
        })
        break
      case 'MULTIGET':
        if (!key || typeof key === 'string') return
        await AsyncStorage.multiGet(key, (err, result) => {
          setResult({ err, result })
        })
        break

      default:
        break
    }
  }

  return [asyncHandler, _result]
}
