'use client';
import { useRouter } from 'next/navigation';
import SelectArea from '@/components/Auth/SignupPage/SelectArea';

function SignUpPage() {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const area = formData.get('area') as string;
    const subArea = formData.get('subArea') as string;

    if (!area) {
      return alert('지역을 선택해주세요');
    } else if (!subArea) {
      return alert('시/군/구 를 선택해주세요');
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
    <div className="max-w-screen h-screen pb-40 flex flex-col justify-center items-center content-center">
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
            placeholder="비밀번호 6자리 이상 입력해 주세요"
            autoComplete="off"
            minLength={6}
            required
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
            required
          />
        </div>
        <div>
          <p className="text-sm ml-9 mb-3 font-medium text-gray-500">거주지를 선택해 주세요 !</p>
          <SelectArea />
        </div>
        <button className="border px-4 py-2 w-80 h-10 rounded-md bg-main text-white text-sm hover:brightness-90 active:brightness-75">
          회원가입
        </button>
      </form>
    </div>
  );
}

export default SignUpPage;
