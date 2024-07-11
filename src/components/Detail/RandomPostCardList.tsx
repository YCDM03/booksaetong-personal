import { useEffect, useState } from 'react';
import { supabase } from '@/contexts/supabase.context';
import PostCard from '../common/PostCard';
import { Posts } from '@/types/Post.type';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import Image from 'next/image';

const RandomPostCardList = () => {
  const [allPosts, setAllPosts] = useState<Posts[]>([]);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async (): Promise<void> => {
    try {
      const { data: allPostsData, error: allPostsError } = await supabase
        .from('products')
        .select('*, product_images(image_url)');

      if (allPostsError) {
        console.error('모든 상품 데이터 불러오기 오류:', allPostsError);
        return;
      }

      if (allPostsData) {
        shufflePosts(allPostsData);
      }
    } catch (error) {
      console.error('모든 상품 데이터 불러오기 오류:', error);
    }
  };

  const shufflePosts = (posts: Posts[]): void => {
    const shuffled = posts.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);
    setAllPosts(selected);
  };

  const handleShuffle = () => {
    fetchAllPosts();
  };

  const formatPrice = (price: number): string => {
    const formatted = new Intl.NumberFormat('en-US').format(price);
    return formatted;
  };

  return (
    <div className="flex flex-col items-center max-w-[1000px] mx-auto my-10">
      <div className="w-full">
        <div className="flex">
          <h2 className="text-2xl font-semibold my-5">랜덤 추천</h2>
          <button className="text-xs text-gray-400 ml-7 cursor-pointer hover:brightness-90" onClick={handleShuffle}>
            더 보기 {'>'}
          </button>
        </div>
        <div className="flex flex-row w-full h-[350px]">
          <Swiper className="custom-swiper-container" slidesPerView={4}>
            {allPosts.map((post) => (
              <SwiperSlide key={post.id}>
                <Link href={`/detail/${post.id}`}>
                  <div className="flex flex-col w-[220px] h-[350px] gap-y-2 cursor-pointer mx-5 px-3">
                    <div className="relative aspect-square my-3">
                      <Image
                        src={post.product_images?.[0]?.image_url || '/placeholder.jpg'}
                        alt="판매글 대표이미지"
                        fill
                        className="object-cover rounded-lg border"
                      />
                    </div>
                    <h6 className="text-md overflow-hidden text-ellipsis">{post.title}</h6>
                    <p className="text-sm font-semibold">{formatPrice(post.price)}원</p>
                    <p className="text-gray-600 text-xs">{post.address}</p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default RandomPostCardList;
