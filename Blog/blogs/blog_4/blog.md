# Async Rendering NextJS Server Components with fp-ts

Greetings edge lord!  Hope your travels through the void have been filled with cringe hot takes and rug pulls.  Here, however, you will be seeing the approach I took to render comments on this site.  We will be referencing items covered in the last {#98c379}([`void log`](/blog/3)).  Read it if you wish.  This `void log` will stay high level.  Also, you can find all the code on {#98c379}([Github](https://github.com/gabrielgrover/improved-octo-spoon))!

## The NextJS Server Component {#server-component}

First let's take a look at the code for the blog page component.

```typescript
type Props = {
  params: { slug: string };
};

const BlogPage = async (props: Props) => {
  const { slug } = props.params;
  const html = await load_blog_html(slug);

  return (
    <div className={styles.container}>
      <Blog html={html} />
      <CommentSection blog_id={slug} />
    </div>
  );
};
```

Notice the `await`?  The blog page is an example of an Async Server component.  I go into detail about the blog page {#98c379}([here](/blog/2)).  What we are interested in is the `CommentSection` component.  We will go through the implementation in small chunks.  

### A small hack

There is an issue with typescript definitions for react right now.  If you import an Async Component and try to render it you get an error message saying something similar to the following.

{#e06c75}(`Component cannot be used as a JSX component. Its return type 'Promise<Element>' is not a valid JSX element.`)

To suppress this message we can use the following function 

```typescript
function async_component_wrapper<T, R>(
  fn: (arg: T) => Promise<R>
): (arg: T) => R {
  return fn as (arg: T) => R;
}
```

All the function really does is a type cast.  This enables us to use an Async Component and suppress the aforementioned error message.  Here is the `CommentSection` component with the wrapper function being used. 

```typescript
type Props = {
  blog_id: string;
};

export const CommentSection: React.FC<Props> = (props) => {
  return (
    <div className={styles.comment_input_container}>
      <h2 className={styles.comment_heading}>Penny for your thoughts</h2>
      <WrappedAsyncCommentSection {...props} />
    </div>
  );
};

const WrappedAsyncCommentSection = async_component_wrapper(AsyncCommentSection);
```

Now let's take a look at the `AsyncCommentSection` component.  This is where we wil be referencing items covered in the previous {#98c379}([`void log`](/blog/3)).

```typescript
async function AsyncCommentSection(props: Props) {
  const blog_id = parseInt(props.blog_id);

  const render_comment_section_or_err = F.pipe(
    get_comments(),
    TE.fold(render_err, render_comment_section(blog_id))
  );

  return render_comment_section_or_err();
}
```

The `render_comment_section_or_err` function calls `get_comments`, which can be a success or a failure.  The `TE.fold` will call `render_err` for a failure, and `render_comment_section` for a success. Keep in mind that `get_comments` is an async function.  It is grabbing comments from a database.  You can see the definition {#98c379}([here](/blog/3#get-comments)).  The `render_err` function is simple.  Here it is.  

```typescript
function render_err(blog_err: BlogError) {
  return T.of(<div>Failed to fetch comments: {blog_err.message}</div>);
}
```

This simple example shows one of my favorite features of the `fp-ts` package.  We get typesafe error handling, which is not possible with Promises.  It pairs very nicely with `Async Components`.  Now, the `render_comment_section`.

```typescript
function render_comment_section(blog_id: number) {
  return F.flow(
    generate_serialized_comments_for_blog_id(blog_id),
    T.map((comments) => (
      <CommentInput blog_id={blog_id} serialized_comments={comments} />
    ))
  );
}

function generate_serialized_comments_for_blog_id(id: number) {
  const filter_comments_for_blog_id = A.filter((c: Comment) => c.blogId === id);

  const to_serializable = A.map((c: Comment) => ({
    ...c,
    createdAt: c.createdAt.getTime(),
    updatedAt: c.updatedAt.getTime(),
  }));

  const filter_sort_map = F.flow(
    filter_comments_for_blog_id,
    sort_comments_by_created_at,
    to_serializable,
    T.of
  );

  return filter_sort_map;
}
```

You can think of `render_comment_section` merely as a set of data transformations.  If you are not used to `fp-ts` it will seem obfuscated, but what is happening is we are taking in an array of `Comments`, filtering them by `blog_id`, transforming each comment to a serializable data structure (more on that next), then creating a `CommentInput` component and passing the array of serialized comments to it.  Right here is where we have a boundary point between `Server Component` land and `Client Component` land.  

In `NextJS` you are able to render `Client Components` inside `Server Components`.  However if you wish to pass data (props) to the `Client Component` the data must be `serializable`.  It loosely has to survive a call to {#6644aa}(`JSON`){#bb1166}(`.stringify`) (on the server) and then a call to {#6644aa}(`JSON`){#bb1166}(`.parse`) (on the client).  Properties like {#ff7100}(`functions`), {#ff7100}(`Dates`), etc are a no go.  A `Comment` has two `Date` properties, {#ff7100}(`createdAt`) and {#ff7100}(`updatedAt`).  So we transform them to a `unix timestamp` which is a number and can be serialized by `NextJS`.

## The NextJS Client Component

The `CommentInput` component needs to be a `Client Component` because it will be taking in data from a user (i.e a comment) and we need to run some logic in response to a user submitting a comment.  Basically if you need to use any {#ff7100}(`React Hooks`) then it is a `Client Component`.  You can read more about this in the `NextJS` documentation.  Without further a do the `CommentInput` component.

```typescript
export const CommentInput: React.FC<Props> = (props) => {
  const { theme } = useTheme();
  const [content, set_content] = React.useState("");
  const { add_comment, add_comment_err, added_comments, loading } =
    useComment();

  const merged_comments = F.pipe(
    added_comments,
    A.map((c) => ({
      ...c,
      createdAt: c.createdAt.getTime(),
      updatedAt: c.updatedAt.getTime(),
    })),
    A.concat(props.serialized_comments),
    A.uniq(eq_serialized_comment)
  );

  const comment_input_styles =
    theme === "light" ? styles.comment_input_light : styles.comment_input_dark;

  return (
    <>
      <div className={styles.text_area_container}>
        <textarea
          className={comment_input_styles}
          name="comment"
          onChange={(e) => set_content(e.target.value)}
          value={content}
        />

        {add_comment_err && !loading && (
          <BlogErrorMessage blog_err={add_comment_err} />
        )}

        <SubmitCommentBtn
          loading={loading}
          on_click={() => {
            add_comment({ content, blogId: props.blog_id });
            set_content("");
          }}
        />
      </div>

      <Comments comments={merged_comments} />
    </>
  );
};
```

The above is a pretty average component.  The one thing of note we are doing is merging the comments comming in as props and the comment(s) a user adds, which come in a property returned from the {#ff7100}(`useComments`) hook.  This is the cool part of being able to weave {#ff7100}(`Client Components`) into {#ff7100}(`Server Components`).  Recall, that the {#98c379}([`Server Component`](/blog/4#server-component)) fetched comments and passed them as props to the {#ff7100}(`Client Component`).  That data fetch happens on the {#ff7100}(`server`), which means that when the {#ff7100}(`Client Component`) mounts/renders it does not need to fetch that data by sending a web request to some endpoint.  Al the {#ff7100}(`Client Component`) is concerned with is displaying the comments that came in as props and display new ones. There is one caveat about all of this that is worth going over.  

### The caveat

When a comment is added a request is sent to an endpoint defined in the `NextJS` project.  When that `POST` request is successful it responds with the comment that is created.  That comment is saved to a state variable in the {#ff7100}(`useComments`) hook.  I noticed when adding a comment that the a new `GET` request for the blog page would fire (not sure what is triggering this).  This would sometimes cause the new comment to display twice, because the `GET` request would trigger the {#ff7100}(`Server Component`) to fetch comments from the database and pass them to the {#ff7100}(`Client Component`).  That is a race condition, and therefore this was not a 100% occurrence.  Until I figure out why the `GET` request is fired and how to prevent it, the current fix is to just de-dup the list.  That is what is happening in {#ff7100}(`merged_comments`) variable in the code above.  

## Fin

Exploring the new features of `NextJS` has been fun.  It is really cool how fast you can get a fullstack app up and running with the `NextJS`/`Prisma`/`PlanetScale` combo.  I do want to move on to a new thing for a little bit.  I want to start messing around with `Rust` a lot more.   Maybe spin up an rpc service in linode or something.  We shall see!  Anyways, we are coming close to the end of the year.  Hopefully next year we can afford a full tank of gas!
