import { useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';

interface ListProps {
  title: string;
}

function PostList({ title, children }: PropsWithChildren<ListProps>) {
  const router = useRouter();

  const handleClickView = () => {
    if (title === '전체도서목록') return router.push('/list/all');
    if (title === '내 근처 도서') return router.push('/list/around');
  };

  return (
    <div className="w-full">
      <div className="flex">
        <h2 className="text-2xl font-semibold my-5">{title}</h2>
        <button className="text-xs text-gray-400 ml-7 cursor-pointer hover:brightness-90" onClick={handleClickView}>
          View More{` >`}
        </button>
      </div>
      <div className="flex flex-row w-full h-[350px]">{children}</div>
    </div>
  );
}

export default PostList;
