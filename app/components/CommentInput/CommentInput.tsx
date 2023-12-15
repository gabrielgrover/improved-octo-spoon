"use client";
import React from "react";
import styles from "./comment.module.css";
import { ThemeContext } from "../../../Providers/ThemeProvider";
import { CommentCard } from "../CommentCard/CommentCard";
import { BlogErrorMessage } from "../BlogErrorMessage/BlogErrorMessage";
import { Comment, useRxComments } from "../../../hooks/useRxComments";

const useTheme = () => React.useContext(ThemeContext);

type Props = {
  blog_id: number;
  token: string;
};

/**
 * This is a client side component.  It can only receive serializable props.
 */
export const CommentInput: React.FC<Props> = (props) => {
  const { theme } = useTheme();
  const [content, set_content] = React.useState("");
  const { add_comment, comments, error, loading } = useRxComments(
    props.blog_id
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

        {error ? <BlogErrorMessage blog_err={error} /> : null}

        <SubmitCommentBtn
          loading={loading}
          on_click={() => {
            add_comment(content);
            set_content("");
          }}
        />
      </div>

      <Comments comments={comments} />
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

function Comments(props: { comments: Comment[] }) {
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
