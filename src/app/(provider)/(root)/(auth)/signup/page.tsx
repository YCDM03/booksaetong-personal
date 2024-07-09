'use client';
import { FormEventHandler } from 'react';
import { FormState } from '@/types/auth/auth.type';

function SignUpPage() {
  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);

    if (formData.get('email') === '') {
      alert('이메일은 필수 입력 값 입니다.');
    }

    await fetch('/api/auth/signup', {
      method: 'POST',
      body: formData
    });
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center content-center border">
      <form
        className="flex flex-col border w-1/3 h-2/3 justify-center items-center content-center gap-10"
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
        <div className="flex flex-col">
          <label htmlFor="input">닉네임</label>
          <input className="border" type="text" name="nickname" placeholder="닉네임을 입력해 주세요" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="input">주소</label>
          <input className="border" type="text" name="address" placeholder="주소를 입력해 주세요(경기도 **시/군/구)" />
        </div>
        <button className="border px-4 py-1">가입</button>
      </form>
    </div>
  );
}

export default SignUpPage;
