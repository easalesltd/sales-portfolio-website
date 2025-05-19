'use client';

import { useState } from 'react';
import { FaStar, FaGoogle } from 'react-icons/fa';

export default function GoogleReviews() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Trusted by Retailers Across East Anglia
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Join our growing list of satisfied customers
          </p>
          
          {/* Review CTA Button */}
          <div className="mt-8">
            <a
              href="https://g.page/r/REPLACE_WITH_YOUR_GOOGLE_REVIEW_LINK"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors ${
                isHovered ? 'ring-2 ring-offset-2 ring-blue-500' : ''
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <FaGoogle className="mr-2" />
              Write a Review on Google
            </a>
          </div>

          {/* Review Guidelines */}
          <div className="mt-8 text-sm text-gray-500">
            <p>We value your feedback! Share your experience with:</p>
            <ul className="mt-2 list-disc list-inside">
              <li>Our product quality and selection</li>
              <li>Customer service and support</li>
              <li>Delivery and reliability</li>
              <li>Display solutions and merchandising</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 