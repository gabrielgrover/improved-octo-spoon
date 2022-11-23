# Wrapping Prisma with fp-ts utility functions


Salutations to you and the great void you hail from!  I hope this `void log` finds you well friendo!  I love functional programming.  It brings me a lot of joy.  However, most companies I have worked at don't really care for it.  The main argument against it being that it slows down most engineers, because most engineers learned different paradigms.  I get it though.  I can see it not being everyone's cup of tea.  But in my own personal projects, such as the `void log`, I can write whatever I god damn please.  Today, we will be writing some utility functions for creating and reading comments.  Many tutorials that discuss functional programming concepts tend to be theory focused and concrete examples are an after thought.  I prefer to go the opposite direction.  Examples first, then the theory is easier for me to grasp, after I have the muscle memory.  As usual, let us start with our dependencies.  This is, afterall, a nodejs project.

## Dependencies

  - `fp-ts` 
  - `Prisma`

The {green}([fp-ts](https://github.com/gcanti/fp-ts)) package is a library that gives you super functional programming powers in `TypeScript`.  Fold, Map, and Reduce to your heart's content.  All with great type inference and safety. {green}([Prisma](https://www.prisma.io/)) is basically an ORM.  Haven't used it before.  So far it has been pretty decent.  I haven't had to do anything complex with it though.  Let us take a look at our first function.

## get_comments

```typescript
export function get_comments(where?: Partial<Comment>) {
  const find = where
    ? () => prisma_client.comment.findMany({ where })
    : () => prisma_client.comment.findMany();

  const create_err = (e: unknown) =>
    GetCommentError("Failed to retrieve comment from database", {
      name: "Prisma",
      lib_message: String(e),
    });

  return TE.tryCatch(find, create_err);
}
```
There is a bit to unpack here.  The namespace `TE` stands for `TaskEither`.  You can kind of think of it as an {red}(`async`) function.  Take a look at the return statement.

```typescript
TE.tryCatch(find, create_err);
```

What this expression evaluates to is a function.  When that function is called it will run the `find` function.  

```typescript
const find = where
  ? () => prisma_client.comment.findMany({ where })
  : () => prisma_client.comment.findMany();
```

If the `find` function results in a promise rejection the `create_err` function will run.  The `fp-ts` library provides some useful utility functions that help us work with the `TaskEither`.  Here is an example.  

```typescript
const try_get_all_comments = pipe(
  get_comments(),
  TE.map((comments: Comment[]) => console.log(comments)),
  TE.mapLeft((e: BlogError) => console.error(e))
);

try_get_all_comments();
```
The pipe function does forward function composition.  The result of the call to `get_comments` is piped into the function returned from `TE.map`.  If the result of the call to `get_comments` fails then the callback inside `TE.map` is not called and is passed forward to `TE.mapLeft` and its callback to handle the failure.  What is returned from the callback in `TE.mapLeft` will be the result of the call to `try_get_all_comments()`.  If it is successful then the callback in `TE.map` will get called, and its return value is the value returned from the call to `try_get_all_comments()`. 

Here is the collection of functions used for creating comments.

```typescript
export function validate_and_add_comment(data: unknown) {
  return F.pipe(validate_comment_input(data), TE.chain(add_comment));
}

function validate_comment_input(comment_input: unknown) {
  const validation = S.object({
    content: S.size(S.string(), 7, Infinity),
    blogId: S.number(),
  });

  const validate = () => {
    S.assert(comment_input, validation);

    return comment_input;
  };

  const create_err = (e: unknown) =>
    InvalidCommentInputError({
      name: "Superstruct",
      lib_message: JSON.stringify(e, null, 2),
    });

  return F.pipe(
    E.tryCatch(validate, create_err),
    E.fold(TE.left, (comment_input) => TE.right(comment_input))
  );
}

function add_comment(comment_input: CommentInput) {
  return TE.tryCatch(
    () => prisma_client.comment.create({ data: comment_input }),
    (e) =>
      AddCommentError("Failed to add comment to database", {
        name: "Prisma",
        lib_message: String(e),
      })
  );
}
```

At the top we have `validate_and_add_comment`.  At a high level, it validates it's input and, if it is valid, makes a write to the `comments` table.  Most of the new stuff is in the `validate_comment_input` function.  Turn your attention to what it is returning. 

```typescript
...

return F.pipe(
  E.tryCatch(validate, create_err),
  E.fold(TE.left, (comment_input) => TE.right(comment_input))
);

...
```

The namespace `E` stands for `Either`.  It is basically the non `async` version of `TaskEither`.  The function returned from `E.fold` is a folding function.  Folding functions behave differently depending on their domain.  In this case (`Either`) it handles a success / failure.  If the `validate` function fails, then the `E.tryCatch` will call `create_err` and pass the result to the function in the first argument of `E.fold`.  If it is a success the return value gets passed to the second argument of `E.fold`.  Notice the `TE.left` and `TE.right` function calls in the folding function.  This converts to a `TaskEither`, `left` for failure `right` for success, which gives us the ability to call `TE.chain` in the `validate_and_add_comment` function.  

Here is our `/comments` endpoint.  Here you can see how the above functions are used in the project.  

```typescript
import type { NextApiRequest, NextApiResponse } from "next";
import * as F from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as BlogAPI from "../../../Blog/api";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const try_add_comment = F.pipe(
    BlogAPI.validate_and_add_comment(req.body),
    TE.map(() => res.status(201).send({ success: true })),
    TE.mapLeft((e) => res.status(400).json(e))
  );

  const try_get_all_comments = F.pipe(
    BlogAPI.get_comments(),
    TE.map((comments) => res.status(200).send({ comments })),
    TE.mapLeft((e) => res.status(400).send(e))
  );

  if (req.method === "POST") {
    try_add_comment();
  }

  if (req.method === "GET") {
    try_get_all_comments();
  }
}
```

## Conclusion

This was a very high level over view of a subset of `functional` programming concepts.  You can check out the {green}([repo](https://github.com/gabrielgrover/improved-octo-spoon)) for this project.  Clone it and take a look at some of the code we went over.  If you have an `IDE` with `TypeScript` support then you can look at how the type inference works with `fp-ts`.  Getting your hands dirty will help a lot.  The next void log we will be going over how to use the work we did and `NextJS` async components to render out comments stored in our database.  Flu season is here.  Becareful in your travels!
