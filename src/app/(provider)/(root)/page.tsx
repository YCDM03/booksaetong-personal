'use client';
import { getAllPostList } from '@/api/mainApi';
import Loading from '@/components/common/Loading/LoadingCenter';
import PostCard from '@/components/common/PostCard';
import PostList from '@/components/common/PostList';
import SwiperButton from '@/components/common/Swiper/SwiperButton';
import EmptyState from '@/components/EmptyState';
import { Posts } from '@/types/Post.type';
import { useUserStore } from '@/zustand/userStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { RiArrowLeftWideLine, RiArrowRightWideLine } from 'react-icons/ri';
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
    <div className="flex flex-col items-center max-w-[1024px] mx-auto my-10 box-border">
      <PostList title="전체도서목록">
        <>
          <Swiper
            className="w-full"
            modules={[Navigation]}
            slidesPerView={4}
            spaceBetween={50}
            navigation={{
              nextEl: '.swiper-button-next-all-custom',
              prevEl: '.swiper-button-prev-all-custom'
            }}
          >
            {allPosts?.map((post, index) => {
              if (index > 9) return false;
              return (
                <SwiperSlide key={post.id}>
                  <PostCard post={post} />
                </SwiperSlide>
              );
            })}
          </Swiper>
          <SwiperButton intent="allRight">
            <RiArrowRightWideLine size={40} color="white" />
          </SwiperButton>
          <SwiperButton intent="allLeft">
            <RiArrowLeftWideLine size={40} color="white" />
          </SwiperButton>
        </>
      </PostList>

      <PostList title="내 근처 도서">
        {address ? (
          locatedPosts && locatedPosts.length > 0 ? (
            <>
              <Swiper
                className="w-full"
                modules={[Navigation]}
                slidesPerView={4}
                spaceBetween={50}
                navigation={{
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom'
                }}
              >
                {locatedPosts.map((post, index) => {
                  if (index > 9) return false;
                  return (
                    <SwiperSlide key={post.id}>
                      <PostCard post={post} />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <SwiperButton intent="areaRight">
                <RiArrowRightWideLine size={40} color="white" />
              </SwiperButton>
              <SwiperButton intent="areaLeft">
                <RiArrowLeftWideLine size={40} color="white" />
              </SwiperButton>
            </>
          ) : (
            <div className="flex w-full h-fit justify-center items-center">
              <EmptyState empty="주소 근처에 도서가" isButtonExist={false} />
            </div>
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
