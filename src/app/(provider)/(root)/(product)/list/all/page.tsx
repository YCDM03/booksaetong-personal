'use client';

import React, { useEffect, useMemo, useState } from 'react';
import CategoryFilter from '@/components/list/CategoryFilter';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import ProductList from '@/components/list/ProductList';
import useSearchStore, { SearchStoreType } from '@/zustand/searchStore';
import { getAllProductList } from '@/api/listApi';
import ProductListHeader from '@/components/list/ProductListHeader';
import ProductListEmpty from '@/components/list/ProductListEmpty';
import { LoadingCenter } from '@/components/common/Loading';
import { pageProductListType } from '@/types/list/productList.type';

function ListOfAllPage() {
  const [showFilter, setShowFilter] = useState(false);

  const {
    search: { keyword, categoryList },
    setKeyword
  } = useSearchStore<SearchStoreType>((state) => state);

  const defaultOptions = useMemo(() => {
    return ['경제경영', '만화', '사회과학', '소설/시/희곡', '어린이', '에세이', '유아', '인문학', '기타'];
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteQuery<
    pageProductListType,
    Error,
    InfiniteData<pageProductListType>,
    [string, { keyword: string; requestCategoryList: string[]; requestLimit: number }],
    number
  >({
    initialPageParam: 0,
    queryKey: [
      'productListOfAll',
      {
        keyword: `%${keyword}%`,
        requestCategoryList: categoryList.length === 0 ? defaultOptions : categoryList,
        requestLimit: 12
      }
    ],
    queryFn: getAllProductList,
    getNextPageParam: (lastPage, allPages): number | undefined => lastPage.nextPage
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
    <div className={`flex flex-col sm:flex-row max-w-[1200px] mx-auto my-10 sm:mx-0`}>
      <div className={`sm:hidden ${showFilter && 'hidden'} flex justify-center ml-10`}>
        <button className="p-2 bg-blue-500 text-white rounded " onClick={() => setShowFilter(!showFilter)}>
          카테고리 보기
        </button>
      </div>
      <div className={`${showFilter ? 'block' : 'hidden'} sm:block`}>
        <CategoryFilter
          checkBoxOptions={defaultOptions}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
        ></CategoryFilter>
      </div>
      <div className="px-10 max-w-[1000px] md:w-[1000px]">
        <div className="flex flex-col items-center ">
          <ProductListHeader keyword={keyword} title={'도서 전체 목록'} address={null}>
            {isPending ? (
              <LoadingCenter />
            ) : data?.pages[0].productList?.length !== 0 ? (
              <ProductList pageList={data?.pages} />
            ) : (
              <div className={'w-full mx-auto h-full'}>
                <ProductListEmpty />
              </div>
            )}

            {isFetchingNextPage && <LoadingCenter />}
          </ProductListHeader>
        </div>
      </div>
    </div>
  );
}

export default ListOfAllPage;
