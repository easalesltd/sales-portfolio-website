import { NextResponse } from 'next/server';
import {
  WORLD_CUP_FANTASY_DAILY_UPDATE,
  WORLD_CUP_FANTASY_FIXTURES,
  WORLD_CUP_FANTASY_MANUAL_MATCHES,
  WORLD_CUP_FANTASY_PLAYERS,
  WORLD_CUP_FANTASY_SCORING,
} from '@/app/data/world-cup-fantasy';
import {
  computeStandings,
  getMatchdaySchedule,
  isWorldCupSweepstakeComplete,
  manualMatchToResult,
  pickWorldCupChampion,
  type MatchPointsEntry,
  type MatchdaySchedule,
  type PlayerStanding,
  type WorldCupChampion,
} from '@/app/lib/world-cup-scoring';
import { resolveWorldCupScheduleFixtures } from '@/app/lib/world-cup-knockout-bracket';
import { enrichMatchdayScheduleWithLiveScores } from '@/app/lib/world-cup-live-scores';

export const runtime = 'nodejs';

export type WorldCupFantasyResponse = {
  ok: true;
  scoring: typeof WORLD_CUP_FANTASY_SCORING;
  dailyUpdate: string;
  standings: PlayerStanding[];
  matchdaySchedule: MatchdaySchedule;
  allScoringMatches: MatchPointsEntry[];
  recentScoringMatches: MatchPointsEntry[];
  finishedMatchCount: number;
  tournamentComplete: boolean;
  champion: WorldCupChampion | null;
};

export async function GET() {
  const recordedMatches = WORLD_CUP_FANTASY_MANUAL_MATCHES.map(manualMatchToResult);
  const recordedMatchIds = new Set(recordedMatches.map((match) => match.id));
  const scheduleFixtures = resolveWorldCupScheduleFixtures(WORLD_CUP_FANTASY_FIXTURES, recordedMatches);
  const baseSchedule = getMatchdaySchedule(
    scheduleFixtures,
    recordedMatches,
    WORLD_CUP_FANTASY_PLAYERS
  );
  const { schedule: matchdaySchedule, provisionalMatches } =
    await enrichMatchdayScheduleWithLiveScores(baseSchedule);
  const matches = [
    ...recordedMatches,
    ...provisionalMatches.filter((match) => !recordedMatchIds.has(match.id)),
  ];
  const { standings, allScoringMatches, recentScoringMatches } = computeStandings(
    WORLD_CUP_FANTASY_PLAYERS,
    matches,
    WORLD_CUP_FANTASY_FIXTURES
  );
  const finishedMatchCount = matches.filter(
    (m) => m.status === 'FINISHED' && m.homeGoals != null && m.awayGoals != null
  ).length;
  const tournamentComplete = isWorldCupSweepstakeComplete(recordedMatches);
  const champion = tournamentComplete ? pickWorldCupChampion(standings) : null;

  const body: WorldCupFantasyResponse = {
    ok: true,
    scoring: WORLD_CUP_FANTASY_SCORING,
    dailyUpdate: WORLD_CUP_FANTASY_DAILY_UPDATE,
    standings,
    matchdaySchedule,
    allScoringMatches,
    recentScoringMatches,
    finishedMatchCount,
    tournamentComplete,
    champion,
  };

  return NextResponse.json(body);
}
