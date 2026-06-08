'use client'

import { OPEN_COOKIE_SETTINGS_EVENT } from '@/app/lib/cookie-consent'

export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
      className="text-gray-600 underline underline-offset-2 transition-colors hover:text-neutral-950 hover:no-underline dark:text-neutral-400 dark:hover:text-neutral-100"
    >
      Cookie settings
    </button>
  )
}
