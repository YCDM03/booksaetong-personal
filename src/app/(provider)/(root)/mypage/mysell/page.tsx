'use client';
import { getAllPostList } from '@/api/mainApi';
import Loading from '@/components/common/Loading/LoadingCenter';
import PostCard from '@/components/common/PostCard';
import EmptyState from '@/components/EmptyState';
import Page from '@/components/MyPage/Page';
import { useUserStore } from '@/zustand/userStore';
import { useQuery } from '@tanstack/react-query';

function MySellPage() {
  const { id } = useUserStore((state) => ({
    id: state.id
  }));

  const { data: allPosts, isPending } = useQuery({
    queryKey: [
      'myPostList',
      {
        keyword: `%%`,
        requestAddress: `%%`,
        requestLimit: 1000000
      }
    ],
    queryFn: getAllPostList
  });

  const myPosts = allPosts?.filter((post) => {
    return post.user_id === id;
  });

  if (isPending) return <Loading />;
  if (!myPosts) return <EmptyState empty="판매내역이" />;
  return (
    <Page title="판매내역">
      {myPosts.length > 0 ? (
          <div className="grid sm:grid-cols-custom-1 md:grid-cols-custom-2 lg:grid-cols-custom-3 xl:grid-cols-custom-4 gap-3 mt-10">
            {myPosts?.map((like) => {
              return <PostCard key={like.id} post={like} />;
            })}
          </div>

      ) : (
        <EmptyState empty="판매내역이" />
      )}
    </Page>
  );
}

export default MySellPage;
