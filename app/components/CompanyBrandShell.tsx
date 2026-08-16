'use client';

import { useLayoutEffect, type CSSProperties, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { getBrandPageTheme } from '@/app/data/brand-page-themes';

export default function CompanyBrandShell({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const slug = pathname.split('/').filter(Boolean).pop() ?? '';
  const theme = getBrandPageTheme(slug);
  const darkBrandPage = slug === 'cambridge-confectionery-company';

  useLayoutEffect(() => {
    if (!darkBrandPage) return;
    const root = document.documentElement;
    root.classList.add('dark');
    return () => {
      root.classList.remove('dark');
    };
  }, [darkBrandPage]);

  const brandStyle = {
    '--brand-accent': theme.accent,
    '--brand-accent-fg': theme.accentForeground,
    '--brand-text': theme.text,
    '--brand-heading': theme.heading,
    '--brand-card': theme.card,
    '--brand-transform': theme.headingTransform,
    '--brand-tracking': theme.headingTracking,
    '--brand-radius': theme.radius,
    '--brand-heading-font': `var(--font-brand-${theme.headingFont})`,
    '--brand-body-font': `var(--font-brand-${theme.bodyFont})`,
  } as CSSProperties;

  return (
    <div className={`brand-honour ${className ?? ''}`.trim()} style={brandStyle}>
      {children}
    </div>
  );
}
