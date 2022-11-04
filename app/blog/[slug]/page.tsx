import { Blog } from "../../../Blog";

type Props = {
  params: { slug: string };
  searchParams: { id: string };
};

const BlogPage = (props: any) => {
  const blog_id = props.params.slug;

  return <Blog id={blog_id} />;
};

export default BlogPage;
