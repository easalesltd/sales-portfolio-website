export type SweepstakeFantasyThemeId = 'world-cup' | 'english-pyramid';

export type SweepstakeFantasyTheme = {
  id: SweepstakeFantasyThemeId;
  chartLineColors: readonly string[];
  cssVars: Record<string, string>;
  c: {
    overlay: string;
    overlayStandalone: string;
    overlayModal: string;
    panel: string;
    panelStandalone: string;
    header: string;
    headerImageWrap: string;
    closeBtn: string;
    body: string;
    sectionHeading: string;
    scoringSection: string;
    scoringHeading: string;
    scoringBullet: string;
    roastSection: string;
    roastHeading: string;
    fixturesSection: string;
    fixturesHeading: string;
    fixturesMeta: string;
    fixturesList: string;
    fixturesRowLive: string;
    fixturesKickoff: string;
    fixturesKickoffLive: string;
    fixturesInPlay: string;
    fixturesFt: string;
    fixturesRound: string;
    fixturesScore: string;
    fixturesLiveScore: string;
    fixturesWinnerPath: string;
    fixturesPoints: string;
    navBtn: string;
    tickerCard: string;
    tickerCardLabel: string;
    tickerCardInner: string;
    tickerScore: string;
    tickerScoreBadge: string;
    tickerMatch: string;
    tickerWrap: string;
    tickerHeader: string;
    tickerTrack: string;
    tickerFadeL: string;
    tickerFadeR: string;
    leaderRow: string;
    leaderRowMobile: string;
    points: string;
    pointsBold: string;
    accentSoft: string;
    accentHover: string;
    accentRing: string;
    accentFocus: string;
    positive: string;
    negative: string;
    rankUp: string;
    rankDown: string;
    rankSame: string;
    goalDifferencePositive: string;
    goalDifferenceNegative: string;
    live: string;
    liveBg: string;
    teamHighlight: string;
    teamResultsPanel: string;
    teamResultsHeading: string;
    teamResultsPoints: string;
    squadCard: string;
    squadCardLeader: string;
    squadCardEliminated: string;
    squadEliminatedBanner: string;
    squadEliminatedBadge: string;
    standingsRowEliminated: string;
    squadRankBadge: string;
    squadRankBadgeLeader: string;
    squadPhotoBtn: string;
    chartWrap: string;
    chartLegendPoints: string;
    chartLegendBtnSelected: string;
    chartLegendBtn: string;
    recentResultItem: string;
    recentResultPoints: string;
    footerNote: string;
    loading: string;
  };
};

const WORLD_CUP_CHART = [
  '#2dd4bf',
  '#84cc16',
  '#38bdf8',
  '#fbbf24',
  '#f87171',
  '#c084fc',
  '#fb923c',
] as const;

const PYRAMID_CHART = [
  '#d4af37',
  '#e8dfc8',
  '#6b8fbf',
  '#a83248',
  '#c9a227',
  '#f5f5f0',
  '#8b6914',
] as const;

export const worldCupFantasyTheme: SweepstakeFantasyTheme = {
  id: 'world-cup',
  chartLineColors: WORLD_CUP_CHART,
  cssVars: {},
  c: {
    overlay: 'bg-neutral-950/95',
    overlayStandalone: 'bg-neutral-950',
    overlayModal: 'fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/95 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4',
    panel: 'flex max-h-[96dvh] w-full max-w-7xl flex-col overflow-hidden rounded-xl border border-neutral-600 bg-neutral-900 shadow-2xl',
    panelStandalone: 'flex min-h-0 flex-1 flex-col overflow-hidden bg-neutral-900',
    header: 'shrink-0 border-b border-neutral-700 px-4 py-4 sm:px-5',
    headerImageWrap: 'flex max-h-28 items-center sm:max-h-36',
    closeBtn:
      'rounded-lg border border-white/25 bg-neutral-950/75 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-900/90 sm:text-sm',
    body: 'min-h-0 flex-1 overflow-y-auto p-4 sm:p-5',
    sectionHeading: 'text-sm font-semibold uppercase tracking-wide text-teal-300',
    scoringSection: 'mt-3 rounded-lg border border-neutral-700/80 bg-neutral-950/50 px-3 py-2.5 sm:px-4 sm:py-3',
    scoringHeading: 'text-[10px] font-semibold uppercase tracking-wide text-neutral-500 sm:text-xs',
    scoringBullet: 'mt-1.5 h-1 w-1 shrink-0 rounded-full bg-teal-400',
    roastSection: 'rounded-lg border border-amber-800/60 bg-amber-950/20 px-4 py-3',
    roastHeading: 'text-sm font-semibold uppercase tracking-wide text-amber-200',
    fixturesSection: 'rounded-lg border border-sky-800/60 bg-sky-950/20 px-3 py-2.5 sm:px-4 sm:py-3',
    fixturesHeading: 'text-sm font-semibold uppercase tracking-wide text-sky-200',
    fixturesMeta: 'text-[10px] text-sky-300/80 sm:text-xs',
    fixturesList: 'mt-2 divide-y divide-sky-900/40 rounded-md border border-sky-900/50 bg-neutral-950/40',
    fixturesRowLive: 'bg-emerald-950/20',
    fixturesKickoff: 'text-xs font-semibold tabular-nums leading-snug text-sky-200',
    fixturesKickoffLive: 'text-xs font-semibold tabular-nums leading-snug text-emerald-300',
    fixturesInPlay: 'mt-0.5 block text-[10px] font-semibold uppercase tracking-wide text-emerald-400 sm:text-xs',
    fixturesFt: 'mt-0.5 block text-[10px] font-semibold uppercase tracking-wide text-sky-300/80 sm:text-xs',
    fixturesRound: 'mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-300/90',
    fixturesScore: 'mx-1.5 font-semibold tabular-nums text-sky-100',
    fixturesLiveScore: 'mx-1.5 font-semibold tabular-nums text-emerald-300',
    fixturesWinnerPath: 'mt-1 text-[11px] text-amber-200/80',
    fixturesPoints: 'mt-1 text-xs font-medium text-teal-200',
    navBtn:
      'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-sky-700/70 bg-sky-950/50 text-sm font-semibold text-sky-100 transition hover:bg-sky-900/60 disabled:cursor-not-allowed disabled:border-neutral-800 disabled:bg-neutral-950/40 disabled:text-neutral-600',
    tickerCard:
      'min-w-[17rem] shrink-0 rounded-lg border border-lime-500/35 bg-neutral-950 px-3 py-2 shadow-[0_0_18px_rgba(132,204,22,0.14)] md:min-w-[21rem] xl:min-w-[24rem]',
    tickerCardLabel: 'text-[9px] font-semibold uppercase tracking-[0.26em] text-lime-500/80',
    tickerCardInner:
      'mt-1 rounded-md border border-lime-900/80 bg-black px-3 py-2 [background-image:radial-gradient(rgba(132,204,22,0.16)_1px,transparent_1px)] [background-size:4px_4px]',
    tickerScore:
      'flex items-center justify-center gap-2 font-mono text-lg font-bold tracking-[0.16em] text-lime-300 [text-shadow:0_0_12px_rgba(132,204,22,0.9)] sm:text-xl xl:text-2xl',
    tickerScoreBadge: 'rounded border border-lime-500/40 bg-lime-400/10 px-2 tabular-nums',
    tickerMatch: 'mt-1.5 truncate text-center text-[11px] font-medium text-teal-200 sm:text-xs',
    tickerWrap:
      'hidden overflow-hidden rounded-xl border border-lime-400/40 bg-neutral-950 px-3 py-3 shadow-[0_0_26px_rgba(132,204,22,0.18)] motion-reduce:overflow-x-auto sm:block lg:px-4',
    tickerHeader: 'mb-2 flex items-center justify-between gap-3 px-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-lime-500/80',
    tickerTrack: 'relative overflow-hidden rounded-lg border border-lime-900/60 bg-black/75 py-2 motion-reduce:overflow-x-auto',
    tickerFadeL: 'pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-black to-transparent motion-reduce:hidden',
    tickerFadeR: 'pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-black to-transparent motion-reduce:hidden',
    leaderRow: 'bg-teal-950/20',
    leaderRowMobile: 'bg-teal-950/20',
    points: 'text-teal-300',
    pointsBold: 'text-xs font-bold tabular-nums text-teal-300',
    accentSoft: 'text-teal-200',
    accentHover: 'hover:text-teal-200',
    accentRing: 'border-teal-400 ring-2 ring-teal-500/40',
    accentFocus: 'focus-visible:outline-teal-500',
    positive: 'text-lime-400',
    negative: 'text-red-400',
    rankUp: 'text-green-400',
    rankDown: 'text-red-400',
    rankSame: 'text-neutral-400',
    goalDifferencePositive: 'text-green-400',
    goalDifferenceNegative: 'text-red-400',
    live: 'text-emerald-400',
    liveBg: 'bg-emerald-950/20',
    teamHighlight: 'bg-teal-950/25',
    teamResultsPanel: 'rounded-md border border-teal-800/50 bg-neutral-950/80 px-3 py-2',
    teamResultsHeading: 'text-[10px] font-semibold uppercase tracking-wide text-teal-300/90',
    teamResultsPoints: 'shrink-0 font-semibold tabular-nums text-teal-300',
    squadCard: 'rounded-lg border border-neutral-700 bg-neutral-950/40',
    squadCardLeader: 'rounded-lg border border-teal-700/40 bg-neutral-950/40 shadow-[0_0_24px_rgba(45,212,191,0.08)]',
    squadCardEliminated:
      'relative overflow-hidden rounded-lg border-2 border-red-600/80 bg-red-950/35 shadow-[0_0_36px_rgba(220,38,38,0.22)]',
    squadEliminatedBanner:
      'border-b border-red-700/70 bg-red-900/50 px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-red-100 sm:text-sm',
    squadEliminatedBadge:
      'inline-flex items-center rounded border border-red-500/80 bg-red-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-200 sm:text-xs',
    standingsRowEliminated: 'bg-red-950/25',
    squadRankBadge: 'inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold text-teal-300',
    squadRankBadgeLeader:
      'inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-950 text-xs font-bold text-teal-200 ring-1 ring-teal-500/50',
    squadPhotoBtn:
      'relative flex aspect-square w-full min-w-0 cursor-zoom-in items-center justify-center overflow-hidden rounded-lg border border-neutral-700/80 bg-neutral-900 transition hover:border-teal-600/60 hover:ring-2 hover:ring-teal-600/30 sm:size-32 md:size-36',
    chartWrap: 'overflow-x-auto overflow-y-visible rounded-lg border border-neutral-700/80 bg-neutral-950/50',
    chartLegendPoints: 'tabular-nums text-teal-300',
    chartLegendBtnSelected: 'border-teal-400 ring-2 ring-teal-500/40',
    chartLegendBtn: 'border-neutral-700',
    recentResultItem: 'rounded-lg border border-neutral-700 bg-neutral-950/40 px-3 py-2 text-sm',
    recentResultPoints: 'mt-1 text-xs text-teal-300',
    footerNote: 'rounded-lg border border-neutral-700 bg-neutral-950/50 px-4 py-3 text-xs text-neutral-400 sm:text-sm',
    loading: 'text-sm text-neutral-400',
  },
};

export const englishPyramidFantasyTheme: SweepstakeFantasyTheme = {
  id: 'english-pyramid',
  chartLineColors: PYRAMID_CHART,
  cssVars: {
    '--sf-bg-deep': '#0a0f1a',
    '--sf-bg-panel': '#121c33',
    '--sf-gold': '#d4af37',
    '--sf-gold-soft': 'rgba(212, 175, 55, 0.14)',
    '--sf-navy-mid': '#1a2744',
    '--sf-maroon': '#8b2233',
  },
  c: {
    overlay: 'bg-[#0a0f1a]/98',
    overlayStandalone: 'bg-[#0a0f1a]',
    overlayModal:
      'fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0f1a]/98 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4',
    panel:
      'sweepstake-parchment flex max-h-[96dvh] w-full max-w-7xl flex-col overflow-hidden rounded-xl border border-[#d4af37]/30 bg-[#121c33] shadow-[0_0_40px_rgba(212,175,55,0.08)]',
    panelStandalone:
      'sweepstake-parchment flex min-h-0 flex-1 flex-col overflow-hidden bg-[#121c33] [background-image:radial-gradient(ellipse_at_top,rgba(212,175,55,0.06),transparent_55%)]',
    header:
      'shrink-0 border-b border-[#d4af37]/35 bg-[#141f38] px-4 py-4 sm:px-5 [background-image:linear-gradient(180deg,rgba(212,175,55,0.08)_0%,transparent_100%)]',
    headerImageWrap: 'flex max-h-28 items-center justify-center sm:max-h-36',
    closeBtn:
      'rounded-lg border border-[#d4af37]/40 bg-[#0a0f1a]/80 px-3 py-1.5 text-xs font-medium text-[#e8dfc8] hover:bg-[#1a2744]/90 sm:text-sm',
    body: 'min-h-0 flex-1 overflow-y-auto p-4 sm:p-5',
    sectionHeading: 'text-sm font-semibold uppercase tracking-[0.12em] text-[#d4af37]',
    scoringSection:
      'mt-3 rounded-lg border border-[#d4af37]/25 bg-[#0a0f1a]/50 px-3 py-2.5 sm:px-4 sm:py-3',
    scoringHeading: 'text-[10px] font-semibold uppercase tracking-wide text-[#e8dfc8]/60 sm:text-xs',
    scoringBullet: 'mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#d4af37]',
    roastSection:
      'rounded-lg border border-[#a83248]/50 bg-[#8b2233]/20 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
    roastHeading: 'text-sm font-semibold uppercase tracking-wide text-[#f0c4cc]',
    fixturesSection:
      'rounded-lg border border-[#d4af37]/25 bg-[#1a2744]/40 px-3 py-2.5 sm:px-4 sm:py-3',
    fixturesHeading: 'text-sm font-semibold uppercase tracking-wide text-[#e8dfc8]',
    fixturesMeta: 'text-[10px] text-[#d4af37]/75 sm:text-xs',
    fixturesList:
      'mt-2 divide-y divide-[#d4af37]/10 rounded-md border border-[#1a2744] bg-[#0a0f1a]/50',
    fixturesRowLive: 'bg-emerald-950/15',
    fixturesKickoff: 'text-xs font-semibold tabular-nums leading-snug text-[#e8dfc8]/90',
    fixturesKickoffLive: 'text-xs font-semibold tabular-nums leading-snug text-emerald-300',
    fixturesInPlay: 'mt-0.5 block text-[10px] font-semibold uppercase tracking-wide text-emerald-400 sm:text-xs',
    fixturesFt: 'mt-0.5 block text-[10px] font-semibold uppercase tracking-wide text-[#d4af37]/70 sm:text-xs',
    fixturesRound: 'mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#d4af37]/90',
    fixturesScore: 'mx-1.5 font-semibold tabular-nums text-[#f5f5f0]',
    fixturesLiveScore: 'mx-1.5 font-semibold tabular-nums text-emerald-300',
    fixturesWinnerPath: 'mt-1 text-[11px] text-[#d4af37]/80',
    fixturesPoints: 'mt-1 text-xs font-medium text-[#d4af37]',
    navBtn:
      'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#d4af37]/35 bg-[#1a2744]/80 text-sm font-semibold text-[#e8dfc8] transition hover:bg-[#d4af37]/15 disabled:cursor-not-allowed disabled:border-neutral-800 disabled:bg-[#0a0f1a]/40 disabled:text-neutral-600',
    tickerCard:
      'min-w-[17rem] shrink-0 rounded-lg border border-[#d4af37]/35 bg-[#0a0f1a] px-3 py-2 shadow-[0_0_20px_rgba(212,175,55,0.12)] md:min-w-[21rem] xl:min-w-[24rem]',
    tickerCardLabel: 'text-[9px] font-semibold uppercase tracking-[0.26em] text-[#d4af37]/75',
    tickerCardInner:
      'mt-1 rounded-md border border-[#d4af37]/20 bg-[#0a0f1a] px-3 py-2 [background-image:radial-gradient(rgba(212,175,55,0.12)_1px,transparent_1px)] [background-size:4px_4px]',
    tickerScore:
      'flex items-center justify-center gap-2 font-mono text-lg font-bold tracking-[0.16em] text-[#d4af37] [text-shadow:0_0_14px_rgba(212,175,55,0.55)] sm:text-xl xl:text-2xl',
    tickerScoreBadge: 'rounded border border-[#d4af37]/40 bg-[#d4af37]/10 px-2 tabular-nums',
    tickerMatch: 'mt-1.5 truncate text-center text-[11px] font-medium text-[#e8dfc8]/85 sm:text-xs',
    tickerWrap:
      'hidden overflow-hidden rounded-xl border border-[#d4af37]/30 bg-[#0a0f1a] px-3 py-3 shadow-[0_0_28px_rgba(212,175,55,0.1)] motion-reduce:overflow-x-auto sm:block lg:px-4',
    tickerHeader:
      'mb-2 flex items-center justify-between gap-3 px-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#d4af37]/75',
    tickerTrack: 'relative overflow-hidden rounded-lg border border-[#d4af37]/15 bg-[#0a0f1a]/90 py-2 motion-reduce:overflow-x-auto',
    tickerFadeL:
      'pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-[#0a0f1a] to-transparent motion-reduce:hidden',
    tickerFadeR:
      'pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-[#0a0f1a] to-transparent motion-reduce:hidden',
    leaderRow: 'bg-[#d4af37]/10 border-l-2 border-l-[#d4af37]/70',
    leaderRowMobile: 'bg-[#d4af37]/10',
    points: 'text-[#d4af37]',
    pointsBold: 'text-xs font-bold tabular-nums text-[#d4af37]',
    accentSoft: 'text-[#e8dfc8]/90',
    accentHover: 'hover:text-[#d4af37]',
    accentRing: 'border-[#d4af37] ring-2 ring-[#d4af37]/35',
    accentFocus: 'focus-visible:outline-[#d4af37]',
    positive: 'text-[#d4af37]',
    negative: 'text-red-400',
    rankUp: 'text-green-400',
    rankDown: 'text-red-400',
    rankSame: 'text-neutral-400',
    goalDifferencePositive: 'text-green-400',
    goalDifferenceNegative: 'text-red-400',
    live: 'text-emerald-400',
    liveBg: 'bg-emerald-950/15',
    teamHighlight: 'bg-[#d4af37]/10',
    teamResultsPanel: 'rounded-md border border-[#d4af37]/25 bg-[#0a0f1a]/80 px-3 py-2',
    teamResultsHeading: 'text-[10px] font-semibold uppercase tracking-wide text-[#d4af37]/90',
    teamResultsPoints: 'shrink-0 font-semibold tabular-nums text-[#d4af37]',
    squadCard: 'rounded-lg border border-[#1a2744] bg-[#0a0f1a]/40',
    squadCardLeader:
      'rounded-lg border border-[#d4af37]/35 bg-[#0a0f1a]/50 shadow-[0_0_28px_rgba(212,175,55,0.1)] ring-1 ring-[#d4af37]/20',
    squadCardEliminated: 'rounded-lg border border-[#1a2744] bg-[#0a0f1a]/40',
    squadEliminatedBanner: '',
    squadEliminatedBadge: '',
    standingsRowEliminated: '',
    squadRankBadge:
      'inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1a2744] text-xs font-bold text-[#e8dfc8]',
    squadRankBadgeLeader:
      'inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#d4af37] text-xs font-bold text-[#0a0f1a] ring-2 ring-[#d4af37]/40',
    squadPhotoBtn:
      'relative flex aspect-square w-full min-w-0 cursor-zoom-in items-center justify-center overflow-hidden rounded-lg border border-[#1a2744] bg-[#0a0f1a] transition hover:border-[#d4af37]/50 hover:ring-2 hover:ring-[#d4af37]/25 sm:size-32 md:size-36',
    chartWrap: 'overflow-x-auto overflow-y-visible rounded-lg border border-[#d4af37]/20 bg-[#0a0f1a]/60',
    chartLegendPoints: 'tabular-nums text-[#d4af37]',
    chartLegendBtnSelected: 'border-[#d4af37] ring-2 ring-[#d4af37]/35',
    chartLegendBtn: 'border-[#1a2744]',
    recentResultItem: 'rounded-lg border border-[#1a2744] bg-[#0a0f1a]/50 px-3 py-2 text-sm',
    recentResultPoints: 'mt-1 text-xs text-[#d4af37]',
    footerNote:
      'rounded-lg border border-[#1a2744] bg-[#0a0f1a]/40 px-4 py-3 text-xs text-[#e8dfc8]/55 sm:text-sm',
    loading: 'text-sm text-[#e8dfc8]/60',
  },
};

export function getSweepstakeFantasyTheme(id: SweepstakeFantasyThemeId = 'world-cup'): SweepstakeFantasyTheme {
  return id === 'english-pyramid' ? englishPyramidFantasyTheme : worldCupFantasyTheme;
}
