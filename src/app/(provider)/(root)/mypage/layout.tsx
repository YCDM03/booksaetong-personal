import Image from 'next/image';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

function MypageLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-row max-w-[1224px] min-h-fit mx-auto my-10">
      <nav className="border w-[200px] h-[400px] py-10 rounded-md">
        <ul className="flex flex-col text-sm cursor-pointer">
          <Link href={'./profile'}>
            <Image src={'/assets/img/sidebar-img.png'} width={20} height={20} alt="프로필 아이콘" />
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

export default MypageLayout;
