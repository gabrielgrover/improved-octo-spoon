import { Comment } from "@prisma/client";
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

  return F.pipe(
    get_comments(),
    TE.fold(render_err, render_comment_section(blog_id))
  )();
}

function render_err(blog_err: BlogError) {
  return T.of(
    <>
      <div>Failed to fetch comments: {blog_err.message}</div>
      <div>lib_message: {JSON.stringify(blog_err.ext_lib, null, 2)}</div>
    </>
  );
}

function render_comment_section(blog_id: number) {
  return F.flow(
    generate_serialized_comments_for_blog_id(blog_id),
    T.map((comments) => (
      <CommentInput blog_id={blog_id} serialized_comments={comments} />
    ))
  );
}

function generate_serialized_comments_for_blog_id(id: number) {
  const to_serializable = A.map((c: Comment) => ({
    ...c,
    createdAt: c.createdAt.getTime(),
    updatedAt: c.updatedAt.getTime(),
  }));

  const filter_comments_for_blog_id = A.filter((c: Comment) => c.blogId === id);

  const filter_sort_map = F.flow(
    filter_comments_for_blog_id,
    sort_comments_by_created_at,
    to_serializable,
    T.of
  );

  return filter_sort_map;
}
