'use client';

import { useState, useEffect } from 'react';
import RequestVisitForm from './RequestVisitForm';

export default function ClientButton() {
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium leading-tight sm:text-base border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors"
      >
        Request an Agent Visit
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsRequestFormOpen(true)}
        className="whitespace-nowrap px-4 py-2 text-sm font-medium leading-tight sm:text-base rounded-md border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors"
      >
        Request an Agent Visit
      </button>
      <RequestVisitForm 
        isOpen={isRequestFormOpen} 
        onClose={() => setIsRequestFormOpen(false)} 
      />
    </>
  );
} 