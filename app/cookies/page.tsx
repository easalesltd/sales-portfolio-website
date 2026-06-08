import Link from 'next/link'
import { getCspNonce } from '@/app/lib/csp-nonce'

const cookieSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Cookie Policy',
  description: 'Cookie policy for East Anglian Sales LTD.',
  url: 'https://www.easalesltd.co.uk/cookies',
  isPartOf: {
    '@type': 'WebSite',
    name: 'East Anglian Sales LTD',
    url: 'https://www.easalesltd.co.uk',
  },
}

export default async function CookiesPage() {
  const nonce = await getCspNonce()

  return (
    <div className="min-h-screen py-12">
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cookieSchema) }}
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-neutral-100 md:text-4xl">Cookie Policy</h1>
        <p className="mt-3 text-sm text-gray-500 dark:text-neutral-500">Last updated: 8 June 2026</p>

        <div className="prose prose-lg mt-8 max-w-none text-gray-700 dark:prose-invert dark:text-neutral-300">
          <p>
            This policy explains how East Anglian Sales LTD uses cookies and similar technologies on{' '}
            <Link href="/">www.easalesltd.co.uk</Link>. For broader privacy information, see our{' '}
            <Link href="/privacy">privacy policy</Link>.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">What are cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help sites work properly,
            remember preferences, or understand how visitors use the site.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">How we use cookies</h2>
          <p>We group cookies on this site as follows:</p>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">Strictly necessary</h3>
          <p>
            These cookies are required for the website to function and cannot be switched off in our systems. They may
            include security cookies used by Cloudflare Turnstile when you submit contact or order forms, to protect those
            forms from spam and automated abuse.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">Analytics (optional)</h3>
          <p>
            If you choose to accept analytics cookies, we use Google Analytics 4 to collect aggregated information about
            how visitors use the site (for example pages viewed, general location, device type, and referral source). This
            helps us improve content and performance.
          </p>
          <p>
            Analytics cookies are only set after you accept them via the cookie banner or Cookie settings in the site
            footer. If you reject analytics cookies, Google Analytics may still receive limited, cookieless signals under
            Google Consent Mode, but analytics storage cookies will not be used.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">Cookies we use</h2>
          <div className="not-prose overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-neutral-700">
                  <th className="py-2 pr-4 font-semibold text-gray-900 dark:text-neutral-100">Cookie / storage</th>
                  <th className="py-2 pr-4 font-semibold text-gray-900 dark:text-neutral-100">Provider</th>
                  <th className="py-2 pr-4 font-semibold text-gray-900 dark:text-neutral-100">Purpose</th>
                  <th className="py-2 font-semibold text-gray-900 dark:text-neutral-100">Duration</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-neutral-300">
                <tr className="border-b border-gray-100 dark:border-neutral-800">
                  <td className="py-3 pr-4 align-top font-mono text-xs">ea-cookie-consent-analytics</td>
                  <td className="py-3 pr-4 align-top">East Anglian Sales LTD</td>
                  <td className="py-3 pr-4 align-top">Remembers your analytics cookie choice</td>
                  <td className="py-3 align-top">Until you clear site data</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-neutral-800">
                  <td className="py-3 pr-4 align-top font-mono text-xs">_ga, _ga_*</td>
                  <td className="py-3 pr-4 align-top">Google Analytics</td>
                  <td className="py-3 pr-4 align-top">Distinguishes users for analytics (only if accepted)</td>
                  <td className="py-3 align-top">Up to 2 years</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-neutral-800">
                  <td className="py-3 pr-4 align-top font-mono text-xs">Turnstile-related cookies</td>
                  <td className="py-3 pr-4 align-top">Cloudflare</td>
                  <td className="py-3 pr-4 align-top">Bot protection on forms</td>
                  <td className="py-3 align-top">Session / short-term</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">Managing your preferences</h2>
          <p>
            When you first visit the site, you can accept or reject analytics cookies using the banner at the bottom of
            the page. You can change your choice at any time using Cookie settings in the site footer (when analytics is
            enabled).
          </p>
          <p>
            You can also control cookies through your browser settings. Blocking all cookies may affect how some parts of
            the site work.
          </p>
          <p>
            To opt out of Google Analytics more broadly, see Google&apos;s tools at{' '}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 dark:text-teal-400"
            >
              tools.google.com/dlpage/gaoptout
            </a>
            .
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">Contact</h2>
          <p>
            Questions about this cookie policy? Email{' '}
            <a href="mailto:dave@easalesltd.co.uk" className="text-teal-700 dark:text-teal-400">
              dave@easalesltd.co.uk
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
