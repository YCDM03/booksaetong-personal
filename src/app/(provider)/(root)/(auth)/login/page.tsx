'use client';

import AuthAlert from '@/components/Auth/AuthAlert';
import { LoadingCenter } from '@/components/common/Loading';
import { useUserStore } from '@/zustand/userStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEventHandler, useState } from 'react';

function LoginPage() {
  const router = useRouter();
  const { setUser } = useUserStore((state) => ({
    setUser: state.setUser
  }));

  const [authAlert, setAuthAlert] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const closeAuthAlert = () => {
    setAuthAlert('');
  };

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const emailRegExp = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if (!emailRegExp.test(email)) {
      setLoginSuccess(false);
      return setAuthAlert('올바른 이메일 양식을 입력해주세요');
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: formData
    });
    const { users, errorMsg } = await response.json();

    if (errorMsg === 'Invalid login credentials') {
      setLoginSuccess(false);
      return setAuthAlert(`유저 정보가 틀렸거나 존재하지 않습니다.`);
    } else if (response.status === 200) {
      setLoginSuccess(true);
      setAuthAlert('로그인 성공! 메인 페이지로 이동합니다.');
      const { id, nickname, address, email, profile_url }: { [key: string]: string } = users[0];
      setUser(id, email, nickname, profile_url, address);
      setTimeout(() => {
        router.push('/');
      }, 500);
      return <LoadingCenter />;
    }
  };

  return (
    <div className="max-w-screen h-screen flex flex-col justify-center items-center content-center">
      <AuthAlert message={authAlert} onClose={closeAuthAlert} forLogin={true} success={loginSuccess} />
      <h2 className="font-bold text-3xl">로그인</h2>
      <form
        className="flex flex-col w-96 h-96 justify-center items-center content-center gap-10"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <label className="text-sm text-slate-700" htmlFor="email">
            아이디
          </label>
          <input
            id="email"
            className="border w-80 h-8 rounded-md px-2"
            type="email"
            name="email"
            placeholder="아이디를 입력해 주세요"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-slate-700" htmlFor="password">
            비밀번호
          </label>
          <input
            id="password"
            className="border w-80 h-8 rounded-md px-2"
            type="password"
            name="password"
            placeholder="패스워드를 입력해 주세요"
            autoComplete="off"
            minLength={6}
            required
          />
        </div>

        <button className="border px-4 py-1 w-80 h-10 rounded-md bg-main text-white text-sm hover:brightness-90 active:brightness-75">
          로그인
        </button>
      </form>
      <div className="text-xs py-5 w-80 text-center text-slate-500">계정이 없으신가요?</div>
      <Link className="text-xs font-bold underline text-slate-500" href="/signup">
        회원가입 하기
      </Link>
    </div>
  );
}

export default LoginPage;
