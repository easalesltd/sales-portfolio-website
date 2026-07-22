'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import { formatTeamLabel as formatPyramidTeamLabel } from '@/app/data/english-pyramid-fantasy';
import type { EnglishPyramidFantasyResponse } from '@/app/api/english-pyramid-fantasy/route';
import type {
  FixtureManager,
  MatchPointsEntry,
  MatchdayEntry,
  MatchdaySchedule as MatchdayScheduleData,
  PlayerStanding,
  TeamMatchDisplay,
  TeamStanding,
} from '@/app/lib/english-pyramid-scoring';
import {
  buildPlayerProgressSeries,
  getTeamMatchDisplay as getPyramidTeamMatchDisplay,
  matchInvolvesTeam as pyramidMatchInvolvesTeam,
} from '@/app/lib/english-pyramid-scoring';
import type { SweepstakeFantasyThemeId } from '@/app/lib/sweepstake-fantasy-theme';
import { formatTeamNameShort } from '@/app/data/english-pyramid-fantasy';
import { useLiveGoalAlerts } from '@/app/hooks/useLiveGoalAlerts';
import { usePullToRefresh } from '@/app/hooks/usePullToRefresh';
import DivisionBadge from './english-pyramid/DivisionBadge';
import EnglishPyramidShareButton from './english-pyramid/EnglishPyramidShareButton';
import LiveGoalAlertsToggle from './english-pyramid/LiveGoalAlertsToggle';
import MatchdayHeroStrip from './english-pyramid/MatchdayHeroStrip';
import EnglishPyramidFixtureRow from './english-pyramid/EnglishPyramidFixtureRow';
import { SweepstakeThemeProvider, useSweepstakeTheme } from './SweepstakeThemeContext';
import { managerColorForPlayer } from '@/app/lib/sweepstake-manager-colors';

type SweepstakeResponse = EnglishPyramidFantasyResponse;

type MatchScoringHelpers = {
  matchInvolvesTeam: (
    match: MatchPointsEntry['match'],
    teamCode: string
  ) => boolean;
  getTeamMatchDisplay: (
    match: MatchPointsEntry['match'],
    teamCode: string
  ) => TeamMatchDisplay | null;
};

type Props = {
  onClose?: () => void;
  standalone?: boolean;
  apiPath?: string;
  title?: string;
  headerImage?: string;
  headerImageAlt?: string;
  formatTeamLabel?: (code: string) => string;
  scoringRules?: readonly string[];
  bonusColumnLabel?: string;
  matchScoringHelpers?: MatchScoringHelpers;
  noResultsMessage?: string;
  resultsUpdateNote?: string;
  progressChartTitle?: string;
  progressChartDescription?: string;
  themeId?: SweepstakeFantasyThemeId;
};

const DEFAULT_API_PATH = '/api/english-pyramid-fantasy';
const DEFAULT_TITLE = 'English Pyramid Sweepstake 2026/27';
/** Bust browser / image-optimizer cache when manager portrait files are replaced. */
const SWEEPSTAKE_MANAGER_PHOTO_VERSION = '20260701';

function managerPhotoSrc(path: string): string {
  return `${path}?v=${SWEEPSTAKE_MANAGER_PHOTO_VERSION}`;
}

const DEFAULT_MATCH_SCORING_HELPERS: MatchScoringHelpers = {
  matchInvolvesTeam: pyramidMatchInvolvesTeam,
  getTeamMatchDisplay: getPyramidTeamMatchDisplay,
};

const SCORING_RULES = [
  'Group stage: 3 pts win · 1 pt draw',
  'Knockout: 3 pts win · 0 pts loss (ET/pens count)',
  '+1 for 3+ goals scored',
  '−1 for 3+ goals conceded',
  '−1 per red card',
] as const;

const PROGRESS_CHART = {
  xStep: 16,
  lineWidth: 3,
  yHeadroomPoints: 3,
} as const;

const PROGRESS_CHART_LAYOUTS = {
  mobile: { height: 288, crestSize: 24, padding: { top: 28, right: 36, bottom: 36, left: 40 } },
  tablet: { height: 400, crestSize: 26, padding: { top: 34, right: 38, bottom: 42, left: 42 } },
  desktop: { height: 520, crestSize: 28, padding: { top: 40, right: 40, bottom: 48, left: 44 } },
} as const;

type ProgressChartLayout = (typeof PROGRESS_CHART_LAYOUTS)[keyof typeof PROGRESS_CHART_LAYOUTS];

function useProgressChartLayout() {
  const [layout, setLayout] = useState<ProgressChartLayout>(PROGRESS_CHART_LAYOUTS.desktop);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width < 640) setLayout(PROGRESS_CHART_LAYOUTS.mobile);
      else if (width < 1024) setLayout(PROGRESS_CHART_LAYOUTS.tablet);
      else setLayout(PROGRESS_CHART_LAYOUTS.desktop);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return layout;
}

function ScoringRulesBlock({ rules = SCORING_RULES }: { rules?: readonly string[] }) {
  const t = useSweepstakeTheme();

  return (
    <div className={t.c.scoringSection}>
      <h4 className={t.c.scoringHeading}>Scoring</h4>
      <ul className="mt-2 space-y-1.5 text-xs text-neutral-300 sm:text-sm">
        {rules.map((rule) => (
          <li key={rule} className="flex items-start gap-2 leading-snug">
            <span className={t.c.scoringBullet} aria-hidden />
            {rule}
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatMatchScore(
  homeGoals: number | null,
  awayGoals: number | null,
  homePenalties?: number | null,
  awayPenalties?: number | null,
): string {
  if (homeGoals == null || awayGoals == null) return '–';
  const base = `${homeGoals}–${awayGoals}`;
  if (homePenalties != null && awayPenalties != null) {
    return `${base} (${homePenalties}–${awayPenalties} pens)`;
  }
  return base;
}

function matchOutcomeLetter(goalsFor: number, goalsAgainst: number): 'W' | 'L' | 'D' {
  if (goalsFor > goalsAgainst) return 'W';
  if (goalsFor < goalsAgainst) return 'L';
  return 'D';
}

function teamMatchDisplayOutcomeLetter(result: TeamMatchDisplay): 'W' | 'L' | 'D' {
  if (result.outcome) {
    return result.outcome === 'win' ? 'W' : result.outcome === 'loss' ? 'L' : 'D';
  }
  return matchOutcomeLetter(result.goalsFor, result.goalsAgainst);
}

function MatchOutcomeLetter({ outcome }: { outcome: 'W' | 'L' | 'D' }) {
  const t = useSweepstakeTheme();
  const tone =
    outcome === 'W' ? t.c.positive : outcome === 'L' ? t.c.negative : 'text-neutral-400';

  return (
    <span className={`font-semibold tabular-nums ${tone}`} aria-label={outcome === 'W' ? 'Win' : outcome === 'L' ? 'Loss' : 'Draw'}>
      {outcome}
    </span>
  );
}

function FormChips({ outcomes }: { outcomes: Array<'W' | 'L' | 'D'> }) {
  if (outcomes.length === 0) {
    return <span className="text-neutral-600">—</span>;
  }

  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Form ${outcomes.join(' ')}`}>
      {outcomes.map((outcome, index) => (
        <MatchOutcomeLetter key={`${outcome}-${index}`} outcome={outcome} />
      ))}
    </span>
  );
}

function TeamMatchAdjustments({ result }: { result: TeamMatchDisplay }) {
  const t = useSweepstakeTheme();
  const items: { key: string; label: string; className: string }[] = [];

  if (result.scoringBonus && result.scoringBonus > 0) {
    items.push({
      key: 'scored',
      label: `(+${result.scoringBonus}, ${result.goalsFor} goals scored)`,
      className: t.c.positive,
    });
  }
  if (result.cleanSheetBonus && result.cleanSheetBonus > 0) {
    items.push({
      key: 'cs',
      label: `(+${result.cleanSheetBonus}, clean sheet)`,
      className: t.c.positive,
    });
  }
  if (result.concededPenalty && result.concededPenalty < 0) {
    items.push({
      key: 'conc',
      label: `(${result.concededPenalty}, ${result.goalsAgainst} goals conceded)`,
      className: t.c.negative,
    });
  }
  if (result.boringMatchPenalty && result.boringMatchPenalty < 0) {
    items.push({
      key: 'boring',
      label: `(${result.boringMatchPenalty}, boring 0–0 — no draw/CS)`,
      className: t.c.negative,
    });
  }
  if (result.redCards > 0) {
    const redPoints = result.redCardPoints ?? -result.redCards;
    const signed =
      redPoints > 0 ? `+${redPoints}` : String(redPoints);
    items.push({
      key: 'red',
      label: `(${signed}, ${result.redCards === 1 ? 'red card' : 'red cards'})`,
      className: redPoints > 0 ? t.c.positive : t.c.negative,
    });
  }
  if (result.redsUnchecked) {
    items.push({
      key: 'reds-unchecked',
      label: '(reds unchecked)',
      className: 'text-amber-400/90',
    });
  }

  if (items.length === 0) return null;

  return (
    <span className="ml-1 inline-flex flex-wrap gap-x-1">
      {items.map((item) => (
        <span key={item.key} className={item.className}>
          {item.label}
        </span>
      ))}
    </span>
  );
}

function playerMatchOutcome(
  match: MatchPointsEntry['match'],
  teamCodes: readonly string[],
  helpers: MatchScoringHelpers
): 'W' | 'L' | 'D' | null {
  for (const code of teamCodes) {
    const display = helpers.getTeamMatchDisplay(match, code);
    if (display) return teamMatchDisplayOutcomeLetter(display);
  }
  return null;
}

function MatchScoringPlayersLine({
  players,
  byPlayer,
  match,
  matchScoringHelpers,
}: {
  players: PlayerStanding[];
  byPlayer: Record<string, number>;
  match: MatchPointsEntry['match'];
  matchScoringHelpers: MatchScoringHelpers;
}) {
  const scoringPlayers = players.filter((player) => byPlayer[player.id] != null);
  if (scoringPlayers.length === 0) return null;

  return (
    <>
      {scoringPlayers.map((player, index) => {
        const points = byPlayer[player.id]!;
        const outcome = playerMatchOutcome(match, player.teams, matchScoringHelpers);
        return (
          <span key={player.id}>
            {index > 0 ? ' · ' : null}
            <ManagerName playerId={player.id} name={playerDisplayLabel(player)} className="text-inherit font-medium" />{' '}
            {outcome ? <MatchOutcomeLetter outcome={outcome} /> : null}{' '}
            {points >= 0 ? '+' : ''}
            {points}
          </span>
        );
      })}
    </>
  );
}

function formatResultTickerDate(utcDate: string): string {
  return new Date(utcDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  });
}

function playerDisplayLabel(player: Pick<PlayerStanding, 'name' | 'teamName'>): string {
  return player.teamName ?? player.name;
}

function fixtureManagerLabel(manager: Pick<FixtureManager, 'name' | 'teamName'>): string {
  return manager.teamName ? `${manager.teamName} (${manager.name})` : manager.name;
}

function formatFixtureKickoff(utcDate: string): string {
  return new Date(utcDate).toLocaleString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });
}

function formatGoalDifference(goalDifference: number): string {
  if (goalDifference > 0) return `+${goalDifference}`;
  return String(goalDifference);
}

function GoalDifferenceValue({ goalDifference }: { goalDifference: number }) {
  const t = useSweepstakeTheme();
  const tone =
    goalDifference > 0
      ? t.c.goalDifferencePositive
      : goalDifference < 0
        ? t.c.goalDifferenceNegative
        : 'text-neutral-300';

  return <span className={`tabular-nums ${tone}`}>{formatGoalDifference(goalDifference)}</span>;
}

function RankMovementIndicator({ change }: { change?: number | null }) {
  const t = useSweepstakeTheme();

  if (change == null) {
    return (
      <span className={`text-xs leading-none ${t.c.rankSame}`} aria-hidden>
        —
      </span>
    );
  }

  if (change > 0) {
    return (
      <span
        className={`text-[10px] font-bold leading-none ${t.c.rankUp}`}
        aria-label={`Up ${change} ${change === 1 ? 'place' : 'places'}`}
        title={`Up ${change}`}
      >
        ▲
      </span>
    );
  }

  if (change < 0) {
    const drop = Math.abs(change);
    return (
      <span
        className={`text-[10px] font-bold leading-none ${t.c.rankDown}`}
        aria-label={`Down ${drop} ${drop === 1 ? 'place' : 'places'}`}
        title={`Down ${drop}`}
      >
        ▼
      </span>
    );
  }

  return (
    <span className={`text-xs leading-none ${t.c.rankSame}`} aria-label="No change" title="No change">
      —
    </span>
  );
}

function RankWithMovement({
  rank,
  rankChange,
  showMovement,
}: {
  rank: number;
  rankChange?: number | null;
  showMovement: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1 tabular-nums">
      <span>{rank}</span>
      {showMovement ? <RankMovementIndicator change={rankChange} /> : null}
    </span>
  );
}

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-neutral-800/80 ${className}`} aria-hidden />;
}

function StandingsLoadingSkeleton() {
  const t = useSweepstakeTheme();

  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading standings">
      <span className="sr-only">Loading standings</span>

      <div className={t.c.tickerWrap}>
        <SkeletonBlock className="mx-1 mb-2 h-3 w-32" />
        <div className="flex gap-3 overflow-hidden px-1 pb-1">
          <SkeletonBlock className="h-24 min-w-[17rem] shrink-0 rounded-lg" />
          <SkeletonBlock className="hidden h-24 min-w-[17rem] shrink-0 rounded-lg sm:block" />
          <SkeletonBlock className="hidden h-24 min-w-[17rem] shrink-0 rounded-lg md:block" />
        </div>
      </div>

      <div className={t.c.roastSection}>
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="mt-3 h-4 w-full" />
        <SkeletonBlock className="mt-2 h-4 w-5/6" />
      </div>

      <div className={t.c.fixturesSection}>
        <div className="flex items-center justify-between gap-3">
          <SkeletonBlock className="h-4 w-40" />
          <SkeletonBlock className="h-3 w-28" />
        </div>
        <div className={`mt-3 ${t.c.fixturesList} divide-y-0`}>
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="px-3 py-3">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="mt-2 h-4 w-full max-w-md" />
            </div>
          ))}
        </div>
      </div>

      <section>
        <SkeletonBlock className="mb-3 h-4 w-36" />
        <div className="overflow-hidden rounded-lg border border-neutral-700">
          <div className="hidden bg-neutral-950 px-3 py-2 sm:grid sm:grid-cols-11 sm:gap-3">
            {Array.from({ length: 11 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-3 w-full" />
            ))}
          </div>
          <div className="divide-y divide-neutral-800">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[1.75rem_minmax(0,1fr)_2rem_2.5rem] items-center gap-x-2 px-2 py-2 sm:grid-cols-11 sm:gap-3 sm:px-3"
              >
                <SkeletonBlock className="h-4 w-4" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-5" />
                <SkeletonBlock className="h-4 w-7" />
                <SkeletonBlock className="hidden h-3 w-16 sm:block" />
                <SkeletonBlock className="hidden h-4 w-7 sm:block" />
                <SkeletonBlock className="hidden h-4 w-7 sm:block" />
                <SkeletonBlock className="hidden h-4 w-7 sm:block" />
                <SkeletonBlock className="hidden h-4 w-7 sm:block" />
                <SkeletonBlock className="hidden h-4 w-8 sm:block" />
                <SkeletonBlock className="hidden h-4 w-7 sm:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SkeletonBlock className="mb-3 h-4 w-28" />
        <div className="space-y-3">
          {[0, 1].map((card) => (
            <div key={card} className={`${t.c.squadCard} px-4 py-3`}>
              <div className="grid grid-cols-2 gap-2 sm:mx-auto sm:w-fit sm:gap-3">
                <SkeletonBlock className="aspect-square w-full rounded-lg sm:size-32" />
                <SkeletonBlock className="aspect-square w-full rounded-lg sm:size-32" />
              </div>
              <SkeletonBlock className="mt-3 h-4 w-48" />
              <SkeletonBlock className="mt-2 h-3 w-full" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function RedCardTally({ count }: { count: number }) {
  const t = useSweepstakeTheme();
  return (
    <span className={t.c.negative}>
      Red <span className="font-semibold">{count}</span>
    </span>
  );
}

function FormSummary({
  wins,
  draws,
  losses,
  redCards,
}: Pick<PlayerStanding, 'wins' | 'draws' | 'losses' | 'redCards'>) {
  return (
    <>
      W{wins} D{draws} L{losses} <RedCardTally count={redCards} />
    </>
  );
}

function FixtureTeamManagers({ managers }: { managers: FixtureManager[] }) {
  if (managers.length === 0) {
    return <span className="text-neutral-500">No manager</span>;
  }

  return (
    <>
      {managers.map((manager, index) => (
        <span key={`${manager.id}-${manager.teamCode}`}>
          {index > 0 ? <span className="text-neutral-600"> · </span> : null}
          <ManagerName
            playerId={manager.id}
            name={fixtureManagerLabel(manager)}
            className="text-inherit"
          />
        </span>
      ))}
    </>
  );
}

function formatMatchdayLabel(date: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const formatted = new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
  if (date === today) return `Today · ${formatted}`;
  return formatted;
}

function MatchdayDayNavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: 'previous' | 'next';
  disabled: boolean;
  onClick: () => void;
}) {
  const t = useSweepstakeTheme();
  const label = direction === 'previous' ? 'Previous matchday' : 'Next matchday';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={t.c.navBtn}
    >
      {direction === 'previous' ? '←' : '→'}
    </button>
  );
}

function formatLiveMatchLabel(livePeriod?: string): string {
  const trimmed = livePeriod?.trim();
  if (trimmed && !/^full time$/i.test(trimmed) && !/^ft$/i.test(trimmed)) {
    if (/\blive\b/i.test(trimmed)) return trimmed;
    return `Live · ${trimmed}`;
  }
  return 'Live';
}

function MatchdayStatusBadge({
  status,
  livePeriod,
}: {
  status: MatchdayEntry['status'];
  livePeriod?: string;
}) {
  const t = useSweepstakeTheme();

  if (status === 'in-play') {
    return (
      <span className={t.c.fixturesInPlay}>{formatLiveMatchLabel(livePeriod)}</span>
    );
  }

  if (status === 'finished') {
    return <span className={t.c.fixturesFt}>Full time</span>;
  }

  return null;
}

function MatchdayFixtureScore({ entry }: { entry: MatchdayEntry }) {
  const t = useSweepstakeTheme();

  if (entry.status === 'finished' && entry.homeGoals != null && entry.awayGoals != null) {
    return (
      <span className={t.c.fixturesScore}>
        {formatMatchScore(entry.homeGoals, entry.awayGoals, entry.homePenalties, entry.awayPenalties)}
      </span>
    );
  }

  if (
    entry.status === 'in-play' &&
    entry.liveHomeGoals != null &&
    entry.liveAwayGoals != null
  ) {
    return (
      <span className={t.c.fixturesLiveScore}>
        {formatMatchScore(entry.liveHomeGoals, entry.liveAwayGoals)}
      </span>
    );
  }

  if (entry.status === 'in-play') {
    return <span className={`font-semibold ${t.c.live}`}>v</span>;
  }

  return <span className="font-medium text-neutral-500">v</span>;
}

function MatchdayFixtureLine({ entry }: { entry: MatchdayEntry }) {
  const t = useSweepstakeTheme();
  const homeIsPlaceholder = entry.placeholderSide === 'home' || entry.placeholderSide === 'both';
  const awayIsPlaceholder = entry.placeholderSide === 'away' || entry.placeholderSide === 'both';

  return (
    <div className="min-w-0 flex-1">
      {entry.roundLabel ? (
        <p className={t.c.fixturesRound}>{entry.roundLabel}</p>
      ) : null}
      <p className="text-sm leading-snug text-neutral-100">
        <span className={`font-medium ${homeIsPlaceholder ? 'italic text-neutral-400' : ''}`}>
          {entry.homeTeam.flag} {entry.homeTeam.name}
        </span>
        <span className="text-neutral-600"> · </span>
        <span className="text-xs text-neutral-400">
          {!homeIsPlaceholder ? <FixtureTeamManagers managers={entry.homeManagers} /> : null}
        </span>
        <MatchdayFixtureScore entry={entry} />
        <span className={`font-medium ${awayIsPlaceholder ? 'italic text-neutral-400' : ''}`}>
          {entry.awayTeam.flag} {entry.awayTeam.name}
        </span>
        <span className="text-neutral-600"> · </span>
        <span className="text-xs text-neutral-400">
          {!awayIsPlaceholder ? <FixtureTeamManagers managers={entry.awayManagers} /> : null}
        </span>
      </p>
      {entry.status === 'finished' && entry.winnerPathLabel ? (
        <p className={t.c.fixturesWinnerPath}>Winner → {entry.winnerPathLabel}</p>
      ) : null}
    </div>
  );
}

function MatchdaySchedule({
  schedule,
  standings,
  scoringMatches,
  matchScoringHelpers,
}: {
  schedule: MatchdayScheduleData;
  standings: PlayerStanding[];
  scoringMatches: MatchPointsEntry[];
  matchScoringHelpers: MatchScoringHelpers;
}) {
  const t = useSweepstakeTheme();
  const [selectedDate, setSelectedDate] = useState(schedule.defaultDate);
  const [managerFilter, setManagerFilter] = useState<string>('all');
  const scoringByMatchId = new Map(scoringMatches.map((entry) => [entry.match.id, entry] as const));
  const selectedIndex = schedule.fixtureDates.indexOf(selectedDate);
  const canGoPrevious = selectedIndex > 0;
  const canGoNext = selectedIndex >= 0 && selectedIndex < schedule.fixtureDates.length - 1;
  const dayEntries = schedule.schedulesByDate[selectedDate] ?? [];
  const entries =
    t.id === 'english-pyramid' && managerFilter !== 'all'
      ? dayEntries.filter(
          (entry) =>
            entry.homeManagers.some((manager) => manager.id === managerFilter) ||
            entry.awayManagers.some((manager) => manager.id === managerFilter)
        )
      : dayEntries;

  useEffect(() => {
    setSelectedDate(schedule.defaultDate);
  }, [schedule.defaultDate]);

  useEffect(() => {
    setManagerFilter('all');
  }, [selectedDate]);

  return (
    <section className={t.c.fixturesSection}>
      {t.id === 'english-pyramid' ? (
        <MatchdayHeroStrip
          schedule={schedule}
          selectedDate={selectedDate}
          showDayNav={schedule.fixtureDates.length > 1}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          onPreviousDay={() => setSelectedDate(schedule.fixtureDates[selectedIndex - 1])}
          onNextDay={() => setSelectedDate(schedule.fixtureDates[selectedIndex + 1])}
        />
      ) : null}
      {t.id === 'english-pyramid' ? (
        <div className="mt-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#d4af37]/80">
            Your games today
          </p>
          <label className="block sm:hidden">
            <span className="sr-only">Filter fixtures by manager</span>
            <select
              value={managerFilter}
              onChange={(event) => setManagerFilter(event.target.value)}
              className="w-full rounded-md border border-neutral-700 bg-neutral-950/80 px-3 py-2 text-sm font-semibold text-neutral-100 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
            >
              <option value="all">All clubs ({dayEntries.length})</option>
              {standings.map((player) => {
                const count = dayEntries.filter(
                  (entry) =>
                    entry.homeManagers.some((manager) => manager.id === player.id) ||
                    entry.awayManagers.some((manager) => manager.id === player.id)
                ).length;
                const label = player.teamName ?? player.name;
                return (
                  <option key={player.id} value={player.id}>
                    {label} ({count})
                  </option>
                );
              })}
            </select>
          </label>
          <div
            className="hidden flex-wrap gap-1.5 sm:flex"
            role="group"
            aria-label="Filter fixtures by manager"
          >
            <button
              type="button"
              onClick={() => setManagerFilter('all')}
              className={`rounded-md border px-2 py-1 text-xs font-semibold transition ${
                managerFilter === 'all'
                  ? 'border-[#d4af37] bg-[#d4af37]/20 text-[#f5f5f0]'
                  : 'border-neutral-700 bg-neutral-950/60 text-neutral-300 hover:border-[#d4af37]/40'
              }`}
            >
              All clubs
              <span className="ml-1 tabular-nums text-neutral-500">({dayEntries.length})</span>
            </button>
            {standings.map((player) => {
              const count = dayEntries.filter(
                (entry) =>
                  entry.homeManagers.some((manager) => manager.id === player.id) ||
                  entry.awayManagers.some((manager) => manager.id === player.id)
              ).length;
              const label = player.teamName ?? player.name;
              const active = managerFilter === player.id;
              return (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => setManagerFilter(player.id)}
                  className={`rounded-md border px-2 py-1 text-xs font-semibold transition ${
                    active
                      ? 'border-[#d4af37] bg-[#d4af37]/20 text-[#f5f5f0]'
                      : 'border-neutral-700 bg-neutral-950/60 text-neutral-300 hover:border-[#d4af37]/40'
                  }`}
                >
                  {label}
                  <span className="ml-1 tabular-nums text-neutral-500">({count})</span>
                </button>
              );
            })}
          </div>
          {managerFilter !== 'all' ? (
            <p className="mt-2 text-xs text-neutral-400">
              Showing {entries.length} fixture{entries.length === 1 ? '' : 's'} involving{' '}
              {standings.find((player) => player.id === managerFilter)?.teamName ??
                standings.find((player) => player.id === managerFilter)?.name}
              .
            </p>
          ) : null}
        </div>
      ) : null}
      {t.id !== 'english-pyramid' ? (
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="flex min-w-0 items-center gap-2">
            {schedule.fixtureDates.length > 1 ? (
              <>
                <MatchdayDayNavButton
                  direction="previous"
                  disabled={!canGoPrevious}
                  onClick={() => setSelectedDate(schedule.fixtureDates[selectedIndex - 1])}
                />
                <h3 className={`min-w-0 ${t.c.fixturesHeading}`}>{formatMatchdayLabel(selectedDate)}</h3>
                <MatchdayDayNavButton
                  direction="next"
                  disabled={!canGoNext}
                  onClick={() => setSelectedDate(schedule.fixtureDates[selectedIndex + 1])}
                />
              </>
            ) : (
              <h3 className={t.c.fixturesHeading}>{formatMatchdayLabel(selectedDate)}</h3>
            )}
          </div>
          <span className={t.c.fixturesMeta}>Kickoffs in GMT · scores after full time</span>
        </div>
      ) : null}

      {entries.length === 0 ? (
        <p className="mt-2 text-sm text-neutral-300">
          {managerFilter !== 'all'
            ? 'No fixtures for this manager on this day.'
            : 'No sweepstake fixtures scheduled for this day.'}
        </p>
      ) : (
        <ul className={t.c.fixturesList}>
          {entries.map((entry) => {
            const scoringEntry = entry.status === 'finished' ? scoringByMatchId.get(entry.id) : undefined;
            const scoringPlayers = scoringEntry
              ? standings.filter((player) => scoringEntry.byPlayer[player.id] != null)
              : [];

            return (
              <li
                key={entry.id}
                className={`px-3 py-1.5 sm:px-3 sm:py-2 ${entry.status === 'in-play' ? t.c.fixturesRowLive : ''}`}
              >
                {t.id === 'english-pyramid' ? (
                  <EnglishPyramidFixtureRow
                    entry={entry}
                    kickoff={
                      <time
                        dateTime={entry.utcDate}
                        className={
                          entry.status === 'in-play' ? t.c.fixturesKickoffLive : t.c.fixturesKickoff
                        }
                      >
                        {formatFixtureKickoff(entry.utcDate)}
                      </time>
                    }
                    statusBadge={
                      <MatchdayStatusBadge status={entry.status} livePeriod={entry.livePeriod} />
                    }
                    score={<MatchdayFixtureScore entry={entry} />}
                    homeManagersLabel={
                      entry.placeholderSide === 'home' || entry.placeholderSide === 'both' ? null : (
                        <FixtureTeamManagers managers={entry.homeManagers} />
                      )
                    }
                    awayManagersLabel={
                      entry.placeholderSide === 'away' || entry.placeholderSide === 'both' ? null : (
                        <FixtureTeamManagers managers={entry.awayManagers} />
                      )
                    }
                    roundLabel={
                      entry.roundLabel ? (
                        <p className={t.c.fixturesRound}>{entry.roundLabel}</p>
                      ) : undefined
                    }
                    winnerPathLabel={
                      entry.status === 'finished' && entry.winnerPathLabel ? (
                        <p className={t.c.fixturesWinnerPath}>Winner → {entry.winnerPathLabel}</p>
                      ) : undefined
                    }
                    pointsLine={
                      scoringPlayers.length > 0 && scoringEntry ? (
                        <p className={t.c.fixturesPoints}>
                          <MatchScoringPlayersLine
                            players={standings}
                            byPlayer={scoringEntry.byPlayer}
                            match={scoringEntry.match}
                            matchScoringHelpers={matchScoringHelpers}
                          />
                        </p>
                      ) : undefined
                    }
                  />
                ) : (
                  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3">
                    <div className="shrink-0 sm:w-[8.75rem]">
                      <time
                        dateTime={entry.utcDate}
                        className={
                          entry.status === 'in-play' ? t.c.fixturesKickoffLive : t.c.fixturesKickoff
                        }
                      >
                        {formatFixtureKickoff(entry.utcDate)}
                      </time>
                      <MatchdayStatusBadge status={entry.status} livePeriod={entry.livePeriod} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <MatchdayFixtureLine entry={entry} />
                      {scoringPlayers.length > 0 && scoringEntry ? (
                        <p className={t.c.fixturesPoints}>
                          <MatchScoringPlayersLine
                            players={standings}
                            byPlayer={scoringEntry.byPlayer}
                            match={scoringEntry.match}
                            matchScoringHelpers={matchScoringHelpers}
                          />
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function LatestResultsTicker({
  matches,
  standings,
  matchScoringHelpers,
}: {
  matches: MatchPointsEntry[];
  standings: PlayerStanding[];
  matchScoringHelpers: MatchScoringHelpers;
}) {
  const t = useSweepstakeTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const resultCount = matches.length;

  useEffect(() => {
    if (resultCount <= 1) {
      setActiveIndex(0);
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % resultCount);
    }, 3600);

    return () => window.clearInterval(interval);
  }, [resultCount]);

  useEffect(() => {
    if (activeIndex >= resultCount) setActiveIndex(0);
  }, [activeIndex, resultCount]);

  if (resultCount === 0) return null;

  const renderResultCard = (entry: MatchPointsEntry, index: number) => {
    const { match, byPlayer } = entry;
    const scoringPlayers = standings.filter((player) => byPlayer[player.id] != null);

    return (
      <article
        key={`${match.id}-${index}`}
        className={t.c.tickerCard}
      >
        <div className={`flex items-center justify-between gap-3 ${t.c.tickerCardLabel}`}>
          <span>Latest result</span>
          <span className="tabular-nums">{formatResultTickerDate(match.utcDate)}</span>
        </div>
        <div className={t.c.tickerCardInner}>
          <div className={t.c.tickerScore}>
            <span>{match.homeTeam.tla}</span>
            <span className={t.c.tickerScoreBadge}>
              {formatMatchScore(match.homeGoals, match.awayGoals, match.homePenalties, match.awayPenalties)}
            </span>
            <span>{match.awayTeam.tla}</span>
          </div>
        </div>
        {scoringPlayers.length > 0 ? (
          <p className={t.c.tickerMatch}>
            <MatchScoringPlayersLine
              players={standings}
              byPlayer={byPlayer}
              match={match}
              matchScoringHelpers={matchScoringHelpers}
            />
          </p>
        ) : null}
      </article>
    );
  };

  return (
    <section className="w-full" aria-label="Latest sweepstake results ticker">
      <div className="flex justify-center sm:hidden" aria-live="polite">
        {renderResultCard(matches[activeIndex], activeIndex)}
      </div>

      <div className={t.c.tickerWrap}>
        <div className={`mb-2 flex items-center justify-between gap-3 px-1 ${t.c.tickerHeader}`}>
          <span>Latest results</span>
          <span className={`hidden md:inline ${t.c.points}`}>Continuous feed</span>
        </div>
        <div className={t.c.tickerTrack}>
          <div className={t.c.tickerFadeL} aria-hidden />
          <div className={t.c.tickerFadeR} aria-hidden />
          <div className="world-cup-scoreboard-marquee flex w-max px-3">
            <div className="flex shrink-0 gap-3 pr-3">
              {matches.map((entry, index) => renderResultCard(entry, index))}
            </div>
            <div className="flex shrink-0 gap-3 pr-3" aria-hidden="true">
              {matches.map((entry, index) => renderResultCard(entry, index + resultCount))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ManagerName({
  playerId,
  name,
  className = 'text-xs font-medium',
}: {
  playerId: string;
  name: string;
  className?: string;
}) {
  const t = useSweepstakeTheme();
  const color = managerColorForPlayer(playerId, t.id);

  return (
    <span className={className} style={color ? { color } : undefined}>
      {name}
    </span>
  );
}

function PlayerIdentity({
  player,
  heading = false,
}: {
  player: Pick<PlayerStanding, 'id' | 'name' | 'teamName'>;
  heading?: boolean;
}) {
  if (player.teamName) {
    const Tag = heading ? 'h4' : 'span';
    return (
      <span className="block min-w-0">
        <Tag className={heading ? 'text-base font-semibold text-white' : 'block font-medium text-white'}>
          {player.teamName}
        </Tag>
        <ManagerName playerId={player.id} name={player.name} />
      </span>
    );
  }

  if (heading) {
    return (
      <h4 className="text-base font-semibold text-white">
        <ManagerName playerId={player.id} name={player.name} className="text-base font-semibold" />
      </h4>
    );
  }

  return <ManagerName playerId={player.id} name={player.name} className="font-medium text-base" />;
}

function progressLineColor(index: number, colors: readonly string[]): string {
  return colors[index % colors.length];
}

function progressTeamLabel(player: Pick<PlayerStanding, 'name' | 'teamName'>): string {
  return player.teamName ? `${player.teamName} (${player.name})` : player.name;
}

function StandingsProgressChart({
  standings,
  scoringMatches,
}: {
  standings: PlayerStanding[];
  scoringMatches: MatchPointsEntry[];
}) {
  const t = useSweepstakeTheme();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const { height, crestSize, padding } = useProgressChartLayout();
  const { xStep, lineWidth, yHeadroomPoints } = PROGRESS_CHART;
  const finishedMatchCount = scoringMatches.length;

  if (finishedMatchCount === 0) {
    return (
      <p className="mt-2 text-sm text-neutral-400">Progress chart fills in once the first results are recorded.</p>
    );
  }

  const series = buildPlayerProgressSeries(standings, scoringMatches);
  const pointCount = series[0]?.points.length ?? 0;
  const plotHeight = height - padding.top - padding.bottom;
  const allTotals = series.flatMap((row) => row.points.map((point) => point.total));
  const dataMin = Math.min(...allTotals);
  const dataMax = Math.max(...allTotals, 1);
  const yMin = Math.min(0, dataMin - 1);
  const yMax = dataMax + yHeadroomPoints;
  const yRange = Math.max(yMax - yMin, 1);
  const selectedSeries = selectedPlayerId ? series.find((row) => row.playerId === selectedPlayerId) : null;

  const xForIndex = (index: number) => padding.left + index * xStep;
  const yForTotal = (total: number) =>
    padding.top + plotHeight - ((total - yMin) / yRange) * plotHeight;

  const yTicks = Array.from({ length: 5 }, (_, tickIndex) => {
    const value = yMin + (yRange * tickIndex) / 4;
    return { value: Math.round(value), y: yForTotal(value) };
  });

  const xLabelStride = Math.max(1, Math.ceil((pointCount - 1) / 10));
  const xLabels = series[0]?.points.filter((_, index) => index === 0 || index % xLabelStride === 0 || index === pointCount - 1) ?? [];

  const toggleSelectedPlayer = (playerId: string) => {
    setSelectedPlayerId((current) => (current === playerId ? null : playerId));
  };

  const selectedStanding = selectedPlayerId ? standings.find((row) => row.id === selectedPlayerId) : null;
  const selectedLabelText =
    selectedSeries && selectedStanding
      ? `${selectedStanding.teamName ?? selectedSeries.label} · ${selectedSeries.currentTotal} pts`
      : '';
  const selectedLabelWidth = selectedLabelText ? Math.max(108, selectedLabelText.length * 6.2 + 20) : 0;
  const chartWidth =
    padding.left + padding.right + selectedLabelWidth + Math.max(1, pointCount - 1) * xStep;

  return (
      <div className={`mt-3 space-y-3`}>
      <div className={t.c.chartWrap}>
        <svg
          role="img"
          aria-label="Cumulative fantasy points by manager across the tournament"
          viewBox={`0 0 ${chartWidth} ${height}`}
          className="block min-w-full"
          style={{ width: chartWidth, height, minWidth: '100%' }}
        >
          {yTicks.map((tick) => (
            <g key={tick.value}>
              <line
                x1={padding.left}
                x2={chartWidth - padding.right}
                y1={tick.y}
                y2={tick.y}
                stroke="rgba(115,115,115,0.25)"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 8}
                y={tick.y + 4}
                textAnchor="end"
                className="fill-neutral-500 text-[10px]"
              >
                {tick.value}
              </text>
            </g>
          ))}

          {xLabels.map((point) => (
            <text
              key={`${point.index}-${point.label}`}
              x={xForIndex(point.index)}
              y={height - 12}
              textAnchor="middle"
              className="fill-neutral-500 text-[10px]"
            >
              {point.label}
            </text>
          ))}

          {series.map((row, seriesIndex) => {
            const color = progressLineColor(seriesIndex, t.chartLineColors);
            const isSelected = selectedPlayerId === row.playerId;
            const path = row.points
              .map((point, index) => {
                const x = xForIndex(index);
                const y = yForTotal(point.total);
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
              })
              .join(' ');
            const last = row.points[row.points.length - 1];
            const markerX = xForIndex(last.index);
            const markerY = yForTotal(last.total);
            const clipId = `progress-crest-${row.playerId}`;
            const standing = standings.find((entry) => entry.id === row.playerId);
            const teamName = standing?.teamName ?? row.label;
            const teamLabel = standing ? progressTeamLabel(standing) : row.label;
            const labelX = markerX + crestSize / 2 + 8;
            const labelText = `${teamName} · ${row.currentTotal} pts`;
            const labelWidth = Math.max(96, labelText.length * 6.2 + 16);

            return (
              <g key={row.playerId} opacity={selectedPlayerId && !isSelected ? 0.35 : 1}>
                <path
                  d={path}
                  fill="none"
                  stroke={color}
                  strokeWidth={isSelected ? lineWidth + 1.5 : lineWidth}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <g
                  role="button"
                  tabIndex={0}
                  aria-label={`${teamLabel}, ${row.currentTotal} points`}
                  aria-pressed={isSelected}
                  className="cursor-pointer outline-none"
                  onClick={() => toggleSelectedPlayer(row.playerId)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      toggleSelectedPlayer(row.playerId);
                    }
                  }}
                >
                  <circle
                    cx={markerX}
                    cy={markerY}
                    r={crestSize / 2 + 10}
                    fill="transparent"
                    stroke="transparent"
                  />
                  <circle
                    cx={markerX}
                    cy={markerY}
                    r={crestSize / 2 + 2}
                    fill="#0a0a0a"
                    stroke={color}
                    strokeWidth={isSelected ? 3 : 2}
                  />
                  <defs>
                    <clipPath id={clipId}>
                      <circle cx={markerX} cy={markerY} r={crestSize / 2 - 1} />
                    </clipPath>
                  </defs>
                  <image
                    href={row.crest}
                    x={markerX - crestSize / 2}
                    y={markerY - crestSize / 2}
                    width={crestSize}
                    height={crestSize}
                    clipPath={`url(#${clipId})`}
                    preserveAspectRatio="xMidYMid meet"
                    pointerEvents="none"
                  />
                </g>
                {isSelected ? (
                  <g aria-hidden={false} pointerEvents="none">
                    <rect
                      x={labelX}
                      y={markerY - 13}
                      width={labelWidth}
                      height={26}
                      rx={6}
                      fill="#0a0a0a"
                      stroke={color}
                      strokeWidth={1.5}
                    />
                    <text
                      x={labelX + 8}
                      y={markerY + 4}
                      className="fill-white text-[11px] font-semibold"
                    >
                      {teamName}
                      <tspan fill={color} dx={6}>
                        {row.currentTotal} pts
                      </tspan>
                    </text>
                  </g>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>

      <p className="text-xs text-neutral-500">
        Tap a crest on the chart to see the team name and current points.
      </p>

      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-neutral-300">
        {series
          .slice()
          .sort((a, b) => b.currentTotal - a.currentTotal)
          .map((row) => {
            const colorIndex = series.findIndex((entry) => entry.playerId === row.playerId);
            const standing = standings.find((entry) => entry.id === row.playerId);
            return (
              <li
                key={row.playerId}
                className={`flex items-center gap-2 ${
                  standing?.allTeamsEliminated ? 'opacity-60 line-through decoration-red-500/70' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleSelectedPlayer(row.playerId)}
                  className={`inline-flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-neutral-900 transition hover:scale-105 ${
                    selectedPlayerId === row.playerId ? t.c.chartLegendBtnSelected : t.c.chartLegendBtn
                  }`}
                  style={{ boxShadow: `0 0 0 1px ${progressLineColor(colorIndex, t.chartLineColors)}` }}
                  aria-label={standing ? progressTeamLabel(standing) : row.label}
                  aria-pressed={selectedPlayerId === row.playerId}
                >
                  <img src={row.crest} alt="" className="max-h-full max-w-full object-contain p-0.5" />
                </button>
                <span className="font-medium text-white">{standing ? progressTeamLabel(standing) : row.label}</span>
                {standing?.allTeamsEliminated ? (
                  <span className={`${t.c.squadEliminatedBadge} no-underline`}>Out</span>
                ) : null}
                <span className={`tabular-nums ${t.c.chartLegendPoints}`}>{row.currentTotal} pts</span>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

function teamsLeftLabel(row: PlayerStanding, themeId: string): string {
  if (themeId === 'english-pyramid') return `${row.teamCount} clubs`;
  if (row.allTeamsEliminated) return 'Eliminated';
  const alive = row.teamBreakdown.filter((team) => !team.eliminated).length;
  if (alive === row.teamCount) return `${row.teamCount} teams`;
  if (alive === 0) return 'Eliminated';
  if (alive === 1) return '1 left — last hope';
  return `${alive} left`;
}

function teamsLeftCount(row: PlayerStanding, themeId: string): string | number {
  if (themeId === 'english-pyramid') return row.teamCount;
  if (row.allTeamsEliminated) return 'OUT';
  const alive = row.teamBreakdown.filter((team) => !team.eliminated).length;
  if (alive === 0) return 'OUT';
  return alive;
}

function isWorldCupPlayerEliminated(player: PlayerStanding, themeId: string): boolean {
  return themeId === 'world-cup' && player.allTeamsEliminated === true;
}

function OverallStandings({ standings }: { standings: PlayerStanding[] }) {
  const t = useSweepstakeTheme();
  const showRankMovement = t.id === 'english-pyramid';
  const mobileGridClass =
    t.id === 'english-pyramid'
      ? 'grid-cols-[1.75rem_minmax(0,1fr)_auto_2.5rem]'
      : 'grid-cols-[1.75rem_minmax(0,1fr)_2rem_2.5rem]';

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-neutral-700 sm:hidden">
        <div
          className={`grid ${mobileGridClass} items-center gap-x-2 border-b border-neutral-800 bg-neutral-950 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-neutral-500`}
        >
          <span>#</span>
          <span>Club</span>
          {t.id === 'english-pyramid' ? (
            <span className="text-right">Form</span>
          ) : (
            <span className="text-right">Left</span>
          )}
          <span className="text-right">Pts</span>
        </div>
        <ul className="divide-y divide-neutral-800">
          {standings.map((row, index) => (
            <li
              key={row.id}
              className={`grid ${mobileGridClass} items-center gap-x-2 px-2 py-1.5 ${
                isWorldCupPlayerEliminated(row, t.id)
                  ? `${t.c.standingsRowEliminated} text-red-200/90`
                  : index === 0
                    ? t.c.leaderRowMobile
                    : 'bg-neutral-950/40'
              }`}
            >
              <span className="text-[11px] text-neutral-300">
                <RankWithMovement
                  rank={index + 1}
                  rankChange={row.rankChange}
                  showMovement={showRankMovement}
                />
              </span>
              <span className="block min-w-0">
                <span className="block text-xs font-medium leading-snug text-white">
                  {playerDisplayLabel(row)}
                </span>
                {row.teamName ? (
                  <ManagerName
                    playerId={row.id}
                    name={row.name}
                    className="block text-[10px] font-medium"
                  />
                ) : null}
              </span>
              {t.id === 'english-pyramid' ? (
                <span className="shrink-0 text-right text-[10px] tabular-nums text-neutral-400">
                  W{row.wins} D{row.draws} L{row.losses}
                </span>
              ) : (
                <span
                  className={`shrink-0 text-right text-xs font-medium tabular-nums ${
                    isWorldCupPlayerEliminated(row, t.id) ? 'font-bold text-red-300' : 'text-neutral-200'
                  }`}
                  title={teamsLeftLabel(row, t.id)}
                >
                  {teamsLeftCount(row, t.id)}
                </span>
              )}
              <span className={`shrink-0 text-right text-sm tabular-nums ${t.c.pointsBold}`}>
                {row.points}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden overflow-x-auto rounded-lg border border-neutral-700 sm:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-neutral-950 text-neutral-400">
            <tr>
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium">Player</th>
              <th className="px-3 py-2 font-medium">Teams</th>
              <th className="px-3 py-2 font-medium text-right">Pld</th>
              <th className="px-3 py-2 font-medium text-right">W</th>
              <th className="px-3 py-2 font-medium text-right">D</th>
              <th className="px-3 py-2 font-medium text-right">L</th>
              <th className="px-3 py-2 font-medium text-right">Bonus</th>
              <th className="px-3 py-2 font-medium text-right">GD</th>
              <th className="px-3 py-2 font-medium text-right">Red</th>
              <th className="px-3 py-2 font-medium text-right">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 text-neutral-100">
            {standings.map((row, index) => (
              <tr
                key={row.id}
                className={
                  isWorldCupPlayerEliminated(row, t.id)
                    ? `${t.c.standingsRowEliminated} text-red-100/90`
                    : index === 0
                      ? t.c.leaderRow
                      : undefined
                }
              >
                <td className="px-3 py-2 text-neutral-300">
                  <RankWithMovement
                    rank={index + 1}
                    rankChange={row.rankChange}
                    showMovement={showRankMovement}
                  />
                </td>
                <td className="px-3 py-2 font-medium">
                  <PlayerIdentity player={row} />
                  {isWorldCupPlayerEliminated(row, t.id) ? (
                    <span className={`ml-2 ${t.c.squadEliminatedBadge}`}>Out</span>
                  ) : null}
                </td>
                <td
                  className={`px-3 py-2 ${
                    isWorldCupPlayerEliminated(row, t.id) ? 'font-semibold text-red-300' : 'text-neutral-300'
                  }`}
                >
                  {teamsLeftLabel(row, t.id)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{row.playedMatches}</td>
                <td className="px-3 py-2 text-right tabular-nums">{row.wins}</td>
                <td className="px-3 py-2 text-right tabular-nums">{row.draws}</td>
                <td className="px-3 py-2 text-right tabular-nums">{row.losses}</td>
                <td className="px-3 py-2 text-right tabular-nums">{row.bonusPoints}</td>
                <td className="px-3 py-2 text-right">
                  <GoalDifferenceValue goalDifference={row.goalDifference} />
                </td>
                <td className={`px-3 py-2 text-right tabular-nums ${t.c.negative}`}>{row.redCards}</td>
                <td className={`px-3 py-2 text-right font-semibold tabular-nums ${index === 0 ? t.c.points : ''}`}>
                  {row.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function formatTeamMatchDate(utcDate: string): string {
  return new Date(utcDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  });
}

function teamMatchDisplaysForTeam(
  teamCode: string,
  matches: MatchPointsEntry[],
  helpers: MatchScoringHelpers
): TeamMatchDisplay[] {
  return matches
    .filter(({ match }) => helpers.matchInvolvesTeam(match, teamCode))
    .map(({ match }) => helpers.getTeamMatchDisplay(match, teamCode))
    .filter((entry): entry is TeamMatchDisplay => entry != null)
    .sort((a, b) => b.utcDate.localeCompare(a.utcDate));
}

/** Last five results, oldest → newest (standard form strip). */
function lastFiveFormOutcomes(
  teamCode: string,
  matches: MatchPointsEntry[],
  helpers: MatchScoringHelpers
): Array<'W' | 'L' | 'D'> {
  return teamMatchDisplaysForTeam(teamCode, matches, helpers)
    .slice(0, 5)
    .reverse()
    .map(teamMatchDisplayOutcomeLetter);
}

function TeamResultsPanel({
  team,
  results,
  formatTeamLabel,
}: {
  team: TeamStanding;
  results: TeamMatchDisplay[];
  formatTeamLabel?: (code: string) => string;
}) {
  const t = useSweepstakeTheme();
  const teamLabel = formatTeamLabel ? formatTeamLabel(team.code) : `${team.flag} ${team.name}`;

  return (
    <div className={t.c.teamResultsPanel} role="region" aria-label={`${team.name} results`}>
      <p className={t.c.teamResultsHeading}>{teamLabel} results</p>
      {results.length === 0 ? (
        <p className="mt-2 text-xs text-neutral-400">No finished matches yet.</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {results.map((result) => (
            <li
              key={result.matchId}
              className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 text-xs text-neutral-100"
            >
              <span className="min-w-0">
                <span className="text-neutral-500">{formatTeamMatchDate(result.utcDate)}</span>{' '}
                <span className="text-neutral-400">{result.isHome ? 'vs' : '@'}</span>{' '}
                {result.opponentFlag} {result.opponentName}{' '}
                <span className="font-medium tabular-nums">
                  {result.goalsFor}–{result.goalsAgainst}
                  {result.penaltiesFor != null && result.penaltiesAgainst != null
                    ? ` (${result.penaltiesFor}–${result.penaltiesAgainst} pens)`
                    : ''}
                </span>{' '}
                <MatchOutcomeLetter outcome={teamMatchDisplayOutcomeLetter(result)} />
                <TeamMatchAdjustments result={result} />
              </span>
              <span className={t.c.teamResultsPoints}>
                {result.points >= 0 ? '+' : ''}
                {result.points} pts
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function prefersFinePointerHover(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function TeamMiniTable({
  teams,
  scoringMatches,
  matchScoringHelpers,
  formatTeamLabel,
  bonusColumnLabel = 'Bonus',
}: {
  teams: TeamStanding[];
  scoringMatches: MatchPointsEntry[];
  matchScoringHelpers: MatchScoringHelpers;
  formatTeamLabel?: (code: string) => string;
  bonusColumnLabel?: string;
}) {
  const t = useSweepstakeTheme();
  const [pinnedTeamCode, setPinnedTeamCode] = useState<string | null>(null);
  const [hoverTeamCode, setHoverTeamCode] = useState<string | null>(null);

  const toggleTeam = (teamCode: string) => {
    setHoverTeamCode(null);
    setPinnedTeamCode((current) => (current === teamCode ? null : teamCode));
  };

  const displayTeamCode = pinnedTeamCode ?? hoverTeamCode;
  const displayTeam = teams.find((team) => team.code === displayTeamCode);
  const displayResults = displayTeam
    ? teamMatchDisplaysForTeam(displayTeam.code, scoringMatches, matchScoringHelpers)
    : [];

  return (
    <div className="rounded-md border border-neutral-700/80">
      <p className="border-b border-neutral-800 bg-neutral-950/80 px-2 py-1.5 text-[10px] text-neutral-500 sm:px-3">
        <span className="hidden sm:inline">Hover a team for results · </span>
        Tap a team for results
      </p>
      <div
        onMouseLeave={() => {
          if (prefersFinePointerHover() && pinnedTeamCode == null) setHoverTeamCode(null);
        }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs sm:text-sm">
            <thead className="bg-neutral-950/80 text-neutral-400">
              <tr>
                <th className="px-2 py-1.5 font-medium sm:px-3">Team</th>
                <th className="px-2 py-1.5 font-medium text-right sm:px-3">Form</th>
                <th className="px-2 py-1.5 font-medium text-right sm:px-3">Pld</th>
                <th className="px-2 py-1.5 font-medium text-right sm:px-3">W</th>
                <th className="px-2 py-1.5 font-medium text-right sm:px-3">D</th>
                <th className="px-2 py-1.5 font-medium text-right sm:px-3">L</th>
                <th className="px-2 py-1.5 font-medium text-right sm:px-3">{bonusColumnLabel}</th>
                <th className="px-2 py-1.5 font-medium text-right sm:px-3">GD</th>
                <th className="px-2 py-1.5 font-medium text-right sm:px-3">Red</th>
                <th className="px-2 py-1.5 font-medium text-right sm:px-3">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-100">
              {teams.map((team) => {
                const isPinned = pinnedTeamCode === team.code;
                const isHighlighted = displayTeamCode === team.code;
                const isEliminated = team.eliminated === true;
                const form = lastFiveFormOutcomes(team.code, scoringMatches, matchScoringHelpers);

                return (
                  <tr
                    key={team.code}
                    className={`transition-colors ${
                      isEliminated
                        ? 'bg-red-950/15 text-red-300/90'
                        : isHighlighted
                          ? t.c.teamHighlight
                          : 'hover:bg-neutral-900/50'
                    }`}
                    onMouseEnter={() => {
                      if (prefersFinePointerHover()) setHoverTeamCode(team.code);
                    }}
                  >
                    <td className="px-2 py-1.5 sm:px-3">
                      <button
                        type="button"
                        onClick={() => toggleTeam(team.code)}
                        aria-expanded={isPinned}
                        aria-controls="team-results-panel"
                        className={`-mx-1 rounded px-1 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${t.c.accentFocus} ${
                          isEliminated ? `${t.c.negative} hover:text-red-300` : t.c.accentHover
                        }`}
                      >
                        {t.id === 'english-pyramid' ? (
                          <>
                            <DivisionBadge divisionId={team.flag} />
                            {team.name}
                          </>
                        ) : formatTeamLabel ? (
                          formatTeamLabel(team.code)
                        ) : (
                          `${team.flag} ${team.name}`
                        )}
                        {isEliminated ? (
                          <span className={`ml-1.5 text-[10px] font-semibold uppercase tracking-wide ${t.c.negative}`}>
                            Eliminated
                          </span>
                        ) : null}
                      </button>
                    </td>
                    <td className="px-2 py-1.5 text-right text-[11px] sm:px-3 sm:text-xs">
                      <FormChips outcomes={form} />
                    </td>
                    <td className="px-2 py-1.5 text-right tabular-nums sm:px-3">{team.playedMatches}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums sm:px-3">{team.wins}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums sm:px-3">{team.draws}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums sm:px-3">{team.losses}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums sm:px-3">{team.bonusPoints}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums sm:px-3">
                      <GoalDifferenceValue goalDifference={team.goalDifference} />
                    </td>
                    <td className={`px-2 py-1.5 text-right tabular-nums sm:px-3 ${t.c.negative}`}>
                      {team.redCards}
                    </td>
                    <td
                      className={`px-2 py-1.5 text-right font-semibold tabular-nums sm:px-3 ${
                        isEliminated ? `${t.c.negative} opacity-90` : ''
                      }`}
                    >
                      {team.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {displayTeam ? (
          <div id="team-results-panel" className="border-t border-neutral-800 px-2 py-2 sm:px-3">
            <TeamResultsPanel team={displayTeam} results={displayResults} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ImageLightbox({
  src,
  label,
  onClose,
  aspectClass = 'aspect-[3/4]',
  imageClassName = '',
  useNativeImage = false,
  useBackgroundImage = false,
}: {
  src: string;
  label: string;
  onClose: () => void;
  aspectClass?: string;
  imageClassName?: string;
  useNativeImage?: boolean;
  useBackgroundImage?: boolean;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${label} — enlarged`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-lg border border-white/25 bg-neutral-950/75 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-900/90 sm:text-sm"
      >
        Close
      </button>
      <div className="w-full max-w-xs sm:max-w-sm" onClick={(event) => event.stopPropagation()}>
        <div
          className={`relative w-full overflow-hidden rounded-xl border border-neutral-600 bg-neutral-950 ${
            aspectClass === 'aspect-square'
              ? 'aspect-square'
              : `${aspectClass} max-h-[calc(100dvh-7rem)]`
          } ${useNativeImage || useBackgroundImage ? 'flex items-center justify-center' : ''}`}
        >
          {useBackgroundImage ? (
            <span
              className={`absolute inset-3 block bg-contain bg-center bg-no-repeat sm:inset-4 ${imageClassName}`}
              style={{ backgroundImage: `url(${src})` }}
              role="img"
              aria-label={label}
            />
          ) : useNativeImage ? (
            <img
              src={src}
              alt={label}
              className={`max-h-full max-w-full object-contain ${imageClassName}`}
            />
          ) : (
            <Image
              src={src}
              alt={label}
              fill
              sizes="(max-width: 640px) 320px, 384px"
              className={`object-contain ${imageClassName}`}
            />
          )}
        </div>
        <p className="mt-3 text-center text-sm font-medium text-white">{label}</p>
      </div>
    </div>
  );
}

function managerPhotoFrameClass(isLeader: boolean, isLast: boolean, themeId: SweepstakeFantasyThemeId): string {
  if (themeId !== 'english-pyramid') return '';
  if (isLeader) return 'ring-2 ring-[#d4af37] border-[#d4af37]';
  if (isLast) return 'ring-2 ring-[#8b2233] border-[#a83248]';
  return '';
}

function PlayerSquadCard({
  rank,
  player,
  scoringMatches,
  formatTeamLabel,
  matchScoringHelpers,
  bonusColumnLabel,
  totalPlayers,
}: {
  rank: number;
  player: PlayerStanding;
  scoringMatches: MatchPointsEntry[];
  formatTeamLabel: (code: string) => string;
  matchScoringHelpers: MatchScoringHelpers;
  bonusColumnLabel?: string;
  totalPlayers: number;
}) {
  const t = useSweepstakeTheme();
  const managerLabel = player.teamName ?? player.name;
  const [enlarged, setEnlarged] = useState<'manager' | 'crest' | null>(null);
  const isLeader = rank === 1;
  const isLast = rank === totalPlayers;
  const isEliminated = isWorldCupPlayerEliminated(player, t.id);
  const photoFrame = managerPhotoFrameClass(isLeader, isLast, t.id);
  const cardClass = isEliminated ? t.c.squadCardEliminated : isLeader ? t.c.squadCardLeader : t.c.squadCard;
  const photoToneClass = isEliminated ? 'grayscale-[0.85] opacity-80' : '';

  return (
    <article className={cardClass} aria-label={isEliminated ? `${managerLabel} eliminated from the World Cup` : undefined}>
      {isEliminated ? (
        <div className={t.c.squadEliminatedBanner}>
          Eliminated — every nation out of the World Cup
        </div>
      ) : null}
      <div className={`px-4 py-3 ${isEliminated ? 'opacity-95' : ''}`}>
        <div className="space-y-3">
          <div className="grid w-full grid-cols-2 gap-2 sm:mx-auto sm:w-fit sm:gap-3">
            <button
              type="button"
              onClick={() => setEnlarged('manager')}
              className={`${t.c.squadPhotoBtn} ${photoFrame} ${photoToneClass}`}
              aria-label={`View enlarged photo of ${managerLabel}`}
            >
              {/* Native img avoids stale next/image optimizer cache after portrait swaps. */}
              <img
                src={managerPhotoSrc(player.managerImage)}
                alt={`${managerLabel} manager`}
                className="h-full w-full object-cover object-center"
              />
            </button>
            <button
              type="button"
              onClick={() => setEnlarged('crest')}
              className={`${t.c.squadPhotoBtn} ${photoFrame} ${photoToneClass} relative aspect-square w-full min-w-0 cursor-zoom-in overflow-hidden sm:size-32 md:size-36`}
              aria-label={`View enlarged ${managerLabel} club crest`}
            >
              {/* background-size: contain cannot stretch — avoids img flex sizing bugs on mobile */}
              <span
                className="absolute inset-2.5 block bg-contain bg-center bg-no-repeat sm:inset-3"
                style={{ backgroundImage: `url(${player.clubCrest})` }}
                aria-hidden
              />
            </button>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <span className={isLeader ? t.c.squadRankBadgeLeader : t.c.squadRankBadge}>{rank}</span>
                {t.id === 'english-pyramid' ? (
                  <RankMovementIndicator change={player.rankChange} />
                ) : null}
              </span>
              <PlayerIdentity player={player} heading />
              {isEliminated ? <span className={t.c.squadEliminatedBadge}>Eliminated</span> : null}
              <span className={`text-sm font-semibold tabular-nums ${t.c.points}`}>{player.points} pts</span>
              {t.id === 'english-pyramid' ? (
                <EnglishPyramidShareButton
                  player={player}
                  rank={rank}
                  totalPlayers={totalPlayers}
                />
              ) : null}
              <span className="text-xs font-medium tabular-nums text-neutral-300">
                GD <GoalDifferenceValue goalDifference={player.goalDifference} />
              </span>
              <span className="text-xs text-neutral-500">
                {t.id === 'english-pyramid' ? (
                  <FormSummary
                    wins={player.wins}
                    draws={player.draws}
                    losses={player.losses}
                    redCards={player.redCards}
                  />
                ) : isEliminated ? (
                  <span className="font-semibold text-red-300">
                    0 alive · all {player.teamCount} nations eliminated ·{' '}
                    <FormSummary
                      wins={player.wins}
                      draws={player.draws}
                      losses={player.losses}
                      redCards={player.redCards}
                    />
                  </span>
                ) : (
                  <>
                    {player.teamBreakdown.filter((team) => !team.eliminated).length} alive ·{' '}
                    {player.teamBreakdown.filter((team) => team.eliminated).length} out ·{' '}
                    <FormSummary
                      wins={player.wins}
                      draws={player.draws}
                      losses={player.losses}
                      redCards={player.redCards}
                    />
                  </>
                )}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-neutral-400 sm:text-sm">{player.draftNote}</p>
            {isEliminated ? (
              <p className="mt-2 text-sm font-medium leading-relaxed text-red-200/95">
                {player.id === 'dave'
                  ? 'Built the sweepstake, drafted the Creamy Creamers, and became the first manager with nobody left in the tournament. The architect of his own humiliation.'
                  : 'Every nation in this squad is out. No more points incoming — only the scoreboard and the shame.'}
              </p>
            ) : null}
            <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs text-neutral-300">
              {t.id === 'english-pyramid'
                ? player.teams.map((code) => {
                    const team = player.teamBreakdown.find((entry) => entry.code === code);
                    const divisionId = team?.flag ?? '';
                    return (
                      <span key={code} className="inline-flex items-center">
                        <DivisionBadge divisionId={divisionId} />
                        {team?.name ?? formatTeamNameShort(code)}
                      </span>
                    );
                  })
                : player.teams.map(formatTeamLabel).join(' · ')}
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-800 px-3 pb-3 pt-2 sm:px-4">
        <TeamMiniTable
          teams={player.teamBreakdown}
          scoringMatches={scoringMatches}
          matchScoringHelpers={matchScoringHelpers}
          formatTeamLabel={formatTeamLabel}
          bonusColumnLabel={bonusColumnLabel}
        />
      </div>
      {enlarged === 'manager' ? (
        <ImageLightbox
          src={managerPhotoSrc(player.managerImage)}
          label={managerLabel}
          useNativeImage
          onClose={() => setEnlarged(null)}
        />
      ) : null}
      {enlarged === 'crest' ? (
        <ImageLightbox
          src={player.clubCrest}
          label={`${managerLabel} crest`}
          aspectClass="aspect-square"
          useBackgroundImage
          onClose={() => setEnlarged(null)}
        />
      ) : null}
    </article>
  );
}

export default function WorldCupFantasy(props: Props) {
  const { themeId = 'english-pyramid', ...rest } = props;
  return (
    <SweepstakeThemeProvider themeId={themeId}>
      <WorldCupFantasyView {...rest} />
    </SweepstakeThemeProvider>
  );
}

function WorldCupFantasyView({
  onClose,
  standalone = false,
  apiPath = DEFAULT_API_PATH,
  title = DEFAULT_TITLE,
  headerImage,
  headerImageAlt = '',
  formatTeamLabel = formatPyramidTeamLabel,
  scoringRules = SCORING_RULES,
  bonusColumnLabel = 'Bonus',
  matchScoringHelpers = DEFAULT_MATCH_SCORING_HELPERS,
  noResultsMessage = 'No finished matches yet — check back once the World Cup starts.',
  resultsUpdateNote = 'Fixtures flip to In play at kick-off and refresh here every minute with live scores when available. Points appear when ESPN reports FT; the ledger still commits automatically later.',
  progressChartTitle = 'Tournament progress',
  progressChartDescription = 'Cumulative points after each recorded result — crest marks current total.',
}: Omit<Props, 'themeId'>) {
  const t = useSweepstakeTheme();
  const [data, setData] = useState<SweepstakeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { enabled: liveAlertsEnabled, setEnabled: setLiveAlertsEnabled } = useLiveGoalAlerts(
    t.id === 'english-pyramid' ? data?.matchdaySchedule : null
  );

  const load = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await fetch(apiPath, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      const payload = (await response.json()) as SweepstakeResponse;
      setData(payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load standings');
    } finally {
      if (!options?.silent) {
        setLoading(false);
      }
    }
  }, [apiPath]);

  const pullToRefreshEnabled = standalone && t.id === 'english-pyramid';
  const { scrollRef, pullDistance, refreshing, threshold } = usePullToRefresh({
    enabled: pullToRefreshEnabled,
    onRefresh: () => load({ silent: true }),
  });

  useEffect(() => {
    void load();

    const interval = window.setInterval(() => {
      void load({ silent: true });
    }, 60_000);

    return () => window.clearInterval(interval);
  }, [load]);

  return (
    <div
      className={
        standalone
          ? `fixed inset-0 z-[200] flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] ${t.c.overlayStandalone}`
          : t.c.overlayModal
      }
      style={t.cssVars as CSSProperties}
      data-sweepstake-theme={t.id}
      role={standalone ? undefined : 'dialog'}
      aria-modal={standalone ? undefined : true}
      aria-labelledby="world-cup-fantasy-title"
    >
      <div className={standalone ? t.c.panelStandalone : t.c.panel}>
        <header className={t.c.header}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {headerImage ? (
                <div className={t.c.headerImageWrap}>
                  {/* Native img keeps the wide crest centred without next/image fill quirks. */}
                  <img
                    src={headerImage}
                    alt={headerImageAlt || title}
                    className={`max-h-28 w-auto max-w-full object-contain sm:max-h-36 ${t.id === 'english-pyramid' ? 'object-center' : 'object-left'}`}
                  />
                </div>
              ) : (
                <h2 id="world-cup-fantasy-title" className="text-lg font-bold leading-tight text-white sm:text-xl">
                  {title}
                </h2>
              )}
              {headerImage ? (
                <h2 id="world-cup-fantasy-title" className="sr-only">
                  {headerImageAlt || title}
                </h2>
              ) : null}
            </div>
            {!standalone && onClose ? (
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={onClose} className={t.c.closeBtn}>
                  Close
                </button>
              </div>
            ) : null}
          </div>
        </header>

        <div ref={scrollRef} className={t.c.body}>
          {pullToRefreshEnabled ? (
            <div
              className="flex items-center justify-center overflow-hidden text-xs font-medium text-[#d4af37] transition-[height] duration-200 ease-out"
              style={{ height: refreshing ? threshold : pullDistance }}
              aria-live="polite"
              aria-busy={refreshing}
            >
              {pullDistance > 0 || refreshing ? (
                <span className="flex items-center gap-2 py-1">
                  {refreshing ? (
                    <>
                      <span
                        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#d4af37]/30 border-t-[#d4af37]"
                        aria-hidden
                      />
                      Refreshing…
                    </>
                  ) : pullDistance >= threshold ? (
                    'Release to refresh'
                  ) : (
                    'Pull to refresh'
                  )}
                </span>
              ) : null}
            </div>
          ) : null}
          {loading ? (
            <StandingsLoadingSkeleton />
          ) : error ? (
            <p className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-100">{error}</p>
          ) : data ? (
            <div className="space-y-6">
              <LatestResultsTicker
                matches={data.recentScoringMatches}
                standings={data.standings}
                matchScoringHelpers={matchScoringHelpers}
              />

              {data.sweepstakeIntro ? (
                <section className="rounded-lg border border-[#d4af37]/25 bg-[#141f38]/70 px-4 py-3">
                  <h3 className={`mb-2 ${t.c.sectionHeading}`}>How it works</h3>
                  <p className="text-sm leading-relaxed text-neutral-100">{data.sweepstakeIntro}</p>
                  {data.sweepstakeFairness ? (
                    <p className="mt-2 text-sm leading-relaxed text-neutral-300">{data.sweepstakeFairness}</p>
                  ) : null}
                </section>
              ) : null}

              <section className={t.c.roastSection}>
                <h3 className={t.c.roastHeading}>Daily roast</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-100">{data.dailyUpdate}</p>
              </section>

              <MatchdaySchedule
                schedule={data.matchdaySchedule}
                standings={data.standings}
                scoringMatches={data.allScoringMatches}
                matchScoringHelpers={matchScoringHelpers}
              />

              <section>
                <h3 className={`mb-3 ${t.c.sectionHeading}`}>Overall standings</h3>
                <OverallStandings standings={data.standings} />
                <ScoringRulesBlock rules={scoringRules} />
              </section>

              <section>
                <h3 className={`mb-1 ${t.c.sectionHeading}`}>{progressChartTitle}</h3>
                <p className="text-xs text-neutral-500">{progressChartDescription}</p>
                <StandingsProgressChart standings={data.standings} scoringMatches={data.allScoringMatches} />
              </section>

              <section>
                <h3 className={`mb-3 ${t.c.sectionHeading}`}>Player squads</h3>
                <div className="space-y-3">
                  {data.standings.map((player, index) => (
                    <PlayerSquadCard
                      key={player.id}
                      rank={index + 1}
                      player={player}
                      scoringMatches={data.allScoringMatches}
                      formatTeamLabel={formatTeamLabel}
                      matchScoringHelpers={matchScoringHelpers}
                      bonusColumnLabel={bonusColumnLabel}
                      totalPlayers={data.standings.length}
                    />
                  ))}
                </div>
              </section>

              <section>
                <h3 className={`mb-3 ${t.c.sectionHeading}`}>Recent results</h3>
                {data.recentScoringMatches.length === 0 ? (
                  <p className="text-sm text-neutral-400">{noResultsMessage}</p>
                ) : (
                  <ul className="space-y-2">
                    {data.recentScoringMatches.map(({ match, byPlayer }) => {
                      const scoringPlayers = data.standings.filter((player) => byPlayer[player.id] != null);

                      return (
                        <li key={match.id} className={t.c.recentResultItem}>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-neutral-100">
                              {match.homeTeam.tla}{' '}
                              {formatMatchScore(
                                match.homeGoals,
                                match.awayGoals,
                                match.homePenalties,
                                match.awayPenalties,
                              )}{' '}
                              {match.awayTeam.tla}
                            </span>
                            <span className="text-xs text-neutral-500">
                              {new Date(match.utcDate).toLocaleDateString('en-GB')}
                            </span>
                          </div>
                          {scoringPlayers.length > 0 ? (
                            <p className={t.c.recentResultPoints}>
                              <MatchScoringPlayersLine
                                players={data.standings}
                                byPlayer={byPlayer}
                                match={match}
                                matchScoringHelpers={matchScoringHelpers}
                              />
                            </p>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>

              <div className={t.c.footerNote}>
                <p>{resultsUpdateNote}</p>
                <p className="mt-2">
                  Finished matches tracked: <span className="text-neutral-200">{data.finishedMatchCount}</span>
                </p>
                {t.id === 'english-pyramid' ? (
                  <LiveGoalAlertsToggle
                    enabled={liveAlertsEnabled}
                    onChange={setLiveAlertsEnabled}
                  />
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
