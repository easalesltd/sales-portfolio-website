import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

export type PendingOrderPayload = {
  exp: number;
  company_slug: string;
  supplier_company: string;
  from_name: string;
  customer_company: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  delivery_address: string;
  order_list: string;
  notes: string;
};

const SALT = 'pending-order-v1';

function getKey(): Buffer {
  const secret = process.env.REQUEST_VISIT_TOKEN_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('REQUEST_VISIT_TOKEN_SECRET must be set (at least 16 characters)');
  }
  return scryptSync(secret, SALT, 32);
}

export function sealOrderPayload(payload: PendingOrderPayload): string {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const json = JSON.stringify(payload);
  const enc = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString('base64url');
}

export function openOrderPayload(token: string): PendingOrderPayload | null {
  try {
    const key = getKey();
    const combined = Buffer.from(token, 'base64url');
    if (combined.length < 28) return null;
    const iv = combined.subarray(0, 12);
    const authTag = combined.subarray(12, 28);
    const enc = combined.subarray(28);
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
    return JSON.parse(dec.toString('utf8')) as PendingOrderPayload;
  } catch {
    return null;
  }
}
