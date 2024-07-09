import { PropsWithChildren } from 'react';

interface ListProps {
  title: string;
}

function PostList({ title, children }: PropsWithChildren<ListProps>) {
  return (
    <div className="w-full">
      <div className="flex">
        <h2 className="text-2xl font-semibold my-5">{title}</h2>
        <button className="text-xs text-gray-400 ml-7">View More</button>
      </div>
      {children}
    </div>
  );
}

export default PostList;
