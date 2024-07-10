'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/contexts/supabase.context';

interface ProductIntroProps {
  productId: string;
}

const ProductIntro: React.FC<ProductIntroProps> = ({ productId }) => {
  const [productContents, setProductContents] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('contents')
        .eq('id', productId)
        .single();

      if (productError) {
        console.error('Product data fetching error:', productError);
        return;
      }

      setProductContents(productData?.contents || '');
    };

    fetchData();
  }, [productId]);

  return (
    <div className="w-full lg:w-[1000px] py-8">
      <h6 className="text-2xl font-bold mb-2">소개</h6>
      <p>{productContents}</p>
    </div>
  );
};

export default ProductIntro;
