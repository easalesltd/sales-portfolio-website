import type { Company } from '@/app/data/companies';

/** Agent-facing copy for homepage tiles, meta descriptions, and JSON-LD — not supplier boilerplate. */
export function partnerBrandAgentDescription(company: Pick<Company, 'name'>): string {
  return `${company.name} supplied wholesale by Dave Langdon, greeting card and gift sales agent for East Anglian Sales LTD, covering Suffolk, Norfolk, Essex and Cambridgeshire.`;
}
