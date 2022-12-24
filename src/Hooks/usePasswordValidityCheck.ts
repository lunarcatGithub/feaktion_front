import { useEffect, useState } from "react";

export default function usePasswordValidityCheck(
  password: string,
  rePassword: string
): string {
  const [type, setType] = useState("");

  const validateCheck = (): void => {
    if (password !== rePassword) {
      setType("different");
    } else if (!password || !rePassword) {
      setType("none");
    } else if (rePassword?.length <= 7) {
      setType("shortage");
    } else {
      setType("ok");
    }
  };

  useEffect(() => {
    validateCheck();
  }, [password, rePassword]);

  return type;
}
