'use client';

import Comments from '@/components/Detail/Comments';
import Location from '@/components/Detail/Location';
import ProductCard from '@/components/Detail/ProductCard';
import ProductIntro from '@/components/Detail/ProductIntro';
import { supabase } from '@/contexts/supabase.context';
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

function DetailPage({ params }: { params: { id: string } }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productImages, setProductImages] = useState<{ [key: string]: string[] }>({});
  const [userData, setUserData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id);
      console.log(params.id);
      console.log(productData);
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
      <div className="flex justify-center">
        <div className="container mx-auto w-11/12 lg:w-[1440px] flex flex-col items-center">
          <ProductCard products={products} productImages={productImages} userData={userData} />

          <ProductIntro />

          <Location />

          <div className="w-full lg:w-[1200px] py-8">
            <h6 className="text-2xl font-bold mb-2">최근 도서</h6>
            <div>카드</div>
          </div>

          <Comments />
        </div>
      </div>
    </>
  );
}

export default DetailPage;
