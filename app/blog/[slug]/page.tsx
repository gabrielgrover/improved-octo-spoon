//import { Blog } from "../../../Blog";

type Props = {
  params: { slug: string };
  searchParams: { id: string };
};

const BlogPage = (props: any) => {
  const blog_id = props.params.slug;
  console.log({ blog_id });

  return <div>hello world</div>;
};

export default BlogPage;
