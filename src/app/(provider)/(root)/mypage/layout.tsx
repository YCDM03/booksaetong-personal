import Link from 'next/link';
import { PropsWithChildren } from 'react';

function layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-row max-w-[1224px] min-h-fit mx-auto my-10">
      <nav className="border w-[200px] h-[400px] py-10 rounded-md">
        <ul className="flex flex-col text-sm cursor-pointer">
          <Link href={'./profile'}>
            <li className="h-12 hover:bg-hover px-4">프로필 수정</li>
          </Link>
          <Link href={'./likes'}>
            <li className="h-12 hover:bg-hover px-4">관심목록</li>
          </Link>
          <Link href={'./mysell'}>
            <li className="h-12 hover:bg-hover px-4">판매내역</li>
          </Link>
        </ul>
      </nav>
      {children}
    </div>
  );
}

export default layout;
