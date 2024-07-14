import { supabase } from '@/contexts/supabase.context';

export interface Product {
  id: string;
  created_at: string;
  title: string;
  category: string;
  price: number;
  contents: string;
  latitude: number;
  longitude: number;
  user_id: string;
  address: string;
}

export const fetchProductData = async (id: string): Promise<Product[]> => {
  const { data, error } = await supabase.from('products').select('*').eq('id', id);
  if (error) throw error;
  return data as Product[];
};

export const fetchProductImages = async (productIds: string[]): Promise<{ [key: string]: string[] }> => {
  const { data, error } = await supabase
    .from('product_images')
    .select('product_id, image_url')
    .in('product_id', productIds);
  if (error) throw error;

  const groupedImages: { [key: string]: string[] } = {};
  data.forEach((image) => {
    if (!groupedImages[image.product_id]) {
      groupedImages[image.product_id] = [];
    }
    groupedImages[image.product_id].push(image.image_url);
  });
  return groupedImages;
};