import type { NextPage } from 'next';
import KakaoMap from '@/components/common/KakaoMap';

const WriterPage: NextPage = () => {
  return (
    <div className="flex ">
      <main className="absolute w-screen h-screen left-0 top-0">
        <KakaoMap />
      </main>
    </div>
  );
};

export default WriterPage;
