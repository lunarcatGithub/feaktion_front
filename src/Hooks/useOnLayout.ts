import { useCallback, useState } from "react";
import { LayoutChangeEvent } from "react-native";

export default function useOnLayout(navi: string): [
  size: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  getSizeLayout: (e: LayoutChangeEvent) => void
] {
  const [size, getSize] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const getSizeLayout = useCallback(
    (e: LayoutChangeEvent): void => {
      const { x, y, width, height } = e.nativeEvent.layout;
      getSize({ x, y, width, height });
    },
    [navi]
  );

  return [size, getSizeLayout];
}
