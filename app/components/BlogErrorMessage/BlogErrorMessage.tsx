import React from "react";
import styles from "./blog_err_message.module.css";
import type { BlogError } from "../../../utils/blog_err";

type Props = {
  blog_err: BlogError;
};

export const BlogErrorMessage: React.FC<Props> = (props) => {
  return (
    <div className={styles.error_message}>
      {get_err_message(props.blog_err)}
    </div>
  );
};

function get_err_message(blog_err: BlogError) {
  if (blog_err.ext_lib?.lib_message) {
    return blog_err.ext_lib.lib_message;
  }

  return blog_err.message;
}
