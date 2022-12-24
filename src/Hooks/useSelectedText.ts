import { useState, useEffect, useRef } from "react";
import { NativeSyntheticEvent } from "react-native";

type OnSelection = {
  start: number;
  end: number;
};

export default function useSelectedText() {
  const [selection, setSelection] = useState<number[]>([]);
  const [text, setText] = useState("");
  const [resultValue, setResultValue] = useState("");

  const onSelectionChange = (e: NativeSyntheticEvent<any>): void => {
    const { start, end }: OnSelection = e?.nativeEvent?.selection;
    setSelection([start, end]);
  };

  useEffect(() => {
    let [start] = selection;
    start = 0;
    // const value = text.substring(start, end);
    // setResultValue(value);
  }, [selection, text]);

  return [selection, onSelectionChange];
}
