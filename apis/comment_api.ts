import { Comment } from "@prisma/client";
import { get_prisma_client } from "./prisma_client";
import * as S from "superstruct";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as F from "fp-ts/function";
import * as A from "fp-ts/Array";
import { Ord, fromCompare, contramap } from "fp-ts/Ord";
import {
  AddCommentError,
  GetCommentError,
  InvalidCommentInputError,
  PrismaClientUnavailable,
} from "../utils";

import { CommentInput } from "./types";

const prisma_client = get_prisma_client();

export function validate_and_add_comment(data: unknown) {
  return F.pipe(validate_comment_input(data), TE.chain(add_comment));
}

export function get_comments(where?: Partial<Comment>) {
  if (prisma_client === undefined) {
    return TE.left(PrismaClientUnavailable());
  }

  const find = where
    ? () => prisma_client.comment.findMany({ where })
    : () => prisma_client.comment.findMany();

  const create_err = (e: unknown) =>
    GetCommentError("Failed to retrieve comment from database", {
      name: "Prisma",
      lib_message: String(e),
    });

  return TE.tryCatch(find, create_err);
}

const ord_number: Ord<number> = fromCompare((x, y) =>
  x < y ? 1 : x > y ? -1 : 0
);

const by_created: Ord<Comment> = contramap((c: Comment) =>
  c.createdAt.getTime()
)(ord_number);

export function sort_comments_by_created_at(cs: Comment[]) {
  return A.sortBy([by_created])(cs);
}

// Private functions

function validate_comment_input(comment_input: unknown) {
  const validation = S.object({
    content: S.size(S.string(), 7, Infinity),
    blogId: S.number(),
  });

  const validate = () => {
    S.assert(comment_input, validation);

    return comment_input;
  };

  const create_err = (e: unknown) =>
    InvalidCommentInputError({
      name: "Superstruct",
      lib_message: JSON.stringify((e as any).failures(), null, 2),
    });

  return F.pipe(
    E.tryCatch(validate, create_err),
    E.fold(TE.left, (comment_input) => TE.right(comment_input))
  );
}

function add_comment(comment_input: CommentInput) {
  if (prisma_client === undefined) {
    return TE.left(PrismaClientUnavailable());
  }

  return TE.tryCatch(
    () => prisma_client.comment.create({ data: comment_input }),
    (e) =>
      AddCommentError("Failed to add comment to database", {
        name: "Prisma",
        lib_message: String(e),
      })
  );
}
