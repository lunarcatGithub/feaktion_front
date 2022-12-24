import { Dispatch, SetStateAction, useEffect, useState } from "react";

type commentType = {
  comment_id: number;
  user_id: number | string;
  comment_body: string;
  comment_updatedate: Date;
}[];

export default function useInfinityScroll(
  count = 20
): [
  resultData: any,
  setData: Dispatch<SetStateAction<commentType>>,
  page: number,
  setPage: Dispatch<SetStateAction<number>>
] {
  const [data, setData] = useState<commentType>([]);
  const [page, setPage] = useState(1);
  const [resultData, setResultData] = useState<any[]>([]);

  const scrollHandling = () => {
    const originData = data.slice(0, page * count);
    setResultData(originData);
  };

  useEffect(() => {
    scrollHandling();
  }, [page, data]);

  return [resultData, setData, page, setPage];
}
