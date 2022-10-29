import React from "react";
import styles from "./pageheading.module.css";

type Props = React.PropsWithChildren<object>;

export function PageHeading(props: Props) {
  return <div className={styles.title}>{props.children}</div>;
}
