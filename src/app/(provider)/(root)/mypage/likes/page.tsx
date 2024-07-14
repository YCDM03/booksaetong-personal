'use client';
import { myLikePost } from '@/api/myPageApi';
import Loading from '@/components/common/Loading/LoadingCenter';
import PostCard from '@/components/common/PostCard';
import EmptyState from '@/components/EmptyState';
import Page from '@/components/MyPage/Page';
import { useUserStore } from '@/zustand/userStore';
import { useQuery } from '@tanstack/react-query';

function LikePage() {
  const { id } = useUserStore((state) => ({
    id: state.id
  }));

  const { data: likes, isPending } = useQuery({
    queryKey: ['mylikeList', id],
    queryFn: () => myLikePost(id)
  });

  if (isPending) return <Loading />;
  if (!likes) return <EmptyState empty="관심 목록이" isButtonExist={false} />;
  return (
    <Page title="관심목록">
      {likes.length > 0 ? (
        <ul className="grid sm:grid-cols-custom-1 md:grid-cols-custom-2 lg:grid-cols-custom-3 xl:grid-cols-custom-4 gap-3 mt-10">
          {likes?.map((like) => {
            return <PostCard key={like.id} post={like} />;
          })}
        </ul>
      ) : (
        <EmptyState empty="관심 목록이" isButtonExist={false} />
      )}
    </Page>
  );
}

export default LikePage;
