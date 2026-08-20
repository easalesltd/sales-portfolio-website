'use client'

import React, { useState, useEffect, useRef, useId } from 'react'
import emailjs from '@emailjs/browser'
import dynamic from 'next/dynamic'
import { FORM_TEXT_FIELD_CLASS } from '@/app/lib/form-field-classes'

// Dynamically import Confetti to avoid SSR issues
const ReactConfetti = dynamic(() => import('react-confetti'), {
  ssr: false
});

interface OrderFormProps {
  companyName: string
  /** Must match `app/data/companies` slug — used for verify flow and redirect. */
  companySlug: string
  /** Cambridge (dark brand page): white buttons with dark text */
  invertedPrimaryButtons?: boolean
}

function primaryCtaColors(inverted: boolean) {
  return inverted
    ? 'border border-white bg-white text-neutral-950 hover:bg-neutral-200 focus:ring-white dark:focus:ring-offset-neutral-900'
    : 'border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 focus:ring-neutral-950 dark:focus:ring-offset-neutral-900'
}

function secondaryOutlineClass(inverted: boolean) {
  return inverted
    ? 'inline-flex items-center px-4 py-2 border border-white shadow-sm text-sm font-medium rounded-md text-white bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white dark:focus:ring-offset-neutral-900 disabled:opacity-50'
    : 'inline-flex items-center px-4 py-2 border border-gray-300 dark:border-neutral-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 dark:focus:ring-offset-neutral-900 disabled:opacity-50'
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

type OrderVerifyApiResult = 'verify_sent' | 'legacy' | 'send_failed' | 'bad_request' | 'error';

async function startOrderVerificationAPI(params: {
  companySlug: string;
  supplierCompany: string;
  contactInfo: ContactInfo;
  filledLines: OrderLine[];
  notes: string;
}): Promise<OrderVerifyApiResult> {
  const res = await fetch('/api/order/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      companySlug: params.companySlug,
      supplierCompany: params.supplierCompany,
      contact: {
        companyName: params.contactInfo.companyName,
        contactPerson: params.contactInfo.contactPerson,
        contactDetails: params.contactInfo.contactDetails,
        emailAddress: params.contactInfo.emailAddress,
        address: params.contactInfo.address,
      },
      orderLines: params.filledLines,
      notes: params.notes,
    }),
  });
  const data = (await res.json()) as { ok?: boolean; fallback?: boolean; error?: string };

  if (res.ok && data.ok && !data.fallback) {
    return 'verify_sent';
  }
  if (data.fallback) {
    return 'legacy';
  }
  if (data.error === 'send_failed') {
    return 'send_failed';
  }
  if (res.status === 400) {
    return 'bad_request';
  }
  return 'error';
}

async function sendLegacyOrderEmail(
  companyName: string,
  contactInfo: ContactInfo,
  formattedOrderLines: string,
  notes: string,
): Promise<void> {
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
      reply_to: contactInfo.emailAddress,
    },
    service_id: 'service_fvfxlgh',
    template_id: 'template_1sz03e8',
    user_id: 'bQOrMB40ft605dNrW',
  };
  await emailjs.send(
    emailContent.service_id,
    emailContent.template_id,
    emailContent.template_params,
    emailContent.user_id,
  );
}

function OrderUrlConfirmationBanner() {
  const [notice, setNotice] = useState<'confirmed' | 'error' | null>(null);

  useEffect(() => {
    const q = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('order') : null;
    if (q === 'confirmed') setNotice('confirmed');
    else if (q === 'error') setNotice('error');
  }, []);

  const dismiss = () => {
    setNotice(null);
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  if (notice === 'confirmed') {
    return (
      <div
        className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100"
        role="status"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium">
            Your email is verified and your order request has been sent. We&apos;ll be in touch soon.
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="shrink-0 text-sm font-semibold underline underline-offset-2 hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  if (notice === 'error') {
    return (
      <div
        className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100"
        role="alert"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium">
            That confirmation link was invalid or expired. Please submit the order form again.
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="shrink-0 text-sm font-semibold underline underline-offset-2 hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return null;
}

function OrderVerifySentPanel({
  verifyEmail,
  invertedPrimaryButtons,
  onDismiss,
}: {
  verifyEmail: string;
  invertedPrimaryButtons: boolean;
  onDismiss: () => void;
}) {
  return (
    <div className="mb-6 space-y-4 rounded-lg border border-neutral-200 bg-white px-4 py-6 text-center dark:border-neutral-700 dark:bg-neutral-900/50">
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold ${
          invertedPrimaryButtons ? 'bg-white/15 text-white' : 'bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-neutral-100'
        }`}
      >
        ✉
      </div>
      <h3 className={`text-xl font-semibold ${invertedPrimaryButtons ? 'text-white' : 'text-gray-900 dark:text-neutral-100'}`}>
        Check your email
      </h3>
      <p className={`mx-auto max-w-md text-sm leading-relaxed ${invertedPrimaryButtons ? 'text-white/85' : 'text-gray-600 dark:text-neutral-400'}`}>
        We sent a confirmation link to{' '}
        <span className={`font-medium ${invertedPrimaryButtons ? 'text-white' : 'text-gray-900 dark:text-neutral-100'}`}>{verifyEmail}</span>.
        Open it to verify your address and send your order to East Anglian Sales LTD.
      </p>
      <p className={`text-xs ${invertedPrimaryButtons ? 'text-white/70' : 'text-gray-500 dark:text-neutral-500'}`}>
        The link expires after 48 hours. You can leave this page and return later.
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className={`mt-2 rounded-md px-6 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${primaryCtaColors(invertedPrimaryButtons)}`}
      >
        Back to form
      </button>
    </div>
  );
}

// New Peppermint Grove Order Form Component (mirrors your Excel order form)
function PeppermintGroveOrderForm({ companyName, companySlug, invertedPrimaryButtons = false }: OrderFormProps) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    companyName: '',
    contactPerson: '',
    contactDetails: '',
    emailAddress: '',
    address: ''
  });
  const [orderLines, setOrderLines] = useState<OrderLine[]>([{ productCode: '', quantity: '' }]);
  const [notes, setNotes] = useState('');
  const [honeypotWebsite, setHoneypotWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [flow, setFlow] = useState<'form' | 'verify_sent'>('form');
  const [verifyEmail, setVerifyEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const successModalRef = useRef<HTMLDivElement>(null);
  const hpId = useId();

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

  const resetAfterSuccessfulSend = () => {
    setOrderLines([{ productCode: '', quantity: '' }]);
    setNotes('');
    setContactInfo({ companyName: '', contactPerson: '', contactDetails: '', emailAddress: '', address: '' });
    setHoneypotWebsite('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    if (honeypotWebsite.trim() !== '') {
      return;
    }

    const filledLines = orderLines.filter(line => line.productCode.trim() !== '' && line.quantity.trim() !== '');
    if (filledLines.length === 0) {
      alert('Please add at least one product to order');
      return;
    }

    if (!contactInfo.companyName || !contactInfo.contactPerson || !contactInfo.emailAddress) {
      alert('Please fill in all required contact information');
      return;
    }

    setStatus('loading');

    try {
      const formattedOrderLines = filledLines.map(line => `• Product Code: ${line.productCode} – Quantity: ${line.quantity}`).join('\n');

      const apiResult = await startOrderVerificationAPI({
        companySlug,
        supplierCompany: companyName,
        contactInfo,
        filledLines,
        notes,
      });

      if (apiResult === 'verify_sent') {
        setVerifyEmail(contactInfo.emailAddress);
        setFlow('verify_sent');
        return;
      }

      if (apiResult === 'legacy') {
        await sendLegacyOrderEmail(companyName, contactInfo, formattedOrderLines, notes);
        setStatus('success');
        resetAfterSuccessfulSend();
        return;
      }

      if (apiResult === 'send_failed') {
        setValidationError('Could not send the confirmation email. Check your connection or try again later.');
        setStatus('error');
        return;
      }

      if (apiResult === 'bad_request') {
        setValidationError('Please check your order details and try again.');
        setStatus('error');
        return;
      }

      setValidationError('Something went wrong. Please try again.');
      setStatus('error');
    } catch {
      setStatus('error');
    } finally {
      setStatus((s) => (s === 'loading' ? 'idle' : s));
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
          className="bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 rounded-xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center relative animate-fade-in-up"
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
          <h3 className="text-2xl font-bold text-gray-800 dark:text-neutral-100 mb-2 text-center">Thank you!</h3>
          <p className="text-gray-600 dark:text-neutral-400 text-center mb-6">Your order request has been sent successfully.<br />We'll be in touch soon.</p>
          <button
            onClick={() => setStatus('idle')}
            className={`mt-2 px-6 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${primaryCtaColors(invertedPrimaryButtons)}`}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {flow === 'verify_sent' ? (
        <OrderVerifySentPanel
          verifyEmail={verifyEmail}
          invertedPrimaryButtons={invertedPrimaryButtons}
          onDismiss={() => {
            setFlow('form');
            setVerifyEmail('');
            setValidationError('');
          }}
        />
      ) : null}
      {flow === 'form' ? (
      <form onSubmit={handleSubmit} className="space-y-6 relative">
        {/* Bot trap: must stay empty. "Company website" label was tripping password managers / autofill. */}
        <div
          className="pointer-events-none absolute left-[max(-100vw,-9999px)] h-px w-px overflow-hidden opacity-0"
          aria-hidden="true"
        >
          <input
            id={hpId}
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
        {(validationError || status === 'error') && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100" role="alert">
            {validationError || 'Failed to send order request. Please try again.'}
          </div>
        )}
        {/* Contact Information Section */}
        <div className="bg-gray-50 dark:bg-neutral-900/90 dark:border dark:border-neutral-800 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-100 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Company Name *</label>
              <input
                type="text"
                id="companyName"
                required
                className={`mt-1 ${FORM_TEXT_FIELD_CLASS}`}
                value={contactInfo.companyName}
                onChange={(e) => handleContactInfoChange('companyName', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Contact Person *</label>
              <input
                type="text"
                id="contactPerson"
                required
                className={`mt-1 ${FORM_TEXT_FIELD_CLASS}`}
                value={contactInfo.contactPerson}
                onChange={(e) => handleContactInfoChange('contactPerson', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Delivery Address *</label>
              <textarea
                id="address"
                required
                rows={3}
                className={`mt-1 ${FORM_TEXT_FIELD_CLASS}`}
                value={contactInfo.address}
                onChange={(e) => handleContactInfoChange('address', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="contactDetails" className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Contact Details (Phone)</label>
                <input
                  type="text"
                  id="contactDetails"
                  className={`mt-1 ${FORM_TEXT_FIELD_CLASS}`}
                  value={contactInfo.contactDetails}
                  onChange={(e) => handleContactInfoChange('contactDetails', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Email Address *</label>
                <input
                  type="email"
                  id="emailAddress"
                  required
                  className={`mt-1 ${FORM_TEXT_FIELD_CLASS}`}
                  value={contactInfo.emailAddress}
                  onChange={(e) => handleContactInfoChange('emailAddress', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Peppermint Grove Order Lines (reverted to original (start of day) –– using a text input for product code and a number input for quantity) */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
            <thead className="bg-gray-50 dark:bg-neutral-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Product Code</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Quantity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-700">
              {orderLines.map((line, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      required
                      className={FORM_TEXT_FIELD_CLASS}
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
                      className={FORM_TEXT_FIELD_CLASS}
                      value={line.quantity}
                      onChange={(e) => handleLineChange(index, 'quantity', e.target.value)}
                      placeholder="Enter quantity"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleRemoveLine(index)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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
            className={secondaryOutlineClass(invertedPrimaryButtons)}
          >
            Add Product Line {orderLines.length}/200
          </button>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Additional Notes</label>
          <textarea
            id="notes"
            rows={4}
            className={`mt-1 ${FORM_TEXT_FIELD_CLASS}`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className={`w-full rounded-md px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors ${primaryCtaColors(invertedPrimaryButtons)}`}
        >
          {status === 'loading' ? 'Sending...' : 'Submit Order'}
        </button>
      </form>
      ) : null}
      {/* Show success modal overlay if status is success */}
      {status === 'success' && <SuccessModal />}
    </>
  );
}

// Default (generic) Order Form Component (existing code)
function DefaultOrderForm({ companyName, companySlug, invertedPrimaryButtons = false }: OrderFormProps) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    companyName: '',
    contactPerson: '',
    contactDetails: '',
    emailAddress: '',
    address: ''
  });
  const [orderLines, setOrderLines] = useState<OrderLine[]>([{ productCode: '', quantity: '' }]);
  const [notes, setNotes] = useState('');
  const [honeypotWebsite, setHoneypotWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [flow, setFlow] = useState<'form' | 'verify_sent'>('form');
  const [verifyEmail, setVerifyEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const successModalRef = useRef<HTMLDivElement>(null);
  const hpId = useId();

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

  const resetAfterSuccessfulSend = () => {
    setOrderLines([{ productCode: '', quantity: '' }]);
    setNotes('');
    setContactInfo({ companyName: '', contactPerson: '', contactDetails: '', emailAddress: '', address: '' });
    setHoneypotWebsite('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    if (honeypotWebsite.trim() !== '') {
      return;
    }

    const filledLines = orderLines.filter(line => line.productCode.trim() !== '' && line.quantity.trim() !== '');
    if (filledLines.length === 0) {
      alert('Please add at least one product to order');
      return;
    }

    if (!contactInfo.companyName || !contactInfo.contactPerson || !contactInfo.emailAddress) {
      alert('Please fill in all required contact information');
      return;
    }

    setStatus('loading');

    try {
      const formattedOrderLines = filledLines.map(line => `• Product Code: ${line.productCode} – Quantity: ${line.quantity}`).join('\n');

      const apiResult = await startOrderVerificationAPI({
        companySlug,
        supplierCompany: companyName,
        contactInfo,
        filledLines,
        notes,
      });

      if (apiResult === 'verify_sent') {
        setVerifyEmail(contactInfo.emailAddress);
        setFlow('verify_sent');
        return;
      }

      if (apiResult === 'legacy') {
        await sendLegacyOrderEmail(companyName, contactInfo, formattedOrderLines, notes);
        setStatus('success');
        resetAfterSuccessfulSend();
        return;
      }

      if (apiResult === 'send_failed') {
        setValidationError('Could not send the confirmation email. Check your connection or try again later.');
        setStatus('error');
        return;
      }

      if (apiResult === 'bad_request') {
        setValidationError('Please check your order details and try again.');
        setStatus('error');
        return;
      }

      setValidationError('Something went wrong. Please try again.');
      setStatus('error');
    } catch {
      setStatus('error');
    } finally {
      setStatus((s) => (s === 'loading' ? 'idle' : s));
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
          className="bg-white dark:bg-neutral-900 dark:border dark:border-neutral-700 rounded-xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center relative animate-fade-in-up"
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
          <h3 className="text-2xl font-bold text-gray-800 dark:text-neutral-100 mb-2 text-center">Thank you!</h3>
          <p className="text-gray-600 dark:text-neutral-400 text-center mb-6">Your order request has been sent successfully.<br />We'll be in touch soon.</p>
          <button
            onClick={() => setStatus('idle')}
            className={`mt-2 px-6 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${primaryCtaColors(invertedPrimaryButtons)}`}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {flow === 'verify_sent' ? (
        <OrderVerifySentPanel
          verifyEmail={verifyEmail}
          invertedPrimaryButtons={invertedPrimaryButtons}
          onDismiss={() => {
            setFlow('form');
            setVerifyEmail('');
            setValidationError('');
          }}
        />
      ) : null}
      {flow === 'form' ? (
      <form onSubmit={handleSubmit} className="space-y-6 relative">
        {/* Bot trap: must stay empty. "Company website" label was tripping password managers / autofill. */}
        <div
          className="pointer-events-none absolute left-[max(-100vw,-9999px)] h-px w-px overflow-hidden opacity-0"
          aria-hidden="true"
        >
          <input
            id={hpId}
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
        {(validationError || status === 'error') && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100" role="alert">
            {validationError || 'Failed to send order request. Please try again.'}
          </div>
        )}
        {/* Contact Information Section */}
        <div className="bg-gray-50 dark:bg-neutral-900/90 dark:border dark:border-neutral-800 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-100 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Company Name *</label>
              <input
                type="text"
                id="companyName"
                required
                className={`mt-1 ${FORM_TEXT_FIELD_CLASS}`}
                value={contactInfo.companyName}
                onChange={(e) => handleContactInfoChange('companyName', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Contact Person *</label>
              <input
                type="text"
                id="contactPerson"
                required
                className={`mt-1 ${FORM_TEXT_FIELD_CLASS}`}
                value={contactInfo.contactPerson}
                onChange={(e) => handleContactInfoChange('contactPerson', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Delivery Address *</label>
              <textarea
                id="address"
                required
                rows={3}
                className={`mt-1 ${FORM_TEXT_FIELD_CLASS}`}
                value={contactInfo.address}
                onChange={(e) => handleContactInfoChange('address', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="contactDetails" className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Contact Details (Phone)</label>
                <input
                  type="text"
                  id="contactDetails"
                  className={`mt-1 ${FORM_TEXT_FIELD_CLASS}`}
                  value={contactInfo.contactDetails}
                  onChange={(e) => handleContactInfoChange('contactDetails', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Email Address *</label>
                <input
                  type="email"
                  id="emailAddress"
                  required
                  className={`mt-1 ${FORM_TEXT_FIELD_CLASS}`}
                  value={contactInfo.emailAddress}
                  onChange={(e) => handleContactInfoChange('emailAddress', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Peppermint Grove Order Lines (mirroring your Excel order form) */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
            <thead className="bg-gray-50 dark:bg-neutral-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Product Code</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Quantity</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-700">
              {orderLines.map((line, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      required
                      className={FORM_TEXT_FIELD_CLASS}
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
                      className={FORM_TEXT_FIELD_CLASS}
                      value={line.quantity}
                      onChange={(e) => handleLineChange(index, 'quantity', e.target.value)}
                      placeholder="Enter quantity"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleRemoveLine(index)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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
            className={secondaryOutlineClass(invertedPrimaryButtons)}
          >
            Add Product Line {orderLines.length}/200
          </button>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-neutral-300">Additional Notes</label>
          <textarea
            id="notes"
            rows={4}
            className={`mt-1 ${FORM_TEXT_FIELD_CLASS}`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className={`w-full rounded-md px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors ${primaryCtaColors(invertedPrimaryButtons)}`}
        >
          {status === 'loading' ? 'Sending...' : 'Submit Order'}
        </button>
      </form>
      ) : null}
      {/* Show success modal overlay if status is success */}
      {status === 'success' && <SuccessModal />}
    </>
  );
}

// Exported OrderForm (Conditional Render) –– if companyName is "Peppermint Grove" render PeppermintGroveOrderForm, otherwise render DefaultOrderForm
export default function OrderForm({ companyName, companySlug, invertedPrimaryButtons = false }: OrderFormProps) {
  return (
    <>
      <OrderUrlConfirmationBanner />
      {companyName === "Peppermint Grove" ? (
        <PeppermintGroveOrderForm companyName={companyName} companySlug={companySlug} invertedPrimaryButtons={invertedPrimaryButtons} />
      ) : (
        <DefaultOrderForm companyName={companyName} companySlug={companySlug} invertedPrimaryButtons={invertedPrimaryButtons} />
      )}
    </>
  );
}