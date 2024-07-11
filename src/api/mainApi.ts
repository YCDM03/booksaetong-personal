import { ProductListType } from '@/types/list/productList.type';

export type QueryKeyProps = {
  keyword: string;
  requestAddress: string;
  requestLimit: number;
};

export const getAllPostList = async ({ queryKey }) => {
  const [_, { keyword, requestAddress, requestLimit }] = queryKey;
  const queryParams = new URLSearchParams({
    keyword,
    requestLimit,
    requestAddress,
    requestOffset: requestLimit * 0
  });

  const response = await fetch(`/api/list/around?${queryParams.toString()}`);
  const ProductList: ProductListType[] = await response.json();

  const postList = ProductList.map((product) => {
    return {
      id: product.id,
      title: product.title,
      address: product.address,
      price: product.price,
      product_images: Array.of({ image_url: product.image_url })
    };
  });

  return postList;
};
