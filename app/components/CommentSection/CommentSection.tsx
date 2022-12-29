import { CommentInput } from "../CommentInput/CommentInput";
import * as F from "fp-ts/function";
import * as E from "fp-ts/Either";
import styles from "./comment_section_styles.module.css";
import { generate_api_token } from "../../../utils/api_token";
import { BlogErrorMessage } from "../../components/BlogErrorMessage/BlogErrorMessage";

type Props = {
  blog_id: string;
};

export const CommentSection: React.FC<Props> = (props) => {
  const comment_input = F.pipe(
    generate_api_token(),
    E.fold(
      (blog_err) => <BlogErrorMessage blog_err={blog_err} />,
      (token) => (
        <CommentInput blog_id={parseInt(props.blog_id)} token={token} />
      )
    )
  );
  return (
    <div className={styles.comment_input_container}>
      <h2 className={styles.comment_heading}>Penny for your thoughts</h2>
      {comment_input}
    </div>
  );
};
