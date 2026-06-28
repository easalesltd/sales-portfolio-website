/** Short pill labels for squad tables (PL / CH / NL etc.). */
export const DIVISION_BADGE_SHORT: Record<string, string> = {
  PL: 'PL',
  CH: 'CH',
  L1: 'L1',
  L2: 'L2',
  NL: 'NL',
  NLN: 'NLN',
  NLS: 'NLS',
};

export function divisionBadgeLabel(divisionId: string): string {
  return DIVISION_BADGE_SHORT[divisionId] ?? divisionId;
}

export function divisionBadgeClassName(divisionId: string): string {
  switch (divisionId) {
    case 'PL':
      return 'border-[#d4af37]/45 bg-[#1a2744] text-[#e8dfc8]';
    case 'CH':
      return 'border-[#a83248]/40 bg-[#2a1830] text-[#f0c4cc]';
    case 'L1':
      return 'border-[#6b8fbf]/40 bg-[#152238] text-[#c8d8ef]';
    case 'L2':
      return 'border-[#8b6914]/40 bg-[#1f1a12] text-[#e8dfc8]';
    case 'NL':
      return 'border-[#4ade80]/30 bg-[#122818] text-[#bbf7d0]';
    case 'NLN':
    case 'NLS':
      return 'border-[#d4af37]/25 bg-[#1a1f14] text-[#e8dfc8]/90';
    default:
      return 'border-neutral-600 bg-neutral-900 text-neutral-300';
  }
}
