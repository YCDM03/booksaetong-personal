import { createClient } from '@/utils/supabase/server';

export const POST = async (request: Request) => {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log('error message:', error?.message);
  }

  return Response.json({ errorMsg: error?.message || null });
};
