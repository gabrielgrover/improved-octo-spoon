import jwt from "jsonwebtoken";
import * as E from "fp-ts/Either";
import { TokenSignFailedError, TokenVerificationError } from "./blog_err";

const api_key = process.env["API_SECRET_KEY"];

type JWTError = Pick<jwt.JsonWebTokenError, "name" | "message">;

export function generate_api_token() {
  return token(Math.floor(Date.now() / 1000) + 60 * 60);
}

export function check_api_token(token: string) {
  if (!api_key) {
    return E.left(TokenVerificationError("env var not available"));
  }

  if (!token) {
    return E.left(TokenVerificationError("Token was not provided."));
  }

  return E.tryCatch(
    () => {
      jwt.verify(token, api_key);
    },
    (e) => {
      const err = e as JWTError;

      return TokenVerificationError(err.message);
    }
  );
}

function token(expiry: number) {
  if (!api_key) {
    return E.left(TokenSignFailedError("env var not available"));
  }

  const token = jwt.sign(
    {
      exp: expiry,
    },
    api_key
  );

  return E.right(token);
}
