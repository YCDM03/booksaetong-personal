'use client';

import React, { useEffect, useState } from 'react';
import { Product } from './ProductCard';
import { supabase } from '@/contexts/supabase.context';

const ProductIntro = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: productData, error: productError } = await supabase.from('products').select('*');

      if (productError) {
        console.error('Product data fetching error:', productError);
        return;
      }

      setProducts(productData || []);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full lg:w-[1200px] py-8">
      <h6 className="text-2xl font-bold mb-2">소개</h6>
      <p>{products[0]?.contents}</p>
    </div>
  );
};

export default ProductIntro;
