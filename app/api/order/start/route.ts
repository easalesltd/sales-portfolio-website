import { NextResponse } from 'next/server';
import { companies } from '@/app/data/companies';
import { sealOrderPayload, type PendingOrderPayload } from '@/app/lib/order-token';
import {
  emailJsKeysConfigured,
  resendSimpleOrderFlowConfigured,
  sendOrderVerificationEmail,
  verificationEmailDeliveryConfigured,
} from '@/app/lib/emailjs-server';
import { getSiteBaseUrl } from '@/app/lib/site-base-url';

export const runtime = 'nodejs';

const LIMITS = {
  slug: 120,
  supplierCompany: 200,
  customerCompany: 200,
  contactPerson: 200,
  contactPhone: 80,
  email: 254,
  address: 2500,
  orderList: 12000,
  notes: 2500,
} as const;

function clip(s: string, max: number): string {
  return s.trim().slice(0, max);
}

function isOrderVerificationFullyConfigured(): boolean {
  try {
    if (!process.env.REQUEST_VISIT_TOKEN_SECRET || process.env.REQUEST_VISIT_TOKEN_SECRET.length < 16) {
      return false;
    }
    if (resendSimpleOrderFlowConfigured()) {
      return true;
    }
    return emailJsKeysConfigured() && verificationEmailDeliveryConfigured();
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!isOrderVerificationFullyConfigured()) {
    return NextResponse.json(
      { ok: false, fallback: true as const, reason: 'verification_not_configured' },
      { status: 200 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const companySlug = clip(String(b.companySlug ?? ''), LIMITS.slug);
  const supplierCompany = clip(String(b.supplierCompany ?? ''), LIMITS.supplierCompany);

  const row = companies.find((c) => c.slug === companySlug);
  if (!row || row.name !== supplierCompany) {
    return NextResponse.json({ ok: false, error: 'invalid_company' }, { status: 400 });
  }

  const contact = b.contact as Record<string, unknown> | undefined;
  if (!contact || typeof contact !== 'object') {
    return NextResponse.json({ ok: false, error: 'missing_contact' }, { status: 400 });
  }

  const customerCompany = clip(String(contact.companyName ?? ''), LIMITS.customerCompany);
  const contactPerson = clip(String(contact.contactPerson ?? ''), LIMITS.contactPerson);
  const contactPhone = clip(String(contact.contactDetails ?? ''), LIMITS.contactPhone) || 'Not provided';
  const emailRaw = clip(String(contact.emailAddress ?? ''), LIMITS.email).toLowerCase();
  const deliveryAddress = clip(String(contact.address ?? ''), LIMITS.address);

  const linesRaw = b.orderLines;
  let orderLines: { productCode: string; quantity: string }[] = [];
  if (Array.isArray(linesRaw)) {
    orderLines = linesRaw
      .map((line) => {
        if (!line || typeof line !== 'object') return null;
        const L = line as Record<string, unknown>;
        return {
          productCode: clip(String(L.productCode ?? ''), 120),
          quantity: clip(String(L.quantity ?? ''), 40),
        };
      })
      .filter((x): x is { productCode: string; quantity: string } => x != null);
  }

  const filledLines = orderLines.filter((line) => line.productCode !== '' && line.quantity !== '');
  if (filledLines.length === 0) {
    return NextResponse.json({ ok: false, error: 'no_lines' }, { status: 400 });
  }

  if (!customerCompany || !contactPerson || !emailRaw || !deliveryAddress) {
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }

  const notes = clip(String(b.notes ?? ''), LIMITS.notes) || 'No additional notes provided';
  const orderList = clip(
    filledLines.map((line) => `• Product Code: ${line.productCode} – Quantity: ${line.quantity}`).join('\n'),
    LIMITS.orderList
  );

  const exp = Date.now() + 48 * 60 * 60 * 1000;
  const payload: PendingOrderPayload = {
    exp,
    company_slug: companySlug,
    supplier_company: supplierCompany,
    from_name: contactPerson,
    customer_company: customerCompany,
    contact_person: contactPerson,
    contact_phone: contactPhone,
    contact_email: emailRaw,
    delivery_address: deliveryAddress,
    order_list: orderList,
    notes,
  };

  let token: string;
  try {
    token = sealOrderPayload(payload);
  } catch {
    return NextResponse.json({ ok: false, error: 'server_misconfigured' }, { status: 500 });
  }

  const confirmUrl = `${getSiteBaseUrl()}/api/order/confirm?t=${encodeURIComponent(token)}`;

  try {
    await sendOrderVerificationEmail({
      toEmail: emailRaw,
      confirmUrl,
      fromName: contactPerson,
      supplierCompany,
    });
  } catch (e) {
    console.error('[order/start] Verification email send failed', e);
    return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true as const, fallback: false as const });
}
