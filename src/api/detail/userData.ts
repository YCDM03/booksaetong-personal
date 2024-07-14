import { supabase } from '@/contexts/supabase.context';

export interface User {
  id: string;
  profile_url: string;
  nickname: string;
  address: string;
  email: string;
}

export const fetchUserData = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data as User[];
};