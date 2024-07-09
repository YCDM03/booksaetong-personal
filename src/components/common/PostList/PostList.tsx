import { PropsWithChildren } from 'react';

interface ListProps {
  title: string;
}

function PostList({ title, children }: PropsWithChildren<ListProps>) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default PostList;
