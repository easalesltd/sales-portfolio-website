const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const isDev = process.env.NODE_ENV === 'development'

/** Single origin for CORS (avoid `*` on a marketing site). Preview: set NEXT_PUBLIC_SITE_URL to the deployment URL. */
function corsAllowOrigin() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (fromEnv) return fromEnv
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`
  }
  if (process.env.NODE_ENV === 'production') {
    return 'https://www.easalesltd.co.uk'
  }
  return null
}

const corsOrigin = corsAllowOrigin()

/** Content-Security-Policy: balanced for Next.js App Router, Tailwind, next/font, local media, and GA4 (layout.tsx). */
const contentSecurityPolicy = [
  "default-src 'self'",
  // Inline bootstrap + next/script (gtag init); external gtag loader. unsafe-eval only in dev (Turbopack/HMR).
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com"
    : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
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

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    const securityHeaders = [
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
      },
      { key: 'Content-Security-Policy', value: contentSecurityPolicy },
    ]
    if (corsOrigin) {
      securityHeaders.push(
        { key: 'Access-Control-Allow-Origin', value: corsOrigin },
        { key: 'Vary', value: 'Origin' }
      )
    }
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2678400,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.easalesltd.co.uk',
        pathname: '/**',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  output: 'standalone',
  turbopack: {},
}

module.exports = withBundleAnalyzer(nextConfig)
