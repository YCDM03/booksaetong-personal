'use client';

import React, { useEffect, useMemo } from 'react';
import CategoryFilter from '@/components/list/CategoryFilter';
import { useInfiniteQuery } from '@tanstack/react-query';
import ProductList from '@/components/list/ProductList';
import useSearchStore, { searchStoreType } from '@/zustand/searchStore';
import { getAllProductList } from '@/api/listApi';
import ProductListHeader from '@/components/list/ProductListHeader';

function ListOfAllPage() {

  const {
    search: { keyword, categoryList },
    setKeyword
  } = useSearchStore<searchStoreType>((state) => state);

  const defaultOptions = useMemo(() => {
    return ['경제경영', '만화', '사회과학', '소설/시/희곡', '어린이', '에세이', '유아', '인문학'];
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending
  } = useInfiniteQuery({
    initialData: undefined, initialPageParam: undefined,
    queryKey: ['productList', {
      keyword: `%${keyword}%`,
      requestCategoryList: categoryList.length === 0 ? defaultOptions : categoryList,
      requestLimit: 12
    }],
    queryFn: getAllProductList,
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
    return () => {
      setKeyword('');
    };
  }, []);

  return (
    <div className={'flex gap-10 pt-[100px]'}>
      <div>
        <CategoryFilter checkBoxOptions={defaultOptions}></CategoryFilter>
      </div>
      <div>
        <div className={'flex flex-col gap-2'}>
          <ProductListHeader keyword={keyword} title={"도서 전체 목록"}>
            {
              data?.pages[0].productList.length !== 0 ?
                <ProductList pageList={data?.pages} /> : <div className={"ml-[10px]"}>결과가 없습니다.</div>
            }
          </ProductListHeader>
        </div>
      </div>
    </div>
  );
}

export default ListOfAllPage;