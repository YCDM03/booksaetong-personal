'use client';

import Loading from '@/components/common/Loading/LoadingCenter';
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

export interface Post {
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
  product_images: { image_url: string }[];
}

function DetailPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<{
    products: Product[];
    productImages: { [key: string]: string[] };
    userData: User[];
    randomPosts: Post[];
  } | null>(null);

  const [isKakaoMapLoaded, setIsKakaoMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        // 상품 데이터 불러오기
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id);
        if (productError) throw productError;

        // 이미지 데이터 불러오기
        const productIds = productData.map((product) => product.id);
        const { data: imageData, error: imageError } = await supabase
          .from('product_images')
          .select('product_id, image_url')
          .in('product_id', productIds);
        if (imageError) throw imageError;

        const groupedImages: { [key: string]: string[] } = {};
        imageData.forEach((image) => {
          if (!groupedImages[image.product_id]) {
            groupedImages[image.product_id] = [];
          }
          groupedImages[image.product_id].push(image.image_url);
        });

        // 사용자 데이터 불러오기
        const { data: userData, error: userError } = await supabase.from('users').select('*');
        if (userError) throw userError;

        // 랜덤 포스트 데이터 불러오기
        const { data: allPostsData, error: allPostsError } = await supabase
          .from('products')
          .select('*, product_images(image_url)');
        if (allPostsError) throw allPostsError;

        const shuffledPosts = allPostsData.sort(() => 0.5 - Math.random()).slice(0, 4);

        // 모든 데이터 세팅
        setData({
          products: productData || [],
          productImages: groupedImages,
          userData: userData || [],
          randomPosts: shuffledPosts || []
        });
      } catch (error) {
        console.error('데이터 불러오기 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    const isKakaoSDKLoaded = !!document.querySelector('script[src*="sdk.js"]');
    setIsKakaoMapLoaded(isKakaoSDKLoaded);
  }, []);

  if (isLoading || !data) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center">
      <div className="container mx-auto w-11/12 lg:w-[1440px] flex flex-col items-center">
        <ProductCard products={data.products} productImages={data.productImages} />
        <ProductIntro contents={data.products[0].contents} />
        <Location
          latitude={data.products[0]?.latitude || 0}
          longitude={data.products[0]?.longitude || 0}
          address={data.products[0]?.address || ''}
        />
        {isKakaoMapLoaded && (
          <Script
            src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`}
          />
        )}
        <RandomPostCardList posts={data.randomPosts} />
        <Comments productId={params.id} userData={data.userData} />
      </div>
    </div>
  );
}

export default DetailPage;
