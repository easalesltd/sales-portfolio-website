import { NextResponse } from 'next/server';
import {
  ENGLISH_PYRAMID_FANTASY_DAILY_UPDATE,
  ENGLISH_PYRAMID_FIXTURES,
  ENGLISH_PYRAMID_MANUAL_MATCHES,
  ENGLISH_PYRAMID_FANTASY_PLAYERS,
  ENGLISH_PYRAMID_FANTASY_SCORING,
  ENGLISH_PYRAMID_SWEEPSTAKE_FAIRNESS,
  ENGLISH_PYRAMID_SWEEPSTAKE_INTRO,
} from '@/app/data/english-pyramid-fantasy';
import {
  computeStandings,
  getUpcomingFixtures,
  manualMatchToResult,
  type MatchPointsEntry,
  type PlayerStanding,
  type UpcomingFixtureEntry,
} from '@/app/lib/english-pyramid-scoring';

export const runtime = 'nodejs';

export type EnglishPyramidFantasyResponse = {
  ok: true;
  title: string;
  scoring: typeof ENGLISH_PYRAMID_FANTASY_SCORING;
  dailyUpdate: string;
  sweepstakeIntro: string;
  sweepstakeFairness: string;
  standings: PlayerStanding[];
  upcomingFixtures: UpcomingFixtureEntry[];
  allScoringMatches: MatchPointsEntry[];
  recentScoringMatches: MatchPointsEntry[];
  finishedMatchCount: number;
};

export async function GET() {
  const matches = ENGLISH_PYRAMID_MANUAL_MATCHES.map(manualMatchToResult);
  const { standings, allScoringMatches, recentScoringMatches } = computeStandings(
    ENGLISH_PYRAMID_FANTASY_PLAYERS,
    matches
  );
  const upcomingFixtures = getUpcomingFixtures(ENGLISH_PYRAMID_FIXTURES, ENGLISH_PYRAMID_FANTASY_PLAYERS);
  const finishedMatchCount = matches.filter(
    (m) => m.status === 'FINISHED' && m.homeGoals != null && m.awayGoals != null
  ).length;

  const body: EnglishPyramidFantasyResponse = {
    ok: true,
    title: 'English Pyramid Sweepstake 2026/27',
    scoring: ENGLISH_PYRAMID_FANTASY_SCORING,
    dailyUpdate: ENGLISH_PYRAMID_FANTASY_DAILY_UPDATE,
    sweepstakeIntro: ENGLISH_PYRAMID_SWEEPSTAKE_INTRO,
    sweepstakeFairness: ENGLISH_PYRAMID_SWEEPSTAKE_FAIRNESS,
    standings,
    upcomingFixtures,
    allScoringMatches,
    recentScoringMatches,
    finishedMatchCount,
  };

  return NextResponse.json(body);
}
