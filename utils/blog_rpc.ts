import * as TE from "fp-ts/TaskEither";
import * as F from "fp-ts/function";
import { CommentInput } from "../apis/types";
import { COMMENT_BASE_URL } from "./constants";
import {
  parse_comment_array,
  parse_comment,
} from "../apis/comment_type_guards";
import {
  AddCommentError,
  GetCommentError,
  is_blog_err,
  BlogError,
  UnrecognizedResponse,
} from "./blog_err";

export function add_comment(comment_input: CommentInput, token: string) {
  const post_comment_task = TE.tryCatch(
    () => post_comment(comment_input, token),
    (err) => err as BlogError
  );

  return post_comment_task;
}

export function get_comments(blog_id: number) {
  const get_comment_task = TE.tryCatch(
    () => fetch_comments(),
    (err) => err as BlogError
  );

  return F.pipe(
    get_comment_task,
    TE.map((comments) => comments.filter((c) => c.blogId === blog_id))
  );
}

async function post_comment(comment_input: CommentInput, token: string) {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  return fetch(COMMENT_BASE_URL, {
    method: "POST",
    body: JSON.stringify({ comment_input, token }),
    headers,
  })
    .then((resp) => resp.json())
    .then((data) => {
      if (is_blog_err(data)) {
        return Promise.reject(data);
      }

      const parse_result = parse_comment(data?.comment);

      if (!parse_result.success) {
        return Promise.reject(UnrecognizedResponse("AddComment"));
      }

      return parse_result.data;
    })
    .catch((err) => {
      if (is_blog_err(err)) {
        return Promise.reject(err);
      }

      return Promise.reject(
        AddCommentError("Failed to add comment", {
          name: "Fetch API",
          lib_message: JSON.stringify(err),
        })
      );
    });
}

async function fetch_comments() {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  return fetch(COMMENT_BASE_URL, { headers })
    .then((resp) => resp.json())
    .then((data) => {
      const maybe_comments = data.comments;

      if (is_blog_err(data)) {
        return Promise.reject(data);
      }

      const parse_result = parse_comment_array(maybe_comments);

      if (!parse_result.success) {
        return [];
      }

      return parse_result.data;
    })
    .catch((err) => {
      if (is_blog_err(err)) {
        return Promise.reject(err);
      }

      return Promise.reject(
        GetCommentError("Failed to get comments", {
          name: "Fetch API",
          lib_message: JSON.stringify(err),
        })
      );
    });
}
