const path = require('path')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

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

/** CSP: middleware.ts (per-request nonces + strict-dynamic; no script-src unsafe-inline). */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/display-solutions/bespoke-confectionary-displays',
        destination: '/display-solutions/bespoke-confectionery-displays',
        permanent: true,
      },
      {
        source: '/about/contact',
        destination: '/contact',
        permanent: true,
      },
    ]
  },
  async headers() {
    const securityHeaders = [
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
      },
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
      {
        source: '/videos/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
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
  /**
   * When a lockfile exists in a parent folder (e.g. home directory), Next can pick that as the
   * workspace root and Turbopack fails to resolve `next/font/google` (`@vercel/turbopack-next/...`).
   * Pin the root to this app so dev/build resolve fonts and internals correctly.
   */
  turbopack: {
    root: path.resolve(__dirname),
  },
}

module.exports = withBundleAnalyzer(nextConfig)
