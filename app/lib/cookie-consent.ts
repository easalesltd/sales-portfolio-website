export const COOKIE_CONSENT_STORAGE_KEY = 'ea-cookie-consent-analytics'

export type AnalyticsConsent = 'granted' | 'denied'

export const OPEN_COOKIE_SETTINGS_EVENT = 'ea-open-cookie-settings'

export function readAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
    if (stored === 'granted' || stored === 'denied') return stored
  } catch {
    // localStorage unavailable (e.g. private browsing restrictions)
  }
  return null
}

export function writeAnalyticsConsent(value: AnalyticsConsent): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, value)
  } catch {
    // ignore write failures
  }
}

export function buildGoogleConsentDefaultScript(): string {
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500
    });
    try {
      var stored = localStorage.getItem('${COOKIE_CONSENT_STORAGE_KEY}');
      if (stored === 'granted') {
        gtag('consent', 'update', { analytics_storage: 'granted' });
      } else if (stored === 'denied') {
        gtag('consent', 'update', { analytics_storage: 'denied' });
      }
    } catch (e) {}
  `
}
