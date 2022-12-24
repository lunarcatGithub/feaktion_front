import { useState } from "react";

export const useConvertTags = (): [
  converted: string[],
  convert: (props: string) => void
] => {
  const [converted, setConverted] = useState<string[]>([]);

  const regURLHttp = new RegExp(
    /^(((http(s?)):\/\/)?)([0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}(:[0-9]+)?(\/\S*)?/
  );
  const regExp = new RegExp(
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
  );

  const convert = (props: string) => {
    if (!props) return;
    const arr: string[] = [];

    new Promise((res, rej) => {
      const data = props
        .replace(/(\n|\r\n)/g, "+<br/>+")
        .split("+")
        .join("+");
      res(data);
    })
      .then((data) => {
        return data?.replace(/\s/g, "+").split("+");
      })
      .then((lastValue) => {
        lastValue?.map((str: string, index?: number) => {
          if (str === "<br/>") {
            arr.push("\n");
          } else {
            arr.push(str);
          }
        });
        setConverted(arr);
      });
  };

  return [converted, convert];
};
