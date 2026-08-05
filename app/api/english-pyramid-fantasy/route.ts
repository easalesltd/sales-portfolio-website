import { NextResponse } from 'next/server';
import {
  ENGLISH_PYRAMID_FANTASY_DAILY_UPDATE,
  ENGLISH_PYRAMID_FIXTURES,
  ENGLISH_PYRAMID_MANUAL_MATCHES,
  ENGLISH_PYRAMID_FANTASY_PLAYERS,
  ENGLISH_PYRAMID_FANTASY_SCORING,
  ENGLISH_PYRAMID_REDRAW,
  ENGLISH_PYRAMID_SWEEPSTAKE_FAIRNESS,
  ENGLISH_PYRAMID_SWEEPSTAKE_INTRO,
} from '@/app/data/english-pyramid-fantasy';
import { enrichMatchdayScheduleWithLiveScores } from '@/app/lib/english-pyramid-live-scores';
import {
  resolveEnglishPyramidPrizeFund,
  type EnglishPyramidPrizeFundSnapshot,
} from '@/app/lib/english-pyramid-prize-fund';
import {
  computeStandings,
  getMatchdaySchedule,
  manualMatchToResult,
  type MatchPointsEntry,
  type MatchdaySchedule,
  type PlayerStanding,
} from '@/app/lib/english-pyramid-scoring';

export const runtime = 'nodejs';

export type EnglishPyramidRedrawState = {
  revealAtUtc: string;
  headline: string;
  /** True while the clock has not reached the reveal and squads are being withheld. */
  squadsHidden: boolean;
};

export type EnglishPyramidFantasyResponse = {
  ok: true;
  title: string;
  scoring: typeof ENGLISH_PYRAMID_FANTASY_SCORING;
  dailyUpdate: string;
  sweepstakeIntro: string;
  sweepstakeFairness: string;
  prizeFund: EnglishPyramidPrizeFundSnapshot;
  redraw: EnglishPyramidRedrawState;
  standings: PlayerStanding[];
  /** Stable draft order for the recordable redraw reveal (standings reorder during the season). */
  revealPlayers: PlayerStanding[];
  matchdaySchedule: MatchdaySchedule;
  allScoringMatches: MatchPointsEntry[];
  recentScoringMatches: MatchPointsEntry[];
  finishedMatchCount: number;
};

/** Withhold club-level detail so a pre-pushed redraw cannot be read before reveal night. */
function hideSquads(standings: PlayerStanding[]): PlayerStanding[] {
  return standings.map((player) => ({
    ...player,
    teams: [],
    teamBreakdown: [],
    teamCount: 0,
    draftNote: '',
  }));
}

function emptyMatchdaySchedule(schedule: MatchdaySchedule): MatchdaySchedule {
  return {
    defaultDate: schedule.defaultDate,
    fixtureDates: [],
    schedulesByDate: {},
  };
}

export async function GET() {
  const recordedMatches = ENGLISH_PYRAMID_MANUAL_MATCHES.map(manualMatchToResult);
  const recordedMatchIds = new Set(recordedMatches.map((match) => match.id));
  const baseSchedule = getMatchdaySchedule(
    ENGLISH_PYRAMID_FIXTURES,
    recordedMatches,
    ENGLISH_PYRAMID_FANTASY_PLAYERS
  );
  const [{ schedule: matchdaySchedule, provisionalMatches }, prizeFund] = await Promise.all([
    enrichMatchdayScheduleWithLiveScores(baseSchedule),
    resolveEnglishPyramidPrizeFund(),
  ]);
  const matches = [
    ...recordedMatches,
    ...provisionalMatches.filter((match) => !recordedMatchIds.has(match.id)),
  ];
  const { standings, allScoringMatches, recentScoringMatches } = computeStandings(
    ENGLISH_PYRAMID_FANTASY_PLAYERS,
    matches
  );
  const finishedMatchCount = matches.filter(
    (m) => m.status === 'FINISHED' && m.homeGoals != null && m.awayGoals != null
  ).length;
  const standingsById = new Map(standings.map((player) => [player.id, player] as const));
  const revealPlayers = ENGLISH_PYRAMID_FANTASY_PLAYERS.map((player) =>
    standingsById.get(player.id)
  ).filter((player): player is PlayerStanding => player != null);

  const squadsHidden =
    ENGLISH_PYRAMID_REDRAW.hideSquadsUntilReveal &&
    Date.now() < new Date(ENGLISH_PYRAMID_REDRAW.revealAtUtc).getTime();

  const body: EnglishPyramidFantasyResponse = {
    ok: true,
    title: 'English Pyramid Sweepstake 2026/27',
    scoring: ENGLISH_PYRAMID_FANTASY_SCORING,
    dailyUpdate: ENGLISH_PYRAMID_FANTASY_DAILY_UPDATE,
    sweepstakeIntro: ENGLISH_PYRAMID_SWEEPSTAKE_INTRO,
    sweepstakeFairness: ENGLISH_PYRAMID_SWEEPSTAKE_FAIRNESS,
    prizeFund,
    redraw: {
      revealAtUtc: ENGLISH_PYRAMID_REDRAW.revealAtUtc,
      headline: ENGLISH_PYRAMID_REDRAW.headline,
      squadsHidden,
    },
    standings: squadsHidden ? hideSquads(standings) : standings,
    revealPlayers: squadsHidden ? hideSquads(revealPlayers) : revealPlayers,
    matchdaySchedule: squadsHidden ? emptyMatchdaySchedule(matchdaySchedule) : matchdaySchedule,
    allScoringMatches,
    recentScoringMatches,
    finishedMatchCount,
  };

  return NextResponse.json(body);
}
