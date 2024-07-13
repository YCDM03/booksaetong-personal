import { ProductImage } from '@/types/Post.type';

export type ProductListType = {
  id: string;
  title: string;
  address: string;
  price: number;
  like_count: number;
  image_url: string;
  user_id: string;
};

export type Product = {
  id: string;
  title: string;
  price: number;
  address: string;
  product_images: ProductImage[];
};

export type pageProductListType = {
  productList: Product[] | undefined;
  nextPage: number | undefined;
};
