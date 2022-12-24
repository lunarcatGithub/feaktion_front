import React, {
  createContext,
  Dispatch,
  ReactChild,
  SetStateAction,
  useState,
} from "react";

// type
type HeaderType = {
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
};

export const HeaderContext = createContext<HeaderType | null>(null);

export default function HeaderStore({
  children,
}: {
  children: ReactChild;
}): JSX.Element {
  const [searchValue, setSearchValue] = useState("");

  return (
    <HeaderContext.Provider value={{ searchValue, setSearchValue }}>
      {children}
    </HeaderContext.Provider>
  );
}
