'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function LogoTestPage() {
  const [size, setSize] = useState(400);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Logo Preview</h1>
        
        {/* Size Controls */}
        <div className="mb-6 flex items-center gap-4">
          <label className="font-medium">Logo Size:</label>
          <input 
            type="range" 
            min="100" 
            max="800" 
            value={size} 
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-48"
          />
          <span>{size}px</span>
        </div>

        {/* Logo Display */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
          <div className="border border-gray-200 rounded-lg p-4" style={{ width: size, height: size }}>
            <Image
              src="/images/logo.svg"
              alt="East Anglian Sales Ltd Logo"
              width={size}
              height={size}
              style={{ width: size, height: size }}
            />
          </div>
        </div>

        {/* Different Background Tests */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-600 p-8 rounded-lg">
            <Image
              src="/images/logo.svg"
              alt="Logo on dark background"
              width={200}
              height={200}
            />
          </div>
          <div className="bg-gray-100 p-8 rounded-lg">
            <Image
              src="/images/logo.svg"
              alt="Logo on light background"
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 