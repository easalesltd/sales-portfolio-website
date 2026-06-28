'use client';

import {
  divisionBadgeClassName,
  divisionBadgeLabel,
} from '@/app/lib/english-pyramid-division-badge';

type Props = {
  divisionId: string;
  className?: string;
};

export default function DivisionBadge({ divisionId, className = '' }: Props) {
  if (!divisionId) return null;

  return (
    <span
      className={`mr-1.5 inline-flex shrink-0 items-center rounded px-1 py-px text-[9px] font-bold uppercase tracking-wide border ${divisionBadgeClassName(divisionId)} ${className}`}
      title={divisionId}
    >
      {divisionBadgeLabel(divisionId)}
    </span>
  );
}
