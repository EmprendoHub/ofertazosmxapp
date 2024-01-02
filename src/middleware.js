import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedPaths = [
  '/perfil',
  '/perfil/update',
  '/perfil/update_password',
  '/perfil/orders',
  '/carrito/envio',
];

const protectedAdminPaths = ['/admin/perfil', '/admin/usuarios'];

export async function middleware(request) {
  // Create a response object to pass down the chain
  const response = NextResponse.next();
  console.log(request);
  const token = await getToken({ req: request });
  // console.log(token?.user?.role);
  // @ts-ignore
  request.nextauth = request.nextauth || {};
  // @ts-ignore
  request.nextauth.token = token;
  let pathname = request.nextUrl.pathname;
  pathname = process.env.NEXTAUTH_URL + pathname;

  if (pathname.includes('admin')) {
    //if admin user is not logged in
    let signInUrl;
    console.log(token, 'if admin in path name');
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
