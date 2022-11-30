import { CommentInput } from "../CommentInput/CommentInput";
import styles from "./comment_section_styles.module.css";

type Props = {
  blog_id: string;
};

export const CommentSection: React.FC<Props> = (props) => {
  return (
    <div className={styles.comment_input_container}>
      <h2 className={styles.comment_heading}>Penny for your thoughts</h2>
      <CommentInput blog_id={parseInt(props.blog_id)} />
    </div>
  );
};
