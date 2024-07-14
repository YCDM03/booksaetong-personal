import { ProductListType } from '@/types/list/productList.type';

export type QueryKeyProps = {
  keyword: string;
  requestAddress: string;
  requestLimit: number;
};

type GetPostListProps = {
  queryKey: [
    string,
    QueryKeyProps
  ];
};

export const getAllPostList = async ( {queryKey} : GetPostListProps) => {
  const [_, { keyword, requestAddress, requestLimit }] = queryKey;

  const params: {
    keyword: string;
    requestAddress: string;
    requestLimit: number;
    requestOffset: number;
  } = {
    keyword,
    requestAddress: requestAddress,
    requestLimit: requestLimit,
    requestOffset: requestLimit * 0
  };

  const queryParams = new URLSearchParams({
    keyword: params.keyword,
    requestLimit: params.requestLimit.toString(),
    requestAddress: params.requestAddress,
    requestOffset: params.requestOffset.toString()
  });

  const response = await fetch(`/api/list/around?${queryParams.toString()}`);
  const ProductList: ProductListType[] = await response.json();

  const postList = ProductList.map((product) => {
    return {
      id: product.id,
      title: product.title,
      address: product.address,
      price: product.price,
      product_images: Array.of({ image_url: product.image_url }),
      user_id: product.user_id
    };
  });

  return postList;
};
