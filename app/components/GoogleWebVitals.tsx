'use client'

import { useReportWebVitals } from 'next/web-vitals'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const METRIC_VALUE_ROUNDING = 1000

export default function GoogleWebVitals() {
  useReportWebVitals((metric) => {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value * METRIC_VALUE_ROUNDING) / METRIC_VALUE_ROUNDING,
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
      metric_navigation_type: metric.navigationType,
      non_interaction: true,
    })
  })

  return null
}
