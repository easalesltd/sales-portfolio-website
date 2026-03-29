import { NextResponse, type NextRequest } from 'next/server';

const CANONICAL_HOST = 'www.easalesltd.co.uk';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase();
  if (
    !host ||
    host === CANONICAL_HOST ||
    host === 'localhost' ||
    host.endsWith('.vercel.app')
  ) {
    return NextResponse.next();
  }
  if (host === 'easalesltd.co.uk') {
    const url = request.nextUrl.clone();
    url.hostname = CANONICAL_HOST;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
