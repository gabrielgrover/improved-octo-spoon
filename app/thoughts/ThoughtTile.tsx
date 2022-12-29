import Link from "next/link";
import styles from "./styles.module.css";

type Props = {
  title: string;
  description: string;
  url_path: string;
  entry_date: number;
};

export function ThoughtTile(props: Props) {
  return (
    <div className={styles.ThoughtTile}>
      <Link className={styles.LinkText} href={props.url_path} prefetch={false}>
        {props.title}
      </Link>
      <div className={styles.Description}>{props.description}</div>
      <div>{new Date(props.entry_date).toDateString()}</div>
    </div>
  );
}
