import { Posts } from '@/types/Post.type';
import Image from 'next/image';
import Link from 'next/link';

type PostCardProps = {
  post: Posts;
};

function PostCard({ post }: PostCardProps) {
  const { product_images, title, address, price } = post;
  const img_url = product_images[0]?.image_url;

  return (
    <Link href={`/detail/${post.id}`}>
      <div className="flex flex-col w-[220px] h-[350px] gap-y-3 text-sm px-3 cursor-pointer">
        <div className="relative aspect-square my-3">
          <Image src={img_url} alt="판매글 대표이미지" fill className="object-cover rounded-lg border" />
        </div>
        <h6 className=" font-semibold">{title}</h6>
        <p className="text-gray-600">{address}</p>
        <p className="text-gray-600">{price}</p>
      </div>
    </Link>
  );
}

export default PostCard;
