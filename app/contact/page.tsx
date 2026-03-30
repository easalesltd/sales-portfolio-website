'use client';

import React from 'react';
import { FaEnvelope, FaInstagram, FaLinkedin, FaCalendarCheck, FaPhone } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import RequestVisitForm from '../components/RequestVisitForm';
import FadeInOnScroll from '../components/FadeInOnScroll';

export default function ContactPage() {
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [visitNotice, setVisitNotice] = useState<'confirmed' | 'error' | null>(null);
  const [orderNotice, setOrderNotice] = useState<'error' | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const visit = params.get('visit');
    if (visit === 'confirmed') setVisitNotice('confirmed');
    else if (visit === 'error') setVisitNotice('error');
    if (params.get('order') === 'error') setOrderNotice('error');
  }, []);

  const dismissVisitNotice = () => {
    setVisitNotice(null);
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/contact');
    }
  };

  const dismissOrderNotice = () => {
    setOrderNotice(null);
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/contact');
    }
  };

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
        {visitNotice === 'confirmed' ? (
          <div
            className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100"
            role="status"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium">
                Your email is verified and your agent visit request has been sent. We&apos;ll be in touch soon.
              </p>
              <button
                type="button"
                onClick={dismissVisitNotice}
                className="shrink-0 text-sm font-semibold underline underline-offset-2 hover:no-underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : null}
        {visitNotice === 'error' ? (
          <div
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100"
            role="alert"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium">
                That confirmation link was invalid or expired. Please open Request an Agent Visit and try again.
              </p>
              <button
                type="button"
                onClick={dismissVisitNotice}
                className="shrink-0 text-sm font-semibold underline underline-offset-2 hover:no-underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : null}
        {orderNotice === 'error' ? (
          <div
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100"
            role="alert"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium">
                That order confirmation link was invalid or expired. Please go back to the company page and submit your order again.
              </p>
              <button
                type="button"
                onClick={dismissOrderNotice}
                className="shrink-0 text-sm font-semibold underline underline-offset-2 hover:no-underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : null}
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
                  className="text-lg font-medium px-4 py-2 rounded-md border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 transition-colors dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                >
                  Request an Agent Visit
                </button>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-4 transition-transform duration-200 hover:translate-x-1">
                <FaPhone className="text-2xl text-gray-600" />
                <a 
                  href="tel:07709197915"
                  className="text-lg text-neutral-900 font-medium hover:text-neutral-600 transition-colors dark:text-neutral-100 dark:hover:text-neutral-300"
                >
                  07709 197915
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-4 transition-transform duration-200 hover:translate-x-1">
                <FaEnvelope className="text-2xl text-gray-600" />
                <a 
                  href="mailto:dave@easalesltd.co.uk"
                  className="text-lg text-neutral-900 font-medium hover:text-neutral-600 transition-colors dark:text-neutral-100 dark:hover:text-neutral-300"
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
                  className="text-lg text-neutral-900 font-medium hover:text-neutral-600 transition-colors dark:text-neutral-100 dark:hover:text-neutral-300"
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
                  className="text-lg text-neutral-900 font-medium hover:text-neutral-600 transition-colors dark:text-neutral-100 dark:hover:text-neutral-300"
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