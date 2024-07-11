import { supabase } from '@/contexts/supabase.context';

export const myLikePost = async (userId: string | null) => {
  const response = supabase
    .from('products')
    .select('*, product_likes!inner(product_id), product_images(image_url)')
    .eq('product_likes.user_id', userId);
  const likes = (await response).data;
  return likes;
};
