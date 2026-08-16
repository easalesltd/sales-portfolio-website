import type { MetadataRoute } from 'next'

const SITE_URL = 'https://www.easalesltd.co.uk'

const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'Google-Extended',
  'PerplexityBot',
  'ClaudeBot',
  'anthropic-ai',
  'Applebot-Extended',
  'Amazonbot',
  'CCBot',
  'meta-externalagent',
  'Bytespider',
  'cohere-ai',
]

export default function robots(): MetadataRoute.Robots {
  const publicAllow = {
    allow: ['/', '/llms.txt', '/llms-full.txt', '/faq', '/sitemap.xml'],
    disallow: ['/api/', '/p/'],
  }

  return {
    rules: [
      {
        userAgent: AI_CRAWLERS,
        ...publicAllow,
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/p/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
