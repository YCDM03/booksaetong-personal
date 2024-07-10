import { Post, ProductImage } from '@/types/Post.type';

export type ProductListType = {
  id: string,
  title: string,
  address: string,
  price: number,
  like_count: number,
  image_url:string
}

export type Product = {
  id: string;
  title: string;
  price: number;
  address: string;
  product_images: ProductImage[];
};


export type pageProductListType = {
  productList:  [Product],
  nextPage: number | undefined
}