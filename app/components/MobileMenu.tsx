'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { companies } from '../data/companies';
import RequestVisitForm from './RequestVisitForm';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="md:hidden">
        <button 
          className="text-gray-500 hover:text-gray-700 p-2"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="md:hidden">
      {/* Burger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="text-gray-500 hover:text-gray-700 p-2"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Panel */}
      <div 
        className={`
          fixed top-0 right-0 w-[280px] bg-white shadow-lg z-40
          transform transition-transform duration-300 ease-in-out h-full
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          <span className="font-semibold text-gray-900">Menu</span>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <nav className="px-6 py-8">
            {/* Request Agent Visit Button */}
            <div className="mb-8">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsRequestFormOpen(true);
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-center"
              >
                Request an Agent Visit
              </button>
            </div>

            {/* Main Navigation Links */}
            <div className="space-y-6">
              <Link 
                href="/" 
                className="block text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors" 
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="block text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors" 
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              
              {/* Brands Section */}
              <div className="py-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Our Partner Brands</h3>
                <div className="space-y-3">
                  {companies.map((company) => (
                    <Link
                      key={company.id}
                      href={`/companies/${company.slug}`}
                      className="block text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {company.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link 
                href="/display-solutions" 
                className="block text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors" 
                onClick={() => setIsOpen(false)}
              >
                Display Solutions
              </Link>
              
              <Link 
                href="/contact" 
                className="block text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors" 
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Request Visit Form Modal */}
      <RequestVisitForm 
        isOpen={isRequestFormOpen} 
        onClose={() => setIsRequestFormOpen(false)} 
      />
    </div>
  );
} 