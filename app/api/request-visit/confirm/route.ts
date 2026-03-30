import { NextResponse } from 'next/server';
import { openVisitPayload } from '@/app/lib/request-visit-token';
import { sendVisitNotificationEmail, visitNotifyConfigured } from '@/app/lib/emailjs-server';
import { getSiteBaseUrl } from '@/app/lib/site-base-url';

export const runtime = 'nodejs';

function redirectTo(query: 'confirmed' | 'error') {
  return NextResponse.redirect(`${getSiteBaseUrl()}/contact?visit=${query}`);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('t');
  if (!token) {
    return redirectTo('error');
  }

  const payload = openVisitPayload(token);
  if (!payload || payload.exp < Date.now()) {
    return redirectTo('error');
  }

  if (!visitNotifyConfigured()) {
    return redirectTo('error');
  }

  try {
    await sendVisitNotificationEmail({
      from_name: payload.from_name,
      business_name: payload.business_name,
      business_address: payload.business_address,
      dates_available: payload.dates_available,
      email: payload.email,
      phone: payload.phone,
      interested_companies: payload.interested_companies,
      notes: payload.notes,
    });
  } catch (e) {
    console.error('[request-visit/confirm] notify send failed', e);
    return redirectTo('error');
  }

  return redirectTo('confirmed');
}
