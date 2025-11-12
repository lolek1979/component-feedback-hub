import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { isDev, ROUTES } from './core/config/conf';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === ROUTES.CSC && !isDev()) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/centralni-sprava-ciselniku', '/centralni-sprava-ciselniku/:path*'],
};
