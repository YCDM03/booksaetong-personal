'use client';
import PostCard from '@/components/common/PostCard';
import PostList from '@/components/common/PostList';
import { supabase } from '@/contexts/supabase.context';
import { Posts } from '@/types/Post.type';
import { useEffect, useState } from 'react';
import 'swiper/css';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

function HomePage() {
  const [allPosts, setAllPosts] = useState<Posts[]>();

  useEffect(() => {
    (async () => {
      const { data: posts, error } = await supabase.from('products').select(`*, product_images(image_url)`);
      if (error) return console.log(error);
      console.log(posts);
      setAllPosts(posts as Posts[]);
    })();
  }, []);

  return (
    <div className="flex flex-col items-center max-w-[1024px] mx-auto my-10">
      <PostList title="전체도서목록 ">
        <Swiper className="flex flex-row w-full" modules={[Pagination]} slidesPerView={4} pagination={true}>
          {allPosts?.map((post) => {
            return (
              <SwiperSlide key={post.id} className="flex flex-row">
                <PostCard post={post} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </PostList>
      <PostList title="내 근처 도서 ">
        <Swiper className="flex flex-row w-full" modules={[Pagination]} slidesPerView={4} pagination={true}>
          {allPosts?.map((post) => {
            return (
              <SwiperSlide key={post.id} className="flex flex-row">
                <PostCard post={post} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </PostList>
    </div>
  );
}

export default HomePage;
