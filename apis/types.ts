import { Comment } from "@prisma/client";

export type CommentInput = Pick<Comment, "content" | "blogId">;
