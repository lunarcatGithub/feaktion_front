import { useState } from 'react'
import AsyncStorage from '@react-native-community/async-storage'

export enum MethodEnum {
  SET = 'SET',
  GET = 'GET',
  REMOVE = 'REMOVE',
  GETALL = 'GETALL',
  MULTIGET = 'MULTIGET',
}
export type paramsType = {
  method: MethodEnum
  key: string[] | string
  value?: string | []
}

export async function asyncStorageUtil({ method, key, value }: paramsType) {
  switch (method) {
    case MethodEnum.SET:
      if (!key || Array.isArray(key)) return
      await AsyncStorage.setItem(key, JSON.stringify(value))

    case MethodEnum.GET:
      if (!key || Array.isArray(key)) return
      return await AsyncStorage.getItem(key, (err, result) => {
        if (!result) return
        if (err) console.error(`Error!: ${err}`)
        return { result }
      })

    case MethodEnum.REMOVE:
      if (!key || Array.isArray(key)) return
      return await AsyncStorage.removeItem(key)

    case MethodEnum.GETALL:
      return await AsyncStorage.getAllKeys((err, result) => {
        if (err) console.error(`Error!: ${err}`)
        return { result }
      })

    case MethodEnum.MULTIGET:
      if (!key || typeof key === 'string') return
      return await AsyncStorage.multiGet(key, (err, result) => {
        if (err) console.error(`Error!: ${err}`)
        return { result }
      })

    default:
      break
  }
}
