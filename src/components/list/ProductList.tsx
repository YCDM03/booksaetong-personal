import PostCard from '@/components/common/PostCard';
import { pageProductListType } from '@/types/list/productList.type';

function ProductList({ pageList }: pageProductListType[]) {
  return (
    <div className={'grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:grid-cols-custom-1 md:grid-cols-custom-2 lg:grid-cols-custom-3 xl:grid-cols-custom-4'} >
      {Array.isArray(pageList) &&
        pageList.map((page) => {
          return page.productList.map((product) => {
            return <PostCard key={product.id} post={product}></PostCard>;
          });
        })}
    </div>
  );
}

export default ProductList;
