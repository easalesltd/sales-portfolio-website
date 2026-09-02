'use client';

import { useEffect, useMemo, useState } from 'react';
import type { PlayerStanding, MatchPointsEntry } from '@/app/lib/english-pyramid-scoring';
import { useSweepstakeTheme } from '@/app/components/SweepstakeThemeContext';
import { managerColorForPlayer } from '@/app/lib/sweepstake-manager-colors';
import {
  awardWinnerLabel,
  computeSweepstakeAwards,
  type SweepstakeAwardResult,
} from '@/app/lib/english-pyramid-awards';

type Props = {
  standings: PlayerStanding[];
  scoringMatches: MatchPointsEntry[];
};

function WinnerNames({ winners }: { winners: PlayerStanding[] }) {
  const t = useSweepstakeTheme();
  return (
    <>
      {winners.map((winner, idx) => {
        const color = managerColorForPlayer(winner.id, t.id);
        return (
          <span key={winner.id} className="inline text-xs font-semibold">
            {idx > 0 ? <span className="text-neutral-500"> &amp; </span> : null}
            <span style={color ? { color } : undefined}>{winner.teamName ?? winner.name}</span>
          </span>
        );
      })}
    </>
  );
}

function AwardDescription({ text, className }: { text: string; className: string }) {
  const paragraphs = text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length <= 1) {
    return <p className={className}>{text}</p>;
  }

  return (
    <div className={`${className} space-y-2`}>
      {paragraphs.map((paragraph, index) => (
        <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
      ))}
    </div>
  );
}

function AwardCard({ award }: { award: SweepstakeAwardResult }) {
  const t = useSweepstakeTheme();
  const hasWinners = award.winners.length > 0;
  const isHonorary = award.kind === 'honorary';

  return (
    <article
      className={`${t.c.squadCard} flex flex-col justify-between overflow-hidden p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-2xl" role="img" aria-hidden="true">
              {award.emoji}
            </span>
            <h4 className="mt-1 text-sm font-bold text-white leading-tight">{award.title}</h4>
          </div>
          {isHonorary && hasWinners ? (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#f2d36b]">
              Honorary
            </span>
          ) : hasWinners ? (
            <span className={`text-xl font-black tabular-nums ${t.c.points}`}>{award.value}</span>
          ) : (
            <span className="text-xs font-semibold uppercase text-neutral-500">Pending</span>
          )}
        </div>
        <AwardDescription className="mt-2 text-xs leading-normal text-neutral-400" text={award.description} />
      </div>
      <div className="mt-4 border-t border-neutral-800/60 pt-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
          {hasWinners ? 'Leader(s)' : 'Status'}
        </span>
        <div className="mt-0.5 min-w-0 truncate">
          {hasWinners ? (
            <WinnerNames winners={award.winners} />
          ) : (
            <span className="text-xs font-medium text-neutral-400">Pending league fixtures</span>
          )}
        </div>
        {hasWinners && !isHonorary ? (
          <span className="mt-0.5 block text-[10px] text-neutral-500">
            {award.value} {award.statLabel.toLowerCase()}
          </span>
        ) : null}
      </div>
    </article>
  );
}

function CompactAwardRow({
  award,
  expanded,
  onToggle,
}: {
  award: SweepstakeAwardResult;
  expanded: boolean;
  onToggle: () => void;
}) {
  const t = useSweepstakeTheme();
  const hasWinners = award.winners.length > 0;
  const isHonorary = award.kind === 'honorary';
  const panelId = `award-detail-${award.id}`;

  return (
    <li className="border-b border-neutral-800 last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center gap-2 px-2.5 py-2 text-left"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
      >
        <span className="w-6 shrink-0 text-center text-base" role="img" aria-hidden="true">
          {award.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-bold leading-tight text-white">{award.shortTitle}</span>
          <span className="mt-0.5 block truncate text-[11px] leading-tight">
            {hasWinners ? (
              <WinnerNames winners={award.winners} />
            ) : (
              <span className="font-medium text-neutral-500">Pending</span>
            )}
          </span>
        </span>
        {isHonorary && hasWinners ? (
          <span className="shrink-0 text-[10px] font-semibold uppercase text-[#f2d36b]">Honorary</span>
        ) : hasWinners ? (
          <span className={`shrink-0 text-sm font-black tabular-nums ${t.c.points}`}>{award.value}</span>
        ) : (
          <span className="shrink-0 text-[10px] font-semibold uppercase text-neutral-600">—</span>
        )}
      </button>
      {expanded ? (
        <div id={panelId} className="px-2.5 pb-2.5 pl-9">
          <AwardDescription className="text-[11px] leading-snug text-neutral-400" text={award.description} />
          {hasWinners && !isHonorary ? (
            <span className="mt-1 block text-[10px] text-neutral-500">
              {award.value} {award.statLabel.toLowerCase()}
            </span>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

export default function SweepstakeAwards({ standings, scoringMatches }: Props) {
  const t = useSweepstakeTheme();
  const [expanded, setExpanded] = useState(false);
  const [openAwardId, setOpenAwardId] = useState<string | null>(null);

  const awardsData = useMemo(
    () => computeSweepstakeAwards(standings, scoringMatches),
    [standings, scoringMatches]
  );

  const hasMatches = scoringMatches.length > 0;
  const liveAwards = awardsData.filter((award) => award.winners.length > 0);

  useEffect(() => {
    const onJump = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (id === 'pyramid-awards') setExpanded(true);
    };
    window.addEventListener('pyramid-jump', onJump);
    return () => window.removeEventListener('pyramid-jump', onJump);
  }, []);

  return (
    <section id="pyramid-awards" aria-label="Stats Corner and Awards" className="mt-6 scroll-mt-3">
      <div className="sm:hidden">
        <div className={`${t.c.squadCard} overflow-hidden`}>
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            aria-controls="sweepstake-awards-mobile-list"
          >
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]/80">
                Stats corner
              </p>
              <h3 className="text-sm font-bold text-white">Awards</h3>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-2 py-0.5 text-[10px] font-bold text-[#f2d36b]">
                {hasMatches ? `${liveAwards.length} live` : 'Pending'}
              </span>
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d4af37]/35 bg-[#1a2744] text-sm text-[#e8dfc8]"
                aria-hidden
              >
                {expanded ? '−' : '+'}
              </span>
            </div>
          </button>

          {!expanded && hasMatches && liveAwards.length > 0 ? (
            <div className="flex gap-1.5 overflow-x-auto border-t border-neutral-800/60 px-2.5 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {liveAwards.map((award) => (
                <span
                  key={award.id}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[11px] font-semibold text-neutral-200"
                >
                  <span aria-hidden="true">{award.emoji}</span>
                  <span className="max-w-[7.5rem] truncate">{awardWinnerLabel(award.winners)}</span>
                  {award.kind === 'honorary' ? null : (
                    <span className={`tabular-nums ${t.c.points}`}>{award.value}</span>
                  )}
                </span>
              ))}
            </div>
          ) : null}

          {expanded ? (
            <div id="sweepstake-awards-mobile-list">
              {!hasMatches ? (
                <p className="border-t border-neutral-800/60 px-3 py-3 text-center text-xs text-neutral-400">
                  Awards will fill in once the first league matches are played and stats are recorded.
                </p>
              ) : (
                <ul className="border-t border-neutral-800/60">
                  {awardsData.map((award) => (
                    <CompactAwardRow
                      key={award.id}
                      award={award}
                      expanded={openAwardId === award.id}
                      onToggle={() =>
                        setOpenAwardId((current) => (current === award.id ? null : award.id))
                      }
                    />
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <div className="hidden sm:block">
        <h3 className={`mb-3 ${t.c.sectionHeading}`}>Stats Corner &amp; Awards</h3>
        {!hasMatches ? (
          <div className={`${t.c.squadCard} p-4 text-center text-xs text-neutral-400 sm:text-sm`}>
            Awards will fill in once the first league matches are played and stats are recorded.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {awardsData.map((award) => (
              <AwardCard key={award.id} award={award} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
