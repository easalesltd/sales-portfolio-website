'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import {
  OPEN_COOKIE_SETTINGS_EVENT,
  readAnalyticsConsent,
  writeAnalyticsConsent,
  type AnalyticsConsent,
} from '@/app/lib/cookie-consent'
import { applyAnalyticsConsent } from '@/app/lib/gtag-consent'

function persistChoice(choice: AnalyticsConsent) {
  writeAnalyticsConsent(choice)
  applyAnalyticsConsent(choice === 'granted')
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  const openBanner = useCallback(() => {
    setVisible(true)
  }, [])

  useEffect(() => {
    if (readAnalyticsConsent() === null) {
      setVisible(true)
    }

    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openBanner)
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openBanner)
  }, [openBanner])

  const accept = () => {
    persistChoice('granted')
    setVisible(false)
  }

  const reject = () => {
    persistChoice('denied')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[90] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900 sm:p-5">
        <h2 id="cookie-consent-title" className="text-base font-semibold text-gray-900 dark:text-neutral-100">
          Cookies on this website
        </h2>
        <p id="cookie-consent-description" className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-neutral-400">
          We use optional analytics cookies to understand how visitors use our site and improve it. You can accept or
          reject analytics cookies. Strictly necessary cookies (for example security on our contact forms) are always
          used. See our{' '}
          <Link href="/cookies" className="site-link font-medium">
            cookie policy
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="site-link font-medium">
            privacy policy
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={accept}
            className="inline-flex items-center justify-center rounded-md border border-neutral-950 bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-900"
          >
            Accept analytics cookies
          </button>
          <button
            type="button"
            onClick={reject}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 dark:focus-visible:ring-neutral-400 dark:focus-visible:ring-offset-neutral-900"
          >
            Reject analytics cookies
          </button>
        </div>
      </div>
    </div>
  )
}
