import styles from "./styles.module.css";
import { CommentInput } from "../app/components/CommentInput/CommentInput";

type Props = {
  html: string;
};

export const Blog = (props: Props) => {
  return (
    <div className={styles.container}>
      <div dangerouslySetInnerHTML={{ __html: props.html }} />
      <div className={styles.comment_input_container}>
        <h2 className={styles.comment_heading}>Penny for your thoughts</h2>
        <CommentInput />
      </div>
    </div>
  );
};
