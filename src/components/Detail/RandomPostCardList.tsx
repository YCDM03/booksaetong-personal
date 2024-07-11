import { useEffect, useState } from 'react';
import { supabase } from '@/contexts/supabase.context';
import PostCard from '../common/PostCard';
import { Posts } from '@/types/Post.type';
import { Swiper, SwiperSlide } from 'swiper/react';

const RandomPostCardList = () => {
  const [allPosts, setAllPosts] = useState<Posts[]>([]);

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const fetchAllBooks = async (): Promise<void> => {
    try {
      const { data: allPosts, error: allPostsError } = await supabase
        .from('products')
        .select('*, product_images(image_url)');

      if (allPostsError) {
        console.error('All products fetching error:', allPostsError);
        return;
      }

      if (allPosts) {
        shufflePosts(allPosts);
      }
    } catch (error) {
      console.error('Fetch All books error:', error);
    }
  };

  const shufflePosts = (posts: Posts[]): void => {
    const shuffled = posts.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);
    setAllPosts(selected);
  };

  const handleShuffle = () => {
    fetchAllBooks();
  };

  return (
    <div className="flex flex-col items-center max-w-[1000px] mx-auto my-10">
      <div className="w-full">
        <div className="flex">
          <h2 className="text-2xl font-semibold my-5">랜덤 추천</h2>
          <button className="text-xs text-gray-400 ml-7 cursor-pointer hover:brightness-90" onClick={handleShuffle}>
            View More {'>'}
          </button>
        </div>
        <div className="flex flex-row w-full h-[350px]">
          <Swiper className="custom-swiper-container" slidesPerView={4}>
            {allPosts.map((post) => (
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
