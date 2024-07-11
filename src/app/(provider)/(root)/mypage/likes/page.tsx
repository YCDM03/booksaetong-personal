'use client';
import { myLikePost } from '@/api/myPageApi';
import PostCard from '@/components/common/PostCard';
import Page from '@/components/MyPage/Page';
import { useUserStore } from '@/zustand/userStore';
import { useQuery } from '@tanstack/react-query';

function LikePage() {
  const { id } = useUserStore((state) => ({
    id: state.id
  }));

  const { data: likes } = useQuery({
    queryKey: ['mylikeList', id],
    queryFn: () => myLikePost(id)
  });

  console.log(likes);

  return (
    <Page title="관심목록">
      <ul className="grid grid-cols-4 gap-5 w-full h-full mt-10">
        {likes?.map((like) => {
          console.log(like);
          return <PostCard key={like.id} post={like} />;
        })}
      </ul>
    </Page>
  );
}

export default LikePage;
