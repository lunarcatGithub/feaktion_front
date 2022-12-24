import React, { createContext, useReducer } from "react";

export const ToastReducer = (state, { type, value, bool }) => {
  switch (type) {
    case "NOTCOMPLETE":
      return { ...state, value, type, bool };
      break;

    default:
      break;
  }
};

export const ToastReducerContext = createContext(null);
export const initReducer = { value: 50, type: "", bool: false };
export const ToastReducerStore = ({ children }) => {
  const [isToast, toastDispatch] = useReducer(ToastReducer, initReducer);

  return (
    <ToastReducerContext.Provider value={{ isToast, toastDispatch }}>
      {children}
    </ToastReducerContext.Provider>
  );
};
