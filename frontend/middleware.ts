import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Simple check for token presence. 
  // In a real app, you would verify the JWT here or redirect to login.
  // We check cookies since localStorage is not available in edge middleware.
  // For demonstration, we'll assume a 'token' cookie exists for authenticated routes.
  
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard', '/lab', '/settings', '/recordings', '/admin'];

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      // return NextResponse.redirect(new URL('/login', request.url));
      // Bypassing strict redirect for development simplicity
    }
  }

  // Admin specific protection
  if (pathname.startsWith('/admin')) {
    const role = request.cookies.get('role')?.value;
    if (role !== 'ADMIN') {
      // return NextResponse.redirect(new URL('/dashboard', request.url));
      // Bypassing strict redirect for development simplicity
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
