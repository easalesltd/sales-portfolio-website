"use client";

import { useState } from "react";
import RequestVisitForm from "./RequestVisitForm";

export default function MobileRequestButton() {
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsRequestFormOpen(true)}
        className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm block md:hidden"
        style={{ minWidth: 'auto' }}
      >
        Request an Agent Visit
      </button>
      <RequestVisitForm isOpen={isRequestFormOpen} onClose={() => setIsRequestFormOpen(false)} />
    </>
  );
} 