import { Blog } from "../../Blog";
import { load_blog_html } from "../../apis/blog_api";
import { PageHeading } from "../components";
import { Constants } from "../../utils";
import styles from "./about.module.css";

const About = async () => {
  const blog_html = await load_blog_html(String(Constants.ABOUT_ME_BLOG_ID));

  return (
    <div className={styles.container}>
      <PageHeading>Void log 0</PageHeading>
      <Blog html={blog_html} />
    </div>
  );
};

export default About;
