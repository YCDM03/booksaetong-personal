import { supabase } from '@/contexts/supabase.context';

export interface Post {
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
  product_images: { image_url: string }[];
}


export const fetchRandomPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase.from('products').select('*, product_images(image_url)');
  if (error) throw error;

  return data.sort(() => 0.5 - Math.random()).slice(0, 4) as Post[];
};
