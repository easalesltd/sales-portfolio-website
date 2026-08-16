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
    const main = document.getElementById('main-content');
    const pageColor = theme.page && theme.page !== 'transparent' ? theme.page : '';
    const previousMain = main?.style.backgroundColor ?? '';
    if (main && pageColor) main.style.backgroundColor = pageColor;
    if (darkBrandPage) document.documentElement.classList.add('dark');

    return () => {
      if (main) main.style.backgroundColor = previousMain;
      if (darkBrandPage) document.documentElement.classList.remove('dark');
    };
  }, [darkBrandPage, theme.page]);

  const brandStyle = {
    '--brand-accent': theme.accent,
    '--brand-accent-fg': theme.accentForeground,
    '--brand-text': theme.text,
    '--brand-heading': theme.heading,
    '--brand-card': theme.card,
    '--brand-transform': theme.headingTransform,
    '--brand-tracking': theme.headingTracking,
    '--brand-radius': theme.radius,
    '--brand-page': theme.page ?? 'transparent',
    '--brand-heading-font': `var(--font-brand-${theme.headingFont})`,
    '--brand-body-font': `var(--font-brand-${theme.bodyFont})`,
  } as CSSProperties;

  return (
    <div className={`brand-honour ${className ?? ''}`.trim()} style={brandStyle}>
      {children}
    </div>
  );
}
