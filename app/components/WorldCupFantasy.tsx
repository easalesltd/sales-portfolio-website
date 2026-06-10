'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { formatTeamLabel } from '@/app/data/world-cup-fantasy';
import type { WorldCupFantasyResponse } from '@/app/api/world-cup-fantasy/route';
import type { PlayerStanding, TeamStanding } from '@/app/lib/world-cup-scoring';

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

function formatSyncedAt(timestamp: number | null): string {
  if (timestamp == null) return 'Not synced yet';
  return new Date(timestamp).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function formatMatchScore(homeGoals: number | null, awayGoals: number | null): string {
  if (homeGoals == null || awayGoals == null) return '–';
  return `${homeGoals}–${awayGoals}`;
}

function playerDisplayLabel(player: Pick<PlayerStanding, 'name' | 'teamName'>): string {
  return player.teamName ?? player.name;
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
      <ul className="space-y-2 sm:hidden">
        {standings.map((row, index) => {
          const extras = [
            `W${row.wins}`,
            `D${row.draws}`,
            `L${row.losses}`,
            row.bonusPoints !== 0 ? `Bonus ${row.bonusPoints > 0 ? '+' : ''}${row.bonusPoints}` : null,
            row.redCards > 0 ? `Reds −${row.redCards}` : null,
          ]
            .filter(Boolean)
            .join(' · ');

          return (
            <li
              key={row.id}
              className={`rounded-lg border px-3 py-2.5 ${
                index === 0
                  ? 'border-teal-900/40 bg-teal-950/20'
                  : 'border-neutral-700 bg-neutral-950/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-2">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold text-teal-300">
                    {index + 1}
                  </span>
                  <PlayerIdentity player={row} heading />
                </div>
                <span className="shrink-0 text-base font-bold tabular-nums text-teal-300">{row.points} pts</span>
              </div>
              <p className="mt-1.5 pl-8 text-xs text-neutral-500">{extras}</p>
            </li>
          );
        })}
      </ul>

      <div className="hidden overflow-x-auto rounded-lg border border-neutral-700 sm:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-neutral-950 text-neutral-400">
            <tr>
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium">Player</th>
              <th className="px-3 py-2 font-medium">Teams</th>
              <th className="px-3 py-2 font-medium text-right">W</th>
              <th className="px-3 py-2 font-medium text-right">D</th>
              <th className="px-3 py-2 font-medium text-right">L</th>
              <th className="px-3 py-2 font-medium text-right">Bonus</th>
              <th className="px-3 py-2 font-medium text-right">Reds</th>
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
                <td className="px-3 py-2 text-right tabular-nums">{row.wins}</td>
                <td className="px-3 py-2 text-right tabular-nums">{row.draws}</td>
                <td className="px-3 py-2 text-right tabular-nums">{row.losses}</td>
                <td className="px-3 py-2 text-right tabular-nums">{row.bonusPoints}</td>
                <td className="px-3 py-2 text-right tabular-nums text-red-300">
                  {row.redCards > 0 ? `−${row.redCards}` : '0'}
                </td>
                <td className="px-3 py-2 text-right font-semibold tabular-nums">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function TeamMiniTable({ teams }: { teams: TeamStanding[] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-neutral-700/80">
      <table className="min-w-full text-left text-xs sm:text-sm">
        <thead className="bg-neutral-950/80 text-neutral-400">
          <tr>
            <th className="px-2 py-1.5 font-medium sm:px-3">Team</th>
            <th className="px-2 py-1.5 font-medium text-right sm:px-3">Pld</th>
            <th className="px-2 py-1.5 font-medium text-right sm:px-3">W</th>
            <th className="px-2 py-1.5 font-medium text-right sm:px-3">D</th>
            <th className="px-2 py-1.5 font-medium text-right sm:px-3">L</th>
            <th className="px-2 py-1.5 font-medium text-right sm:px-3">Bonus</th>
            <th className="px-2 py-1.5 font-medium text-right sm:px-3">Red</th>
            <th className="px-2 py-1.5 font-medium text-right sm:px-3">Pts</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800 text-neutral-100">
          {teams.map((team) => (
            <tr key={team.code}>
              <td className="px-2 py-1.5 sm:px-3">
                {team.flag} {team.name}
              </td>
              <td className="px-2 py-1.5 text-right tabular-nums sm:px-3">{team.playedMatches}</td>
              <td className="px-2 py-1.5 text-right tabular-nums sm:px-3">{team.wins}</td>
              <td className="px-2 py-1.5 text-right tabular-nums sm:px-3">{team.draws}</td>
              <td className="px-2 py-1.5 text-right tabular-nums sm:px-3">{team.losses}</td>
              <td className="px-2 py-1.5 text-right tabular-nums sm:px-3">{team.bonusPoints}</td>
              <td className="px-2 py-1.5 text-right tabular-nums text-red-300 sm:px-3">
                {team.redCards > 0 ? `−${team.redCards}` : '0'}
              </td>
              <td className="px-2 py-1.5 text-right font-semibold tabular-nums sm:px-3">{team.points}</td>
            </tr>
          ))}
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

function PlayerSquadCard({ rank, player }: { rank: number; player: PlayerStanding }) {
  const managerLabel = player.teamName ?? player.name;
  const [enlarged, setEnlarged] = useState<'manager' | 'crest' | null>(null);

  return (
    <article className="rounded-lg border border-neutral-700 bg-neutral-950/40">
      <div className="px-4 py-3">
        <div className="flex gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setEnlarged('manager')}
            className="relative w-[4.5rem] min-h-28 shrink-0 cursor-zoom-in self-stretch overflow-hidden rounded-lg border border-neutral-700/80 bg-neutral-900 transition hover:border-teal-600/60 hover:ring-2 hover:ring-teal-600/30 sm:w-24 sm:min-h-32"
            aria-label={`View enlarged photo of ${managerLabel}`}
          >
            <Image
              src={player.managerImage}
              alt={`${managerLabel} manager`}
              fill
              sizes="(max-width: 640px) 72px, 96px"
              className="object-cover object-center"
            />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold text-teal-300">
                {rank}
              </span>
              <PlayerIdentity player={player} heading />
              <span className="text-sm font-semibold tabular-nums text-teal-300">{player.points} pts</span>
              <span className="text-xs text-neutral-500">
                {player.teamCount} teams · W{player.wins} D{player.draws} L{player.losses}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-neutral-400 sm:text-sm">{player.draftNote}</p>
            <p className="mt-2 text-xs text-neutral-300">{player.teams.map(formatTeamLabel).join(' · ')}</p>
          </div>
          <button
            type="button"
            onClick={() => setEnlarged('crest')}
            className="relative w-[4.5rem] min-h-28 shrink-0 cursor-zoom-in self-stretch overflow-hidden rounded-lg border border-neutral-700/80 bg-neutral-900 transition hover:border-teal-600/60 hover:ring-2 hover:ring-teal-600/30 sm:w-24 sm:min-h-32"
            aria-label={`View enlarged ${managerLabel} club crest`}
          >
            <Image
              src={player.clubCrest}
              alt={`${managerLabel} club crest`}
              fill
              sizes="(max-width: 640px) 72px, 96px"
              className="object-cover object-center"
            />
          </button>
        </div>
      </div>
      <div className="border-t border-neutral-800 px-3 pb-3 pt-2 sm:px-4">
        <TeamMiniTable teams={player.teamBreakdown} />
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const url = refresh ? '/api/world-cup-fantasy?refresh=1' : '/api/world-cup-fantasy';
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      const payload = (await response.json()) as WorldCupFantasyResponse;
      setData(payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load standings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load(false);
  }, [load]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/95 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="world-cup-fantasy-title"
    >
      <div className="flex max-h-[96dvh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-neutral-600 bg-neutral-900 shadow-2xl">
        <header className="shrink-0 border-b border-neutral-700 px-4 py-4 sm:px-5">
          <div className="flex items-start justify-between gap-3">
            <h2 id="world-cup-fantasy-title" className="min-w-0 text-lg font-bold leading-tight text-white sm:text-xl">
              World Cup Sweepstake 2026
            </h2>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => void load(true)}
                disabled={refreshing}
                className="rounded-lg border border-white/25 bg-neutral-950/75 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-900/90 disabled:opacity-50 sm:text-sm"
              >
                {refreshing ? 'Updating…' : 'Refresh scores'}
              </button>
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
              <section className="rounded-lg border border-teal-900/50 bg-teal-950/20 px-4 py-3">
                <h3 className="text-sm font-semibold text-teal-200">The sweepstake</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-200">{data.sweepstakeIntro}</p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{data.sweepstakeFairness}</p>
              </section>

              <div className="rounded-lg border border-neutral-700 bg-neutral-950/50 px-4 py-3 text-xs text-neutral-400 sm:text-sm">
                <p>
                  Last score sync: <span className="text-neutral-200">{formatSyncedAt(data.lastSyncedAt)}</span>
                </p>
                {!data.apiConfigured ? (
                  <p className="mt-2 text-amber-200/90">
                    Auto-sync is off — add <code className="text-amber-100">FOOTBALL_DATA_API_TOKEN</code> on the server.
                  </p>
                ) : null}
                {data.syncError ? (
                  <p className="mt-2 text-red-200">Latest sync failed: {data.syncError}</p>
                ) : null}
                <p className="mt-2">
                  Finished matches tracked: <span className="text-neutral-200">{data.finishedMatchCount}</span>
                </p>
              </div>

              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal-300">Overall standings</h3>
                <OverallStandings standings={data.standings} />
                <ScoringRulesBlock />
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal-300">Player squads</h3>
                <div className="space-y-3">
                  {data.standings.map((player, index) => (
                    <PlayerSquadCard key={player.id} rank={index + 1} player={player} />
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
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
