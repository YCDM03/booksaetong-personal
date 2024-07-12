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

  return (
    <Page title="판매내역">
      {myPosts ? (
        <div>
          <ul className="grid grid-cols-4 gap-5 w-full h-full mt-10">
            {myPosts?.map((like) => {
              return <PostCard key={like.id} post={like} />;
            })}
          </ul>
        </div>
      ) : (
        <EmptyState empty="판매내역이" />
      )}
    </Page>
  );
}

export default MySellPage;
