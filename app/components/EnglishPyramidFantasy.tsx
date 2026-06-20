'use client';

import { formatTeamLabel } from '@/app/data/english-pyramid-fantasy';
import { getTeamMatchDisplay, matchInvolvesTeam } from '@/app/lib/english-pyramid-scoring';
import WorldCupFantasy from './WorldCupFantasy';

type Props = {
  onClose: () => void;
};

const ENGLISH_PYRAMID_SCORING_RULES = [
  '3 pts win',
  '1 pt draw',
  '+1 clean sheet (0 goals conceded)',
  '+1 for 3+ goals scored',
  '−1 for 3+ goals conceded',
  '−1 per red card',
] as const;

export default function EnglishPyramidFantasy({ onClose }: Props) {
  return (
    <WorldCupFantasy
      onClose={onClose}
      apiPath="/api/english-pyramid-fantasy"
      title="English Pyramid Sweepstake 2026/27"
      formatTeamLabel={formatTeamLabel}
      scoringRules={ENGLISH_PYRAMID_SCORING_RULES}
      bonusColumnLabel="Bonus (CS/3+)"
      matchScoringHelpers={{ getTeamMatchDisplay, matchInvolvesTeam }}
      noResultsMessage="No finished matches yet — check back once the 2026/27 league season starts."
      resultsUpdateNote="League results for our 49 clubs are added manually after full-time (seven divisions, one ledger). Each club is matched by its team code and search names — previous results stay recorded, so only newly finished matches need adding."
    />
  );
}
