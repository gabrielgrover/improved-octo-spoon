"use client";
import React from "react";
import { CommentInput } from "../../../apis/types";
import styles from "./comment_card_styles.module.css";

type Props = {
  comment: CommentInput;
};

/**
 * This is a client side component.  It can only receive serializable props.
 */
export const CommentCard: React.FC<Props> = (props) => {
  return (
    <div className={styles.comment_card_container}>{props.comment.content}</div>
  );
};
