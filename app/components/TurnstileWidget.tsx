'use client';

import React, { useEffect } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { useTurnstile } from '../contexts/TurnstileContext';

const TurnstileWidget = () => {
  const { execute } = useTurnstile();

  const handleVerify = async () => {
    try {
      await execute();
    } catch {
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