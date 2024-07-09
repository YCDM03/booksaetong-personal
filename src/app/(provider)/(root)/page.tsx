import PostCard from '@/components/common/PostCard';
import PostList from '@/components/common/PostList';

function HomePage() {
  const post = {
    imgURL: '/assets/img/example_img.jpg',
    title: '책 팔아요',
    price: 19200,
    location: '경기 용인시 시흥구'
  };
  return (
    <div className="flex flex-col items-center max-w-[1024px] mx-auto my-10">
      <PostList title="전체도서목록 ">
        <ul className="flex">
          <PostCard post={post} />
        </ul>
      </PostList>
      <PostList title="내 근처 도서 ">
        <ul className="flex">
          <PostCard post={post} />
        </ul>
      </PostList>
    </div>
  );
}

export default HomePage;
