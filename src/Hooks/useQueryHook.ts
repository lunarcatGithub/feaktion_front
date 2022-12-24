import { useQuery } from 'react-query';
import useFetch from './useAxiosFetch';

export default function useQueryHook(
  keyArr: [key: string, value?: string | number | {}],
  url: string,
  params?: {} | null,
  prevent = false,
  values?: string[] | number[],
): any {
  let detect = true;
  if (prevent) return null;

  values?.map(items => {
    if (!items) detect = false;
  });
  if (!detect) return;
  return useQuery(keyArr, () => useFetch({ url, method: 'get', data: params }));
}
