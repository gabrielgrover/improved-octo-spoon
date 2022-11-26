import type { NextApiRequest, NextApiResponse } from "next";
import * as F from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as CommentAPI from "../../../apis/comment_api";
import {
  api_token_middleware,
  log_token_middleware,
  log_req_method_middleware,
} from "../../../utils/api_middleware";

export default F.pipe(
  comment_handler,
  api_token_middleware("POST"),
  log_req_method_middleware,
  log_token_middleware
);

function comment_handler(req: NextApiRequest, res: NextApiResponse) {
  const try_add_comment = F.pipe(
    CommentAPI.validate_and_add_comment(req.body?.comment_input),
    TE.map((comment) => res.status(201).json({ success: true, comment })),
    TE.mapLeft((e) => res.status(400).json(e))
  );

  const try_get_all_comments = F.pipe(
    CommentAPI.get_comments(),
    TE.map((comments) => res.status(200).json({ comments })),
    TE.mapLeft((e) => res.status(400).json(e))
  );

  if (req.method === "POST") {
    try_add_comment();
  }

  if (req.method === "GET") {
    try_get_all_comments();
  }
}
