'use client';

import { useEffect } from 'react';
import EnglishPyramidFantasy from '@/app/components/EnglishPyramidFantasy';

export default function EnglishPyramidSweepstakePage() {
  useEffect(() => {
    document.documentElement.dataset.sweepstakeStandalone = 'true';
    document.documentElement.dataset.sweepstakeTheme = 'english-pyramid';
    return () => {
      delete document.documentElement.dataset.sweepstakeStandalone;
      delete document.documentElement.dataset.sweepstakeTheme;
    };
  }, []);

  return <EnglishPyramidFantasy standalone />;
}
