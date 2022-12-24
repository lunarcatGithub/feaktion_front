import { Dispatch, SetStateAction } from 'react';

export enum AsyncCallType {
  SET = 'SET',
  GET = 'GET',
  REMOVE = 'REMOVE',
  GETALL = 'GETALL',
  MULTIGET = 'MULTIGET',
}

export type AsyncStorageContextType = {
  type: AsyncCallType;
  key?: string | string[];
  value?: string | undefined;
};
export type ReturnValueType =
  | {
      err?: Error | undefined;
      result?: string | string[] | [string, string | null][];
    }
  | undefined;

export type AsyncStorageContextReturnType = {
  asyncState: Promise<AsyncStorageContextType>;
  asyncDispatch: Dispatch<SetStateAction<AsyncStorageContextType>>;
};
