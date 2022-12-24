import React, { useEffect, useRef, useState } from "react";
import { ToastAndroid, BackHandler } from "react-native";

export default function useBackExit() {
  const count = useRef(0);

  const backHandler = () => {
    if (count?.current === 1) {
      BackHandler.exitApp();
    }

    if (count?.current === 0) {
      ToastAndroid.show("한번 더 누르면 종료됩니다", ToastAndroid.SHORT);
      count.current += 1;
    }

    setTimeout(() => {
      count.current = 0;
    }, 2000);
  };

  return backHandler;
}
