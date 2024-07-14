import { useEffect, useState } from 'react';
import { Posts } from '@/types/Post.type';
import { Swiper, SwiperSlide } from 'swiper/react';
import PostCard from '../common/PostCard';
import { fetchRandomPosts, Post } from '@/api/detail/randomPosts';

interface RandomPostCardListProps {
  posts: Post[];
}

const RandomPostCardList = ({ posts }: RandomPostCardListProps) => {
  const [visiblePosts, setVisiblePosts] = useState<Post[]>(posts);

  const shufflePosts = (array: Post[]) => {
    return array.sort(() => 0.5 - Math.random()).slice(0, 4);
  };

  const handleShuffle = async () => {
    try {
      const allPosts = await fetchRandomPosts();
      const shuffledPosts = shufflePosts(allPosts);
      setVisiblePosts(shuffledPosts);
    } catch (error) {
      console.error('랜덤 포스트 오류 :', error);
    }
  };

  useEffect(() => {
    handleShuffle();
  }, []);

  return (
    <div className="flex flex-col items-center w-[1000px] mx-auto my-10">
      <div className="w-full">
        <div className="flex">
          <h2 className="text-2xl font-semibold my-[20px]">랜덤 추천</h2>
          <button className="text-xs text-gray-400 ml-7 cursor-pointer hover:brightness-90" onClick={handleShuffle}>
            View More{` >`}
          </button>
        </div>
        <div className="flex flex-row w-full h-[350px]">
          <Swiper className="custom-swiper-container" slidesPerView={4} spaceBetween={20}>
            {visiblePosts?.map((post) => (
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
