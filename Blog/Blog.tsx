import styles from "./styles.module.css";

type Props = {
  html: string;
};

export const Blog = (props: Props) => (
  <div className={styles.container}>
    <div dangerouslySetInnerHTML={{ __html: props.html }} />
  </div>
);
