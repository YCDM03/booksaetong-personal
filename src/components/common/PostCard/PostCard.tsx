import { Tables } from '@/types/supabase';
import Image from 'next/image';

type Products = Tables<'products'>;
type Images = Tables<'product_images'>;

type Post = Products & {
  img_url: Images[];
};

type PostCardProps = {
  post: Post;
};

function PostCard({ post }: PostCardProps) {
  const { img_url, title, address, price } = post;
  return (
    <div className="flex flex-col w-[220px] h-[350px] gap-y-3 text-sm px-3">
      <div className="relative aspect-square my-3">
        <Image src={img_url} alt="판매글 대표이미지" fill className="object-cover" />
      </div>
      <h6 className=" font-semibold">{title}</h6>
      <p className="text-gray-600">{address}</p>
      <p className="text-gray-600">{price}</p>
    </div>
  );
}

export default PostCard;
