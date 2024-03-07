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
  if (pathname.includes('puntodeventa')) {
    //if admin user is not logged in
    let signInUrl;
    if (!token) {
      signInUrl = new URL('/api/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    if (token?.user?.role !== 'sucursal') {
      signInUrl = new URL('/no-autorizado', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }
  if (
    pathname.includes('afiliado') ||
    pathname === '/registro/affiliate/stripe'
  ) {
    //if afiliado user is not logged in
    let signInUrl;
    if (!token) {
      signInUrl = new URL('/api/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    if (token?.user?.role !== 'afiliado') {
      signInUrl = new URL('/no-autorizado', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  if (pathname.includes('perfil')) {
    //if afiliado user is not logged in
    let signInUrl;
    if (!token) {
      signInUrl = new URL('/api/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }

    if (token?.user?.role === 'afiliado') {
      signInUrl = new URL('/afiliado', request.url);
      return NextResponse.redirect(signInUrl);
    }
    if (token?.user?.role === 'manager') {
      signInUrl = new URL('/admin', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }
  // Check if 'alink' is present in the URL search parameters
  const affParam = request.nextUrl.searchParams.get('alink');
  if (affParam) {
    try {
      // Attempt to get the client's IP address

      const userAgent = request.headers.get('user-agent'); // User agent string
      const res = await fetch(
        `${process.env.NEXTAUTH_URL}/api/affiliate/createevent`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            affParam,
            userAgent,
          }),
        }
      );

      if (res.ok) {
        console.log('Affiliate referral EVENT created successfully');
      }
    } catch (error) {
      console.error('Error creating referral event:', error);
    }
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
