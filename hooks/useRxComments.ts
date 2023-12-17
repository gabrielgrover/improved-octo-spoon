import { Comment } from "../utils/setup_rxdb";
import { BlogError, AddCommentError, GetCommentError } from "../utils/blog_err";
import React from "react";
import { stringify } from "../utils/stringify";
import * as F from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as T from "fp-ts/Task";
import type { Subscription } from "rxjs";
import { v4 as uuid } from "uuid";
import { useDatabase } from "../Providers/DatabaseProvider";

export type { Comment } from "../utils/setup_rxdb";

export const useRxComments = (blog_id: number) => {
  const { blog_db } = useDatabase();
  const [err, set_err] = React.useState<BlogError>();
  const [comments, set_comments] = React.useState<Record<string, Comment>>({});
  const [loading, set_loading] = React.useState(false);
  const sub_ref = React.useRef<Subscription | null>(null);

  const ack_err = React.useCallback(() => set_err(undefined), [set_err]);

  const add_comment = React.useCallback(
    async (content: string) => {
      if (!blog_db) {
        return;
      }

      if (err) {
        ack_err();
      }

      set_loading(true);

      const c: Comment = {
        content,
        id: uuid(),
        blogId: blog_id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      try {
        await blog_db.comments.insert(c);
      } catch (e) {
        const err = AddCommentError("Failed to add comment", {
          name: "rxdb",
          lib_message: stringify(e),
        });

        set_err(err);
      }

      set_loading(false);
    },
    [blog_db, err, ack_err]
  );

  const find_all_comments = React.useCallback(async () => {
    if (!blog_db) return [];

    return blog_db.comments.find({ selector: { blogId: blog_id } }).exec();
  }, [blog_db]);

  const to_comment_ledger = React.useCallback(
    (cs: Comment[]) => Object.fromEntries(cs.map((c) => [c.id, c])),
    []
  );

  const to_rxdb_comment_err = React.useCallback(
    (e: unknown) =>
      GetCommentError("Failed to fetch comment(s)", {
        name: "rxdb",
        lib_message: stringify(e),
      }),
    []
  );

  const build_comment_ledger = React.useCallback(
    F.pipe(
      TE.tryCatch(find_all_comments, to_rxdb_comment_err),
      TE.map(to_comment_ledger)
    ),
    [find_all_comments, to_comment_ledger, to_rxdb_comment_err]
  );

  const initialize_comment_ledger = React.useCallback(
    F.pipe(
      () => {
        set_loading(true);
        return build_comment_ledger();
      },
      TE.fold(
        (e) => T.of(set_err(e)),
        (cs) => T.of(set_comments(cs))
      ),
      T.map(() => set_loading(false))
    ),
    [build_comment_ledger, set_comments, set_err]
  );

  React.useEffect(() => {
    if (!blog_db) {
      return;
    }

    initialize_comment_ledger();

    sub_ref.current = blog_db.comments.$.subscribe((evt) => {
      set_comments((prev) => ({
        ...prev,
        [evt.documentData.id]: evt.documentData,
      }));
    });

    return () => {
      sub_ref.current?.unsubscribe();
    };
  }, [blog_db, initialize_comment_ledger]);

  return {
    comments: Object.values(comments),
    error: err,
    add_comment,
    loading,
  };
};
