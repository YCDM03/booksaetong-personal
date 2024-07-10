import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

function EmptyState() {
  const router = useRouter();

  const handlePostClick = () => {
    router.push('/post');
  };
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="w-24 h-24 mb-6">
        <Image src="/assets/img/box.png" width={150} height={150} alt="Empty" />
      </div>
      <p className="text-gray-600 mb-4">현재 판매내역이 존재하지 않습니다.</p>
      <button onClick={handlePostClick} className="bg-main hover:bg-hover text-white px-7 py-3 rounded">
        판매 등록하기
      </button>
    </div>
  );
}

export default EmptyState;
