'use client';

import React, { useState } from 'react';
import SwiperSlider from '../common/Swiper/Slider';
import Link from 'next/link';
import { HeartIcon } from '@heroicons/react/outline'; // outline로 변경

export interface Product {
  id: string;
  created_at: string;
  title: string;
  category: string;
  price: number;
  contents: string;
  latitude: number;
  longitude: number;
  user_id: string;
  address: string;
}

interface ProductCardProps {
  products: Product[];
  productImages: { [key: string]: string[] };
  userData: any[];
}

const ProductCard: React.FC<ProductCardProps> = ({ products, productImages, userData }) => {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    // 좋아요 상태를 서버에 저장하거나 로컬 상태만 변경할 수 있습니다.
  };

  return (
    <>
      {products.length > 0 && (
        <div className="container flex justify-center my-10">
          <div className=" w-[1440px] h-[480px] border-transparent rounded-md flex items-center place-content-evenly shadow-detail">
            <div className="w-[500px] h-[400px]">
              {productImages[products[0].id] ? (
                <SwiperSlider images={productImages[products[0]?.id]} />
              ) : (
                <p>이미지를 불러오는 중...</p>
              )}
            </div>
            <div className="rounded-md w-[500px] h-[400px] flex flex-col justify-between p-4">
              <div>
                <div>
                  <p className="font-bold text-3xl">{products[0].title}</p>
                  <div className="flex itezms-center">
                    <HeartIcon
                      className={`h-6 w-6 text-red-500 cursor-pointer ${
                        liked ? 'text-red-600 fill-current' : 'text-gray-400 stroke-current'
                      }`}
                      onClick={toggleLike}
                    />
                  </div>
                </div>
                <p className="text-gray">{products[0].address}</p>
                <p className="my-4 text-lg">{products[0].price}원</p>
                <p>{products[0].contents}</p>
              </div>
              <div className="flex items-center space-x-2">
                {userData.length > 0 && (
                  <img
                    src={
                      userData[0].profile_url ||
                      'https://wwqtgagcybxbzyouattn.supabase.co/storage/v1/object/public/avatars/profiles/550e8400-e29b-41d4-a716-446655440000/default_profile.png'
                    }
                    alt="유저 프로필 이미지"
                    className="object-cover w-10 h-10 rounded-full mr-4"
                  />
                )}
                <div>
                  <p>{products[0].user_id}</p>
                  <p className="text-gray">{products[0].address}</p>
                </div>
                {userData.length > 0 && products.length > 0 && (
                  <Link href={`/editpage/${products[0].id}`}>
                    <button
                      className={`mt-2 bg-main text-white w-40 h-10 rounded-md ${
                        products[0].user_id === userData[0].id ? '' : 'hidden'
                      }`}
                    >
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
