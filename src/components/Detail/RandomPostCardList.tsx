import { Posts } from '@/types/Post.type';
import { Swiper, SwiperSlide } from 'swiper/react';
import PostCard from '../common/PostCard';

interface RandomPostCardListProps {
  posts: Posts[];
}

const RandomPostCardList = ({ posts }: RandomPostCardListProps) => {
  return (
    <div className="flex flex-col items-center w-[1000px] mx-auto my-10">
      <div className="w-full">
        <div className="flex">
          <h2 className="text-2xl font-semibold my-[20px]">랜덤 추천</h2>
        </div>
        <div className="flex flex-row w-full h-[350px]">
          <Swiper className="custom-swiper-container" slidesPerView={4} spaceBetween={20}>
            {posts.map((post) => (
              <SwiperSlide key={post.id}>
                <PostCard post={post} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default RandomPostCardList;
