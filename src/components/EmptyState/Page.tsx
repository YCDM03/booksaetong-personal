import Image from 'next/image';
import { useRouter } from 'next/navigation';

type EmptyProps = {
  empty: string;
  isButtonExist?: boolean;
};

function EmptyState({ empty, isButtonExist = true }: EmptyProps) {
  const router = useRouter();

  const handlePostClick = () => {
    if (empty === '판매내역이') return router.push('/post');
    if (empty === '회원 정보가') return router.push('/login');
  };
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="w-24 h-24 mb-6">
        <Image src="/assets/img/box.png" width={150} height={150} alt="Empty" />
      </div>
      <p className="text-gray-600 mb-4">{`현재 ${empty} 존재하지 않습니다.`}</p>
      {isButtonExist && (
        <button onClick={handlePostClick} className="bg-main hover:bg-hover text-white px-7 py-3 rounded">
          등록하기
        </button>
      )}
    </div>
  );
}

export default EmptyState;
