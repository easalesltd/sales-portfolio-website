export function applyAnalyticsConsent(granted: boolean): void {
  if (typeof window === 'undefined') return
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
  if (typeof gtag !== 'function') return
  gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
  })
}
