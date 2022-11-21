import { Blog } from "../../../Blog";
import { load_blog_html, list_blogs } from "../../../apis/blog_api";
import styles from "./blog_page_styles.module.css";
import { CommentList } from "../../components/CommentList/CommentList";
import { CommentInput } from "../../components/CommentInput/CommentInput";

type Props = {
  params: { slug: string };
};

const BlogPage = async (props: Props) => {
  const { slug } = props.params;
  const html = await load_blog_html(slug);

  return (
    <div className={styles.container}>
      <Blog html={html} />
      <div className={styles.comment_input_container}>
        <h2 className={styles.comment_heading}>Penny for your thoughts</h2>
        <CommentInput blog_id={slug} />
      </div>
      <CommentList blog_id={slug} />
    </div>
  );
};

export async function generateStaticParams() {
  const blogs = await list_blogs();

  return blogs.map((b) => ({
    slug: String(b.id),
  }));
}

export default BlogPage;
