import { Posts } from '@/types/Post.type';
import Image from 'next/image';
import Link from 'next/link';

type PostCardProps = {
  post: Posts;
};

function PostCard({ post }: PostCardProps) {
  const { product_images, title, address, price } = post;
  const img_url = !product_images[0].image_url && product_images[0].image_url.length < 0 ? '' : product_images[0].image_url;

  const formatPrice = (price: number): string => {
    const formated = new Intl.NumberFormat('en-US').format(price);
    return formated;
  };

  return (
    <Link href={`/detail/${post.id}`} className="w-fit">
      <div className="flex flex-col w-[220px] h-[350px] gap-y-2 cursor-pointer">
        <div className="relative aspect-square my-3">
          <Image src={img_url} alt="판매글 대표이미지" fill className="object-cover rounded-lg border" />
        </div>
        <h6 className="text-md overflow-hidden text-ellipsis whitespace-nowrap">{title}</h6>
        <p className="text-sm font-semibold">{formatPrice(price)}원</p>
        <p className="text-gray-600 text-xs">{address}</p>
      </div>
    </Link>
  );
}

export default PostCard;
