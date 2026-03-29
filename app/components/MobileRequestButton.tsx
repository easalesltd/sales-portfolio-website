"use client";

import { useState } from "react";
import RequestVisitForm from "./RequestVisitForm";

export default function MobileRequestButton() {
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsRequestFormOpen(true)}
        className="ml-2 px-3 py-2 rounded-md font-medium text-sm block md:hidden border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors"
        style={{ minWidth: 'auto' }}
      >
        Request an Agent Visit
      </button>
      <RequestVisitForm isOpen={isRequestFormOpen} onClose={() => setIsRequestFormOpen(false)} />
    </>
  );
} 