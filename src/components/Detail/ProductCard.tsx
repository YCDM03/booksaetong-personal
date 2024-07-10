'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/contexts/supabase.context';
import SwiperSlider from '../common/Swiper/Slider';

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

interface ProductImage {
  id: number;
  product_id: string;
  image_url: string;
}

function ProductCard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productImages, setProductImages] = useState<{ [key: string]: string[] }>({});
  const [userData, setUserData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const { data: productData, error: productError } = await supabase.from('products').select('*');
      const { data: imageData, error: imageError } = await supabase
        .from('product_images')
        .select('product_id, image_url');
      const { data: userData, error: userError } = await supabase.from('users').select('*');

      if (productError) {
        console.error('Product data fetching error:', productError);
        return;
      }

      if (imageError) {
        console.error('Image data fetching error:', imageError);
        return;
      }

      if (userError) {
        console.error('User data fetching error:', userError);
        return;
      }

      // Group images by product_id
      const groupedImages: { [key: string]: string[] } = {};

      imageData.forEach((image) => {
        if (!groupedImages[image.product_id]) {
          groupedImages[image.product_id] = [];
        }
        groupedImages[image.product_id].push(image.image_url);
      });

      setProducts(productData || []);
      setProductImages(groupedImages);
      setUserData(userData || []);
    };

    fetchData();
  }, []);

  return (
    <>
      {products.length > 0 && (
        <div className="container flex justify-center my-10">
          <div className="rounded-md w-[1440px] h-[480px] border-transparent flex items-center place-content-evenly shadow-detail">
            <div className="rounded-md w-[500px] h-[400px] border-2 border-black">
              {productImages[products[0].id] ? (
                <SwiperSlider images={productImages[products[0].id]} />
              ) : (
                <p>이미지를 불러오는 중...</p>
              )}
            </div>
            <div className="rounded-md w-[500px] h-[400px] border-2 border-black flex flex-col justify-between p-4">
              <div>
                <p className="font-bold text-2xl">{products[0].title}</p>
                <p>좋아요</p>
                <p className="text-gray">{products[0].address}</p>
                <p className="my-2">{products[0].price}원</p>
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
                    className="object-cover w-20 h-20 rounded-full"
                  />
                )}
                <div>
                  <p>{products[0].user_id}</p>
                  <p className="text-gray]">{products[0].address}</p>
                </div>
                <button className="mt-2 bg-main text-white w-40 h-10 rounded-md">글 수정하기</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;
