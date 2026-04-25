'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const RequestVisitForm = dynamic(() => import('../RequestVisitForm'));

/**
 * Minimal island: opens the visit request modal from the homepage CTA row.
 */
export default function HomeRequestVisitCTA() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto inline-flex items-center justify-center text-center px-6 py-3 min-h-[3rem] rounded-md font-medium border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 transition-all duration-300 sm:hover:-translate-y-0.5 sm:hover:shadow-lg active:translate-y-0 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
      >
        Request an Agent Visit
      </button>
      <RequestVisitForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
