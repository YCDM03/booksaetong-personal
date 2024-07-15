'use client';

import ProductList from '@/components/list/ProductList';
import React, { useEffect, useState } from 'react';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { getGroundProductList } from '@/api/listApi';
import useSearchStore, { SearchStoreType } from '@/zustand/searchStore';
import { useUserStore } from '@/zustand/userStore';
import ProductListHeader from '@/components/list/ProductListHeader';
import ProductListEmpty from '@/components/list/ProductListEmpty';
import { LoadingCenter } from '@/components/common/Loading';
import { pageProductListType } from '@/types/list/productList.type';

function ListOfAroundPage() {
  const { userAddress } = useUserStore((state) => ({
    userAddress: state.address
  }));
  const [address, setAddress] = useState<string | null>('');
  const {
    search: { keyword },
    setKeyword
  } = useSearchStore<SearchStoreType>((state) => state);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery<
    pageProductListType,
    Error,
    InfiniteData<pageProductListType>,
    [string, { keyword: string; requestAddress: string; requestLimit: number }],
    number | undefined
  >({
    initialPageParam: undefined,
    queryKey: [
      'productList',
      {
        keyword: `%${keyword}%`,
        requestAddress: `%${address}%`,
        requestLimit: 12
      }
    ],
    queryFn: getGroundProductList,
    getNextPageParam: (lastPage, allPages) => lastPage.nextPage
  });

  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [fetchNextPage, hasNextPage]);

  useEffect(() => {
    setAddress(userAddress);
  }, [userAddress]);

  useEffect(() => {
    return () => {
      setKeyword('');
    };
  }, []);

  return (
    <div className={'px-10 max-w-[1024px] mx-auto sm:mx-0 md:w-[550px] lg:w-[1024px]'}>
      <div className={'flex flex-col'}>
        <ProductListHeader title={'내 근처 도서목록'} keyword={keyword} address={address}>
          {address ? (
            isPending ? (
              <LoadingCenter />
            ) : data?.pages[0].productList?.length !== 0 ? (
              <ProductList pageList={data?.pages} />
            ) : (
              <ProductListEmpty message={'도서목록이'} />
            )
          ) : (
            <ProductListEmpty message={'현재 회원 정보가'} />
          )}
        </ProductListHeader>
      </div>
    </div>
  );
}

export default ListOfAroundPage;
