import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from './utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  // console.log(request.referrer);
  if (
    request.nextUrl.pathname.includes('/mypage') ||
    request.nextUrl.pathname.includes('/post') ||
    request.nextUrl.pathname.includes('/edit')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';

    return request.cookies.get('sb-wwqtgagcybxbzyouattn-auth-token') ? NextResponse.next() : NextResponse.redirect(url);
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
