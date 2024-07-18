'use client';

import AuthAlert from '@/components/Auth/AuthAlert';
import { useHeaderAlertStore } from '@/zustand/alertStore';
import useSearchStore, { SearchStoreType } from '@/zustand/searchStore';
import { useUserStore } from '@/zustand/userStore';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, MouseEventHandler, useState } from 'react';
import HeaderButton from './HeaderButton';

function Header() {
  const { message, forLogin, success, setSuccessAlert, setErrorAlert, clearAlert } = useHeaderAlertStore((state) => ({
    message: state.message,
    forLogin: state.forLogin,
    success: state.success,
    setSuccessAlert: state.setSuccessAlert,
    setErrorAlert: state.setErrorAlert,
    clearAlert: state.clearAlert
  }));
  const router = useRouter();
  const currentPathName = usePathname();
  const { nickname, clearUser } = useUserStore((state) => ({
    nickname: state.nickname,
    clearUser: state.clearUser
  }));

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const { setKeyword } = useSearchStore<SearchStoreType>((state) => state);
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
    const response = await fetch('/api/auth/logout', {
      method: 'POST'
    });
    const { message, errorMsg }: { message: string | null; errorMsg: string | null } = await response.json();
    if (errorMsg) {
      return setErrorAlert(errorMsg);
    } else if (message) {
      clearUser();
      setSuccessAlert(message, false, true);
    }

    currentPathName.includes('mypage') || currentPathName.includes('edit') || currentPathName.includes('post')
      ? router.push('/login')
      : null;
  };

  return (
    <header className="flex w-full h-[160px] min-w-[350px] lg:h-[70px] sm:h-[100px] shadow-lg shadow-gray-100 justify-center">
      <AuthAlert message={message} onClose={clearAlert} forLogin={forLogin} success={success} />
      <div className="flex  items-center   w-screen max-w-[1200px] lg:flex-row lg:justify-between flex-col justify-center sm:gap-4">
        <div className="flex items-center gap-0 flex-col lg:flex-row sm:flex-row sm:gap-8 justify-center ">
          <Link href={'/'}>
            <Image
              src="https://wwqtgagcybxbzyouattn.supabase.co/storage/v1/object/public/avatars/booksaetong_logo.png"
              width={230}
              height={58}
              alt="북새통 로고"
              className="h-12 w-auto"
            />
          </Link>
          <nav>
            <ul className="flex cursor-pointer text-sm text-gray-600 sm:gap-8 gap-3 min-w-[300px] justify-center">
              <Link href={'/list/all'}>전체도서목록</Link>
              <Link href={'/list/around'}>내 근처 도서</Link>
              {nickname ? (
                <Link href={'/mypage/profile'}>
                  <li>마이페이지</li>
                </Link>
              ) : (
                ''
              )}
            </ul>
          </nav>
        </div>
        <div className="flex sm:gap-x-3 sm:gap-y-0 sm:flex-row flex-col items-center gap-2">
          <form className="flex flex-row relative justify-center" onSubmit={onSubmit}>
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
          <div>
            {nickname ? (
              <div className="flex w-[300px] justify-center sm:gap-2 sm:w-full gap-10 ">
                <Link href={'/post'}>
                  <HeaderButton intent="login">글쓰기</HeaderButton>
                </Link>
                <HeaderButton intent="logout" onClick={handleLogout}>
                  로그아웃
                </HeaderButton>
              </div>
            ) : (
              <div className="flex w-[300px] justify-center sm:gap-2 sm:w-full gap-10 ">
                <Link href={'/signup'}>
                  <HeaderButton intent="signUp">회원가입</HeaderButton>
                </Link>
                <Link href={'/login'}>
                  <HeaderButton intent="login">로그인</HeaderButton>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
