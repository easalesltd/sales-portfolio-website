'use client';

import { formatTeamLabel } from '@/app/data/english-pyramid-fantasy';
import { getTeamMatchDisplay, matchInvolvesTeam } from '@/app/lib/english-pyramid-scoring';
import WorldCupFantasy from './WorldCupFantasy';

type Props = {
  onClose?: () => void;
  standalone?: boolean;
};

const ENGLISH_PYRAMID_SCORING_RULES = [
  '3 pts home win',
  '4 pts away win',
  '1 pt draw (except 0–0)',
  '−1 for a boring 0–0 (no draw or clean-sheet points)',
  '+1 clean sheet (0 goals conceded)',
  '+1 for 3+ goals scored',
  '−1 for 3+ goals conceded',
  '+1 per red card',
] as const;

export default function EnglishPyramidFantasy({ onClose, standalone = false }: Props) {
  return (
    <WorldCupFantasy
      onClose={onClose}
      standalone={standalone}
      themeId="english-pyramid"
      apiPath="/api/english-pyramid-fantasy"
      title="English Pyramid Sweepstake 2026/27"
      headerImage="/images/english-pyramid-fantasy/league-header.png"
      headerImageAlt="English Pyramid Football Fantasy League"
      formatTeamLabel={formatTeamLabel}
      scoringRules={ENGLISH_PYRAMID_SCORING_RULES}
      bonusColumnLabel="Bonus (CS/3+)"
      matchScoringHelpers={{ getTeamMatchDisplay, matchInvolvesTeam }}
      noResultsMessage="No finished matches yet — check back once the 2026/27 league season starts."
      resultsUpdateNote="Fixtures flip to In play at kick-off and refresh here every minute. Live scores: ESPN for Premier League through National League, Football Web Pages for NL North/South, with FotMob fallback and red-card cross-checking across the National divisions. Points appear only after a verified FT; the ledger still commits automatically later. Unconfirmed lower-league reds remain labelled “reds unchecked”."
      progressChartTitle="Season progress"
      progressChartDescription="Cumulative points after each matchday — tap a crest for the current total."
    />
  );
}
