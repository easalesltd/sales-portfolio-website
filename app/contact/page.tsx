'use client';

import Link from 'next/link';
import { FaEnvelope, FaInstagram, FaLinkedin, FaCalendarCheck, FaPhone } from 'react-icons/fa';

export default function ContactPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Contact Us</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            {/* Request an Agent Visit Button (updated so that it opens a modal (or a form) (or navigates to a “/request-agent” (or “/request” or “/agent” or “/request-an-agent”) route) –– similar to the top navigation bar (for requesting an agent) */}
            <div className="flex justify-center mb-8">
              <Link
                href="/request-agent"
                className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                <FaCalendarCheck className="mr-2" />
                Request an Agent Visit
              </Link>
            </div>

            {/* Phone */}
            <div className="flex items-center space-x-4">
              <FaPhone className="text-2xl text-gray-600" />
              <a 
                href="tel:07709197915"
                className="text-lg text-blue-600 hover:text-blue-800 transition-colors"
              >
                07709 197915
              </a>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-2xl text-gray-600" />
              <a 
                href="mailto:dave@easalesltd.co.uk"
                className="text-lg text-blue-600 hover:text-blue-800 transition-colors"
              >
                dave@easalesltd.co.uk
              </a>
            </div>

            {/* Instagram */}
            <div className="flex items-center space-x-4">
              <FaInstagram className="text-2xl text-gray-600" />
              <a 
                href="https://www.instagram.com/eastangliansalesltd/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-blue-600 hover:text-blue-800 transition-colors"
              >
                @eastangliansalesltd
              </a>
            </div>

            {/* LinkedIn */}
            <div className="flex items-center space-x-4">
              <FaLinkedin className="text-2xl text-gray-600" />
              <a 
                href="https://www.linkedin.com/in/dave-langdon-709a8547"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-blue-600 hover:text-blue-800 transition-colors"
              >
                Dave Langdon
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 