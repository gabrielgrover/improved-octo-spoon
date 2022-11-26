import { z } from "zod";
import { Comment } from "@prisma/client";

const z_date = z.preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date());

const zod_comment_validator = z.object({
  id: z.number(),
  content: z.string(),
  blogId: z.number(),
  updatedAt: z_date,
  createdAt: z_date,
});

const zod_comment_array_validator = z.array(zod_comment_validator);

export function is_comment(val: unknown): val is Comment {
  const { success } = zod_comment_validator.safeParse(val);

  return success;
}

export function is_comment_array(val: unknown): val is Comment[] {
  const { success } = zod_comment_array_validator.safeParse(val);

  return success;
}

export function parse_comment_array(val: unknown) {
  return zod_comment_array_validator.safeParse(val);
}

export function parse_comment(val: unknown) {
  return zod_comment_validator.safeParse(val);
}
