'use client';

import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import dynamic from 'next/dynamic';

// Dynamically import Confetti to avoid SSR issues
const ReactConfetti = dynamic(() => import('react-confetti'), {
  ssr: false
});

interface Company {
  name: string;
  checked: boolean;
}

export default function RequestVisitForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    businessAddress: '',
    datesAvailable: '',
    email: '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    emailjs.init("bQOrMB40ft605dNrW");
  }, []);

  const [companies, setCompanies] = useState<Company[]>([
    { name: 'Boxer Gifts', checked: false },
    { name: 'David Fischhoff', checked: false },
    { name: 'Emotional Rescue', checked: false },
    { name: 'Global Journey Gifts', checked: false },
    { name: 'Mint Publishing', checked: false },
    { name: 'Museums & Galleries', checked: false },
    { name: 'Ohh Deer', checked: false },
    { name: 'Paper Salad', checked: false },
    { name: 'Peppermint Grove', checked: false },
    { name: 'The Cambridge Confectionery Company', checked: false },
    { name: 'Star Editions', checked: false },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [validationError, setValidationError] = useState<string>('');
  const [flow, setFlow] = useState<'form' | 'verify_sent'>('form');
  const [verifyEmail, setVerifyEmail] = useState('');
  /** Honeypot — leave empty; bots often fill it so we skip sending. */
  const [honeypotWebsite, setHoneypotWebsite] = useState('');

  const successModalRef = useRef<HTMLDivElement>(null);
  const emptyForm = {
    name: '',
    businessName: '',
    businessAddress: '',
    datesAvailable: '',
    email: '',
    phone: '',
    notes: ''
  };

  const resetAll = () => {
    setFormData(emptyForm);
    setCompanies((prev) => prev.map((c) => ({ ...c, checked: false })));
    setFlow('form');
    setSubmitStatus('idle');
    setValidationError('');
    setVerifyEmail('');
    setHoneypotWebsite('');
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const sendLegacyEmail = async (selectedCompanies: string) => {
    await emailjs.send(
      'service_fvfxlgh',
      'template_35gndyb',
      {
        from_name: formData.name,
        business_name: formData.businessName,
        business_address: formData.businessAddress,
        dates_available: formData.datesAvailable,
        email: formData.email,
        phone: formData.phone,
        interested_companies: selectedCompanies,
        notes: formData.notes || 'No additional notes'
      },
      'bQOrMB40ft605dNrW'
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    if (honeypotWebsite.trim() !== '') {
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const selectedList = companies.filter((company) => company.checked).map((company) => company.name);
    const selectedCompanies = selectedList.join(', ');

    if (!selectedCompanies) {
      setValidationError('Please select at least one company you are interested in');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/request-visit/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          businessName: formData.businessName,
          businessAddress: formData.businessAddress,
          datesAvailable: formData.datesAvailable,
          email: formData.email,
          phone: formData.phone,
          notes: formData.notes || 'No additional notes',
          interestedCompanies: selectedList,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; fallback?: boolean; error?: string };

      if (res.ok && data.ok && !data.fallback) {
        setVerifyEmail(formData.email);
        setFlow('verify_sent');
        return;
      }

      if (data.fallback) {
        await sendLegacyEmail(selectedCompanies);
        setSubmitStatus('success');
        setTimeout(() => {
          handleClose();
        }, 5000);
        return;
      }

      if (data.error === 'send_failed') {
        setValidationError('Could not send the confirmation email. Check your connection or try again later.');
        setSubmitStatus('error');
        return;
      }

      setValidationError('Something went wrong. Please try again.');
      setSubmitStatus('error');
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Modal Overlay
  const SuccessModal = () => {
    const [windowSize, setWindowSize] = useState({
      width: typeof window !== 'undefined' ? window.innerWidth : 0,
      height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    useEffect(() => {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
      <div
        ref={successModalRef}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity animate-fade-in"
        onClick={handleClose}
      >
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
        />
        <div
          className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center relative animate-fade-in-up"
          onClick={e => e.stopPropagation()}
        >
          {/* Animated Checkmark SVG */}
          <svg className="w-20 h-20 text-green-500 mb-6" viewBox="0 0 52 52">
            <circle className="stroke-current text-green-200" cx="26" cy="26" r="25" fill="none" strokeWidth="2" />
            <path
              className="stroke-current"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="48"
              strokeDashoffset="48"
              d="M14 27l7 7 16-16"
            >
              <animate attributeName="stroke-dashoffset" from="48" to="0" dur="0.5s" fill="freeze" />
            </path>
          </svg>
          <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">Thank you!</h3>
          <p className="text-gray-600 text-center mb-6">Your request has been sent successfully.<br />We&apos;ll be in touch soon.</p>
          <button
            onClick={handleClose}
            className="mt-2 px-6 py-2 rounded-md font-medium border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-4 relative">
            <div className="sticky top-0 bg-white rounded-t-lg border-b border-gray-200 p-4 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Request an Agent Visit</h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500 p-2"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
              {flow === 'verify_sent' ? (
                <div className="space-y-4 text-center py-4">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-2xl font-bold">
                    ✉
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Check your email</h3>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
                    We sent a confirmation link to <span className="font-medium text-gray-900">{verifyEmail}</span>.
                    Open it to verify your address and send your visit request to East Anglian Sales LTD.
                  </p>
                  <p className="text-xs text-gray-500">The link expires after 48 hours. You can close this window.</p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-4 px-6 py-2 rounded-md font-medium border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : null}
              {flow === 'form' ? (
              <form onSubmit={handleSubmit} className="space-y-6 relative">
                <div
                  className="pointer-events-none absolute left-[max(-100vw,-9999px)] h-px w-px overflow-hidden opacity-0"
                  aria-hidden="true"
                >
                  <input
                    id="req-visit-company-website"
                    name="_ea_trk"
                    type="text"
                    tabIndex={-1}
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    data-1p-ignore="true"
                    data-lpignore="true"
                    data-bwignore="true"
                    aria-hidden="true"
                    value={honeypotWebsite}
                    onChange={(e) => setHoneypotWebsite(e.target.value)}
                  />
                </div>
                {validationError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md" role="alert">
                    <p className="font-medium">Please correct the following:</p>
                    <p className="text-sm mt-1">{validationError}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Your Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Address</label>
                  <textarea
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                    value={formData.businessAddress}
                    onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Preferred Dates</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Any Tuesday, Week of 15th March, etc."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.datesAvailable}
                    onChange={(e) => setFormData({ ...formData, datesAvailable: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional information or special requests..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interested in (select all that apply)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {companies.map((company, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={company.checked}
                          onChange={() => {
                            const newCompanies = [...companies];
                            newCompanies[index].checked = !newCompanies[index].checked;
                            setCompanies(newCompanies);
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">{company.name}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 rounded-md font-medium ${
                      isSubmitting 
                        ? 'bg-gray-400 text-white' 
                        : submitStatus === 'error'
                        ? 'bg-red-500 text-white'
                        : 'border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800'
                    }`}
                  >
                    {isSubmitting 
                      ? 'Sending...' 
                      : submitStatus === 'error'
                      ? 'Error - Try Again'
                      : 'Send Request'}
                  </button>
                </div>
              </form>
              ) : null}
            </div>
          </div>
        </div>
      )}
      {/* Show success modal overlay if submitStatus is success */}
      {submitStatus === 'success' && <SuccessModal />}
    </>
  );
} 