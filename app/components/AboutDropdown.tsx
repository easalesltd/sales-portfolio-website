'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useRouter, usePathname } from 'next/navigation';

export default function AboutDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const aboutItems = [
    { name: 'About Dave', href: '/about' },
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

  const isActive = pathname === '/about' || pathname === '/recipes';

  return (
    <div 
      className="relative" 
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`flex items-center px-3 py-2 rounded-md transition-colors ${
          isActive 
            ? 'text-blue-600 bg-blue-50' 
            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
        }`}
      >
        About
        <ChevronDownIcon 
          className={`ml-2 h-5 w-5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
          {aboutItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-4 py-2 text-sm transition-colors ${
                pathname === item.href
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
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