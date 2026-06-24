'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { formatTeamLabel as formatWorldCupTeamLabel } from '@/app/data/world-cup-fantasy';
import type { WorldCupFantasyResponse } from '@/app/api/world-cup-fantasy/route';
import type { EnglishPyramidFantasyResponse } from '@/app/api/english-pyramid-fantasy/route';
import type {
  FixtureManager,
  MatchPointsEntry,
  PlayerStanding,
  TeamMatchDisplay,
  TeamStanding,
  UpcomingFixtureEntry,
} from '@/app/lib/world-cup-scoring';
import {
  buildPlayerProgressSeries,
  getTeamMatchDisplay as getWorldCupTeamMatchDisplay,
  matchInvolvesTeam as worldCupMatchInvolvesTeam,
} from '@/app/lib/world-cup-scoring';

type SweepstakeResponse = WorldCupFantasyResponse | EnglishPyramidFantasyResponse;

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
  onClose: () => void;
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
};

const DEFAULT_API_PATH = '/api/world-cup-fantasy';
const DEFAULT_TITLE = 'World Cup Sweepstake 2026';
/** Bust browser / image-optimizer cache when manager portrait files are replaced. */
const SWEEPSTAKE_MANAGER_PHOTO_VERSION = '20260623';

function managerPhotoSrc(path: string): string {
  return `${path}?v=${SWEEPSTAKE_MANAGER_PHOTO_VERSION}`;
}

const DEFAULT_MATCH_SCORING_HELPERS: MatchScoringHelpers = {
  matchInvolvesTeam: worldCupMatchInvolvesTeam,
  getTeamMatchDisplay: getWorldCupTeamMatchDisplay,
};

const SCORING_RULES = [
  '3 pts win',
  '1 pt draw',
  '+1 for 3+ goals',
  '−1 for 3+ conceded',
  '−1 per red card',
] as const;

const PROGRESS_LINE_COLORS = [
  '#2dd4bf',
  '#84cc16',
  '#38bdf8',
  '#fbbf24',
  '#f87171',
  '#c084fc',
  '#fb923c',
] as const;

const PROGRESS_CHART = {
  height: 540,
  xStep: 16,
  crestSize: 28,
  lineWidth: 3,
  yHeadroomPoints: 3,
  padding: { top: 40, right: 40, bottom: 48, left: 44 },
} as const;

function ScoringRulesBlock({ rules = SCORING_RULES }: { rules?: readonly string[] }) {
  return (
    <div className="mt-3 rounded-lg border border-neutral-700/80 bg-neutral-950/50 px-3 py-2.5 sm:px-4 sm:py-3">
      <h4 className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500 sm:text-xs">Scoring</h4>
      <ul className="mt-2 space-y-1.5 text-xs text-neutral-300 sm:text-sm">
        {rules.map((rule) => (
          <li key={rule} className="flex items-start gap-2 leading-snug">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-teal-400" aria-hidden />
            {rule}
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatMatchScore(homeGoals: number | null, awayGoals: number | null): string {
  if (homeGoals == null || awayGoals == null) return '–';
  return `${homeGoals}–${awayGoals}`;
}

function matchOutcomeLetter(goalsFor: number, goalsAgainst: number): 'W' | 'L' | 'D' {
  if (goalsFor > goalsAgainst) return 'W';
  if (goalsFor < goalsAgainst) return 'L';
  return 'D';
}

function MatchOutcomeLetter({ outcome }: { outcome: 'W' | 'L' | 'D' }) {
  const tone =
    outcome === 'W' ? 'text-lime-400' : outcome === 'L' ? 'text-red-400' : 'text-neutral-400';

  return (
    <span className={`font-semibold tabular-nums ${tone}`} aria-label={outcome === 'W' ? 'Win' : outcome === 'L' ? 'Loss' : 'Draw'}>
      {outcome}
    </span>
  );
}

function TeamMatchAdjustments({ result }: { result: TeamMatchDisplay }) {
  const items: { key: string; label: string; className: string }[] = [];

  if (result.scoringBonus && result.scoringBonus > 0) {
    items.push({
      key: 'scored',
      label: `(+${result.scoringBonus}, ${result.goalsFor} goals scored)`,
      className: 'text-lime-400',
    });
  }
  if (result.cleanSheetBonus && result.cleanSheetBonus > 0) {
    items.push({
      key: 'cs',
      label: `(+${result.cleanSheetBonus}, clean sheet)`,
      className: 'text-lime-400',
    });
  }
  if (result.concededPenalty && result.concededPenalty < 0) {
    items.push({
      key: 'conc',
      label: `(${result.concededPenalty}, ${result.goalsAgainst} goals conceded)`,
      className: 'text-red-300',
    });
  }
  if (result.redCards > 0) {
    const penalty = -result.redCards;
    items.push({
      key: 'red',
      label: `(${penalty}, ${result.redCards === 1 ? 'red card' : 'red cards'})`,
      className: 'text-red-300',
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
    if (display) return matchOutcomeLetter(display.goalsFor, display.goalsAgainst);
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
            {playerDisplayLabel(player)}{' '}
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

function RedCardTally({ count }: { count: number }) {
  return (
    <span className="text-red-300">
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
          <span>{fixtureManagerLabel(manager)}</span>
        </span>
      ))}
    </>
  );
}

function UpcomingFixtures({ fixtures }: { fixtures: UpcomingFixtureEntry[] }) {
  return (
    <section className="rounded-lg border border-sky-800/60 bg-sky-950/20 px-3 py-2.5 sm:px-4 sm:py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-200">Upcoming sweepstake fixtures</h3>
        <span className="text-[10px] text-sky-300/80 sm:text-xs">Kickoffs in GMT</span>
      </div>

      {fixtures.length === 0 ? (
        <p className="mt-2 text-sm text-neutral-300">No upcoming sweepstake fixtures scheduled yet.</p>
      ) : (
        <ul className="mt-2 divide-y divide-sky-900/40 rounded-md border border-sky-900/50 bg-neutral-950/40">
          {fixtures.map((fixture) => (
            <li key={fixture.id} className="px-3 py-2">
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                <time
                  dateTime={fixture.utcDate}
                  className="shrink-0 text-xs font-semibold tabular-nums leading-snug text-sky-200 sm:w-[8.75rem]"
                >
                  {formatFixtureKickoff(fixture.utcDate)}
                </time>
                <p className="min-w-0 flex-1 text-sm leading-snug text-neutral-100">
                  <span className="font-medium">
                    {fixture.homeTeam.flag} {fixture.homeTeam.name}
                  </span>
                  <span className="text-neutral-600"> · </span>
                  <span className="text-xs text-neutral-400">
                    <FixtureTeamManagers managers={fixture.homeManagers} />
                  </span>
                  <span className="mx-1.5 text-neutral-600">v</span>
                  <span className="font-medium">
                    {fixture.awayTeam.flag} {fixture.awayTeam.name}
                  </span>
                  <span className="text-neutral-600"> · </span>
                  <span className="text-xs text-neutral-400">
                    <FixtureTeamManagers managers={fixture.awayManagers} />
                  </span>
                </p>
              </div>
            </li>
          ))}
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
        className="min-w-[17rem] shrink-0 rounded-lg border border-lime-500/35 bg-neutral-950 px-3 py-2 shadow-[0_0_18px_rgba(132,204,22,0.14)] md:min-w-[21rem] xl:min-w-[24rem]"
      >
        <div className="flex items-center justify-between gap-3 text-[9px] font-semibold uppercase tracking-[0.26em] text-lime-500/80">
          <span>Latest result</span>
          <span className="tabular-nums">{formatResultTickerDate(match.utcDate)}</span>
        </div>
        <div className="mt-1 rounded-md border border-lime-900/80 bg-black px-3 py-2 [background-image:radial-gradient(rgba(132,204,22,0.16)_1px,transparent_1px)] [background-size:4px_4px]">
          <div className="flex items-center justify-center gap-2 font-mono text-lg font-bold tracking-[0.16em] text-lime-300 [text-shadow:0_0_12px_rgba(132,204,22,0.9)] sm:text-xl xl:text-2xl">
            <span>{match.homeTeam.tla}</span>
            <span className="rounded border border-lime-500/40 bg-lime-400/10 px-2 tabular-nums">
              {formatMatchScore(match.homeGoals, match.awayGoals)}
            </span>
            <span>{match.awayTeam.tla}</span>
          </div>
        </div>
        {scoringPlayers.length > 0 ? (
          <p className="mt-1.5 truncate text-center text-[11px] font-medium text-teal-200 sm:text-xs">
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

      <div className="hidden overflow-hidden rounded-xl border border-lime-400/40 bg-neutral-950 px-3 py-3 shadow-[0_0_26px_rgba(132,204,22,0.18)] motion-reduce:overflow-x-auto sm:block lg:px-4">
        <div className="mb-2 flex items-center justify-between gap-3 px-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-lime-500/80">
          <span>Latest results</span>
          <span className="hidden text-lime-300/70 md:inline">Continuous feed</span>
        </div>
        <div className="relative overflow-hidden rounded-lg border border-lime-900/60 bg-black/75 py-2 motion-reduce:overflow-x-auto">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-black to-transparent motion-reduce:hidden"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-black to-transparent motion-reduce:hidden"
            aria-hidden
          />
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

function PlayerIdentity({
  player,
  heading = false,
}: {
  player: Pick<PlayerStanding, 'name' | 'teamName'>;
  heading?: boolean;
}) {
  if (player.teamName) {
    const Tag = heading ? 'h4' : 'span';
    return (
      <span className="block min-w-0">
        <Tag className={heading ? 'text-base font-semibold text-white' : 'block font-medium text-white'}>
          {player.teamName}
        </Tag>
        <span className="block text-xs text-neutral-400">{player.name}</span>
      </span>
    );
  }

  if (heading) {
    return <h4 className="text-base font-semibold text-white">{player.name}</h4>;
  }

  return <span className="font-medium text-white">{player.name}</span>;
}

function progressLineColor(index: number): string {
  return PROGRESS_LINE_COLORS[index % PROGRESS_LINE_COLORS.length];
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
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const finishedMatchCount = scoringMatches.length;

  if (finishedMatchCount === 0) {
    return (
      <p className="mt-2 text-sm text-neutral-400">Progress chart fills in once the first results are recorded.</p>
    );
  }

  const series = buildPlayerProgressSeries(standings, scoringMatches);
  const pointCount = series[0]?.points.length ?? 0;
  const { height, xStep, crestSize, lineWidth, yHeadroomPoints, padding } = PROGRESS_CHART;
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
    <div className="mt-3 space-y-3">
      <div className="overflow-x-auto overflow-y-visible rounded-lg border border-neutral-700/80 bg-neutral-950/50">
        <svg
          role="img"
          aria-label="Cumulative fantasy points by manager across the tournament"
          viewBox={`0 0 ${chartWidth} ${height}`}
          className="block min-w-full"
          style={{ width: chartWidth, height, minHeight: height, minWidth: '100%' }}
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
            const color = progressLineColor(seriesIndex);
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
                      <tspan className="fill-teal-300" dx={6}>
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
              <li key={row.playerId} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleSelectedPlayer(row.playerId)}
                  className={`inline-flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-neutral-900 transition hover:scale-105 ${
                    selectedPlayerId === row.playerId ? 'border-teal-400 ring-2 ring-teal-500/40' : 'border-neutral-700'
                  }`}
                  style={{ boxShadow: `0 0 0 1px ${progressLineColor(colorIndex)}` }}
                  aria-label={standing ? progressTeamLabel(standing) : row.label}
                  aria-pressed={selectedPlayerId === row.playerId}
                >
                  <img src={row.crest} alt="" className="max-h-full max-w-full object-contain p-0.5" />
                </button>
                <span className="font-medium text-white">{standing ? progressTeamLabel(standing) : row.label}</span>
                <span className="tabular-nums text-teal-300">{row.currentTotal} pts</span>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

function OverallStandings({ standings }: { standings: PlayerStanding[] }) {
  return (
    <>
      <div className="overflow-hidden rounded-lg border border-neutral-700 sm:hidden">
        <div className="grid grid-cols-[1.25rem_minmax(0,1fr)_auto_auto_auto_auto] items-center gap-x-2 border-b border-neutral-800 bg-neutral-950 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-neutral-500">
          <span>#</span>
          <span>Club</span>
          <span className="text-right">Form</span>
          <span className="w-7 text-right">Red</span>
          <span className="w-8 text-right">GD</span>
          <span className="w-7 text-right">Pts</span>
        </div>
        <ul className="divide-y divide-neutral-800">
          {standings.map((row, index) => (
            <li
              key={row.id}
              className={`grid grid-cols-[1.25rem_minmax(0,1fr)_auto_auto_auto_auto] items-center gap-x-2 px-2 py-1 ${
                index === 0 ? 'bg-teal-950/20' : 'bg-neutral-950/40'
              }`}
            >
              <span className="text-[11px] tabular-nums text-neutral-400">{index + 1}</span>
              <span className="truncate text-xs font-medium text-white">
                {playerDisplayLabel(row)}
              </span>
              <span className="shrink-0 text-[10px] tabular-nums text-neutral-500">
                P{row.playedMatches} W{row.wins} D{row.draws} L{row.losses}
              </span>
              <span className="w-7 shrink-0 text-right text-xs tabular-nums text-red-300">
                {row.redCards}
              </span>
              <span className="w-8 shrink-0 text-right text-xs tabular-nums text-neutral-200">
                {formatGoalDifference(row.goalDifference)}
              </span>
              <span className="w-7 shrink-0 text-right text-xs font-bold tabular-nums text-teal-300">
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
              <tr key={row.id} className={index === 0 ? 'bg-teal-950/20' : undefined}>
                <td className="px-3 py-2 text-neutral-400">{index + 1}</td>
                <td className="px-3 py-2 font-medium">
                  <PlayerIdentity player={row} />
                </td>
                <td className="px-3 py-2 text-neutral-300">{row.teamCount} teams</td>
                <td className="px-3 py-2 text-right tabular-nums">{row.playedMatches}</td>
                <td className="px-3 py-2 text-right tabular-nums">{row.wins}</td>
                <td className="px-3 py-2 text-right tabular-nums">{row.draws}</td>
                <td className="px-3 py-2 text-right tabular-nums">{row.losses}</td>
                <td className="px-3 py-2 text-right tabular-nums">{row.bonusPoints}</td>
                <td className="px-3 py-2 text-right tabular-nums">{formatGoalDifference(row.goalDifference)}</td>
                <td className="px-3 py-2 text-right tabular-nums text-red-300">{row.redCards}</td>
                <td className="px-3 py-2 text-right font-semibold tabular-nums">{row.points}</td>
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

function TeamResultsPanel({
  team,
  results,
  formatTeamLabel,
}: {
  team: TeamStanding;
  results: TeamMatchDisplay[];
  formatTeamLabel?: (code: string) => string;
}) {
  const teamLabel = formatTeamLabel ? formatTeamLabel(team.code) : `${team.flag} ${team.name}`;

  return (
    <div
      className="rounded-md border border-teal-800/50 bg-neutral-950/80 px-3 py-2"
      role="region"
      aria-label={`${team.name} results`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-teal-300/90">
        {teamLabel} results
      </p>
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
                {result.opponentFlag} {result.opponentTla}{' '}
                <span className="font-medium tabular-nums">
                  {result.goalsFor}–{result.goalsAgainst}
                </span>{' '}
                <MatchOutcomeLetter outcome={matchOutcomeLetter(result.goalsFor, result.goalsAgainst)} />
                <TeamMatchAdjustments result={result} />
              </span>
              <span className="shrink-0 font-semibold tabular-nums text-teal-300">
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

                return (
                  <tr
                    key={team.code}
                    className={`transition-colors ${
                      isHighlighted ? 'bg-teal-950/25' : 'hover:bg-neutral-900/50'
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
                        className="-mx-1 rounded px-1 text-left transition hover:text-teal-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                      >
                        {formatTeamLabel ? formatTeamLabel(team.code) : `${team.flag} ${team.name}`}
                      </button>
                    </td>
                    <td className="px-2 py-1.5 text-right tabular-nums sm:px-3">{team.playedMatches}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums sm:px-3">{team.wins}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums sm:px-3">{team.draws}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums sm:px-3">{team.losses}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums sm:px-3">{team.bonusPoints}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums sm:px-3">
                      {formatGoalDifference(team.goalDifference)}
                    </td>
                    <td className="px-2 py-1.5 text-right tabular-nums text-red-300 sm:px-3">{team.redCards}</td>
                    <td className="px-2 py-1.5 text-right font-semibold tabular-nums sm:px-3">{team.points}</td>
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
}: {
  src: string;
  label: string;
  onClose: () => void;
  aspectClass?: string;
  imageClassName?: string;
  useNativeImage?: boolean;
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
          className={`relative ${aspectClass} max-h-[calc(100dvh-7rem)] w-full overflow-hidden rounded-xl border border-neutral-600 bg-neutral-950 ${
            useNativeImage ? 'flex items-center justify-center' : ''
          }`}
        >
          {useNativeImage ? (
            <img
              src={src}
              alt={label}
              className={`max-h-[calc(100dvh-7rem)] max-w-full object-contain ${imageClassName}`}
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

function PlayerSquadCard({
  rank,
  player,
  scoringMatches,
  formatTeamLabel,
  matchScoringHelpers,
  bonusColumnLabel,
}: {
  rank: number;
  player: PlayerStanding;
  scoringMatches: MatchPointsEntry[];
  formatTeamLabel: (code: string) => string;
  matchScoringHelpers: MatchScoringHelpers;
  bonusColumnLabel?: string;
}) {
  const managerLabel = player.teamName ?? player.name;
  const [enlarged, setEnlarged] = useState<'manager' | 'crest' | null>(null);

  return (
    <article className="rounded-lg border border-neutral-700 bg-neutral-950/40">
      <div className="px-4 py-3">
        <div className="space-y-3">
          <div className="grid w-full grid-cols-2 gap-2 sm:mx-auto sm:w-fit sm:gap-3">
            <button
              type="button"
              onClick={() => setEnlarged('manager')}
              className="relative flex aspect-square w-full min-w-0 cursor-zoom-in items-center justify-center overflow-hidden rounded-lg border border-neutral-700/80 bg-neutral-900 transition hover:border-teal-600/60 hover:ring-2 hover:ring-teal-600/30 sm:size-32 md:size-36"
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
              className="flex aspect-square w-full min-w-0 cursor-zoom-in items-center justify-center overflow-hidden rounded-lg border border-neutral-700/80 bg-neutral-900 p-2.5 transition hover:border-teal-600/60 hover:ring-2 hover:ring-teal-600/30 sm:size-32 sm:p-3 md:size-36"
              aria-label={`View enlarged ${managerLabel} club crest`}
            >
              {/* Native img keeps circular crests centred in the tile on desktop. */}
              <img
                src={player.clubCrest}
                alt=""
                className="max-h-full max-w-full object-contain"
              />
            </button>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold text-teal-300">
                {rank}
              </span>
              <PlayerIdentity player={player} heading />
              <span className="text-sm font-semibold tabular-nums text-teal-300">{player.points} pts</span>
              <span className="text-xs font-medium tabular-nums text-neutral-300">
                GD {formatGoalDifference(player.goalDifference)}
              </span>
              <span className="text-xs text-neutral-500">
                {player.teamCount} teams ·{' '}
                <FormSummary
                  wins={player.wins}
                  draws={player.draws}
                  losses={player.losses}
                  redCards={player.redCards}
                />
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-neutral-400 sm:text-sm">{player.draftNote}</p>
            <p className="mt-2 text-xs text-neutral-300">{player.teams.map(formatTeamLabel).join(' · ')}</p>
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
          imageClassName="p-3 sm:p-4"
          onClose={() => setEnlarged(null)}
        />
      ) : null}
    </article>
  );
}

export default function WorldCupFantasy({
  onClose,
  apiPath = DEFAULT_API_PATH,
  title = DEFAULT_TITLE,
  headerImage,
  headerImageAlt = '',
  formatTeamLabel = formatWorldCupTeamLabel,
  scoringRules = SCORING_RULES,
  bonusColumnLabel = 'Bonus',
  matchScoringHelpers = DEFAULT_MATCH_SCORING_HELPERS,
  noResultsMessage = 'No finished matches yet — check back once the World Cup starts.',
  resultsUpdateNote = 'Scores are updated manually after full-time. Previous results stay recorded, so only newly finished matches need adding.',
  progressChartTitle = 'Tournament progress',
  progressChartDescription = 'Cumulative points after each recorded result — crest marks current total.',
}: Props) {
  const [data, setData] = useState<SweepstakeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiPath, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      const payload = (await response.json()) as SweepstakeResponse;
      setData(payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load standings');
    } finally {
      setLoading(false);
    }
  }, [apiPath]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/95 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="world-cup-fantasy-title"
    >
      <div className="flex max-h-[96dvh] w-full max-w-7xl flex-col overflow-hidden rounded-xl border border-neutral-600 bg-neutral-900 shadow-2xl">
        <header className="shrink-0 border-b border-neutral-700 px-4 py-4 sm:px-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {headerImage ? (
                <div className="flex max-h-28 items-center sm:max-h-36">
                  {/* Native img keeps the wide crest centred without next/image fill quirks. */}
                  <img
                    src={headerImage}
                    alt={headerImageAlt || title}
                    className="max-h-28 w-auto max-w-full object-contain object-left sm:max-h-36"
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
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-white/25 bg-neutral-950/75 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-900/90 sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          {loading ? (
            <p className="text-sm text-neutral-400">Loading standings…</p>
          ) : error ? (
            <p className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-100">{error}</p>
          ) : data ? (
            <div className="space-y-6">
              <LatestResultsTicker
                matches={data.recentScoringMatches}
                standings={data.standings}
                matchScoringHelpers={matchScoringHelpers}
              />

              <section className="rounded-lg border border-amber-800/60 bg-amber-950/20 px-4 py-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-200">Daily roast</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-100">{data.dailyUpdate}</p>
              </section>

              <UpcomingFixtures fixtures={data.upcomingFixtures} />

              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal-300">Overall standings</h3>
                <OverallStandings standings={data.standings} />
                <ScoringRulesBlock rules={scoringRules} />
              </section>

              <section>
                <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-teal-300">{progressChartTitle}</h3>
                <p className="text-xs text-neutral-500">{progressChartDescription}</p>
                <StandingsProgressChart standings={data.standings} scoringMatches={data.allScoringMatches} />
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal-300">Player squads</h3>
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
                    />
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal-300">Recent results</h3>
                {data.recentScoringMatches.length === 0 ? (
                  <p className="text-sm text-neutral-400">{noResultsMessage}</p>
                ) : (
                  <ul className="space-y-2">
                    {data.recentScoringMatches.map(({ match, byPlayer }) => {
                      const scoringPlayers = data.standings.filter((player) => byPlayer[player.id] != null);

                      return (
                        <li
                          key={match.id}
                          className="rounded-lg border border-neutral-700 bg-neutral-950/40 px-3 py-2 text-sm"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-neutral-100">
                              {match.homeTeam.tla} {formatMatchScore(match.homeGoals, match.awayGoals)}{' '}
                              {match.awayTeam.tla}
                            </span>
                            <span className="text-xs text-neutral-500">
                              {new Date(match.utcDate).toLocaleDateString('en-GB')}
                            </span>
                          </div>
                          {scoringPlayers.length > 0 ? (
                            <p className="mt-1 text-xs text-teal-300">
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

              <div className="rounded-lg border border-neutral-700 bg-neutral-950/50 px-4 py-3 text-xs text-neutral-400 sm:text-sm">
                <p>{resultsUpdateNote}</p>
                <p className="mt-2">
                  Finished matches tracked: <span className="text-neutral-200">{data.finishedMatchCount}</span>
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
