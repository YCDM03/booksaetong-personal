'use client';

import ProductList from '@/components/list/ProductList';
import React, { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getGroundProductList } from '@/api/listApi';
import useSearchStore, { searchStoreType } from '@/zustand/searchStore';
import { useUserStore } from '@/zustand/userStore';
import ProductListHeader from '@/components/list/ProductListHeader';
import ProductListEmpty from '@/components/list/ProductListEmpty';
import { LoadingTop } from '@/components/common/Loading';
import { useRouter } from 'next/navigation';

function ListOfAroundPage() {
  const { userAddress } = useUserStore((state) => ({
    userAddress: state.address
  }));
  const [address, setAddress] = useState<string | null>('');
  const {
    search: { keyword },
    setKeyword
  } = useSearchStore<searchStoreType>((state) => state);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery({
    initialData: undefined,
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

  const router = useRouter();
  useEffect(() => {
    if (!userAddress) {
      router.push('/login');
    }

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
          {data?.pages[0].productList.length !== 0 ? (
            <ProductList pageList={data?.pages} />
          ) : (
            <ProductListEmpty />
          )}
          {isFetchingNextPage &&
            <div className={'flex justify-start w-full mt-[100px]'}>
              <LoadingTop></LoadingTop>
            </div>}
        </ProductListHeader>
      </div>
    </div>
  );
}

export default ListOfAroundPage;
