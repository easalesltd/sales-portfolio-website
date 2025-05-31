'use client';

import React, { useCallback, useEffect } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { useTurnstile } from '../contexts/TurnstileContext';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: (error: any) => void;
}

const TurnstileWidget = () => {
  const { execute } = useTurnstile();

  const handleVerify = async () => {
    try {
      await execute();
    } catch (error) {
      // Handle error silently
    }
  };

  useEffect(() => {
    // Cleanup function to remove the widget when component unmounts
    return () => {
      const turnstileScript = document.querySelector('script#cf-turnstile-script');
      if (turnstileScript) {
        turnstileScript.remove();
      }
      const turnstileWidget = document.querySelector('.cf-turnstile');
      if (turnstileWidget) {
        turnstileWidget.remove();
      }
    };
  }, []);

  return (
    <>
      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
        onSuccess={handleVerify}
      />
    </>
  );
};

export default TurnstileWidget; 