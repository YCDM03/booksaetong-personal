'use client';

import useUserStore from '@/zustand/userStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEventHandler } from 'react';

function LoginPage() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email) {
      return alert('이메일을 입력해주세요');
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: formData
    });
    const { data, errorMsg } = await response.json();

    if (errorMsg === 'Invalid login credentials') {
      return alert('올바른 유저 정보를 입력해주세요');
    } else if (response.status === 200) {
      alert('로그인 성공!');
      const { address, email, nickname, sub }: { [key: string]: string } = data?.user.user_metadata;
      localStorage.setItem('user', JSON.stringify({ address, email, nickname, sub }));
      login({ address, email, nickname, sub });
      router.push('/');
    }
  };
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center content-center border">
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
            autoComplete="off"
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
