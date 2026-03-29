'use client';

import React from 'react';
import { FaEnvelope, FaInstagram, FaLinkedin, FaCalendarCheck, FaPhone } from 'react-icons/fa';
import { useState } from 'react';
import RequestVisitForm from '../components/RequestVisitForm';
import FadeInOnScroll from '../components/FadeInOnScroll';

export default function ContactPage() {
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);

  // Generate structured data for Contact page
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': 'https://www.easalesltd.co.uk/contact#contactpage',
    'name': 'Contact East Anglian Sales LTD',
    'description': 'Contact Dave Langdon, your Greeting Card and Giftware Sales Agent. Get in touch via phone, email, or request an agent visit.',
    'url': 'https://www.easalesltd.co.uk/contact',
    'mainEntity': {
      '@type': 'Organization',
      '@id': 'https://www.easalesltd.co.uk/#organization',
      'name': 'East Anglian Sales LTD',
      'contactPoint': [
        {
          '@type': 'ContactPoint',
          'telephone': '07709197915',
          'email': 'dave@easalesltd.co.uk',
          'contactType': 'sales',
          'areaServed': ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire', 'Hertfordshire'],
          'availableLanguage': 'English'
        }
      ],
      'sameAs': [
        'https://www.instagram.com/eastangliansalesltd/',
        'https://www.linkedin.com/in/dave-langdon-709a8547',
        'https://www.facebook.com/eastangliansalesltd'
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactSchema)
        }}
      ></script>
      <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll>
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Contact Us</h1>
        </FadeInOnScroll>
        
        <FadeInOnScroll delay={0.12} direction="up">
          <div className="bg-white rounded-lg shadow-lg p-8 transition-shadow duration-300 hover:shadow-xl">
            <div className="space-y-6">
              {/* Request an Agent Visit */}
              <div className="flex items-center space-x-4 transition-transform duration-200 hover:translate-x-1">
                <FaCalendarCheck className="text-2xl text-gray-600" />
                <button
                  onClick={() => setIsRequestFormOpen(true)}
                  className="text-lg text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Request an Agent Visit
                </button>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-4 transition-transform duration-200 hover:translate-x-1">
                <FaPhone className="text-2xl text-gray-600" />
                <a 
                  href="tel:07709197915"
                  className="text-lg text-blue-600 hover:text-blue-800 transition-colors"
                >
                  07709 197915
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-4 transition-transform duration-200 hover:translate-x-1">
                <FaEnvelope className="text-2xl text-gray-600" />
                <a 
                  href="mailto:dave@easalesltd.co.uk"
                  className="text-lg text-blue-600 hover:text-blue-800 transition-colors"
                >
                  dave@easalesltd.co.uk
                </a>
              </div>

              {/* Instagram */}
              <div className="flex items-center space-x-4 transition-transform duration-200 hover:translate-x-1">
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
              <div className="flex items-center space-x-4 transition-transform duration-200 hover:translate-x-1">
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
        </FadeInOnScroll>
      </div>

      {/* Request Visit Form Modal */}
      <RequestVisitForm 
        isOpen={isRequestFormOpen} 
        onClose={() => setIsRequestFormOpen(false)} 
      />
    </div>
    </>
  );
} 