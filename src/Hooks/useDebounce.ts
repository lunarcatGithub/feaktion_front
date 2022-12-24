import { useEffect, useState } from "react";

export default function useDebounce(value: any, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState();

  useEffect(() => {
    // setTimeout을 통해 delay 이후에 debouncedValue를 얻습니다.
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value]);

  return debouncedValue;
}
