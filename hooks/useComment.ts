import React from "react";
import * as BlogRpc from "../utils/blog_rpc";
import * as F from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import type { Comment } from "@prisma/client";
import { BlogError } from "../utils/blog_err";
import type { CommentInput } from "../apis/types";

export const useComment = () => {
  const [add_comment_err, set_add_comment_err] = React.useState<BlogError>();
  const [comments, set_comments] = React.useState<Comment[]>([]);

  function add_comment(comment_input: CommentInput) {
    F.pipe(
      BlogRpc.add_comment(comment_input),
      TE.map((c) => set_comments((prev) => [c, ...prev])),
      TE.mapLeft(set_add_comment_err)
    )();
  }

  return {
    add_comment,
    add_comment_err,
    comments,
  };
};
