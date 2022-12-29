"use client";
import React from "react";
import * as O from "fp-ts/Option";

type TokenProviderContextType = {
  token: O.Option<string>;
};

export const TokenContext = React.createContext<TokenProviderContextType>({
  token: O.none,
});

export type TokenProviderProps = React.PropsWithChildren<{
  token: O.Option<string>;
}>;

export const TokenProvider: React.FC<TokenProviderProps> = (props) => {
  //console.log({ token_from_provider: props.token });

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
