import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const POST = async (request: Request) => {
  const supabase = createClient();
  const formData = await request.formData();

  let { data, error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        nickname: formData.get('nickname') as string,
        address: ((formData.get('area') as string) + ' ' + formData.get('subArea')) as string
      }
    }
  });

  if (error) {
    console.log('error message:', error?.message);
  }

  cookies().delete('sb-wwqtgagcybxbzyouattn-auth-token');
  cookies().delete('sb-wwqtgagcybxbzyouattn-auth-token-code-verifier');
  return Response.json({ data, errorMsg: error?.message || null });
};
