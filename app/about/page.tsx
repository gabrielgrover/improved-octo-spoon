import { Blog } from "../../Blog";
import { PageHeading } from "../components";
import { Constants } from "../../utils";

const About = () => {
  //const blog_html = await load_blog_html(String(Constants.ABOUT_ME_BLOG_ID));

  return (
    <>
      <PageHeading>Void log 0</PageHeading>
      <Blog id={String(Constants.ABOUT_ME_BLOG_ID)} />
    </>
  );
};

export default About;
