"use client";
import React from "react";
import { CommentInput } from "../../../apis/types";

type Props = {
  comment: CommentInput & { createdAt: number; updatedAt: number };
};

/**
 * This is a client side component.  It can only receive serializable props.
 */
export const CommentCard: React.FC<Props> = (props) => {
  return <div>{props.comment.content}</div>;
};
