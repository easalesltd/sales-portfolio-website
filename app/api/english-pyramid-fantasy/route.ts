import { NextRequest, NextResponse } from 'next/server';
import {
  ENGLISH_PYRAMID_FANTASY_DAILY_UPDATE,
  ENGLISH_PYRAMID_OFFICIAL_STATEMENT,
  publishedOfficialStatement,
  ENGLISH_PYRAMID_FIXTURES,
  ENGLISH_PYRAMID_MANUAL_MATCHES,
  ENGLISH_PYRAMID_FANTASY_PLAYERS,
  ENGLISH_PYRAMID_FANTASY_SCORING,
  ENGLISH_PYRAMID_REDRAW,
  ENGLISH_PYRAMID_SWEEPSTAKE_FAIRNESS,
  ENGLISH_PYRAMID_SWEEPSTAKE_INTRO,
} from '@/app/data/english-pyramid-fantasy';
import {
  applyRedCardFloorsToRecordedMatches,
  enrichMatchdayScheduleWithLiveScores,
} from '@/app/lib/english-pyramid-live-scores';
import {
  resolveEnglishPyramidPrizeFund,
  type EnglishPyramidPrizeFundSnapshot,
} from '@/app/lib/english-pyramid-prize-fund';
import {
  computeStandings,
  getMatchdaySchedule,
  listAwardedRedCards,
  manualMatchToResult,
  type AwardedRedCard,
  type MatchPointsEntry,
  type MatchdaySchedule,
  type PlayerStanding,
} from '@/app/lib/english-pyramid-scoring';

export const runtime = 'nodejs';

export type EnglishPyramidRedrawState = {
  revealAtUtc: string;
  ceremonyEndsAtUtc: string;
  headline: string;
  /** True while the clock has not reached the reveal and squads are being withheld. */
  squadsHidden: boolean;
  /** True from reveal until ceremonyEndsAtUtc — public banner “Play the reveal”. */
  ceremonyAvailable: boolean;
  /**
   * True until ceremonyEndsAtUtc. Powers the `?reveal=1` rehearsal path
   * (and live night) without unsealing the public standings UI early.
   */
  rehearsalAllowed: boolean;
};

export type EnglishPyramidFantasyResponse = {
  ok: true;
  title: string;
  scoring: typeof ENGLISH_PYRAMID_FANTASY_SCORING;
  dailyUpdate: string;
  officialStatement: typeof ENGLISH_PYRAMID_OFFICIAL_STATEMENT;
  /** Every ledger dismissal, shown under the steward statement. */
  redCardAwards: AwardedRedCard[];
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

export async function GET(request: NextRequest) {
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
    ...applyRedCardFloorsToRecordedMatches(recordedMatches, matchdaySchedule),
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

  const now = Date.now();
  const revealAt = new Date(ENGLISH_PYRAMID_REDRAW.revealAtUtc).getTime();
  const ceremonyEndsAt = new Date(ENGLISH_PYRAMID_REDRAW.ceremonyEndsAtUtc).getTime();
  const squadsHidden =
    ENGLISH_PYRAMID_REDRAW.hideSquadsUntilReveal && now < revealAt;
  const ceremonyAvailable = now >= revealAt && now < ceremonyEndsAt;
  const rehearsalAllowed = now < ceremonyEndsAt;
  /** Soft unlock for `/p/ep2627?reveal=1` — standings stay sealed until revealAt. */
  const rehearsalUnlock =
    rehearsalAllowed && request.nextUrl.searchParams.get('rehearsal') === '1';

  const body: EnglishPyramidFantasyResponse = {
    ok: true,
    title: 'English Pyramid Sweepstake 2026/27',
    scoring: ENGLISH_PYRAMID_FANTASY_SCORING,
    dailyUpdate: ENGLISH_PYRAMID_FANTASY_DAILY_UPDATE,
    officialStatement: publishedOfficialStatement(ENGLISH_PYRAMID_OFFICIAL_STATEMENT),
    redCardAwards: squadsHidden
      ? []
      : listAwardedRedCards(matches, ENGLISH_PYRAMID_FANTASY_PLAYERS),
    sweepstakeIntro: ENGLISH_PYRAMID_SWEEPSTAKE_INTRO,
    sweepstakeFairness: ENGLISH_PYRAMID_SWEEPSTAKE_FAIRNESS,
    prizeFund,
    redraw: {
      revealAtUtc: ENGLISH_PYRAMID_REDRAW.revealAtUtc,
      ceremonyEndsAtUtc: ENGLISH_PYRAMID_REDRAW.ceremonyEndsAtUtc,
      headline: ENGLISH_PYRAMID_REDRAW.headline,
      squadsHidden,
      ceremonyAvailable,
      rehearsalAllowed,
    },
    standings: squadsHidden ? hideSquads(standings) : standings,
    revealPlayers:
      squadsHidden && !rehearsalUnlock ? hideSquads(revealPlayers) : revealPlayers,
    matchdaySchedule: squadsHidden ? emptyMatchdaySchedule(matchdaySchedule) : matchdaySchedule,
    allScoringMatches,
    recentScoringMatches,
    finishedMatchCount,
  };

  return NextResponse.json(body);
}
