import { Blog, list_blogs, load_blog_html } from "../../../Blog";

type Props = {
  params: { slug: string; html: string };
};

const BlogPage = async (props: any) => {
  const { slug } = props.params;

  const html = await load_blog_html(slug);

  //console.log({ html });

  return <div dangerouslySetInnerHTML={{ __html: html ?? "" }} />;
  //return <Blog html={html} />;
};

export async function generateStaticParams() {
  const blogs = await list_blogs();

  //console.log("typeof html", typeof blogs[0]?.html);
  //console.log({ blogs });

  return blogs.map((b) => ({
    slug: String(b.id),
  }));
}

export default BlogPage;
