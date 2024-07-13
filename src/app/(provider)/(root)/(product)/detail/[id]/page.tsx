'use client';

import Comments from '@/components/Detail/Comments';
import Location from '@/components/Detail/Location';
import ProductCard from '@/components/Detail/ProductCard';
import ProductIntro from '@/components/Detail/ProductIntro';
import RandomPostCardList from '@/components/Detail/RandomPostCardList';
import { supabase } from '@/contexts/supabase.context';
import Script from 'next/script';
import { useEffect, useState } from 'react';

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

export interface User {
  id: string;
  profile_url: string;
  nickname: string;
  address: string;
  email: string;
}

function DetailPage({ params }: { params: { id: string } }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productImages, setProductImages] = useState<{ [key: string]: string[] }>({});
  const [userData, setUserData] = useState<User[]>([]);
  const [isKakaoMapLoaded, setIsKakaoMapLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const { data: productData, error } = await supabase.from('products').select('*').eq('id', params.id);

      if (error) {
        console.error('product 데이터 불러오기 오류:', error);
        return;
      }

      // 이미지 불러오기
      const productIds = productData.map((product) => product.id);
      const { data: imageData, error: imageError } = await supabase
        .from('product_images')
        .select('product_id, image_url')
        .in('product_id', productIds);

      if (imageError) {
        console.error('이미지 불러오기 오류:', error);
        return;
      }

      // product_id 로 이미지 그룹화
      const groupedImages: { [key: string]: string[] } = {};
      imageData.forEach((image) => {
        if (!groupedImages[image.product_id]) {
          groupedImages[image.product_id] = [];
        }
        groupedImages[image.product_id].push(image.image_url);
      });

      setProducts(productData || []);
      setProductImages(groupedImages);

      // user정보 불러오기
      const { data: userData, error: userError } = await supabase.from('users').select('*');

      if (userError) {
        console.error('유저정보 오류:', userError);
        return;
      }

      setUserData(userData || []);
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    // Check if Kakao SDK script is already loaded
    const isKakaoSDKLoaded = !!document.querySelector('script[src*="sdk.js"]');
    setIsKakaoMapLoaded(isKakaoSDKLoaded);
  }, []);

  return (
    <div className="flex justify-center">
      <div className="container mx-auto w-11/12 lg:w-[1440px] flex flex-col items-center">
        <ProductCard products={products} productImages={productImages} />
        {products.length > 0 && (
          <>
            <ProductIntro contents={products[0].contents} />
            <Location
              latitude={products[0]?.latitude || 0}
              longitude={products[0]?.longitude || 0}
              address={products[0]?.address || ''}
            />
          </>
        )}
        {isKakaoMapLoaded && (
          <Script
            src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`}
          />
        )}
        <RandomPostCardList />
        <Comments productId={params.id} userData={userData} />
      </div>
    </div>
  );
}

export default DetailPage;
