'use client';

import { fetchProductData, fetchProductImages, Product } from '@/api/detail/allProducts';
import { fetchRandomPosts, Post } from '@/api/detail/randomPosts';
import { fetchUserData, User } from '@/api/detail/userData';
import Loading from '@/components/common/Loading/LoadingCenter';
import Comments from '@/components/Detail/Comments';
import Location from '@/components/Detail/Location';
import ProductCard from '@/components/Detail/ProductCard';
import ProductIntro from '@/components/Detail/ProductIntro';
import RandomPostCardList from '@/components/Detail/RandomPostCardList';
import Script from 'next/script';
import { useEffect, useState } from 'react';

interface DetailPageProps {
  params: { id: string };
}

function DetailPage({ params }: DetailPageProps) {
  const { id } = params;
  const [productData, setProductData] = useState<Product[] | null>(null);
  const [userData, setUserData] = useState<User[] | null>(null);
  const [randomPostsData, setRandomPostsData] = useState<Post[] | null>(null);
  const [productImages, setProductImages] = useState<{ [key: string]: string[] }>({});
  const [isKakaoMapLoaded, setIsKakaoMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isRandomPostsLoading, setIsRandomPostsLoading] = useState(true);
  const [isImagesLoading, setIsImagesLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await fetchProductData(id);
        setProductData(productData);
        setIsProductLoading(false);

        const userData = await fetchUserData();
        setUserData(userData);
        setIsUserLoading(false);

        const randomPostsData = await fetchRandomPosts();
        setRandomPostsData(randomPostsData);
        setIsRandomPostsLoading(false);

        const productIds = productData.map((product: Product) => product.id);
        const productImages = await fetchProductImages(productIds);
        setProductImages(productImages);
        setIsImagesLoading(false);
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const isKakaoSDKLoaded = !!document.querySelector('script[src*="sdk.js"]');
    setIsKakaoMapLoaded(isKakaoSDKLoaded);
  }, []);

  const allDataLoaded = !isProductLoading && !isUserLoading && !isRandomPostsLoading && !isImagesLoading && !isLoading;

  if (!allDataLoaded) {
    return <Loading />;
  }

  if (!productData || productData.length === 0) {
    return <div>제품을 찾을 수 없습니다.</div>;
  }

  const currentProduct = productData[0];

  return (
    <div className="flex justify-center">
      <div className="container mx-auto w-11/12 lg:w-[1440px] flex flex-col items-center">
        <ProductCard products={productData} productImages={productImages} />
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
        {randomPostsData && <RandomPostCardList posts={randomPostsData} />}
        {userData && <Comments productId={id} userData={userData} />}
      </div>
    </div>
  );
}

export default DetailPage;
