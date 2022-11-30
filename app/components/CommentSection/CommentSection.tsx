import { CommentInput } from "../CommentInput/CommentInput";
import styles from "./comment_section_styles.module.css";
import { generate_api_token } from "../../../utils/api_token";
import * as F from "fp-ts/function";
import * as E from "fp-ts/Either";

type Props = {
  blog_id: string;
};

export const revalidate = 0;

export const CommentSection: React.FC<Props> = (props) => {
  const api_token = F.pipe(
    generate_api_token(),
    E.fold(
      (e) => e.message,
      (i) => i
    )
  );

  console.log({ api_token });

  return (
    <div className={styles.comment_input_container}>
      <h2 className={styles.comment_heading}>Penny for your thoughts</h2>
      <CommentInput blog_id={parseInt(props.blog_id)} />
    </div>
  );
};
