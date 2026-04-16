'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { usePathname } from 'next/navigation';

const displaySolutionItems = [
  { name: 'All Display Solutions', href: '/display-solutions' },
  {
    name: 'Bespoke Confectionery Displays',
    href: '/display-solutions/bespoke-confectionery-displays',
  },
] as const;

export default function DisplaySolutionsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    return () => {
      if (closeTimeout.current) {
        clearTimeout(closeTimeout.current);
      }
    };
  }, []);

  const isActive = pathname.startsWith('/display-solutions');

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={() => {
        if (closeTimeout.current) {
          clearTimeout(closeTimeout.current);
        }
        setIsOpen(true);
      }}
      onMouseLeave={() => {
        closeTimeout.current = setTimeout(() => {
          setIsOpen(false);
        }, 50);
      }}
    >
      <Link
        href="/display-solutions"
        prefetch
        className={`flex items-center px-3 py-2 rounded-md transition-colors ${
          isActive
            ? 'text-neutral-950 bg-neutral-100 dark:text-white dark:bg-neutral-800'
            : 'text-gray-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-gray-50 dark:hover:bg-neutral-900'
        }`}
      >
        Display Solutions
        <ChevronDownIcon
          className={`ml-2 h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </Link>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-neutral-900 rounded-md shadow-lg border border-gray-200 dark:border-neutral-700 py-1 z-50">
          {displaySolutionItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={`block px-4 py-2 text-sm transition-colors ${
                pathname === item.href
                  ? 'text-neutral-950 bg-neutral-100 dark:text-white dark:bg-neutral-800'
                  : 'text-gray-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
