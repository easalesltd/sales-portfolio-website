'use client';

import React, { useEffect } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { verifyTurnstileToken } from '../lib/turnstile';

interface TurnstileWidgetProps {
  onVerify?: (token: string) => void;
  onError?: () => void;
}

const TurnstileWidget = ({ onVerify, onError }: TurnstileWidgetProps) => {
  const handleVerify = async (token: string) => {
    try {
      const isValid = await verifyTurnstileToken(token);
      if (isValid && onVerify) {
        onVerify(token);
      } else if (!isValid && onError) {
        onError();
      }
    } catch {
      if (onError) {
        onError();
      }
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
        onError={onError}
      />
    </>
  );
};

export default TurnstileWidget; 