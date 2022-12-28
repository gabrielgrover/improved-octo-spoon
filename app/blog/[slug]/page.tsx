import * as F from "fp-ts/function";
import * as E from "fp-ts/Either";
import { Blog } from "../../../Blog";
import { load_blog_html, list_blogs } from "../../../apis/blog_api";
import styles from "./blog_page_styles.module.css";
import { generate_api_token } from "../../../utils/api_token";
import { CommentSection } from "../../components/CommentSection";
import { BlogErrorMessage } from "../../components/BlogErrorMessage/BlogErrorMessage";

type Props = {
  params: { slug: string };
};

//export const revalidate = 0;

const BlogPage = async (props: Props) => {
  const { slug } = props.params;
  const html = await load_blog_html(slug);

  const comment_section = F.pipe(
    generate_api_token(),
    E.fold(
      (blog_err) => <BlogErrorMessage blog_err={blog_err} />,
      (token) => <CommentSection blog_id={slug} token={token} />
    )
  );

  return (
    <div className={styles.container}>
      <Blog html={html} />
      {comment_section}
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
