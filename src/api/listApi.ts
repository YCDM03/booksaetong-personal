import { pageProductListType, ProductListType } from '@/types/list/productList.type';

export const getAllProductList = async ({ pageParam = 0, queryKey }): Promise<pageProductListType> => {
  const [_, {keyword, requestCategoryList, requestLimit}] = queryKey;
  debugger
  const queryParams = new URLSearchParams({
    keyword,
    categoryList: JSON.stringify(requestCategoryList),
    requestLimit: requestLimit,
    requestOffset: requestLimit * pageParam
  });

  const response = await fetch(`/api/list/all?${queryParams.toString()}`);
  const ProductList: ProductListType[] = await response.json();

  return {
    productList: ProductList.map(product => {
      return {
        id: product.id,
        title: product.title,
        address: product.address,
        price: product.price,
        product_images: Array.of({image_url: product.image_url})
      };
    }),
    nextPage: ProductList.length === requestLimit ? pageParam + 1 : undefined
  };
};

export const getGroundProductList = async ({ pageParam = 0, queryKey }): Promise<pageProductListType> => {
  const [_, {keyword,requestAddress, requestLimit}] = queryKey;
  debugger
  const queryParams = new URLSearchParams({
    keyword,
    requestLimit,
    requestAddress,
    requestOffset: requestLimit * pageParam
  });

  debugger
  const response = await fetch(`/api/list/around?${queryParams.toString()}`);
  const ProductList: ProductListType[] = await response.json();

  return {
    productList: ProductList.map(product => {
      return {
        id: product.id,
        title: product.title,
        address: product.address,
        price: product.price,
        product_images: Array.of({image_url: product.image_url})
      };
    }),
    nextPage: ProductList.length === requestLimit ? pageParam + 1 : undefined
  };
};