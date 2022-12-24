import React, { createContext, useReducer, ReactNode } from 'react';
import {
  AsyncStorageContextType,
  AsyncCallType,
  AsyncStorageContextReturnType,
} from './types/contextType';
import AsyncStorage from '@react-native-community/async-storage';

export const AsyncContextReducer =
  createContext<AsyncStorageContextReturnType | null>(null);

const AsyncReducer = (
  state: {},
  { type, value, key }: AsyncStorageContextType,
) => {
  switch (type) {
    case AsyncCallType.SET:
      if (!key || Array.isArray(key)) return;
      return AsyncStorage.setItem(key, JSON.stringify(value));

    case AsyncCallType.GET:
      if (!key || Array.isArray(key)) return;

      return AsyncStorage.getItem(key, (err, result) => {
        if (!result) return;
        return { err, result };
      });

    case AsyncCallType.REMOVE:
      if (!key || Array.isArray(key)) return;
      return AsyncStorage.removeItem(key);

    case AsyncCallType.GETALL:
      return AsyncStorage.getAllKeys((err?: Error, result?: Array<string>) => {
        if (!result) return;
        return { err, result };
      });

    case AsyncCallType.MULTIGET:
      if (!key || typeof key === 'string') return;
      return AsyncStorage.multiGet(
        key,
        (err, result?: [string, string | null][]) => {
          return { err: err, result: (result = [['', '']]) };
        },
      );

    default:
      break;
  }
};
const initReducer = { value: '', type: '', key: '' };

export default function AsyncContext({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [asyncState, asyncDispatch] = useReducer(AsyncReducer, initReducer);
  return (
    <AsyncContextReducer.Provider value={{ asyncState, asyncDispatch }}>
      {children}
    </AsyncContextReducer.Provider>
  );
}
