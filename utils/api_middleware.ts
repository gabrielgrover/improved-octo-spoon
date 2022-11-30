import type { NextApiRequest, NextApiResponse } from "next";
import * as F from "fp-ts/function";
import * as E from "fp-ts/Either";
import { check_api_token } from "./api_token";

type Handler = (req: NextApiRequest, res: NextApiResponse) => void;

export function api_token_middleware(method: "GET" | "POST") {
  return (handler: Handler) => {
    return (req: NextApiRequest, res: NextApiResponse) => {
      const token: string | undefined = req.body?.token;

      if (method !== req.method) {
        return handler(req, res);
      }

      return F.pipe(
        check_api_token(token || ""),
        E.fold(
          (blog_err) => {
            res.status(404).json(blog_err);
          },
          () => {
            handler(req, res);
          }
        )
      );
    };
  };
}

export function log_token_middleware(handler: Handler) {
  return (req: NextApiRequest, res: NextApiResponse) => {
    const token: string | undefined = req.body?.token;

    console.log({ token });

    handler(req, res);
  };
}

export function log_req_method_middleware(handler: Handler) {
  return (req: NextApiRequest, res: NextApiResponse) => {
    console.log({ method: req.method });

    handler(req, res);
  };
}
