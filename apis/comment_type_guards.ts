import * as S from "superstruct";
import { Comment } from "@prisma/client";

const comment_validation = S.object({
  id: S.number(),
  content: S.string(),
  blogId: S.number(),
});

const comment_collection_validation = S.array(comment_validation);

export function is_comment(val: unknown): val is Comment {
  return S.is(val, comment_validation);
}

export function is_comment_array(val: unknown): val is Comment[] {
  return S.is(val, comment_collection_validation);
}
