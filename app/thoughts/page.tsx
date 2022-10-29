import { list_blogs, get_blog_url } from "../../Blog";
import styles from "./styles.module.css";
import { ThoughtTile } from "./ThoughtTile";
import { PageHeading } from "../PageHeading";

const Thoughts = async () => {
  const blogs = await list_blogs();

  return (
    <div className={styles.ThoughtsContainer}>
      <PageHeading>My thoughts</PageHeading>
      {blogs.map((blog, idx) => (
        <ThoughtTile
          key={idx}
          title={blog.name}
          description={blog.description}
          url_path={get_blog_url(blog.id)}
          entry_date={blog.created_at}
        />
      ))}
    </div>
  );
};

export default Thoughts;
