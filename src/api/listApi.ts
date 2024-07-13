import { pageProductListType, ProductListType } from '@/types/list/productList.type';

type AllProductLisTtype = {
  pageParam: number;
  queryKey: [
    string,
    {
      keyword: string;
      requestCategoryList: string[];
      requestLimit: number;
    }
  ];
};

type GroundProductList = {
  pageParam?: number;
  queryKey: [string, { keyword: string; requestAddress: string; requestLimit: number }];
};

type QueryKeyType = [
  string,
  {
    keyword: string;
    requestCategoryList: string[];
    requestLimit: number;
  }
];

export const getAllProductList = async ({
  pageParam = 0,
  queryKey
}: AllProductLisTtype): Promise<pageProductListType> => {
  const [_, { keyword, requestCategoryList, requestLimit }]: QueryKeyType = queryKey;

  const params: {
    keyword: string;
    categoryList: string;
    requestLimit: number;
    requestOffset: number;
  } = {
    keyword,
    categoryList: JSON.stringify(requestCategoryList),
    requestLimit: requestLimit,
    requestOffset: requestLimit * pageParam
  };

  const queryParams = new URLSearchParams({
    keyword: params.keyword,
    categoryList: params.categoryList,
    requestLimit: params.requestLimit.toString(),
    requestOffset: params.requestOffset.toString()
  });

  const response = await fetch(`/api/list/all?${queryParams.toString()}`);
  const productList: ProductListType[] = await response.json();

  return {
    productList: productList.map((product) => {
      return {
        id: product.id,
        title: product.title,
        address: product.address,
        price: product.price,
        product_images: Array.of({ image_url: product.image_url })
      };
    }),
    nextPage: productList.length === requestLimit ? pageParam + 1 : undefined
  };
};

export const getGroundProductList = async ({
  pageParam = 0,
  queryKey
}: GroundProductList): Promise<pageProductListType> => {
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
    requestOffset: requestLimit * pageParam
  };

  const queryParams = new URLSearchParams({
    keyword: params.keyword,
    requestLimit: params.requestLimit.toString(),
    requestAddress: params.requestAddress,
    requestOffset: params.requestOffset.toString()
  });

  const response = await fetch(`/api/list/around?${queryParams.toString()}`);
  const ProductList: ProductListType[] = await response.json();

  return {
    productList: ProductList.map((product) => {
      return {
        id: product.id,
        title: product.title,
        address: product.address,
        price: product.price,
        product_images: Array.of({ image_url: product.image_url })
      };
    }),
    nextPage: ProductList.length === requestLimit ? pageParam + 1 : undefined
  };
};
