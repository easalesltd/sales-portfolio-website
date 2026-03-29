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
        className="px-4 py-2 rounded-md font-medium border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors"
      >
        Request an Agent Visit
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsRequestFormOpen(true)}
        className="px-4 py-2 rounded-md font-medium border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors"
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