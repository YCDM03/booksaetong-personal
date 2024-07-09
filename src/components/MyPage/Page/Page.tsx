import { PropsWithChildren } from 'react';

interface MypageProps {
  title: string;
}

function Page({ title, children }: PropsWithChildren<MypageProps>) {
  return (
    <main className="w-full ml-10">
      <div className="border-b-[1px] px-10 py-5">
        <h1 className="text-2xl font-semibold mb-4">{title}</h1>
        <p className="text-xs text-gray-500">
          마이페이지 {`>`} {title}
        </p>
      </div>
      {children}
    </main>
  );
}

export default Page;
