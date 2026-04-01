'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { usePathname } from 'next/navigation';

export default function AboutDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const aboutItems = [
    { name: 'Meet Dave', href: '/about' },
    { name: 'What is a Sales Agent?', href: '/what-is-a-sales-agent' },
    { name: 'Magazine articles', href: '/blog' },
    { name: 'Recipes', href: '/recipes' }
  ];

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 50); // Faster close to prevent overlap
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const isActive =
    pathname === '/about' ||
    pathname === '/recipes' ||
    pathname === '/what-is-a-sales-agent' ||
    pathname.startsWith('/blog');

  return (
    <div 
      className="relative" 
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href="/about"
        prefetch
        className={`flex items-center px-3 py-2 rounded-md transition-colors ${
          isActive 
            ? 'text-neutral-950 bg-neutral-100 dark:text-white dark:bg-neutral-800' 
            : 'text-gray-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-900'
        }`}
      >
        About Dave
        <ChevronDownIcon 
          className={`ml-2 h-5 w-5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </Link>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-md shadow-lg border border-gray-200 dark:border-neutral-700 py-1 z-50">
          {aboutItems.map((item) => (
            <Link
              key={item.name}
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