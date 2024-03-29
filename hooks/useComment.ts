import React from "react";
import * as BlogRpc from "../utils/blog_rpc";
import * as F from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import * as O from "fp-ts/Option";
import type { Comment } from "@prisma/client";
import { BlogError, AddCommentError } from "../utils/blog_err";
import * as CommentSort from "../utils/sort_comments";
import type { CommentInput } from "../apis/types";
import { useToken } from "../Providers/TokenProvider";

export const useComment = (blog_id: number) => {
  const { token } = useToken();
  const [add_comment_err, set_add_comment_err] = React.useState<
    BlogError | undefined
  >();
  const [fetch_comments_err, set_fetch_comments_err] = React.useState<
    BlogError | undefined
  >();

  const [added_comments, set_comments] = React.useState<Comment[]>([]);
  const [initial_comments, set_initial_comments] = React.useState<Comment[]>(
    []
  );
  const [loading, set_loading] = React.useState(false);

  const comments = F.pipe(
    initial_comments.concat(added_comments),
    CommentSort.by_created_at_ascending
  );

  React.useEffect(() => {
    F.pipe(
      BlogRpc.get_comments(blog_id),
      TE.fold(
        (err) => T.of(set_fetch_comments_err(err)),
        (cs) => T.of(set_initial_comments(cs))
      )
    )();
  }, [set_initial_comments]);

  console.log(
    "token",
    F.pipe(
      token,
      O.fold(
        () => {},
        (token) => console.log({ token })
      )
    )
  );

  function add_comment(comment_input: CommentInput, _token: string) {
    set_add_comment_err(undefined);
    set_loading(true);

    F.pipe(
      token,
      O.fold(
        () => TE.left(AddCommentError("Token not available.")),
        (token) => BlogRpc.add_comment(comment_input, token)
      ),
      TE.fold(
        (err) => T.of(set_add_comment_err(err)),
        (c) => T.of(set_comments((prev) => [c, ...prev]))
      ),
      T.map(() => set_loading(false))
    )();
  }

  return {
    add_comment,
    comments,
    loading,
    errors: {
      add_comment_err,
      fetch_comments_err,
    },
  };
};
