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
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Request an Agent Visit
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsRequestFormOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
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