'use client';

import Image from 'next/image';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { formatTeamLabel } from '@/app/data/world-cup-fantasy';
import type { WorldCupFantasyResponse } from '@/app/api/world-cup-fantasy/route';
import type {
  FixtureManager,
  MatchPointsEntry,
  PlayerStanding,
  TeamMatchDisplay,
  TeamStanding,
  UpcomingFixtureEntry,
} from '@/app/lib/world-cup-scoring';
import { getTeamMatchDisplay, matchInvolvesTeam } from '@/app/lib/world-cup-scoring';

type Props = {
  onClose: () => void;
};

const SCORING_RULES = [
  '3 pts win',
  '1 pt draw',
  '+1 for 3+ goals',
  '−1 for 3+ conceded',
  '−1 per red card',
] as const;

function ScoringRulesBlock() {
  return (
    <div className="mt-3 rounded-lg border border-neutral-700/80 bg-neutral-950/50 px-3 py-2.5 sm:px-4 sm:py-3">
      <h4 className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500 sm:text-xs">Scoring</h4>
      <ul className="mt-2 space-y-1.5 text-xs text-neutral-300 sm:text-sm">
        {SCORING_RULES.map((rule) => (
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

function FixtureTeamBlock({
  team,
  managers,
  align = 'left',
}: {
  team: UpcomingFixtureEntry['homeTeam'];
  managers: FixtureManager[];
  align?: 'left' | 'right';
}) {
  return (
    <div
      className={`rounded-md border border-sky-900/50 bg-neutral-950/40 px-3 py-2 ${
        align === 'right' ? 'md:text-right' : ''
      }`}
    >
      <p className="text-sm font-medium leading-snug text-neutral-100">
        {team.flag} {team.name}
      </p>
      <p className="mt-1 text-xs leading-snug text-neutral-300">
        <FixtureTeamManagers managers={managers} />
      </p>
    </div>
  );
}

function UpcomingFixtures({ fixtures }: { fixtures: UpcomingFixtureEntry[] }) {
  return (
    <section className="rounded-lg border border-sky-800/60 bg-sky-950/20 px-4 py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-200">Upcoming sweepstake fixtures</h3>
        <span className="text-xs text-sky-300/80">Kickoff times shown in GMT</span>
      </div>

      {fixtures.length === 0 ? (
        <p className="mt-2 text-sm text-neutral-300">No upcoming sweepstake fixtures scheduled yet.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {fixtures.map((fixture) => (
            <li key={fixture.id} className="rounded-lg border border-sky-900/60 bg-neutral-950/40 px-3 py-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm md:grid md:grid-cols-[minmax(8rem,0.85fr)_minmax(0,2.4fr)] md:gap-4">
                <span className="font-semibold tabular-nums text-sky-200">{formatFixtureKickoff(fixture.utcDate)}</span>
                <span className="text-neutral-100 md:hidden">
                  {fixture.homeTeam.flag} {fixture.homeTeam.name}{' '}
                  <span className="text-neutral-500">vs</span> {fixture.awayTeam.flag} {fixture.awayTeam.name}
                </span>
                <div className="hidden min-w-0 items-stretch gap-3 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center">
                  <FixtureTeamBlock team={fixture.homeTeam} managers={fixture.homeManagers} />
                  <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">vs</span>
                  <FixtureTeamBlock team={fixture.awayTeam} managers={fixture.awayManagers} align="right" />
                </div>
              </div>
              <div className="mt-2 grid gap-1.5 text-xs text-neutral-300 sm:grid-cols-2 md:hidden">
                <p>
                  <span className="font-medium text-neutral-100">{fixture.homeTeam.tla}</span>{' '}
                  <FixtureTeamManagers managers={fixture.homeManagers} />
                </p>
                <p>
                  <span className="font-medium text-neutral-100">{fixture.awayTeam.tla}</span>{' '}
                  <FixtureTeamManagers managers={fixture.awayManagers} />
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
}: {
  matches: MatchPointsEntry[];
  standings: PlayerStanding[];
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
    const scorers = standings
      .filter((player) => byPlayer[player.id] != null)
      .map((player) => {
        const points = byPlayer[player.id]!;
        return `${playerDisplayLabel(player)} ${points >= 0 ? '+' : ''}${points}`;
      })
      .join(' · ');

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
        {scorers ? (
          <p className="mt-1.5 truncate text-center text-[11px] font-medium text-teal-200 sm:text-xs">{scorers}</p>
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

function teamMatchDisplaysForTeam(teamCode: string, matches: MatchPointsEntry[]): TeamMatchDisplay[] {
  return matches
    .filter(({ match }) => matchInvolvesTeam(match, teamCode))
    .map(({ match }) => getTeamMatchDisplay(match, teamCode))
    .filter((entry): entry is TeamMatchDisplay => entry != null)
    .sort((a, b) => b.utcDate.localeCompare(a.utcDate));
}

function TeamResultsPanel({
  team,
  results,
  layout,
}: {
  team: TeamStanding;
  results: TeamMatchDisplay[];
  layout: 'inline' | 'popover';
}) {
  return (
    <div
      className={
        layout === 'popover'
          ? 'absolute left-0 top-full z-30 mt-1 w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-teal-700/60 bg-neutral-950 px-3 py-2 shadow-xl'
          : 'rounded-md border border-teal-800/50 bg-neutral-950/80 px-3 py-2'
      }
      role="region"
      aria-label={`${team.name} results`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-teal-300/90">
        {team.flag} {team.name} results
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
                </span>
                {result.redCards > 0 ? (
                  <span className="ml-1 text-red-300">({result.redCards} red)</span>
                ) : null}
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

function TeamMiniTable({
  teams,
  scoringMatches,
}: {
  teams: TeamStanding[];
  scoringMatches: MatchPointsEntry[];
}) {
  const [pinnedTeamCode, setPinnedTeamCode] = useState<string | null>(null);
  const [hoverTeamCode, setHoverTeamCode] = useState<string | null>(null);

  const toggleTeam = (teamCode: string) => {
    setPinnedTeamCode((current) => (current === teamCode ? null : teamCode));
  };

  return (
    <div className="overflow-x-auto rounded-md border border-neutral-700/80">
      <p className="border-b border-neutral-800 bg-neutral-950/80 px-2 py-1.5 text-[10px] text-neutral-500 sm:px-3">
        <span className="hidden sm:inline">Hover a team for results · </span>
        Tap a team for results
      </p>
      <table className="min-w-full text-left text-xs sm:text-sm">
        <thead className="bg-neutral-950/80 text-neutral-400">
          <tr>
            <th className="px-2 py-1.5 font-medium sm:px-3">Team</th>
            <th className="px-2 py-1.5 font-medium text-right sm:px-3">Pld</th>
            <th className="px-2 py-1.5 font-medium text-right sm:px-3">W</th>
            <th className="px-2 py-1.5 font-medium text-right sm:px-3">D</th>
            <th className="px-2 py-1.5 font-medium text-right sm:px-3">L</th>
            <th className="px-2 py-1.5 font-medium text-right sm:px-3">Bonus</th>
            <th className="px-2 py-1.5 font-medium text-right sm:px-3">GD</th>
            <th className="px-2 py-1.5 font-medium text-right sm:px-3">Red</th>
            <th className="px-2 py-1.5 font-medium text-right sm:px-3">Pts</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800 text-neutral-100">
          {teams.map((team) => {
            const results = teamMatchDisplaysForTeam(team.code, scoringMatches);
            const isPinned = pinnedTeamCode === team.code;
            const isHovered = hoverTeamCode === team.code;
            const showInline = isPinned;
            const showPopover = isHovered && !isPinned;

            return (
              <Fragment key={team.code}>
                <tr
                  className={`relative transition-colors ${
                    isPinned || isHovered ? 'bg-teal-950/25' : 'hover:bg-neutral-900/50'
                  }`}
                  onMouseEnter={() => setHoverTeamCode(team.code)}
                  onMouseLeave={() => setHoverTeamCode((current) => (current === team.code ? null : current))}
                >
                  <td className="relative px-2 py-1.5 sm:px-3">
                    <button
                      type="button"
                      onClick={() => toggleTeam(team.code)}
                      aria-expanded={isPinned}
                      aria-controls={`team-results-${team.code}`}
                      className="-mx-1 rounded px-1 text-left transition hover:text-teal-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
                    >
                      {team.flag} {team.name}
                    </button>
                    {showPopover ? (
                      <TeamResultsPanel team={team} results={results} layout="popover" />
                    ) : null}
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
                {showInline ? (
                  <tr id={`team-results-${team.code}`}>
                    <td colSpan={9} className="px-2 pb-2 pt-0 sm:px-3">
                      <TeamResultsPanel team={team} results={results} layout="inline" />
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ImageLightbox({
  src,
  label,
  onClose,
  aspectClass = 'aspect-[3/4]',
}: {
  src: string;
  label: string;
  onClose: () => void;
  aspectClass?: string;
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
          className={`relative ${aspectClass} max-h-[80dvh] w-full overflow-hidden rounded-xl border border-neutral-600 bg-neutral-950`}
        >
          <Image src={src} alt={label} fill sizes="(max-width: 640px) 320px, 384px" className="object-contain" />
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
}: {
  rank: number;
  player: PlayerStanding;
  scoringMatches: MatchPointsEntry[];
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
              className="relative aspect-square w-full min-w-0 cursor-zoom-in overflow-hidden rounded-lg border border-neutral-700/80 bg-neutral-900 transition hover:border-teal-600/60 hover:ring-2 hover:ring-teal-600/30 sm:size-32 md:size-36"
              aria-label={`View enlarged photo of ${managerLabel}`}
            >
              <Image
                src={player.managerImage}
                alt={`${managerLabel} manager`}
                fill
                sizes="(max-width: 640px) 45vw, 144px"
                className="object-cover object-center"
              />
            </button>
            <button
              type="button"
              onClick={() => setEnlarged('crest')}
              className="flex aspect-square w-full min-w-0 cursor-zoom-in items-center justify-center overflow-hidden rounded-lg border border-neutral-700/80 bg-neutral-900 p-1.5 transition hover:border-teal-600/60 hover:ring-2 hover:ring-teal-600/30 sm:size-32 sm:p-2 md:size-36"
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
        <TeamMiniTable teams={player.teamBreakdown} scoringMatches={scoringMatches} />
      </div>
      {enlarged === 'manager' ? (
        <ImageLightbox
          src={player.managerImage}
          label={managerLabel}
          onClose={() => setEnlarged(null)}
        />
      ) : null}
      {enlarged === 'crest' ? (
        <ImageLightbox
          src={player.clubCrest}
          label={`${managerLabel} crest`}
          aspectClass="aspect-square"
          onClose={() => setEnlarged(null)}
        />
      ) : null}
    </article>
  );
}

export default function WorldCupFantasy({ onClose }: Props) {
  const [data, setData] = useState<WorldCupFantasyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/world-cup-fantasy', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      const payload = (await response.json()) as WorldCupFantasyResponse;
      setData(payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load standings');
    } finally {
      setLoading(false);
    }
  }, []);

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
            <h2 id="world-cup-fantasy-title" className="min-w-0 text-lg font-bold leading-tight text-white sm:text-xl">
              World Cup Sweepstake 2026
            </h2>
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
              <LatestResultsTicker matches={data.recentScoringMatches} standings={data.standings} />

              <section className="rounded-lg border border-amber-800/60 bg-amber-950/20 px-4 py-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-200">Daily roast</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-100">{data.dailyUpdate}</p>
              </section>

              <UpcomingFixtures fixtures={data.upcomingFixtures} />

              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal-300">Overall standings</h3>
                <OverallStandings standings={data.standings} />
                <ScoringRulesBlock />
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
                    />
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal-300">Recent results</h3>
                {data.recentScoringMatches.length === 0 ? (
                  <p className="text-sm text-neutral-400">No finished matches yet — check back once the World Cup starts.</p>
                ) : (
                  <ul className="space-y-2">
                    {data.recentScoringMatches.map(({ match, byPlayer }) => {
                      const scorers = data.standings
                        .filter((player) => byPlayer[player.id] != null)
                        .map(
                          (player) =>
                            `${playerDisplayLabel(player)} ${byPlayer[player.id]! >= 0 ? '+' : ''}${byPlayer[player.id]}`
                        )
                        .join(' · ');

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
                          {scorers ? <p className="mt-1 text-xs text-teal-300">{scorers}</p> : null}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>

              <div className="rounded-lg border border-neutral-700 bg-neutral-950/50 px-4 py-3 text-xs text-neutral-400 sm:text-sm">
                <p>
                  Scores are updated manually after full-time. Previous results stay recorded, so only newly finished
                  matches need adding.
                </p>
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
