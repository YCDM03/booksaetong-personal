import { createClient } from '@/utils/supabase/server';

export const POST = async (request: Request) => {
  const supabase = createClient();
  const formData = await request.formData();

  let { data, error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        nickname: formData.get('nickname') as string,
        address: formData.get('address') as string
      }
    }
  });
  if (error) {
    console.log('error message:', error?.message);
  }
  // public.users 테이블에 유저 정보 추가는 트리거를 통해 처리

  return Response.json({ data, errorMsg: error?.message || null });
};
