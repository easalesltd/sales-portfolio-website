'use client';

import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

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
    { name: 'Gnaw Chocolate', checked: false },
    { name: 'Mint Publishing', checked: false },
    { name: 'Museums & Galleries', checked: false },
    { name: 'Ohh Deer Wholesale', checked: false },
    { name: 'Paper Salad', checked: false },
    { name: 'Peppermint Grove', checked: false },
    { name: 'Star Editions', checked: false },
    { name: 'WPL Gifts', checked: false }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const selectedCompanies = companies
      .filter(company => company.checked)
      .map(company => company.name)
      .join(', ');

    if (!selectedCompanies) {
      alert('Please select at least one company you are interested in');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await emailjs.send(
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

      console.log('Email sent successfully:', result);
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
        setFormData({
          name: '',
          businessName: '',
          businessAddress: '',
          datesAvailable: '',
          email: '',
          phone: '',
          notes: ''
        });
        setCompanies(companies.map(company => ({ ...company, checked: false })));
      }, 2000);
    } catch (error) {
      console.error('Failed to send email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-4 relative">
        <div className="sticky top-0 bg-white rounded-t-lg border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Request an Agent Visit</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-2"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className={`px-6 py-2 rounded-md text-white font-medium ${
                  isSubmitting 
                    ? 'bg-gray-400' 
                    : submitStatus === 'success'
                    ? 'bg-green-500'
                    : submitStatus === 'error'
                    ? 'bg-red-500'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting 
                  ? 'Sending...' 
                  : submitStatus === 'success'
                  ? 'Sent!'
                  : submitStatus === 'error'
                  ? 'Error - Try Again'
                  : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 