import styles from "./pageheading.module.css";

type Props = {
  text: string;
};

export function PageHeading(props: Props) {
  return <div className={styles.title}>{props.text}</div>;
}
