import styles from "./styles.module.css";
import { load_blog_html } from "./api";

type Props = {
  id: string;
};

export const Blog = asyncComponent(async (props: Props) => {
  const __html = await load_blog_html(props.id);
  //

  return <div>hello id {props.id}</div>;

  // return (
  //   <div className={styles.container}>
  //     <div dangerouslySetInnerHTML={{ __html }} />{" "}
  //   </div>
  // );
});

function asyncComponent<T, R>(fn: (arg: T) => Promise<R>): (arg: T) => R {
  return fn as (arg: T) => R;
}
