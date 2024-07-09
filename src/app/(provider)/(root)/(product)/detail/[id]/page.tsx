'use client';

import PostCard from '@/components/common/PostCard';
import Slider from '@/components/common/Swiper/Swiper';
import { supabase } from '@/contexts/supabase.context';
import React, { useEffect, useState } from 'react';

interface Product {
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

function DetailPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchData = async (): Promise<void> => {
    const { data, error } = await supabase.from('products').select('*');

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setProducts(data || []);
      console.log('Fetched data:', data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {products.length > 0 && (
        <div className="container flex justify-center my-10">
          <div className="rounded-md w-[1440px] h-[480px] border-transparent flex items-center place-content-evenly shadow-detail">
            <div className="rounded-md w-[500px] h-[400px] border-2 border-black">
              <Slider src={{ postImage }} className="flex place-self-center" alt="이미지영역" />
            </div>
            <div className="w-[500px] h-[400px]  items-start border-2 border-black">
              <p className="font-bold text-2xl">{products[0].title}</p>
              <p className="">판매중</p>
              <p className="font text-[#aaaaaa]">{products[0].address}</p>
              <p className="my-5">{products[0].price}원</p>
              <p>
                {products[0].contents}설명을 넣는 곳입니다. 선물 받은 책을 다 읽어서 팝니다. 재미있습니다. 약간 헤짐
                있음.
              </p>
              <p>좋아요</p>

              <div>
                <img src="" alt="" />
                <p>{products[0].user_id}</p>
                <p>{products[0].address}</p>
                <button>글 수정하기</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-[1440px] justify-center">
        <h6>소개</h6>
        <div>책의 소개글이 들어가는 영역입니다.</div>
      </div>

      <div className="w-[1440px]">
        <h6>거래장소</h6>
        <div>안양역</div>
        <div>map api 불러오기</div>
      </div>

      <div>
        <h6>내 근처 도서</h6>
        <div>카드가 들어가는 영역입니다 (swiper)</div>
      </div>

      <div>
        <h6>댓글</h6>
        <div>입력창</div>
        <div>입력한 창을 보여줍니다.</div>
      </div>
    </>
  );
}

export default DetailPage;
