export type Post = {
  id: string;
  title: string;
  price: number;
  address: string;
};

export type ProductImage = {
  image_url: string;
};

export type Posts = Post & {
  product_images: ProductImage[];
};
