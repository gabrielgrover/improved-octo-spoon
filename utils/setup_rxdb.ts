"use client";
import {
  addRxPlugin,
  createRxDatabase,
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxCollection,
  RxDatabase,
} from "rxdb";
import { replicateCouchDB } from "rxdb/plugins/replication-couchdb";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

addRxPlugin(RxDBDevModePlugin);

const COMMENTS_DB_URL = process.env["NEXT_PUBLIC_COMMENTS_DB_URL"];

export async function setup_rxdb(token: string) {
  const db = await createRxDatabase<BlogDatabase>({
    name: "blog",
    storage: getRxStorageDexie(),
  });

  const cs = await db.addCollections({
    comments: {
      schema: commentSchemaLiteral,
    },
  });

  remote_replication(cs.comments, token);

  return db;
}

function remote_replication(collection: CommentCollection, token: string) {
  if (!COMMENTS_DB_URL) {
    return;
  }

  return replicateCouchDB({
    collection,
    url: COMMENTS_DB_URL,
    live: true,
    fetch: (url, opts) => {
      console.log("fetching", url);
      return fetch(url, {
        ...opts,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    },
    pull: {
      /**
       * Amount of documents to be fetched in one HTTP request
       * (optional)
       */
      batchSize: 60,
      /**
       * Heartbeat time in milliseconds
       * for the long polling of the changestream.
       * @link https://docs.couchdb.org/en/3.2.2-docs/api/database/changes.html
       * (optional, default=60000)
       */
      heartbeat: 60000,
    },
    push: {
      /**
       * How many local changes to process at once.
       * (optional)
       */
      batchSize: 60,
    },
  });
}

const commentSchemaLiteral = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    blogId: {
      type: "number",
    },
    content: {
      type: "string",
    },
    createdAt: {
      type: "number",
    },
    updatedAt: {
      type: "number",
    },
  },
  required: ["blogId", "content", "createdAt", "updatedAt", "id"],
} as const;

const TypedCommentSchema = toTypedRxJsonSchema(commentSchemaLiteral);

export type Comment = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof TypedCommentSchema
>;

export type CommentCollection = RxCollection<Comment>;

export type BlogDatabaseCollections = {
  comments: CommentCollection;
};

export type BlogDatabase = RxDatabase<BlogDatabaseCollections>;
