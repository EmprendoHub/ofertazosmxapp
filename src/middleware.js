import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedPaths = [
  '/perfil',
  '/perfil/update',
  '/perfil/update_password',
  '/perfil/orders',
  '/carrito/envio',
];

export async function middleware(request) {
  const token = await getToken({ req: request });
  // console.log(token?.user?.role);
  // @ts-ignore
  request.nextauth = request.nextauth || {};
  // @ts-ignore
  request.nextauth.token = token;
  const pathname = request.nextUrl.pathname;
  if (pathname.includes('admin')) {
    //if admin user is not logged in
    let signInUrl;
    if (!token) {
      signInUrl = new URL('/api/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    if (token?.user?.role !== 'manager') {
      signInUrl = new URL('/no-autorizado', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  if (
    !token &&
    (protectedPaths.includes(pathname) || pathname.includes('perfil'))
  ) {
    const signInUrl = new URL('/api/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
