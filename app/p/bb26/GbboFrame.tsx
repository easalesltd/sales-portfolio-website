'use client';

import { useEffect } from 'react';
import { AppShell } from '@/app/components/gbbo/AppShell';
import { LeagueProvider } from '@/app/lib/gbbo/store';

export function GbboFrame({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.sweepstakeStandalone = 'true';
    document.documentElement.dataset.sweepstakeTheme = 'gbbo';
    return () => {
      delete document.documentElement.dataset.sweepstakeStandalone;
      delete document.documentElement.dataset.sweepstakeTheme;
    };
  }, []);

  return (
    <LeagueProvider>
      <AppShell>{children}</AppShell>
    </LeagueProvider>
  );
}
