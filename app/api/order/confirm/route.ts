import { NextResponse } from 'next/server';
import { openOrderPayload } from '@/app/lib/order-token';
import { sendOrderNotificationEmail, orderNotifyConfigured } from '@/app/lib/emailjs-server';
import { getSiteBaseUrl } from '@/app/lib/site-base-url';

export const runtime = 'nodejs';

function redirectTo(slug: string, query: 'confirmed' | 'error') {
  const base = getSiteBaseUrl();
  const path = `/companies/${encodeURIComponent(slug)}`;
  return NextResponse.redirect(`${base}${path}?order=${query}`);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('t');
  if (!token) {
    return NextResponse.redirect(`${getSiteBaseUrl()}/contact?order=error`);
  }

  const payload = openOrderPayload(token);
  if (!payload || payload.exp < Date.now()) {
    return NextResponse.redirect(`${getSiteBaseUrl()}/contact?order=error`);
  }

  if (!orderNotifyConfigured()) {
    return NextResponse.redirect(`${getSiteBaseUrl()}/contact?order=error`);
  }

  const slug = payload.company_slug.replace(/[^a-z0-9-]/gi, '').slice(0, 120) || 'unknown';

  const templateParams: Record<string, string> = {
    to_name: 'Dave',
    from_name: payload.contact_person,
    supplier_company: payload.supplier_company,
    customer_company: payload.customer_company,
    contact_person: payload.contact_person,
    contact_phone: payload.contact_phone || 'Not provided',
    contact_email: payload.contact_email,
    delivery_address: payload.delivery_address,
    order_list: payload.order_list,
    notes: payload.notes,
    reply_to: payload.contact_email,
  };

  try {
    await sendOrderNotificationEmail(templateParams);
  } catch (e) {
    console.error('[order/confirm] notify send failed', e);
    return redirectTo(slug, 'error');
  }

  return redirectTo(slug, 'confirmed');
}
