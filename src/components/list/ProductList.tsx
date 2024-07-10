import PostCard from '@/components/common/PostCard';
import React from 'react';
import { pageProductListType } from '@/types/list/productList.type';

function ProductList({pageList }: pageProductListType[]) {

  return (
      <div className={'flex flex-wrap gap-10'}>
        {
          Array.isArray(pageList) &&
          pageList.map((page) => {
            return page.productList.map(product => {
              return <PostCard key={product.id} post={product}></PostCard>;
            });
          })
        }
      </div>
  );
}

export default ProductList;