'use client'

import React, { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser'
import dynamic from 'next/dynamic'

// Dynamically import Confetti to avoid SSR issues
const ReactConfetti = dynamic(() => import('react-confetti'), {
  ssr: false
});

interface OrderFormProps {
  companyName: string
}

interface OrderLine {
  productCode: string;
  quantity: string;
}

interface ContactInfo {
  companyName: string;
  contactPerson: string;
  contactDetails: string;
  emailAddress: string;
  address: string;
}

// New Peppermint Grove Order Form Component (mirrors your Excel order form)
function PeppermintGroveOrderForm({ companyName }: OrderFormProps) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    companyName: '',
    contactPerson: '',
    contactDetails: '',
    emailAddress: '',
    address: ''
  });
  const [orderLines, setOrderLines] = useState<OrderLine[]>([{ productCode: '', quantity: '' }]);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const successModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    emailjs.init("bQOrMB40ft605dNrW");
  }, []);

  const handleContactInfoChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleAddLine = () => {
    if (orderLines.length < 200) {
      setOrderLines([...orderLines, { productCode: '', quantity: '' }]);
    }
  };

  const handleRemoveLine = (index: number) => {
    if (orderLines.length > 1) {
      setOrderLines(orderLines.filter((_, i) => i !== index));
    }
  };

  const handleLineChange = (index: number, field: keyof OrderLine, value: string) => {
    const newLines = [...orderLines];
    newLines[index] = { ...newLines[index], [field]: value };
    setOrderLines(newLines);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Filter out empty lines (i.e. lines with product code (or quantity) empty)
    const filledLines = orderLines.filter(line => line.productCode.trim() !== '' && line.quantity.trim() !== '');
    if (filledLines.length === 0) {
      alert('Please add at least one product to order');
      setStatus('idle');
      return;
    }

    if (!contactInfo.companyName || !contactInfo.contactPerson || !contactInfo.emailAddress) {
      alert('Please fill in all required contact information');
      setStatus('idle');
      return;
    }

    try {
      // Format order lines for better email readability (mirroring your Excel order form)
      const formattedOrderLines = filledLines.map(line => `• Product Code: ${line.productCode} – Quantity: ${line.quantity}`).join('\n');

      const emailContent = {
        template_params: {
          to_name: 'Dave',
          from_name: contactInfo.contactPerson,
          supplier_company: companyName,
          customer_company: contactInfo.companyName,
          contact_person: contactInfo.contactPerson,
          contact_phone: contactInfo.contactDetails || 'Not provided',
          contact_email: contactInfo.emailAddress,
          delivery_address: contactInfo.address,
          order_list: formattedOrderLines,
          notes: notes || 'No additional notes provided',
          reply_to: contactInfo.emailAddress
        },
        service_id: 'service_fvfxlgh',
        template_id: 'template_1sz03e8',
        user_id: 'bQOrMB40ft605dNrW'
      };

      await emailjs.send(emailContent.service_id, emailContent.template_id, emailContent.template_params, emailContent.user_id);
      setStatus('success');
      setOrderLines([{ productCode: '', quantity: '' }]);
      setNotes('');
      setContactInfo({ companyName: '', contactPerson: '', contactDetails: '', emailAddress: '', address: '' });
    } catch (error) {
      setStatus('error');
    }
  }

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
        onClick={() => setStatus('idle')}
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
          <p className="text-gray-600 text-center mb-6">Your order request has been sent successfully.<br />We&apos;ll be in touch soon.</p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information Section */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name *</label>
              <input
                type="text"
                id="companyName"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={contactInfo.companyName}
                onChange={(e) => handleContactInfoChange('companyName', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">Contact Person *</label>
              <input
                type="text"
                id="contactPerson"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={contactInfo.contactPerson}
                onChange={(e) => handleContactInfoChange('contactPerson', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Delivery Address *</label>
              <textarea
                id="address"
                required
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={contactInfo.address}
                onChange={(e) => handleContactInfoChange('address', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="contactDetails" className="block text-sm font-medium text-gray-700">Contact Details (Phone)</label>
                <input
                  type="text"
                  id="contactDetails"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={contactInfo.contactDetails}
                  onChange={(e) => handleContactInfoChange('contactDetails', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700">Email Address *</label>
                <input
                  type="email"
                  id="emailAddress"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={contactInfo.emailAddress}
                  onChange={(e) => handleContactInfoChange('emailAddress', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Peppermint Grove Order Lines (reverted to original (start of day) –– using a text input for product code and a number input for quantity) */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Code</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderLines.map((line, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={line.productCode}
                      onChange={(e) => handleLineChange(index, 'productCode', e.target.value)}
                      placeholder="Enter product code"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      required
                      min="1"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={line.quantity}
                      onChange={(e) => handleLineChange(index, 'quantity', e.target.value)}
                      placeholder="Enter quantity"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleRemoveLine(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handleAddLine}
            disabled={orderLines.length >= 200}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Add Product Line {orderLines.length}/200
          </button>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
          <textarea
            id="notes"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {status === 'loading' ? 'Sending...' : 'Submit Order'}
        </button>

        {status === 'error' && (
          <p className="text-red-600 text-center">Failed to send order request. Please try again.</p>
        )}
      </form>
      {/* Show success modal overlay if status is success */}
      {status === 'success' && <SuccessModal />}
    </>
  );
}

// Default (generic) Order Form Component (existing code)
function DefaultOrderForm({ companyName }: OrderFormProps) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    companyName: '',
    contactPerson: '',
    contactDetails: '',
    emailAddress: '',
    address: ''
  });
  const [orderLines, setOrderLines] = useState<OrderLine[]>([{ productCode: '', quantity: '' }]);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const successModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    emailjs.init("bQOrMB40ft605dNrW");
  }, []);

  const handleContactInfoChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleAddLine = () => {
    if (orderLines.length < 200) {
      setOrderLines([...orderLines, { productCode: '', quantity: '' }]);
    }
  };

  const handleRemoveLine = (index: number) => {
    if (orderLines.length > 1) {
      setOrderLines(orderLines.filter((_, i) => i !== index));
    }
  };

  const handleLineChange = (index: number, field: keyof OrderLine, value: string) => {
    const newLines = [...orderLines];
    newLines[index] = { ...newLines[index], [field]: value };
    setOrderLines(newLines);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Filter out empty lines
    const filledLines = orderLines.filter(line => line.productCode.trim() !== '' && line.quantity.trim() !== '');
    if (filledLines.length === 0) {
      alert('Please add at least one product to order');
      setStatus('idle');
      return;
    }

    if (!contactInfo.companyName || !contactInfo.contactPerson || !contactInfo.emailAddress) {
      alert('Please fill in all required contact information');
      setStatus('idle');
      return;
    }

    try {
      // Format order lines for better email readability (mirroring your Excel order form)
      const formattedOrderLines = filledLines.map(line => `• Product Code: ${line.productCode} – Quantity: ${line.quantity}`).join('\n');

      const emailContent = {
        template_params: {
          to_name: 'Dave',
          from_name: contactInfo.contactPerson,
          supplier_company: companyName,
          customer_company: contactInfo.companyName,
          contact_person: contactInfo.contactPerson,
          contact_phone: contactInfo.contactDetails || 'Not provided',
          contact_email: contactInfo.emailAddress,
          delivery_address: contactInfo.address,
          order_list: formattedOrderLines,
          notes: notes || 'No additional notes provided',
          reply_to: contactInfo.emailAddress
        },
        service_id: 'service_fvfxlgh',
        template_id: 'template_1sz03e8',
        user_id: 'bQOrMB40ft605dNrW'
      };

      await emailjs.send(emailContent.service_id, emailContent.template_id, emailContent.template_params, emailContent.user_id);
      setStatus('success');
      setOrderLines([{ productCode: '', quantity: '' }]);
      setNotes('');
      setContactInfo({ companyName: '', contactPerson: '', contactDetails: '', emailAddress: '', address: '' });
    } catch (error) {
      setStatus('error');
    }
  }

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
        onClick={() => setStatus('idle')}
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
          <p className="text-gray-600 text-center mb-6">Your order request has been sent successfully.<br />We&apos;ll be in touch soon.</p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information Section */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name *</label>
              <input
                type="text"
                id="companyName"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={contactInfo.companyName}
                onChange={(e) => handleContactInfoChange('companyName', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">Contact Person *</label>
              <input
                type="text"
                id="contactPerson"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={contactInfo.contactPerson}
                onChange={(e) => handleContactInfoChange('contactPerson', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Delivery Address *</label>
              <textarea
                id="address"
                required
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={contactInfo.address}
                onChange={(e) => handleContactInfoChange('address', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="contactDetails" className="block text-sm font-medium text-gray-700">Contact Details (Phone)</label>
                <input
                  type="text"
                  id="contactDetails"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={contactInfo.contactDetails}
                  onChange={(e) => handleContactInfoChange('contactDetails', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700">Email Address *</label>
                <input
                  type="email"
                  id="emailAddress"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={contactInfo.emailAddress}
                  onChange={(e) => handleContactInfoChange('emailAddress', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Peppermint Grove Order Lines (mirroring your Excel order form) */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Code</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orderLines.map((line, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={line.productCode}
                      onChange={(e) => handleLineChange(index, 'productCode', e.target.value)}
                      placeholder="Enter product code"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      required
                      min="1"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={line.quantity}
                      onChange={(e) => handleLineChange(index, 'quantity', e.target.value)}
                      placeholder="Enter quantity"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleRemoveLine(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handleAddLine}
            disabled={orderLines.length >= 200}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Add Product Line {orderLines.length}/200
          </button>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
          <textarea
            id="notes"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {status === 'loading' ? 'Sending...' : 'Submit Order'}
        </button>

        {status === 'error' && (
          <p className="text-red-600 text-center">Failed to send order request. Please try again.</p>
        )}
      </form>
      {/* Show success modal overlay if status is success */}
      {status === 'success' && <SuccessModal />}
    </>
  );
}

// Exported OrderForm (Conditional Render) –– if companyName is "Peppermint Grove" render PeppermintGroveOrderForm, otherwise render DefaultOrderForm
export default function OrderForm({ companyName }: OrderFormProps) {
  if (companyName === "Peppermint Grove") {
    return <PeppermintGroveOrderForm companyName={companyName} />;
  } else {
    return <DefaultOrderForm companyName={companyName} />;
  }
} 