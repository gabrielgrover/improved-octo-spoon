import type { NextApiRequest, NextApiResponse } from "next";
import * as BlogAPI from "../../../Blog/api";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const comments_handler = create_comments_handler(req, res);

  comments_handler(req.method);
}

function create_comments_handler(req: NextApiRequest, res: NextApiResponse) {
  const add_comment = BlogAPI.validate_and_add_comment(
    (e) => res.status(400).json(e),
    () => res.status(201)
  );
  const get_comments = BlogAPI.get_comments(
    (e) => res.status(400).json(e),
    (comments) => res.status(200).json({ comments })
  );

  const handle_post = () => {
    console.log("handling post");
    add_comment(req.body);
  };

  const handle_get = () => {
    get_comments();
  };

  return (method?: string) => {
    switch (method) {
      case "GET":
        handle_get();
      case "POST":
        handle_post();

      default:
        res.status(500);
    }
  };
}
