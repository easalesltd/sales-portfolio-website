'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { companies } from '../data/companies';
import RequestVisitForm from './RequestVisitForm';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [isBrandsExpanded, setIsBrandsExpanded] = useState(false);
  const [isDisplaySolutionsExpanded, setIsDisplaySolutionsExpanded] = useState(false);

  const aboutNavItems = [
    { name: 'Meet Dave', href: '/about' },
    { name: 'Contact Dave', href: '/about/contact' },
    { name: 'What is a Sales Agent?', href: '/what-is-a-sales-agent' },
    { name: 'Blog / Press', href: '/blog' },
    { name: 'Recipes', href: '/recipes' },
  ] as const;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="md:hidden">
        <button 
          className="text-gray-500 dark:text-neutral-300 hover:text-gray-700 dark:hover:text-white p-2"
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
        className="text-gray-500 dark:text-neutral-300 hover:text-gray-700 dark:hover:text-white p-1.5 md:p-2"
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
                className="w-full px-4 py-2 rounded-md font-medium text-center border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 transition-colors"
              >
                Request an Agent Visit
              </button>
            </div>

            {/* Main Navigation Links */}
            <div className="space-y-6">
              <Link 
                href="/" 
                prefetch
                className="block text-lg font-medium text-gray-900 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors" 
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              
              {/* About Section — expandable, same pattern as Our Partner Brands */}
              <div>
                <button
                  type="button"
                  onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                  className="flex w-full items-center justify-between text-lg font-medium text-gray-900 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors mb-2"
                  aria-expanded={isAboutExpanded}
                  aria-controls="mobile-menu-about-subnav"
                >
                  About Dave
                  <svg
                    className={`h-5 w-5 transform transition-transform ${isAboutExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  id="mobile-menu-about-subnav"
                  className={`mt-2 space-y-3 overflow-hidden transition-all duration-300 ${
                    isAboutExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {aboutNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch
                      className="block pl-4 text-gray-600 transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Brands Section */}
              <div>
                <button
                  onClick={() => setIsBrandsExpanded(!isBrandsExpanded)}
                  className="flex items-center justify-between w-full text-lg font-medium text-gray-900 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors mb-2"
                >
                  Our Partner Brands
                  <svg 
                    className={`w-5 h-5 transform transition-transform ${isBrandsExpanded ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`space-y-3 overflow-hidden transition-all duration-300 ${isBrandsExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} mt-2`}>
                  {companies.map((company) => (
                    <Link
                      key={company.id}
                      href={`/companies/${company.slug}`}
                      prefetch={false}
                      className="block text-gray-600 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors pl-4"
                      onClick={() => setIsOpen(false)}
                    >
                      {company.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setIsDisplaySolutionsExpanded(!isDisplaySolutionsExpanded)}
                  className="flex w-full items-center justify-between text-lg font-medium text-gray-900 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors mb-2"
                  aria-expanded={isDisplaySolutionsExpanded}
                  aria-controls="mobile-menu-display-solutions-subnav"
                >
                  Display Solutions
                  <svg
                    className={`h-5 w-5 transform transition-transform ${isDisplaySolutionsExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  id="mobile-menu-display-solutions-subnav"
                  className={`mt-2 space-y-3 overflow-hidden transition-all duration-300 ${
                    isDisplaySolutionsExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <Link
                    href="/display-solutions"
                    prefetch
                    className="block pl-4 text-gray-600 transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
                    onClick={() => setIsOpen(false)}
                  >
                    All Display Solutions
                  </Link>
                  <Link
                    href="/display-solutions/bespoke-confectionery-displays"
                    prefetch
                    className="block pl-4 text-gray-600 transition-colors hover:text-neutral-800 dark:hover:text-neutral-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Bespoke Confectionery Displays
                  </Link>
                </div>
              </div>
              
              <Link 
                href="/temporary-rep-cover" 
                prefetch
                className="block text-lg font-medium text-gray-900 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors" 
                onClick={() => setIsOpen(false)}
              >
                Temporary Rep Cover
              </Link>
              
              <Link 
                href="/contact" 
                prefetch
                className="block text-lg font-medium text-gray-900 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors" 
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