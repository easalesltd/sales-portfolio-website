import emailjs from '@emailjs/nodejs';

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

export async function sendVisitVerificationEmail(params: {
  toEmail: string;
  confirmUrl: string;
  fromName: string;
}): Promise<void> {
  const pk = publicKey();
  const privateKey = process.env.EMAILJS_PRIVATE_KEY!;
  const serviceId = process.env.EMAILJS_SERVICE_ID ?? DEFAULT_SERVICE;
  const templateId = process.env.EMAILJS_TEMPLATE_VERIFY;
  if (!templateId) {
    throw new Error('EMAILJS_TEMPLATE_VERIFY is not set');
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

export async function sendVisitNotificationEmail(templateParams: Record<string, string>): Promise<void> {
  const pk = publicKey();
  const privateKey = process.env.EMAILJS_PRIVATE_KEY!;
  const serviceId = process.env.EMAILJS_SERVICE_ID ?? DEFAULT_SERVICE;
  const templateId = process.env.EMAILJS_TEMPLATE_VISIT ?? DEFAULT_TEMPLATE_VISIT;
  await emailjs.send(serviceId, templateId, templateParams, { publicKey: pk, privateKey });
}
