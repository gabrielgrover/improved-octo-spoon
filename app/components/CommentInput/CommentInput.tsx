"use client";

import styles from "./comment.module.css";

export const CommentInput = () => (
  <textarea
    className={styles.comment_input}
    name="comment"
    onChange={(e) => console.log("input", e.target.value)}
  />
);
