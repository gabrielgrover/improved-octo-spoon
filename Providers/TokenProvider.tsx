"use client";
import React from "react";

type TokenProviderContextType = {
  token: string;
};

export const TokenContext = React.createContext<TokenProviderContextType>({
  token: "",
});

export type TokenProviderProps = React.PropsWithChildren<{
  token: string;
}>;

export const TokenProvider: React.FC<TokenProviderProps> = (props) => {
  return (
    <TokenContext.Provider
      value={{
        token: props.token,
      }}
    >
      {props.children}
    </TokenContext.Provider>
  );
};
