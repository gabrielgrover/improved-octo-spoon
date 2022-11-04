import { readFile, readdir } from "fs/promises";
import { BlogMeta } from "./types";
import { load_mark_down_html } from "./mark_down_loader";

export const BLOGS_DIR = "Blog/blogs";

export function load_blog_html(blog_id: string) {
  const path_to_blog = `${BLOGS_DIR}/blog_${blog_id}/blog.md`;

  const html = load_mark_down_html(path_to_blog);

  return html;
}

export async function list_blogs(): Promise<BlogMeta[]> {
  const blog_dirs = (await readdir(BLOGS_DIR, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => `${BLOGS_DIR}/${dirent.name}`);

  const blogs: BlogMeta[] = await Promise.all(
    blog_dirs.map(async (dir) =>
      JSON.parse((await readFile(`${dir}/meta.json`)).toString())
    )
  );

  return blogs;
}

export async function get_all_blog_html() {
  const blog_metas = await list_blogs();

  return Promise.all(
    blog_metas.map(async (blog_meta) => ({
      ...blog_meta,
      html: await load_blog_html(String(blog_meta.id)),
    }))
  );
}

export function get_blog_url(blog_id: number) {
  return `/blog/${blog_id}`;
}
