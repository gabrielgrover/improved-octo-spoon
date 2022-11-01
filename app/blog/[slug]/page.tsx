import { load_blog_html, Blog } from "../../../Blog";

type Props = {
  params: { slug: string };
  searchParams: { id: string };
};

const BlogPage = async (props: Props) => {
  const blog_id = props.params.slug;
  const html = await load_blog_html(blog_id);

  return <Blog html={html} />;
};

export default BlogPage;
