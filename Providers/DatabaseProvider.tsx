"use client";
import React from "react";
import { BlogDatabase, setup_rxdb } from "../utils/setup_rxdb";
import { useToken } from "./TokenProvider";
import * as O from "fp-ts/Option";
import * as F from "fp-ts/function";

type DatabaseContextType = {
  blog_db?: BlogDatabase;
};

const DatabaseContext = React.createContext<DatabaseContextType>({});

export const DatabaseProvider: React.FC<React.PropsWithChildren> = (props) => {
  const { token: maybe_token } = useToken();
  const [blog_db, set_blog_db] = React.useState<BlogDatabase>();

  React.useEffect(() => {
    const token = F.pipe(
      maybe_token,
      O.getOrElse(() => "")
    );

    console.log("TOKEN: ", token);

    setup_rxdb(token).then(set_blog_db).catch(console.error);
  }, [set_blog_db, maybe_token]);

  return (
    <DatabaseContext.Provider value={{ blog_db }}>
      {props.children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => React.useContext(DatabaseContext);
