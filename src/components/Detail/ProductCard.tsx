import React, { useEffect, useState } from 'react';
import SwiperSlider from '../common/Swiper/Slider';
import Link from 'next/link';
import { HeartIcon } from '@heroicons/react/outline';
import { supabase } from '@/contexts/supabase.context';
import { Product } from '@/app/(provider)/(root)/(product)/detail/[id]/page';
import { useUserStore } from '@/zustand/userStore';

interface ProductCardProps {
  products: Product[];
  productImages: { [key: string]: string[] };
  userData: any[];
}

const ProductCard: React.FC<ProductCardProps> = ({ products, productImages, userData }) => {
  const [liked, setLiked] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const { id: loggedInUserId } = useUserStore((state) => ({
    id: state.id
  }));

  useEffect(() => {
    const fetchLikedStatus = async () => {
      if (loggedInUserId && products.length > 0) {
        const { data, error } = await supabase
          .from('product_likes')
          .select('id')
          .eq('user_id', loggedInUserId)
          .eq('product_id', products[0].id)
          .single();

        if (error) {
          console.error('Error fetching like status:', error);
        } else if (data) {
          setLiked(true);
        }
      }
    };

    fetchLikedStatus();
  }, [loggedInUserId, products]);

  useEffect(() => {
    const fetchUserEmail = async () => {
      if (products.length > 0) {
        const { data, error } = await supabase.from('users').select('email').eq('id', products[0].user_id).single();

        if (error) {
          console.error('Error fetching user email:', error);
        } else if (data) {
          setUserEmail(data.email);
        }
      }
    };

    fetchUserEmail();
  }, [products]);

  const toggleLike = async (productId: string) => {
    if (!loggedInUserId) {
      alert('로그인이 필요합니다.');
      return;
    }

    setLiked((prevLiked) => !prevLiked);

    if (liked) {
      const { error } = await supabase
        .from('product_likes')
        .delete()
        .eq('user_id', loggedInUserId)
        .eq('product_id', productId);

      if (error) {
        console.error('Error deleting like:', error);
      }
    } else {
      const { error } = await supabase.from('product_likes').insert({ user_id: loggedInUserId, product_id: productId });

      if (error) {
        console.error('Error inserting like:', error);
      }
    }
  };

  const formatPrice = (price: number): string => {
    const formatted = new Intl.NumberFormat('en-US').format(price);
    return `${formatted}원`;
  };

  return (
    <>
      {products.length > 0 && (
        <div className="container flex justify-center my-10">
          <div className="w-[1440px] h-[480px] border-transparent rounded-md flex items-center place-content-evenly shadow-detail">
            <div className="w-[500px] h-[400px]">
              {productImages[products[0].id] ? (
                <SwiperSlider images={productImages[products[0]?.id]} />
              ) : (
                <p>이미지를 불러오는 중...</p>
              )}
            </div>
            <div className="rounded-md w-[500px] h-[400px] flex flex-col justify-between p-4">
              <div>
                <div className="flex">
                  <p className="font-bold text-3xl mr-5">{products[0].title}</p>
                  <div className="flex items-center">
                    <HeartIcon
                      className={`h-7 w-7 cursor-pointer ${
                        liked ? 'text-red-600 fill-current' : 'text-gray-400 stroke-current'
                      }`}
                      onClick={() => toggleLike(products[0].id)}
                    />
                  </div>
                </div>
                <p className="text-[#6A7280] mt-4">{products[0].address}</p>
                <p className="my-4 text-lg font-medium">{formatPrice(products[0].price)}</p>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  {userData.length > 0 && (
                    <img
                      src={
                        userData[0].profile_url ||
                        'https://wwqtgagcybxbzyouattn.supabase.co/storage/v1/object/public/avatars/profiles/550e8400-e29b-41d4-a716-446655440000/default_profile.png'
                      }
                      alt="유저 프로필 이미지"
                      className="object-cover w-12 h-12 rounded-full mr-2"
                    />
                  )}
                  <div>
                    <p className="mb-1 text-sm">{userEmail}</p>
                    <p className="text-[#6A7280] text-sm">{products[0].address}</p>
                  </div>
                </div>
                {loggedInUserId === products[0].user_id && (
                  <Link href={`/edit/${products[0].id}`}>
                    <button className="mt-6 bg-main text-white font-medium w-40 py-2.5 px-4 rounded-md hover:bg-hover">
                      글 수정하기
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
