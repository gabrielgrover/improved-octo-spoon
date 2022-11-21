"use client";
import React from "react";
import styles from "./comment.module.css";
import { ThemeContext } from "../../../Providers/ThemeProvider";
import { useComment } from "../../../hooks/useComment";
import { CommentCard } from "../CommentCard";

const useTheme = () => React.useContext(ThemeContext);

type Props = {
  blog_id: string;
};

/**
 * This is a client side component.  It can only receive serializable props.
 */
export const CommentInput: React.FC<Props> = (props) => {
  const { theme } = useTheme();
  const [content, set_content] = React.useState("");
  const { add_comment, add_comment_err, comments } = useComment();

  const comment_input_styles =
    theme === "light" ? styles.comment_input_light : styles.comment_input_dark;

  return (
    <>
      <div className={styles.text_area_container}>
        <textarea
          className={comment_input_styles}
          name="comment"
          onChange={(e) => set_content(e.target.value)}
        />
        <button
          onClick={() =>
            add_comment({ content, blogId: parseInt(props.blog_id) })
          }
        >
          Submit
        </button>
      </div>

      {comments.map((c, idx) => (
        <CommentCard
          key={idx}
          comment={{
            ...c,
            createdAt: c.createdAt.getTime(),
            updatedAt: c.updatedAt.getTime(),
          }}
        />
      ))}
    </>
  );
};
