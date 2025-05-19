'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { companies } from '../data/companies';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useRouter, usePathname } from 'next/navigation';

export default function BrandsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/') {
      // On homepage, scroll to section
      const brandsSection = document.querySelector('#partner-brands');
      if (brandsSection) {
        brandsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // On other pages, navigate to homepage with hash
      router.push('/#partner-brands');
    }
  };

  if (!mounted) {
    return (
      <div className="relative">
        <button className="text-gray-700 px-3 py-2 rounded-md hover:bg-gray-50 flex items-center">
          Our Partner Brands
          <svg
            className="ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    );
  }

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
        }, 200); // 200ms delay
      }}
    >
      <button
        onClick={handleClick}
        className="text-gray-700 px-3 py-2 rounded-md hover:bg-gray-50 flex items-center"
      >
        Our Partner Brands
        <ChevronDownIcon
          className={`ml-2 h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-2 sm:px-0">
          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
              <div className="-m-3">
                <h3 className="text-base font-medium text-gray-900">Our Partner Brands</h3>
                <div className="mt-2 space-y-2">
                  {companies.map((company) => (
                    <Link
                      key={company.id}
                      href={`/companies/${company.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      {company.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 