import { Post } from '@/types/Post.type';
import Image from 'next/image';

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  const { imgURL, title, location, price } = post;
  return (
    <div className="flex flex-col w-[220px] h-[350px] gap-y-3 text-sm px-3">
      <div className="relative aspect-square my-3">
        <Image src={imgURL} alt="판매글 대표이미지" fill className="object-cover" />
      </div>
      <h6 className=" font-semibold">{title}</h6>
      <p className="text-gray-600">{location}</p>
      <p className="text-gray-600">{price}</p>
    </div>
  );
}

export default PostCard;
