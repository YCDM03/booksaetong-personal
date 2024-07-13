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
import { useQuery } from '@tanstack/react-query';

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

const fetchProductData = async (id: string): Promise<Product[]> => {
  const { data, error } = await supabase.from('products').select('*').eq('id', id);
  if (error) throw error;
  return data as Product[];
};

const fetchProductImages = async (productIds: string[]): Promise<{ [key: string]: string[] }> => {
  const { data, error } = await supabase
    .from('product_images')
    .select('product_id, image_url')
    .in('product_id', productIds);
  if (error) throw error;

  const groupedImages: { [key: string]: string[] } = {};
  data.forEach((image) => {
    if (!groupedImages[image.product_id]) {
      groupedImages[image.product_id] = [];
    }
    groupedImages[image.product_id].push(image.image_url);
  });
  return groupedImages;
};

const fetchUserData = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data as User[];
};

const fetchRandomPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase.from('products').select('*, product_images(image_url)');
  if (error) throw error;

  return data.sort(() => 0.5 - Math.random()).slice(0, 4) as Post[];
};

function DetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const productQuery = useQuery<Product[]>({
    queryKey: ['product', id],
    queryFn: () => fetchProductData(id)
  });

  const userQuery = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUserData
  });

  const randomPostsQuery = useQuery<Post[]>({
    queryKey: ['randomPosts'],
    queryFn: fetchRandomPosts
  });

  const [productImages, setProductImages] = useState<{ [key: string]: string[] } | null>(null);
  const [isKakaoMapLoaded, setIsKakaoMapLoaded] = useState(false);

  useEffect(() => {
    if (productQuery.data) {
      const productIds = productQuery.data.map((product) => product.id);
      fetchProductImages(productIds).then(setProductImages);
    }
  }, [productQuery.data]);

  useEffect(() => {
    const isKakaoSDKLoaded = !!document.querySelector('script[src*="sdk.js"]');
    setIsKakaoMapLoaded(isKakaoSDKLoaded);
  }, []);

  const isLoading =
    productQuery.isLoading || userQuery.isLoading || randomPostsQuery.isLoading || productImages === null;

  if (isLoading) {
    return <Loading />;
  }

  if (!productQuery.data || productQuery.data.length === 0) {
    return <div>제품을 찾을 수 없습니다.</div>;
  }

  const currentProduct = productQuery.data[0];

  return (
    <div className="flex justify-center">
      <div className="container mx-auto w-11/12 lg:w-[1440px] flex flex-col items-center">
        <ProductCard products={productQuery.data} productImages={productImages} />
        <ProductIntro contents={currentProduct.contents} />
        <Location
          latitude={currentProduct.latitude}
          longitude={currentProduct.longitude}
          address={currentProduct.address}
        />
        {isKakaoMapLoaded && (
          <Script
            src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`}
          />
        )}
        {randomPostsQuery.data && <RandomPostCardList posts={randomPostsQuery.data} />}
        {userQuery.data && <Comments productId={id} userData={userQuery.data} />}
      </div>
    </div>
  );
}

export default DetailPage;
