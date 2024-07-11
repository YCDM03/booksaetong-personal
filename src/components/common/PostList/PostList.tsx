import { PropsWithChildren } from 'react';

interface ListProps {
  title: string;
}

function PostList({ title, children }: PropsWithChildren<ListProps>) {
  return (
    <div className="w-full">
      <div className="flex">
        <h2 className="text-2xl font-semibold my-5">{title}</h2>
        <button className="text-xs text-gray-400 ml-7 cursor-pointer hover:brightness-90">View More{` >`}</button>
      </div>
      <div className="flex flex-row h-[350px]">{children}</div>
    </div>
  );
}

export default PostList;
