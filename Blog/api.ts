import { readFile, readdir } from "fs/promises";
import { PrismaClient, Comment } from "@prisma/client";
import * as S from "superstruct";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import * as F from "fp-ts/function";
import { BlogMeta } from "./types";
import {
  AddCommentError,
  BlogError,
  GetCommentError,
  InvalidCommentInputError,
} from "../utils";
import { load_mark_down_html } from "./mark_down_loader";

export const BLOGS_DIR = "Blog/blogs";

const prisma_client = new PrismaClient();

export function load_blog_html(blog_id: string) {
  const path_to_blog = `${BLOGS_DIR}/blog_${blog_id}/blog.md`;

  const html = load_mark_down_html(path_to_blog);

  return html;
}

export async function list_blogs(): Promise<BlogMeta[]> {
  const blog_dirs = (await readdir(BLOGS_DIR, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => `${BLOGS_DIR}/${dirent.name}`);

  const blogs: BlogMeta[] = await Promise.all(
    blog_dirs.map(async (dir) =>
      JSON.parse((await readFile(`${dir}/meta.json`)).toString())
    )
  );

  return blogs;
}

export async function get_all_blog_html() {
  const blog_metas = await list_blogs();

  return Promise.all(
    blog_metas.map(async (blog_meta) => ({
      ...blog_meta,
      html: await load_blog_html(String(blog_meta.id)),
    }))
  );
}

type CommentInput = Pick<Comment, "content" | "blogId">;

export function get_comments(
  on_error: (e: BlogError) => void,
  on_success: (cs: Comment[]) => void
) {
  return (where?: Partial<Comment>) => {
    const find = where
      ? () => prisma_client.comment.findMany({ where })
      : () => prisma_client.comment.findMany();

    const create_err = (e: unknown) =>
      GetCommentError("Failed to retrieve comment from database", {
        name: "Prisma",
        lib_message: String(e),
      });

    return F.pipe(
      TE.tryCatch(find, create_err),
      TE.fold(
        (e) => TE.of(on_error(e)),
        (comments) => TE.of(on_success(comments))
      )
    );
  };
}

export function get_blog_url(blog_id: number) {
  return `/blog/${blog_id}`;
}

export function validate_and_add_comment(
  on_error: (err: BlogError) => void,
  on_success: (c: Comment) => void
) {
  return (data: unknown) =>
    F.pipe(
      validate_comment_input(data),
      E.fold((e) => {
        console.log(`error in either: ${JSON.stringify(e, null, 2)}`);
        return TE.left(e);
      }, add_comment),
      TE.fold(
        (e) => {
          console.log(`error in task either: ${JSON.stringify(e, null, 2)}`);
          return TE.of(on_error(e));
        },
        (comment) => {
          return TE.of(on_success(comment));
        }
      )
    );
}

// Private functions

function validate_comment_input(comment_input: unknown) {
  console.log("validate_comment_input called", { comment_input });
  const validation = S.object({
    content: S.size(S.string(), 7, Infinity),
    blogId: S.number(),
  });

  const validate = () => {
    console.log("validating comment input");
    S.assert(comment_input, validation);
    console.log("comment input is valid");

    return comment_input;
  };

  const create_err = (e: unknown) =>
    InvalidCommentInputError({
      name: "Superstruct",
      lib_message: JSON.stringify(e),
    });

  return E.tryCatch(validate, create_err);
}

function add_comment(comment_input: CommentInput) {
  console.log("adding comment");
  return TE.tryCatch(
    () => prisma_client.comment.create({ data: comment_input }),
    (e) =>
      AddCommentError("Failed to add comment to database", {
        name: "Prisma",
        lib_message: String(e),
      })
  );
}
