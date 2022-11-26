import { Comment } from "@prisma/client";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import * as F from "fp-ts/function";
import * as A from "fp-ts/Array";
import { BlogError } from "../../../utils/blog_err";
import { async_component_wrapper } from "../../../utils/async_component_wrapper";
import { CommentInput } from "../CommentInput/CommentInput";
import {
  get_comments,
  sort_comments_by_created_at,
} from "../../../apis/comment_api";
import { generate_api_token } from "../../../utils/api_token";
import styles from "./comment_section_styles.module.css";

type Props = {
  blog_id: string;
};

export const CommentSection: React.FC<Props> = (props) => {
  return (
    <div className={styles.comment_input_container}>
      <h2 className={styles.comment_heading}>Penny for your thoughts</h2>
      <WrappedAsyncCommentSection {...props} />
    </div>
  );
};

const WrappedAsyncCommentSection = async_component_wrapper(AsyncCommentSection);

async function AsyncCommentSection(props: Props) {
  const blog_id = parseInt(props.blog_id);

  const render_comment_section_or_err = F.pipe(
    get_comments(),
    TE.chain(generate_comments_token_tuple),
    TE.fold(render_err, render_comment_section(blog_id))
  );

  return render_comment_section_or_err();
}

function render_err(blog_err: BlogError) {
  return T.of(<div>Failed to fetch comments: {blog_err.message}</div>);
}

function render_comment_section(blog_id: number) {
  return F.flow(
    (data: { comments: Comment[]; token: string }) =>
      T.of({
        comments: generate_serialized_comments_for_blog_id(blog_id)(
          data.comments
        ),
        token: data.token,
      }),
    T.map(({ comments, token }) => (
      <CommentInput
        blog_id={blog_id}
        serialized_comments={comments}
        token={token}
      />
    ))
  );
}

function generate_serialized_comments_for_blog_id(id: number) {
  const filter_comments_for_blog_id = A.filter((c: Comment) => c.blogId === id);

  const to_serializable = A.map((c: Comment) => ({
    ...c,
    createdAt: c.createdAt.getTime(),
    updatedAt: c.updatedAt.getTime(),
  }));

  const filter_sort_map = F.flow(
    filter_comments_for_blog_id,
    sort_comments_by_created_at,
    to_serializable
  );

  return filter_sort_map;
}

function generate_comments_token_tuple(comments: Comment[]) {
  return F.pipe(
    generate_api_token(),
    E.fold(TE.left, (token) => TE.right({ comments, token }))
  );
}
