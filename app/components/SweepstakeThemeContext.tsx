'use client';

import { createContext, useContext } from 'react';
import {
  getSweepstakeFantasyTheme,
  type SweepstakeFantasyTheme,
  type SweepstakeFantasyThemeId,
} from '@/app/lib/sweepstake-fantasy-theme';

const SweepstakeThemeContext = createContext<SweepstakeFantasyTheme>(getSweepstakeFantasyTheme());

export function SweepstakeThemeProvider({
  themeId,
  children,
}: {
  themeId: SweepstakeFantasyThemeId;
  children: React.ReactNode;
}) {
  return (
    <SweepstakeThemeContext.Provider value={getSweepstakeFantasyTheme(themeId)}>
      {children}
    </SweepstakeThemeContext.Provider>
  );
}

export function useSweepstakeTheme(): SweepstakeFantasyTheme {
  return useContext(SweepstakeThemeContext);
}
