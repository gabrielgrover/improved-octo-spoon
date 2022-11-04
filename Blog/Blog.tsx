import styles from "./styles.module.css";

type Props = {
  html: string;
};

export const Blog = (props: Props) => {
  return (
    <div
      className={styles.container}
      dangerouslySetInnerHTML={{ __html: props.html }}
    />
  );
};
