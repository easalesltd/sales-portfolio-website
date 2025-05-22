'use client';

import { useEffect, useCallback } from 'react';
import Script from 'next/script';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: (error: Error) => void;
}

export default function TurnstileWidget({ onVerify, onError }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    console.warn('Turnstile site key not found in environment variables');
    return null;
  }

  const handleCallback = useCallback((token: string) => {
    onVerify(token);
  }, [onVerify]);

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
      <Script
        id="cf-turnstile-script"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      />
      <div
        className="cf-turnstile"
        data-sitekey={siteKey}
        data-callback={handleCallback}
        data-error={onError}
        data-theme="light"
        data-action="form"
      />
    </>
  );
} 