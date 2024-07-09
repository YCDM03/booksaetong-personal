import PostCard from '@/components/common/PostCard';
import PostList from '@/components/common/PostList';

function HomePage() {
  return (
    <div>
      <PostList title="전체도서목록 ">
        <PostCard />
      </PostList>
    </div>
  );
}

export default HomePage;
