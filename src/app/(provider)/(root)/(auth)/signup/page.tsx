'use client';
import { FormEventHandler } from 'react';
import { FormState } from '@/types/auth/auth.type';
import { useRouter } from 'next/navigation';

function SignUpPage() {
  const router = useRouter();
  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const nickname = formData.get('nickname') as string;
    const address = formData.get('address') as string;

    if (!email) {
      return alert('이메일을 입력해주세요');
    } else if (password.length < 6) {
      return alert('비밀번호를 6자리 이상 입력해주세요');
    } else if (!nickname) {
      return alert('닉네임을 입력해주세요');
    } else if (!address) {
      return alert('주소를 입력해주세요');
    }

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      body: formData
    });
    const { data, errorMsg } = await response.json();
    if (errorMsg === 'User already registered') {
      return alert('이미 가입된 유저입니다!');
    }
    alert('가입이 완료되었습니다.');
    router.push('/login');
  };

  return (
    <div className="w-screen h-screen pb-40 flex flex-col justify-center items-center content-center border">
      <h2 className="font-bold text-3xl my-20">회원가입</h2>
      <form className="flex flex-col w-96  justify-center items-center content-center gap-10" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label className="text-sm text-slate-700" htmlFor="email">
            이메일
          </label>
          <input
            id="email"
            className="border w-80 h-8 rounded-md px-2"
            type="email"
            name="email"
            placeholder="이메일을 입력해 주세요"
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
            placeholder="비밀번호 6자리 이상 입력해 주세요"
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-slate-700" htmlFor="nickname">
            닉네임
          </label>
          <input
            id="nickname"
            className="border w-80 h-8 rounded-md px-2"
            type="text"
            name="nickname"
            placeholder="닉네임을 입력해 주세요"
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-slate-700" htmlFor="address">
            주소
          </label>
          <input
            id="address"
            className="border w-80 h-8 rounded-md px-2"
            type="text"
            name="address"
            placeholder="주소를 입력해 주세요(경기도 **시/군/구)"
            autoComplete="off"
          />
        </div>
        <button className="border px-4 py-2 w-80 h-10 rounded-md bg-main text-white text-sm hover:brightness-90 active:brightness-75">
          회원가입
        </button>
      </form>
    </div>
  );
}

export default SignUpPage;
