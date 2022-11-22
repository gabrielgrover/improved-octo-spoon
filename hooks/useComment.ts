import React from "react";
import * as BlogRpc from "../utils/blog_rpc";
import * as F from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import type { Comment } from "@prisma/client";
import { BlogError } from "../utils/blog_err";
import type { CommentInput } from "../apis/types";

export const useComment = () => {
  const [add_comment_err, set_add_comment_err] = React.useState<BlogError>();
  const [comments, set_comments] = React.useState<Comment[]>([]);
  const [loading, set_loading] = React.useState(false);

  function add_comment(comment_input: CommentInput) {
    set_loading(true);
    F.pipe(
      BlogRpc.add_comment(comment_input),
      TE.fold(
        (err) => T.of(set_add_comment_err(err)),
        (c) => T.of(set_comments((prev) => [c, ...prev]))
      ),
      T.map(() => set_loading(false))
    )();
  }

  return {
    add_comment,
    add_comment_err,
    comments,
    loading,
  };
};
