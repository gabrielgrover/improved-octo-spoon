import { Comment } from "@prisma/client";
import * as TE from "fp-ts/TaskEither";
import * as F from "fp-ts/function";
import * as T from "fp-ts/Task";
import * as A from "fp-ts/Array";
import {
  get_comments,
  sort_comments_by_created_at,
} from "../../../apis/comment_api";
import { async_component_wrapper } from "../../../utils";
import { BlogError } from "../../../utils/blog_err";
import { CommentCard } from "../CommentCard/CommentCard";

type Props = {
  blog_id: string;
};

export const CommentList = async_component_wrapper(AsyncCommentList);

async function AsyncCommentList(props: Props) {
  return render_comments(parseInt(props.blog_id));
}

function render_comments(id: number) {
  return F.pipe(
    get_comments(),
    TE.fold(render_err, render_comments_for_blog_id(id))
  )();
}

function render_err(blog_err: BlogError) {
  return T.of(<div>error: {blog_err.message}</div>);
}

function render_comments_for_blog_id(id: number) {
  const to_serializable = A.map((c: Comment) => ({
    ...c,
    createdAt: c.createdAt.getTime(),
    updatedAt: c.updatedAt.getTime(),
  }));

  const filter_comments_for_blog_id = A.filter((c: Comment) => c.blogId === id);

  const to_single_jsx_element = (cs: JSX.Element[]) => <>{cs}</>;

  const filter_sort_map = F.flow(
    filter_comments_for_blog_id,
    sort_comments_by_created_at,
    to_serializable,
    A.map((c) => <CommentCard key={c.id} comment={c} />),
    to_single_jsx_element,
    T.of
  );

  return filter_sort_map;
}
