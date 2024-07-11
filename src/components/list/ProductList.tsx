import PostCard from '@/components/common/PostCard';
import { pageProductListType } from '@/types/list/productList.type';

function ProductList({ pageList }: pageProductListType[]) {
  return (
    <div className={'flex flex-wrap'}>
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
