import type { Comment } from "@prisma/client";
import * as A from "fp-ts/Array";
import { Ord, fromCompare, contramap } from "fp-ts/Ord";

const ord_number: Ord<number> = fromCompare((x, y) =>
  x < y ? 1 : x > y ? -1 : 0
);

const by_created: Ord<Comment> = contramap((c: Comment) =>
  c.createdAt.getTime()
)(ord_number);

export function by_created_at_ascending(cs: Comment[]) {
  return A.sortBy([by_created])(cs);
}
