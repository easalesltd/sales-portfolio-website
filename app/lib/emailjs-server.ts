import emailjs from '@emailjs/nodejs';
import { Resend } from 'resend';

const DEFAULT_SERVICE = 'service_fvfxlgh';
const DEFAULT_TEMPLATE_VISIT = 'template_35gndyb';

function publicKey(): string {
  return (
    process.env.EMAILJS_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ||
    ''
  );
}

export function emailJsKeysConfigured(): boolean {
  return Boolean(publicKey() && process.env.EMAILJS_PRIVATE_KEY);
}

export function visitVerificationTemplateConfigured(): boolean {
  return Boolean(process.env.EMAILJS_TEMPLATE_VERIFY);
}

function resendVerificationConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
}

/** Easiest production setup: Resend only — verification + your copy of the request (no EmailJS server keys). */
export function resendSimpleVisitFlowConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY &&
    process.env.RESEND_FROM &&
    process.env.VISIT_REQUEST_NOTIFY_EMAIL
  );
}

/** Visitor “click to confirm” email: Resend (no extra EmailJS template) or EmailJS template. */
export function verificationEmailDeliveryConfigured(): boolean {
  return resendVerificationConfigured() || visitVerificationTemplateConfigured();
}

/** After the visitor confirms, we can email you via Resend (simple mode) or EmailJS. */
export function visitNotifyConfigured(): boolean {
  return resendSimpleVisitFlowConfigured() || emailJsKeysConfigured();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function sendVisitVerificationViaResend(params: {
  toEmail: string;
  confirmUrl: string;
  fromName: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY!;
  const from = process.env.RESEND_FROM!;
  const resend = new Resend(apiKey);
  const safeName = escapeHtml(params.fromName);
  const html = `
<p>Hi ${safeName},</p>
<p>Please confirm your email so we can receive your <strong>Request an Agent Visit</strong> for East Anglian Sales LTD.</p>
<p><a href="${escapeHtml(params.confirmUrl)}">Confirm and send my request</a></p>
<p style="font-size:12px;color:#555;">This link expires in 48 hours. If you did not request this, you can ignore this email.</p>
`.trim();

  const { error } = await resend.emails.send({
    from,
    to: params.toEmail,
    subject: 'Confirm your agent visit request',
    html,
  });
  if (error) {
    throw new Error(error.message);
  }
}

export async function sendVisitVerificationEmail(params: {
  toEmail: string;
  confirmUrl: string;
  fromName: string;
}): Promise<void> {
  if (resendVerificationConfigured()) {
    await sendVisitVerificationViaResend(params);
    return;
  }

  const pk = publicKey();
  const privateKey = process.env.EMAILJS_PRIVATE_KEY!;
  const serviceId = process.env.EMAILJS_SERVICE_ID ?? DEFAULT_SERVICE;
  const templateId = process.env.EMAILJS_TEMPLATE_VERIFY;
  if (!templateId) {
    throw new Error('Set RESEND_API_KEY and RESEND_FROM, or EMAILJS_TEMPLATE_VERIFY');
  }
  await emailjs.send(
    serviceId,
    templateId,
    {
      to_email: params.toEmail,
      confirm_url: params.confirmUrl,
      from_name: params.fromName,
    },
    { publicKey: pk, privateKey }
  );
}

async function sendVisitNotificationViaResend(p: Record<string, string>): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY!;
  const from = process.env.RESEND_FROM!;
  const to = process.env.VISIT_REQUEST_NOTIFY_EMAIL!;
  const resend = new Resend(apiKey);
  const replyTo = p.email || undefined;
  const rows = [
    ['Name', p.from_name],
    ['Business', p.business_name],
    ['Address', p.business_address],
    ['Dates', p.dates_available],
    ['Email', p.email],
    ['Phone', p.phone],
    ['Interested in', p.interested_companies],
    ['Notes', p.notes],
  ]
    .map(([k, v]) => `<tr><td style="padding:6px 12px;border:1px solid #e5e5e5;"><strong>${escapeHtml(k)}</strong></td><td style="padding:6px 12px;border:1px solid #e5e5e5;">${escapeHtml(v)}</td></tr>`)
    .join('');
  const html = `
<p>This agent visit request was <strong>verified by email</strong> (the visitor clicked the confirmation link).</p>
<table style="border-collapse:collapse;max-width:640px;">${rows}</table>
`.trim();

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: replyTo || undefined,
    subject: `Verified visit request — ${escapeHtml(p.business_name)}`,
    html,
  });
  if (error) {
    throw new Error(error.message);
  }
}

export async function sendVisitNotificationEmail(templateParams: Record<string, string>): Promise<void> {
  if (resendSimpleVisitFlowConfigured()) {
    await sendVisitNotificationViaResend(templateParams);
    return;
  }

  const pk = publicKey();
  const privateKey = process.env.EMAILJS_PRIVATE_KEY!;
  const serviceId = process.env.EMAILJS_SERVICE_ID ?? DEFAULT_SERVICE;
  const templateId = process.env.EMAILJS_TEMPLATE_VISIT ?? DEFAULT_TEMPLATE_VISIT;
  await emailjs.send(serviceId, templateId, templateParams, { publicKey: pk, privateKey });
}
