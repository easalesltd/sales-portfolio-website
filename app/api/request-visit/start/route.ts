import { NextResponse } from 'next/server';
import { sealVisitPayload, type PendingVisitPayload } from '@/app/lib/request-visit-token';
import {
  emailJsKeysConfigured,
  sendVisitVerificationEmail,
  verificationEmailDeliveryConfigured,
} from '@/app/lib/emailjs-server';
import { getSiteBaseUrl } from '@/app/lib/site-base-url';

export const runtime = 'nodejs';

const LIMITS = {
  name: 200,
  businessName: 200,
  businessAddress: 2500,
  datesAvailable: 500,
  email: 254,
  phone: 40,
  notes: 2500,
  companiesList: 4000,
} as const;

function clip(s: string, max: number): string {
  return s.trim().slice(0, max);
}

function isVerificationFullyConfigured(): boolean {
  try {
    if (!process.env.REQUEST_VISIT_TOKEN_SECRET || process.env.REQUEST_VISIT_TOKEN_SECRET.length < 16) {
      return false;
    }
    return emailJsKeysConfigured() && verificationEmailDeliveryConfigured();
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!isVerificationFullyConfigured()) {
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
  const name = clip(String(b.name ?? ''), LIMITS.name);
  const businessName = clip(String(b.businessName ?? ''), LIMITS.businessName);
  const businessAddress = clip(String(b.businessAddress ?? ''), LIMITS.businessAddress);
  const datesAvailable = clip(String(b.datesAvailable ?? ''), LIMITS.datesAvailable);
  const emailRaw = clip(String(b.email ?? ''), LIMITS.email).toLowerCase();
  const phone = clip(String(b.phone ?? ''), LIMITS.phone);
  const notes = clip(String(b.notes ?? ''), LIMITS.notes) || 'No additional notes';

  const companiesRaw = b.interestedCompanies;
  let interestedCompanies = '';
  if (Array.isArray(companiesRaw)) {
    interestedCompanies = clip(companiesRaw.map((c) => String(c)).join(', '), LIMITS.companiesList);
  } else if (typeof companiesRaw === 'string') {
    interestedCompanies = clip(companiesRaw, LIMITS.companiesList);
  }

  if (!name || !businessName || !businessAddress || !datesAvailable || !emailRaw || !phone) {
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }

  if (!interestedCompanies) {
    return NextResponse.json({ ok: false, error: 'no_companies' }, { status: 400 });
  }

  const exp = Date.now() + 48 * 60 * 60 * 1000;
  const payload: PendingVisitPayload = {
    exp,
    from_name: name,
    business_name: businessName,
    business_address: businessAddress,
    dates_available: datesAvailable,
    email: emailRaw,
    phone,
    interested_companies: interestedCompanies,
    notes,
  };

  let token: string;
  try {
    token = sealVisitPayload(payload);
  } catch {
    return NextResponse.json({ ok: false, error: 'server_misconfigured' }, { status: 500 });
  }

  const confirmUrl = `${getSiteBaseUrl()}/api/request-visit/confirm?t=${encodeURIComponent(token)}`;

  try {
    await sendVisitVerificationEmail({
      toEmail: emailRaw,
      confirmUrl,
      fromName: name,
    });
  } catch (e) {
    console.error('[request-visit/start] Verification email send failed', e);
    return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true as const, fallback: false as const });
}
