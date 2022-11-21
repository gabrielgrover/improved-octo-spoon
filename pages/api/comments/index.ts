import type { NextApiRequest, NextApiResponse } from "next";
import * as F from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as CommentAPI from "../../../apis/comment_api";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const try_add_comment = F.pipe(
    CommentAPI.validate_and_add_comment(JSON.parse(req.body)),
    TE.map((comment) => res.status(201).send({ success: true, comment })),
    TE.mapLeft((e) => res.status(400).json(e))
  );

  const try_get_all_comments = F.pipe(
    CommentAPI.get_comments(),
    TE.map((comments) => res.status(200).send({ comments })),
    TE.mapLeft((e) => res.status(400).send(e))
  );

  if (req.method === "POST") {
    try_add_comment();
  }

  if (req.method === "GET") {
    try_get_all_comments();
  }
}
