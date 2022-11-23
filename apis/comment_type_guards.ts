import * as S from "superstruct";
import { Comment } from "@prisma/client";

const comment_validation = S.object({
  id: S.number(),
  content: S.string(),
  blogId: S.number(),
  updatedAt: S.date(),
  createdAt: S.date(),
});

const comment_collection_validation = S.array(comment_validation);

export function is_comment(val: unknown): val is Comment {
  const _val = val as Comment;

  if (_val?.updatedAt) {
    _val.updatedAt = new Date(_val.updatedAt);
  }

  if (_val?.createdAt) {
    _val.createdAt = new Date(_val.createdAt);
  }

  return S.is(_val, comment_validation);
}

export function is_comment_array(val: unknown): val is Comment[] {
  return S.is(val, comment_collection_validation);
}
