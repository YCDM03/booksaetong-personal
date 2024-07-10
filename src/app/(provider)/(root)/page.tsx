'use client';
import PostCard from '@/components/common/PostCard';
import PostList from '@/components/common/PostList';
import { supabase } from '@/contexts/supabase.context';
import { Post } from '@/types/Post.type';
import { useEffect, useState } from 'react';

type Posts = Post & {
  product_images: {
    img_url: string;
  };
};

function HomePage() {
  const [allPosts, setAllPosts] = useState<Posts[]>();
  const post = {
    imgURL: '/assets/img/example_img.jpg',
    title: '책 팔아요',
    price: 19200,
    location: '경기 용인시 시흥구'
  };

  useEffect(() => {
    (async () => {
      const { data: posts, error } = await supabase.from('products').select(`*, product_images(image_url)`);
      if (error) return console.log(error);
      console.log(posts);
      setAllPosts(posts);
    })();
  }, []);

  return (
    <div className="flex flex-col items-center max-w-[1024px] mx-auto my-10">
      <PostList title="전체도서목록 ">
        <ul className="flex">
          {allPosts?.map((post) => {
            return <PostCard key={post.id} post={post} />;
          })}
        </ul>
      </PostList>
      <PostList title="내 근처 도서 ">
        <ul className="flex"></ul>
      </PostList>
    </div>
  );
}

export default HomePage;
