//import { Blog } from "../../../Blog";

type Props = {
  params: { slug: string };
  searchParams: { id: string };
};

const BlogPage = (props: any) => {
  const blog_id = props.params.slug;
  console.log({ blog_id });

  return <div>hello id {blog_id}</div>;
};

export default BlogPage;
