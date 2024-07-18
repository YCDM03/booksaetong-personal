import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const POST = async (request: Request) => {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return Response.json({ errorMsg: error?.message });
  } else {
    cookies().delete('sb-wwqtgagcybxbzyouattn-auth-token');
  }

  return Response.json({ message: '로그아웃 되었습니다!' });
};
