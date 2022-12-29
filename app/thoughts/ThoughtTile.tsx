import Link from "next/link";
import styles from "./styles.module.css";
//import { DynamicLink } from "../components/DynamicLink";

type Props = {
  title: string;
  description: string;
  url_path: string;
  entry_date: number;
};

export function ThoughtTile(props: Props) {
  return (
    <div className={styles.ThoughtTile}>
      {/*<DynamicLink href={props.url_path}>{props.title}</DynamicLink>*/}
      <Link className={styles.LinkText} href={props.url_path}>
        {props.title}
      </Link>
      <div className={styles.Description}>{props.description}</div>
      <div>{new Date(props.entry_date).toDateString()}</div>
    </div>
  );
}
