import { createClient } from '@/utils/supabase/server';

export const POST = async (request: Request) => {
  const supabase = createClient();
  const formData = await request.formData();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string
  });

  if (error) {
    console.log('error message:', error?.message);
  }

  return Response.json({ data, errorMsg: error?.message || null });
};
