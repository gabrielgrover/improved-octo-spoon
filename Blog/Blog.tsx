type Props = {
  html: string;
};

export const Blog = (props: Props) => {
  return <div dangerouslySetInnerHTML={{ __html: props.html }} />;
};
