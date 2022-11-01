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

## Directory structure {#directory-structure}

Here is the shape of the directory that contains my markdown files.

```
Blog/blogs
├── blog_1
│   ├── blog.md
│   └── meta.json          // <--- Generated via codeblock and markdown-it-highlightjs
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

This is the first example of my favorite new NextJS feature.


## Blog page 

Here is where my blog page is located in the project directory 

```
app
├── blog
   └── [slug]
       ├── page.tsx
       └── styles.module.css
```


