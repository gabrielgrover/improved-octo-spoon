import { Blog } from "../../../Blog";
import { load_blog_html, list_blogs } from "../../../apis/blog_api";
import styles from "./blog_page_styles.module.css";
//import { CommentSection } from "../../components/CommentSection";

type Props = {
  params: { slug: string };
};

const BlogPage = async (props: Props) => {
  const { slug } = props.params;
  const html = await load_blog_html(slug);

  return (
    <div className={styles.container}>
      <Blog html={html} />
      {/*
        Disabling comments for now.  Until we have moderation set up
        <CommentSection blog_id={slug} />
     */}
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
