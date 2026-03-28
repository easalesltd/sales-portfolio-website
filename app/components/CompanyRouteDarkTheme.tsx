'use client';

import { useLayoutEffect } from 'react';

/**
 * Adds/removes `class="dark"` on <html> for route-specific dark UI (e.g. brand-aligned pages).
 * Cleans up on navigation so the rest of the site stays light.
 */
export default function CompanyRouteDarkTheme({
  enabled,
  children,
}: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  useLayoutEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add('dark');
    return () => {
      root.classList.remove('dark');
    };
  }, [enabled]);

  return <>{children}</>;
}
