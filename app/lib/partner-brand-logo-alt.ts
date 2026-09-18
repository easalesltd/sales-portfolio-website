/**
 * Accessible alt for partner brand logos (homepage tiles, company pages).
 */
export function partnerBrandLogoAlt(brandName: string, alternateNames?: string[]): string {
  if (alternateNames?.length) {
    return `${brandName} (${alternateNames[0]}) logo`;
  }
  return `${brandName} logo`;
}
