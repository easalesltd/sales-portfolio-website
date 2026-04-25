import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function generateNonce(): string {
  const a = new Uint8Array(16)
  crypto.getRandomValues(a)
  return btoa(String.fromCharCode(...a))
}

function buildCsp(nonce: string, isDev: boolean): string {
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    ...(isDev ? (["'unsafe-eval'"] as const) : []),
  ].join(' ')

  const styleSrc = isDev
    ? `'self' 'nonce-${nonce}' 'unsafe-inline' https://fonts.googleapis.com`
    : `'self' 'nonce-${nonce}' https://fonts.googleapis.com`

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    `style-src ${styleSrc}`,
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com https://www.google.co.uk",
    "media-src 'self' blob:",
    "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.googletagmanager.com https://stats.g.doubleclick.net",
    "frame-src 'self'",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; ')
}

export function proxy(request: NextRequest) {
  const { nextUrl } = request
  const hostname = nextUrl.hostname.toLowerCase()

  // Canonical host policy: always serve production on www.
  if (hostname === 'easalesltd.co.uk') {
    const redirectUrl = nextUrl.clone()
    redirectUrl.hostname = 'www.easalesltd.co.uk'
    return NextResponse.redirect(redirectUrl, 308)
  }

  // Keep one path version indexed: remove trailing slash except root.
  if (nextUrl.pathname.length > 1 && nextUrl.pathname.endsWith('/')) {
    const redirectUrl = nextUrl.clone()
    redirectUrl.pathname = nextUrl.pathname.replace(/\/+$/, '')
    return NextResponse.redirect(redirectUrl, 308)
  }

  const isDev = process.env.NODE_ENV === 'development'
  const nonce = generateNonce()
  const csp = buildCsp(nonce, isDev)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })
  response.headers.set('Content-Security-Policy', csp)
  return response
}

export const config = {
  matcher: [
    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|webp|avif|svg|woff2?|ttf|eot|xml|txt|webmanifest|mp4|mov)).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
