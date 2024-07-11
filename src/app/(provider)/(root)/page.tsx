'use client';
import { getAllPostList } from '@/api/mainApi';
import Loading from '@/components/common/Loading/LoadingCenter';
import PostCard from '@/components/common/PostCard';
import PostList from '@/components/common/PostList';
import EmptyState from '@/components/EmptyState';
import { Posts } from '@/types/Post.type';
import { useUserStore } from '@/zustand/userStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

function HomePage() {
  const [locatedPosts, setLocatedPosts] = useState<Posts[] | undefined>();

  const { address } = useUserStore((state) => ({
    address: state.address
  }));

  const { data: allPosts, isPending } = useQuery({
    queryKey: [
      'mainList',
      {
        keyword: `%%`,
        requestAddress: `%%`,
        requestLimit: 1000000
      }
    ],
    queryFn: getAllPostList
  });

  console.log(allPosts);
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

  if (isPending) return <Loading />;
  return (
    <div className="flex flex-col items-center max-w-[1024px] mx-auto my-10">
      <PostList title="전체도서목록">
        <Swiper modules={[Navigation]} slidesPerView={4} navigation>
          {allPosts?.map((post, index) => {
            if (index > 9) return false;
            return (
              <SwiperSlide key={post.id}>
                <PostCard post={post} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </PostList>

      <PostList title="내 근처 도서">
        {address ? (
          locatedPosts && (
            <Swiper className="w-full" modules={[Navigation]} slidesPerView={4} navigation>
              {locatedPosts.map((post, index) => {
                if (index > 9) return false;
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
      </PostList>
    </div>
  );
}

export default HomePage;
