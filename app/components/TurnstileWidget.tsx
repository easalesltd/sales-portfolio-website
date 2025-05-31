'use client';

import React, { useCallback, useEffect } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: (error: any) => void;
}

export default function TurnstileWidget({ onVerify, onError }: TurnstileWidgetProps) {
  const handleVerify = useCallback((token: string) => {
    onVerify(token);
  }, [onVerify]);

  const handleError = useCallback((error: any) => {
    if (onError) {
      onError(error);
    }
    console.error('Turnstile error:', error);
  }, [onError]);

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
        onError={handleError}
      />
    </>
  );
} 