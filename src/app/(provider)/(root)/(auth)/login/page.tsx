'use client';

import { useRouter } from 'next/navigation';
import { FormEventHandler } from 'react';

function LoginPage() {
  const router = useRouter();

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);

    if (formData.get('email') === '') {
      alert('이메일은 필수 입력 값 입니다.');
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: formData
    });
    console.log(await response.json());
    if (response.status === 200) {
      alert('로그인 성공!');
      router.push('/');
    }
  };
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center content-center border">
      <form
        className="flex flex-col border w-1/5 h-2/5 justify-center items-center content-center gap-10"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <label htmlFor="input">이메일</label>
          <input className="border" type="email" name="email" placeholder="이메일을 입력해 주세요" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="input">비밀번호</label>
          <input className="border" type="password" name="password" placeholder="패스워드를 입력해 주세요" />
        </div>

        <button className="border px-4 py-1">로그인</button>
      </form>
    </div>
  );
}

export default LoginPage;
