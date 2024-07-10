import Comments from '@/components/Detail/Comments';
import Location from '@/components/Detail/Location';
import ProductCard from '@/components/Detail/ProductCard';
import ProductIntro from '@/components/Detail/ProductIntro';
import { supabase } from '@/contexts/supabase.context';

function DetailPage() {
  return (
    <>
      <div className="flex justify-center">
        <div className="container mx-auto w-11/12 lg:w-[1440px] flex flex-col items-center">
          <ProductCard />

          <ProductIntro />

          <Location />

          <div className="w-full lg:w-[1200px] py-8">
            <h6 className="text-2xl font-bold mb-2">최근 도서</h6>
            <div>카드</div>
          </div>

          <Comments />
        </div>
      </div>
    </>
  );
}

export default DetailPage;
