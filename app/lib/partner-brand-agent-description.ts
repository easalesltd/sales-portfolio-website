import type { Company } from '@/app/data/companies';

/**
 * Visible brand blurb for homepage tiles and company schema/copy.
 * Uses the brand’s own description — not agent-centric SEO stuffing.
 */
export function partnerBrandAgentDescription(
  company: Pick<Company, 'name' | 'description'>
): string {
  const description = company.description?.trim();
  if (description) return description;
  return `${company.name} — wholesale partner brand.`;
}
