import { Blog, load_blog_html } from "../../Blog";
import { PageHeading } from "../PageHeading";
import { Constants } from "../../utils";

const About = async () => {
  const blog_html = await load_blog_html(String(Constants.ABOUT_ME_BLOG_ID));

  return (
    <>
      <PageHeading>Void log 0</PageHeading>
      <Blog html={blog_html} />
    </>
  );
};

export default About;
