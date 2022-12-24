import React, { useState, useEffect } from "react";

export const emailRegexp = (): [
  value: boolean,
  handler: (text: string) => void
] => {
  const [value, getValue] = useState(false);

  const handler = (text: string): void => {
    const emailReg =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    // data?.trim();
    const regResult = text?.match(emailReg);
    if (!regResult) return;
    if (regResult !== null && regResult[0] === text) {
      getValue(true);
    } else {
      getValue(false);
    }
  };

  return [value, handler];
};
