# Rendering markdown in NextJS 13

## Intro

Greetings!  I am sure it has been a long and busy day out in the void for you.  Joining me here is much appreciated.  I wanted to share how I got local markdown files rendering in my NextJS 13 project.  It is this very feature that has enabled me to communicate to the outside!  So, I thought it would be a great first topic for the `void log`.  This will also showcase my favorite new feature NextJS has.  May the void find use for this small contribution!

## Dependencies

I stand on the shoulders of giants.  Here are the npm packages I needed for this feature.  

- `markdown-it`
- `markdown-it-highlightjs`
- `markdown-it-imsize`
- `markdown-it-color` 

The `markdown-it` package is the package I am using to parse markdown into html so it can be rendered on a NextJS page.  The rest of the packages are plugins for `markdown-it`.  My favorite, and the most useful for me, is `markdown-it-highlightjs`.  This will allow me to render code blocks, which will be demonstrated in due time.  

## Blog Directory structure {#directory-structure}

Here is the shape of the directory that contains my markdown files.

```
Blog/blogs
├── blog_1
│   ├── blog.md
│   └── meta.json
└── blog_2
    ├── blog.md
    └── meta.json
```

Each blog is numbered and contains its own directory.  The `blog.md` file is the actual markdown, and `meta.json` contains meta data for the specific blog entry.  It looks like this{#blog-meta}

```typescript
type BlogMeta = {
  name: string;
  description: string;
  id: number;
  created_at: number;
  updated_at: number;
};
```

The meta data provides the content that is on the {blue}([Thoughts page](/thoughts)).  Before we go into that let's take a look at some helper functions that I created!

## Utilities

Since I am not using a database and just doing some `good ol' fashion disc readin!'`  I figured some helper functions would be [`helpful`](https://www.youtube.com/watch?v=6zXDo4dL7SU). 

### load_mark_down_html

Here is my code to load a markdown file and parse it using `markdown-it`.

```typescript
import { readFile } from "fs/promises";
import markdownIt from "markdown-it";
import highlightjs from "markdown-it-highlightjs";
//@ts-ignore
import image_size_plugin from "markdown-it-imsize";
import color_plugin from "markdown-it-color";

const md = markdownIt()
  .use(highlightjs)
  .use(image_size_plugin)
  .use(color_plugin, { inline: true });

const load_mark_down_file = (path: string) =>
  readFile(path)
    .then((buf) => buf.toString())
    .catch((e) =>
      Promise.reject(new Error(`Failed to load markdown file: ${e}`))
    );

const parse_md = (content: string) => {
  const mark_down_html_string = md.render(content);

  return mark_down_html_string;
};

export const load_mark_down_html = (path: string) =>
  load_mark_down_file(path).then(parse_md);
```

It might seem like a lot, but we are essentially doing two things.  We are reading a markdown file, with the `fs` API, into a string, and then passing that string to the render function from `markdown-it`.  The render function outputs an html string.  

### load_blog_html {#load-blog-html}

The following function is pretty straight forward.

```typescript
import { readFile, readdir } from "fs/promises";
import { BlogMeta } from "./types";
import { load_mark_down_html } from "./mark_down_loader";

export const BLOGS_DIR = "Blog/blogs";

export function load_blog_html(blog_id: string) {
  const path_to_blog = `${BLOGS_DIR}/blog_${blog_id}/blog.md`;

  const html = load_mark_down_html(path_to_blog);

  return html;
}
```

We are using the `load_mark_down_html` function defined above.  We need to construct the path to the markdown file to give to the `load_blog_html` function.  That path is the variable `path_to_blog`.  Examine it closesly and you will see that it matches the shape of the {blue}([directory structure](#directory-structure)).

### list_blogs

The `list_blogs` function is what is used on the `Thoughts` page to display blog meta data.  

```typescript
import { readFile, readdir } from "fs/promises";
import { BlogMeta } from "./types";
import { load_mark_down_html } from "./mark_down_loader";

export const BLOGS_DIR = "Blog/blogs";

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
```

This function gets all the sub directories in the `Blog/blogs` directory, i.e `blog_1` and `blog_2`, then grabs the `meta.json` file in each of those directories.  Returning a {blue}([BlogMeta](#blog-meta)) array.


### Blog component

We need to eventualy render the html that is returned from {blue}([load_blog_html](#load-blog-html)).  We simply make use of the `dangerouslySetInnerHTML` div property.  I know.  Very naughty... 

```typescript
import styles from "./styles.module.css";

type Props = {
  html: string;
};

export const Blog = (props: Props) => (
  <div className={styles.container}>
    <div dangerouslySetInnerHTML={{ __html: props.html }} />
  </div>
);
```


With all of that out of the way we can now show how these helper functions are even used to display my `void logs`!

## Thoughts page

Here is the thoughts page component.

```typescript
import { list_blogs, get_blog_url } from "../../Blog";
import styles from "./styles.module.css";
import { ThoughtTile } from "./ThoughtTile";
import { PageHeading } from "../PageHeading";

const Thoughts = async () => {
  const blogs = await list_blogs();

  return (
    <div className={styles.ThoughtsContainer}>
      <PageHeading>My thoughts</PageHeading>
      {blogs.map((blog, idx) => (
        <ThoughtTile
          key={idx}
          title={blog.name}
          description={blog.description}
          url_path={get_blog_url(blog.id)}
          entry_date={blog.created_at}
        />
      ))}
    </div>
  );
};

export default Thoughts;
```

This is the first example of my favorite new NextJS feature.  Notice the call to `list_blogs`.  Since this component is under the `app` directory `NextJS` assumes it is a server component.  This gives the ability to `await` a async function call in the body of a function component.  Before we would have to probably export a `getStaticProps` function if we were using NextJS, and if we were using a client side frame work we would need to use a mixture of `React.useEffect` and `React.useState`. Another important thing to notice/remember is that `list_blogs` is reading the filesystem on the `server`.  In `NextJS` we can now seemlessly write logic that fetches data on the server.  Again, no need for `getStaticProps`.  The logic can happen inside the function component definition.  In this case, the definition of the `Thoughts` component.    

The `ThoughtTile` component in the above code is where the link to the actual blog page is handled.  

```typescript
import Link from "next/link";
import styles from "./styles.module.css";

type Props = {
  title: string;
  description: string;
  url_path: string;
  entry_date: number;
};

export function ThoughtTile(props: Props) {
  return (
    <div className={styles.ThoughtTile}>
      <Link className={styles.LinkText} href={props.url_path}>
        {props.title}
      </Link>
      <div className={styles.Description}>{props.description}</div>
      <div>{new Date(props.entry_date).toDateString()}</div>
    </div>
  );
}
```

## Blog page 

In order to have a dynamic blog page we set up the directory like this. 

```
app
├── blog
   └── [slug]
       ├── page.tsx
       └── styles.module.css
```

When we use a sub directory named `[slug]` we can use routes like `/blog/1`, and the value `1` will show up in the props of the blog page component.  The pages of these routes will get generated at build time.  So we need to implement the `generateStaticParams` function.  In this function we get all the blogs and inject each blog id into a slug property.  NextJS will then pass that id to the `BlogPage` component.  We can then fetch the blog markdown with `load_blog_html` and passing the blog id stored in params.  

```typescript
import { Blog, list_blogs, load_blog_html } from "../../../Blog";

type Props = {
  params: { slug: string };
};

const BlogPage = async (props: Props) => {
  const { slug } = props.params;

  const html = await load_blog_html(slug);

  return <Blog html={html} />;
};

export async function generateStaticParams() {
  const blogs = await list_blogs();

  return blogs.map((b) => ({
    slug: String(b.id),
  }));
}

export default BlogPage;
```

## Conclusion

I hope this `void log` was able to show you how to render markdown files that are stored locally on the server.  I have been hearing a lot of good things about the Prisma.  For the next entry I will implement a commenting system for the `void log` using Prisma and Sqlite.  Until next time.  Blessings of the `void` upon thy mouth.
