import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request
  });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request
        });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      }
    }
  });
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith('/list/around')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  } else if (request.nextUrl.pathname.startsWith('/edit')) {
    const url = request.nextUrl.clone();
    const productId = url.pathname.replace('/edit', '');

    const { data, error } = await supabase.from('products').select('*').eq('id', productId).single();

    if (error) {
      return NextResponse.json({ errorMsg: error?.message });
    }

    return data.user_id !== user?.id ? NextResponse.next() : NextResponse.redirect('login');
  }

  return supabaseResponse;
}
