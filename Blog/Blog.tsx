import styles from "./styles.module.css";

type Props = {
  html: string;
};

export const Blog = (props: Props) => {
  //

  //const __html = props.html;
  //return <div>hello @ id {props.id}</div>;

  return (
    <div
      className={styles.container}
      dangerouslySetInnerHTML={{ __html: props.html }}
    />
  );
};

function asyncComponent<T, R>(fn: (arg: T) => Promise<R>): (arg: T) => R {
  return fn as (arg: T) => R;
}
