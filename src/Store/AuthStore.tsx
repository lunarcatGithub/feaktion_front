import React, {
  createContext,
  Dispatch,
  ReactChild,
  SetStateAction,
  useState,
} from "react";

type signUpValue = {
  email: string;
  password: string | number;
  repassword?: string | number;
  gender?: string;
};
type signupInputType = { email: string; password: string; rePassword: string };

export type appType = {
  userEmail: string;
  setUserEmail: Dispatch<SetStateAction<string>>;
  userPassword: string;
  setUserPassword: Dispatch<SetStateAction<string>>;
  loginInput: { userId: string; password: string };
  setLoginInput: Dispatch<SetStateAction<{ userId: string; password: string }>>;
  signupSecondInput: {
    nickname: string;
    userId: string;
    password: string;
    email: string;
  };
  setSignupSecondInput: Dispatch<
    SetStateAction<{
      nickname: string;
      userId: string;
      password: string;
      email: string;
    }>
  >;
  signUpValue: signUpValue | undefined;
  setSignUpValue: Dispatch<SetStateAction<signUpValue | undefined>>;
  signupInputText: signupInputType;
  setSignupInput: Dispatch<SetStateAction<signupInputType>>;
};

export const AuthMainContext = createContext<appType | null>(null);
export function AuthMainStore({
  children,
}: {
  children: ReactChild;
}): JSX.Element {
  // login
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loginInput, setLoginInput] = useState({ userId: "", password: "" });

  // signup second
  const [signupSecondInput, setSignupSecondInput] = useState({
    nickname: "",
    userId: "",
    password: "",
    email: "",
  });
  const [signUpValue, setSignUpValue] = useState<signUpValue | undefined>();
  const [signupInputText, setSignupInput] = useState({
    email: "",
    password: "",
    rePassword: "",
  });

  return (
    <AuthMainContext.Provider
      value={{
        userEmail,
        setUserEmail,
        userPassword,
        setUserPassword,
        loginInput,
        setLoginInput,
        // signup
        signupSecondInput,
        setSignupSecondInput,
        signUpValue,
        setSignUpValue,
        signupInputText,
        setSignupInput,
      }}
    >
      {children}
    </AuthMainContext.Provider>
  );
}
