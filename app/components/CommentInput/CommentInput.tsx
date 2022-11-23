"use client";
import React from "react";
import styles from "./comment.module.css";
import { ThemeContext } from "../../../Providers/ThemeProvider";
import { useComment } from "../../../hooks/useComment";
import { CommentCard } from "../CommentCard";

const useTheme = () => React.useContext(ThemeContext);

type Props = {
  blog_id: number;
  comment_count: number;
};

/**
 * This is a client side component.  It can only receive serializable props.
 */
export const CommentInput: React.FC<Props> = (props) => {
  const { theme } = useTheme();
  const [content, set_content] = React.useState("");
  const { add_comment, add_comment_err, comments, loading } = useComment();

  React.useEffect(() => {
    if (add_comment_err) console.error(add_comment_err);
  }, [add_comment_err]);

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
        <button
          onClick={(e) => {
            if (loading) {
              return;
            }

            e.preventDefault();
            add_comment({ content, blogId: props.blog_id });
            set_content("");
          }}
          className={theme === "light" ? styles.btn : styles.btn_dark_theme}
        >
          {loading ? "Sending to the void..." : "Submit"}
        </button>
      </div>

      {props.comment_count + comments.length > 0 && (
        <p className={styles.comment_list_title}>Comments from the void</p>
      )}

      {comments.map((c) => (
        <CommentCard key={c.id} comment={c} />
      ))}
    </>
  );
};
