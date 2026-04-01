import { headers } from 'next/headers'

/** Per-request nonce from middleware (Content-Security-Policy script-src). */
export async function getCspNonce(): Promise<string | undefined> {
  return (await headers()).get('x-nonce') ?? undefined
}
