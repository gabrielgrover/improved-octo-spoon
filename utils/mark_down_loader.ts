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
