'use client';
import PostCard from '@/components/common/PostCard';
import PostList from '@/components/common/PostList';
import EmptyState from '@/components/EmptyState';
import { supabase } from '@/contexts/supabase.context';
import { Posts } from '@/types/Post.type';
import { useUserStore } from '@/zustand/userStore';
import { useEffect, useState } from 'react';
import 'swiper/css';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

function HomePage() {
  const [allPosts, setAllPosts] = useState<Posts[]>();
  const [locatedPosts, setLocatedPosts] = useState<Posts[] | undefined>();

  const { address } = useUserStore((state) => ({
    address: state.address
  }));

  useEffect(() => {
    (async () => {
      const { data: posts, error } = await supabase.from('products').select(`*, product_images(image_url)`);
      if (error) return console.log(error);
      setAllPosts(posts as Posts[]);
    })();
  }, []);

  useEffect(() => {
    const located = allPosts?.filter((post) => {
      if (!address) return false;
      const postAdd = post.address.split(' ');
      const userAdd = address?.split(' ');
      const postAddress = `${postAdd[0]} ${postAdd[1]}`;
      const userAddress = `${userAdd[0]} ${userAdd[1]}`;
      return postAddress === userAddress;
    });
    setLocatedPosts(located);
  }, [allPosts]);

  return (
    <div className="flex flex-col items-center max-w-[1024px] mx-auto my-10">
      <PostList title="전체도서목록">
        <Swiper className="custom-swiper-container" modules={[Navigation]} slidesPerView={4} navigation>
          {allPosts?.map((post) => {
            return (
              <SwiperSlide key={post.id}>
                <PostCard post={post} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </PostList>
      {/* 
      <PostList title="내 근처 도서">
        {address ? (
          locatedPosts && (
            <Swiper className="custom-swiper-container" modules={[Navigation]} slidesPerView={4} navigation>
              {locatedPosts.map((post) => {
                return (
                  <SwiperSlide key={post.id}>
                    <PostCard post={post} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )
        ) : (
          <div className="flex w-full h-fit justify-center items-center">
            <EmptyState empty="회원 정보가" />
          </div>
        )}
      </PostList> */}
      <PostList title="내 근처 도서">
        {address ? (
          <div className="flex">
            {locatedPosts?.map((post) => {
              return <PostCard key={post.id} post={post} />;
            })}
          </div>
        ) : (
          <div className="flex w-full h-fit justify-center items-center">
            <EmptyState empty="회원 정보가" />
          </div>
        )}
      </PostList>
    </div>
  );
}

export default HomePage;
