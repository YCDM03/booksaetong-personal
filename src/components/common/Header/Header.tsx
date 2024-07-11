'use client';

import useSearchStore, { searchStoreType } from '@/zustand/searchStore';
import { useUserStore } from '@/zustand/userStore';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, MouseEventHandler, useState } from 'react';
import HeaderButton from './HeaderButton';

function Header() {
  const router = useRouter();
  const currentPathName = usePathname();
  const { nickname, clearUser } = useUserStore((state) => ({
    nickname: state.nickname,
    clearUser: state.clearUser
  }));

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const { setKeyword } = useSearchStore<searchStoreType>((state) => state);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setKeyword(searchKeyword);
    setSearchKeyword('');
    if (currentPathName === '/list/all' || currentPathName === '/list/around') {
      router.push(`${currentPathName}`);
    } else {
      router.push('/list/all');
    }
  };

  const handleLogout: MouseEventHandler<HTMLButtonElement> = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST'
    });
    clearUser();
    alert('로그아웃 되었습니다.');
  };

  return (
    <header className="flex justify-center w-screen h-[70px] shadow-lg shadow-gray-100">
      <div className="flex flex-row items-center justify-between lg:w-2/3 md:w-full">
        <div className="flex items-center">
          <Link href={'/'}>
            <h1 className="text-xl font-semibold cursor-pointer">북새통</h1>
          </Link>
          <nav>
            <ul className="flex ml-20 cursor-pointer text-sm text-gray-600 gap-8">
              <Link href={'/list/all'}>전체도서목록</Link>
              <Link href={'/list/around'}>내 근처 도서</Link>
              <Link href={'/mypage/profile'}>
                <li>마이페이지</li>
              </Link>
            </ul>
          </nav>
        </div>
        <div className="flex gap-x-3">
          <form className="flex flex-row relative" onSubmit={onSubmit}>
            <Image
              src={'/assets/img/Search.png'}
              width={25}
              height={25}
              alt="searchIcon"
              className="absolute top-1.5 left-2"
            />
            <input
              value={searchKeyword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value)}
              type="text"
              placeholder="지역 or 책 이름을 검색해보세요"
              className="w-[300px] h-fit py-2 pl-10 pr-5 rounded-md border text-sm focus:outline-none"
            />
          </form>
          <Link href={'/signup'}>{nickname ? '' : <HeaderButton intent="signUp">회원가입</HeaderButton>}</Link>

          {nickname ? (
            <>
              <Link href={'/post'}>
                <HeaderButton intent="login">글쓰기</HeaderButton>
              </Link>
              <Link href={'/login'}>
                <HeaderButton intent="logout" onClick={handleLogout}>
                  로그아웃
                </HeaderButton>
              </Link>
            </>
          ) : (
            <Link href={'/login'}>
              <HeaderButton intent="login">로그인</HeaderButton>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
