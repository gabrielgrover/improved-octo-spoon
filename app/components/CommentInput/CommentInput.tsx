"use client";
import React from "react";
import { Comment } from "@prisma/client";
import * as A from "fp-ts/Array";
import * as F from "fp-ts/function";
import * as EQ from "fp-ts/Eq";
import styles from "./comment.module.css";
import { ThemeContext } from "../../../Providers/ThemeProvider";
import { useComment } from "../../../hooks/useComment";
import { CommentCard } from "../CommentCard/CommentCard";
import { BlogErrorMessage } from "../BlogErrorMessage/BlogErrorMessage";

const useTheme = () => React.useContext(ThemeContext);

type Props = {
  blog_id: number;
  serialized_comments: SerializedComment[];
  token: string;
};

type SerializedComment = Omit<Comment, "createdAt" | "updatedAt"> & {
  createdAt: number;
  updatedAt: number;
};

const eq_serialized_comment: EQ.Eq<SerializedComment> = {
  equals: (c1, c2) => c1.id === c2.id,
};

/**
 * This is a client side component.  It can only receive serializable props.
 */
export const CommentInput: React.FC<Props> = (props) => {
  const { theme } = useTheme();
  const [content, set_content] = React.useState("");
  const { add_comment, add_comment_err, added_comments, loading } = useComment(
    props.token
  );

  const merged_comments = F.pipe(
    added_comments,
    A.map((c) => ({
      ...c,
      createdAt: c.createdAt.getTime(),
      updatedAt: c.updatedAt.getTime(),
    })),
    A.concat(props.serialized_comments),
    A.uniq(eq_serialized_comment)
  );

  const comment_input_styles =
    theme === "light" ? styles.comment_input_light : styles.comment_input_dark;

  return (
    <>
      <div className={styles.text_area_container}>
        <textarea
          className={comment_input_styles}
          name="comment"
          onChange={(e) => set_content(e.target.value)}
          value={content}
        />

        {add_comment_err && !loading && (
          <BlogErrorMessage blog_err={add_comment_err} />
        )}

        <SubmitCommentBtn
          loading={loading}
          on_click={() => {
            add_comment({ content, blogId: props.blog_id });
            set_content("");
          }}
        />
      </div>

      <Comments comments={merged_comments} />
    </>
  );
};

function SubmitCommentBtn(props: { loading: boolean; on_click: () => void }) {
  const { theme } = useTheme();

  return (
    <button
      onClick={(e) => {
        if (props.loading) {
          return;
        }

        e.preventDefault();
        props.on_click();
      }}
      className={theme === "light" ? styles.btn : styles.btn_dark_theme}
    >
      {props.loading ? "Sending to the void..." : "Submit"}
    </button>
  );
}

function Comments(props: { comments: SerializedComment[] }) {
  return (
    <>
      {props.comments.length > 0 && (
        <p className={styles.comment_list_title}>Comments from the void</p>
      )}

      {props.comments.map((c) => (
        <CommentCard key={c.id} comment={c} />
      ))}
    </>
  );
}
