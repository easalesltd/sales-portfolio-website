'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BONUS_COLLECTIBLE_SRCS } from '@/app/data/bonus-game-collectibles';
import { companies } from '@/app/data/companies';
import { type GameLevelId } from '@/app/lib/game-levels';

const STORAGE_KEY = 'sales-agent-dash-high-score';
const AUDIO_ENABLED_KEY = 'sales-agent-dash-audio-enabled';

/** Playable venues — obstacle sets and backdrops differ per level. */
const GAME_LEVELS: readonly { id: GameLevelId; title: string; blurb: string }[] = [
  { id: 'road', title: 'On the Road', blurb: 'East Anglia — cameras, PCNs, and the open road.' },
  { id: 'nec', title: 'Spring Fair — The NEC', blurb: 'Indoor trade show — crowds, coffee, and paperwork.' },
  {
    id: 'harrogate',
    title: 'Harrogate Xmas Show',
    blurb: 'Hardest: faster hall; festive trees, reindeer & sleighs.',
  },
  {
    id: 'bonus',
    title: 'Bonus Level',
    blurb: 'Neon bonus room — dodge fire, grab every bonus pickup.',
  },
] as const;

type GameLeaderboardEntry = {
  rank: number;
  score: number;
  name: string;
  submittedAt: number;
};

/** Opaque backing store — slightly cheaper compositing than default alpha on many mobile GPUs. */
const CTX_2D_OPTS: CanvasRenderingContext2DSettings = { alpha: false };

const GROUND_RATIO = 0.78;
const GRAVITY = 0.68;
const JUMP_V = -13.5;
const BASE_SCROLL = 3.9;
/** World pixels travelled between obstacle spawns (keeps density as scroll speed ramps up). */
const OBSTACLE_SPAWN_GAP_PX = 465;

/** Company stands 1–2: no bubble; stand 3: bubble; stand 4: no — then repeat. */
const TRADE_STAND_SPEECH_CYCLE_LEN = 4;
const TRADE_STAND_SPEECH_CYCLE_INDEX = 2;
/** Mix stands and jump hazards in world-distance space so one type does not spawn in long clumps. */
const TRADE_MIN_RUN_DIST_AFTER_STAND_BEFORE_OBS = 170;
const TRADE_MIN_RUN_DIST_AFTER_OBS_BEFORE_STAND = 190;
const TRADE_MAX_CONSECUTIVE_STANDS = 2;
const TRADE_MAX_CONSECUTIVE_OBSTACLES = 3;
/** Scenic signs in the hall / on the road (no collision); NEC & Harrogate use exhibitor stands only. */
const BILLBOARD_SPAWN_GAP_PX = 820;
/** Bonus “order” tablets — spawned between obstacle waves; ~1 per 1.2 obstacle gaps. */
const ORDER_SPAWN_GAP_PX = Math.round(OBSTACLE_SPAWN_GAP_PX * 1.15);
const ORDER_BONUS_SCORE = 400;
const ORDER_W = 40;
const ORDER_H = 48;
/** Hitbox / draw position: distance from ground up to the top edge of the tablet. */
const ORDER_ABOVE_GROUND = 112;
/** Bonus collectibles — larger on screen (same feet-from-ground as default tablets). */
const BONUS_ORDER_W = 78;
const BONUS_ORDER_H = 96;
const BONUS_ORDER_ABOVE_GROUND = ORDER_ABOVE_GROUND - ORDER_H + BONUS_ORDER_H;

function orderPickupSizeForLevel(level: GameLevelId): { w: number; h: number; aboveGround: number } {
  if (level === 'bonus') {
    return { w: BONUS_ORDER_W, h: BONUS_ORDER_H, aboveGround: BONUS_ORDER_ABOVE_GROUND };
  }
  return { w: ORDER_W, h: ORDER_H, aboveGround: ORDER_ABOVE_GROUND };
}

function orderPickupTop(groundY: number, level: GameLevelId): number {
  return groundY - orderPickupSizeForLevel(level).aboveGround;
}
/** HUD toast frames after collecting an order pickup */
const NICE_ORDER_MESSAGE_FRAMES = 42;
/** Min horizontal gap between a new order tablet and obstacles / billboards / other orders (world px). */
const ORDER_ASSET_CLEARANCE_PX = 46;
/** If spawn slot is blocked, try again after this much extra run distance. */
const ORDER_SPAWN_RETRY_PX = 52;
const ORDER_SPAWN_EDGE_X = 28;

/**
 * Player/obstacle AABB uses full sprite `pw`×`ph` and obstacle `w`×`h` by default, which is harsher
 * than what you see (arms, quiff, transparent padding). Insets shrink both boxes slightly so deaths
 * line up with apparent contact.
 */
const PLAYER_HIT_INSET_X = 5;
const PLAYER_HIT_INSET_TOP = 7;
const PLAYER_HIT_INSET_BOTTOM = 2;
const OBSTACLE_HIT_INSET_X = 4;
const OBSTACLE_HIT_INSET_TOP = 4;
/** Obstacles narrower than this keep a proportional hit width so thin hazards still register. */
const OBSTACLE_HIT_MIN_W = 28;
/**
 * NEC / Harrogate: only the lower part of each jump hazard counts as lethal (road: full box).
 * Harrogate uses a tighter band than NEC so deaths match visible contact — hardest level, fair hits.
 */
function tradeJumpObstacleHitTuning(level: GameLevelId): {
  hFrac: number;
  hMin: number;
  topTrimFrac: number;
  insetX: number;
} {
  if (level === 'harrogate') {
    return { hFrac: 0.5, hMin: 26, topTrimFrac: 0.24, insetX: 14 };
  }
  return { hFrac: 0.62, hMin: 32, topTrimFrac: 0.14, insetX: 11 };
}

/** No disco below this floor score. */
const DISCO_MIN_SCORE = 3000;
/** Per-frame lerp toward 0/1 so disco overlays ease in/out (BGM still switches once — avoids per-frame `play()` jank). */
const DISCO_VISUAL_BLEND_RATE = 0.11;
/** Wall-clock fallback if `HTMLAudioElement.duration` is not ready yet (matches compressed assets, ffprobe). */
function discoTrackFallbackDurationSec(level: GameLevelId): number {
  switch (level) {
    case 'harrogate':
      return 11.911;
    case 'nec':
      return 17.856;
    default:
      return 44.608;
  }
}

// Game audio lives under `public/` so it's served from the site root (`/Audio/...`).
// Note: the folder name is capitalized in your project (`public/Audio`).
const GAME_MUSIC_SRC = '/Audio/Game%20Audio.m4a';
const DISCO_MUSIC_SRC = '/Audio/Disco%20Mode.m4a';
const NEC_DISCO_MUSIC_SRC = encodeURI('/Audio/NEC Disco Music.m4a');
const NEC_GAME_MUSIC_SRC = encodeURI('/Audio/Spring Fair Music.m4a');
const HARROGATE_GAME_MUSIC_SRC = encodeURI('/Audio/Xmas Music.m4a');
const HARROGATE_DISCO_MUSIC_SRC = encodeURI('/Audio/Xmas Disco Mode.m4a');
const BONUS_GAME_MUSIC_SRC = encodeURI('/Audio/Bonus Round Music.m4a');
const BONUS_HELL_MUSIC_SRC = encodeURI('/Audio/Bonus Round Hell.m4a');
/** Wall-clock fallback length (`Bonus Round Hell.m4a` compressed AAC ~49k). */
const BONUS_HELL_TRACK_FALLBACK_SEC = 20.827;

function gameMusicSrcForLevel(level: GameLevelId): string {
  if (level === 'harrogate') return HARROGATE_GAME_MUSIC_SRC;
  if (level === 'nec') return NEC_GAME_MUSIC_SRC;
  if (level === 'bonus') return BONUS_GAME_MUSIC_SRC;
  return GAME_MUSIC_SRC;
}

function discoMusicSrcForLevel(level: GameLevelId): string {
  if (level === 'harrogate') return HARROGATE_DISCO_MUSIC_SRC;
  if (level === 'nec') return NEC_DISCO_MUSIC_SRC;
  return DISCO_MUSIC_SRC;
}

/** Swap main BGM file when venue changes (same element; avoids duplicate decode). */
function syncGameBgmElement(a: HTMLAudioElement, level: GameLevelId): void {
  const path = gameMusicSrcForLevel(level);
  if (a.dataset.salesDashBgm === path) return;
  a.dataset.salesDashBgm = path;
  a.pause();
  a.src = path;
  a.load();
  a.loop = true;
  a.volume = GAME_MUSIC_VOLUME;
}

/** Swap disco loop when venue changes (Harrogate uses festive disco track). */
function syncDiscoBgmElement(a: HTMLAudioElement, level: GameLevelId): void {
  const path = discoMusicSrcForLevel(level);
  if (a.dataset.salesDashDisco === path) return;
  a.dataset.salesDashDisco = path;
  a.pause();
  a.src = path;
  a.load();
  a.loop = false;
  a.volume = DISCO_MUSIC_VOLUME;
}

function syncBonusHellBgmElement(a: HTMLAudioElement): void {
  if (a.dataset.salesDashHell === BONUS_HELL_MUSIC_SRC) return;
  a.dataset.salesDashHell = BONUS_HELL_MUSIC_SRC;
  a.pause();
  a.src = BONUS_HELL_MUSIC_SRC;
  a.load();
  a.loop = false;
  a.volume = DISCO_MUSIC_VOLUME;
}
/** Death sting — one of several clips chosen at random when the run ends. */
const DEATH_LAUGH_SRCS = [
  encodeURI('/Audio/Death 1.m4a'),
  encodeURI('/Audio/Death 2.m4a'),
  encodeURI('/Audio/Death 3.m4a'),
  encodeURI('/Audio/Death 4.m4a'),
  encodeURI('/Audio/Death 5.m4a'),
] as const;
/** Order pickup — random clip per collect; keep below music so the loop stays readable. */
const ORDER_PICKUP_SRCS = [
  encodeURI('/Audio/Order 1.m4a'),
  encodeURI('/Audio/Order 2.m4a'),
] as const;
const GAME_MUSIC_VOLUME = 0.35;
const DISCO_MUSIC_VOLUME = 0.45;
const LAUGH_VOLUME = 0.8;
const ORDER_PICKUP_VOLUME = 0.55;
/** Inaudible WAV — use for gesture unlock only so priming never touches death/order clips (avoids stray blips). */
const SILENT_WAV_DATA_URL =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==';

const COUNTIES = ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'] as const;

function countyForScore(score: number): (typeof COUNTIES)[number] {
  return COUNTIES[Math.floor(score / 500) % 4];
}

const TRADE_SHOW_HALLS = ['Hall 1', 'Hall 2', 'Hall 3', 'Hall 4', 'Hall 5'] as const;

function hallForTradeShowScore(score: number): (typeof TRADE_SHOW_HALLS)[number] {
  return TRADE_SHOW_HALLS[Math.floor(score / 500) % 5];
}

/** Shuffled 0..count-1 — each billboard uses the next index until the deck is exhausted, then reshuffle (fair, no immediate repeats). */
function shuffleCompanyIndices(count: number): number[] {
  const arr = Array.from({ length: count }, (_, i) => i);
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** GA4 (`gtag` in root layout). Fires once when the hidden game opens — track in GA4 → Engagement → Events → `sales_agent_dash_open`. */
function trackSalesAgentDashOpen() {
  if (typeof window === 'undefined') return;
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') {
    gtag('event', 'sales_agent_dash_open', {
      engagement_type: 'easter_egg',
    });
  }
}

const LOSE_PHRASES = [
  'Why are you still playing this?',
  "That's coming out of your mileage allowance.",
  'Did you try jumping? Revolutionary concept.',
  'Your sample bag survived. You did not.',
  'Flannel does not count as armour.',
  'Flip-flops were a bold choice for parkour.',
  'Call that a journey plan?',
  "No one tell my companies i've made this please",
] as const;

function randomLosePhrase(): string {
  return LOSE_PHRASES[Math.floor(Math.random() * LOSE_PHRASES.length)];
}

const ROAD_OBSTACLE_KINDS = [
  'speed_camera',
  'pcn',
  'pro_forma_invoice',
  'broken_car',
  'sales_target',
  'hmrc',
  'snake',
] as const;

/** Spring Fair — office / hall props (`public/images/Game/`). */
const TRADE_SHOW_OBSTACLE_KINDS = ['trade_clipboard', 'trade_coffee', 'trade_box'] as const;

/** Harrogate — festive jump hazards only. */
const HARROGATE_OBSTACLE_KINDS = ['hg_xmas_tree', 'hg_reindeer', 'hg_sleigh'] as const;

/** Bonus room — only fire hazards (drawn as emoji). */
const BONUS_OBSTACLE_KINDS = ['bonus_fire_emoji'] as const;

type RoadObstacleKind = (typeof ROAD_OBSTACLE_KINDS)[number];
type TradeShowObstacleKind = (typeof TRADE_SHOW_OBSTACLE_KINDS)[number];
type HarrogateObstacleKind = (typeof HARROGATE_OBSTACLE_KINDS)[number];
type BonusObstacleKind = (typeof BONUS_OBSTACLE_KINDS)[number];
type ObstacleKind =
  | RoadObstacleKind
  | TradeShowObstacleKind
  | HarrogateObstacleKind
  | BonusObstacleKind;

function obstacleKindsForLevel(level: GameLevelId): readonly ObstacleKind[] {
  switch (level) {
    case 'road':
      return ROAD_OBSTACLE_KINDS;
    case 'nec':
      return TRADE_SHOW_OBSTACLE_KINDS;
    case 'harrogate':
      return HARROGATE_OBSTACLE_KINDS;
    case 'bonus':
      return BONUS_OBSTACLE_KINDS;
  }
}

function isTradeShowLevel(level: GameLevelId): boolean {
  return level === 'nec' || level === 'harrogate';
}

function obstacleSpawnGapPx(_level: GameLevelId): number {
  return OBSTACLE_SPAWN_GAP_PX;
}

/** Trade-show jump hazards — world distance between spawns (smaller = harder). Harrogate uses a bit more gap than NEC so hazards aren’t on top of each other. */
function tradeShowObstacleAdvancePx(level: GameLevelId): number {
  if (level === 'harrogate') return Math.round(OBSTACLE_SPAWN_GAP_PX * 0.52);
  return Math.round(OBSTACLE_SPAWN_GAP_PX * 0.5);
}

/** Trade-show stand spacing — shorter distance = booths appear more often along the run. */
function tradeShowStandAdvancePx(level: GameLevelId): number {
  if (level === 'harrogate') return Math.round(OBSTACLE_SPAWN_GAP_PX * 0.75);
  return Math.round(OBSTACLE_SPAWN_GAP_PX * 0.78);
}


/** Order tablet spacing scales with obstacle gap on Harrogate. */
function orderSpawnGapPx(level: GameLevelId): number {
  return Math.round(ORDER_SPAWN_GAP_PX * (obstacleSpawnGapPx(level) / OBSTACLE_SPAWN_GAP_PX));
}

/** World scroll speed multiplier — keep Harrogate near other venues so jump timing stays fair. */
function levelScrollMultiplier(level: GameLevelId): number {
  if (level === 'harrogate') return 1.05;
  return 1;
}

function hudVenueLabel(level: GameLevelId, score: number): string {
  switch (level) {
    case 'road':
      return countyForScore(score);
    case 'nec':
      return `NEC • ${hallForTradeShowScore(score)}`;
    case 'harrogate':
      return `Harrogate • ${hallForTradeShowScore(score)}`;
    case 'bonus':
      return ['Bonus run', 'Loot room', 'Extra mile', 'Side quest'][Math.floor(score / 600) % 4];
  }
}

function hudVenueHue(level: GameLevelId, score: number): string {
  if (level === 'road') {
    return ['#6d28d9', '#047857', '#b91c1c', '#0369a1'][Math.floor(score / 500) % 4];
  }
  if (level === 'bonus') {
    return ['#eab308', '#f472b6', '#22d3ee', '#a78bfa'][Math.floor(score / 500) % 4];
  }
  const hallIdx = Math.floor(score / 500) % 5;
  if (level === 'nec') {
    return ['#0369a1', '#0e7490', '#1d4ed8', '#0891b2', '#4338ca'][hallIdx];
  }
  return ['#b91c1c', '#c2410c', '#be185d', '#a16207', '#9f1239'][hallIdx];
}

interface Obstacle {
  x: number;
  w: number;
  h: number;
  kind: ObstacleKind;
  /** Collision height from ground when less than full visual `h` (e.g. smoke above the car). */
  collisionH?: number;
  /** Bonus fire only: phase (rad) for horizontal sway. */
  swayPhase?: number;
  /** Bonus fire only: lateral offset from `x`, recomputed each frame after scroll. */
  swayOffset?: number;
}

/** Floating iPad-style “order” pickup (bonus score). Position uses same `x` scroll as obstacles; Y is derived from `groundY`. */
interface OrderPickup {
  x: number;
  w: number;
  h: number;
  /** Bonus level: draw this asset from `logoImagesRef` instead of the ORDER tablet. */
  collectibleSrc?: string;
  /** Bonus level only: mystery box — random effect + toast on pickup. */
  isMysteryBox?: boolean;
}

interface Billboard {
  x: number;
  kind: 'company' | 'seasonal' | 'promo';
  /** Index into `companies` when `kind === "company"` */
  companyIndex?: number;
  /** Copy line when `kind === "seasonal"` or caption when `kind === "promo"` */
  message?: string;
  seasonalTheme?: SeasonalTheme;
  /** Public URL for promo image (must match preload map key) */
  promoImageUrl?: string;
  /** Picks NPC speech line on trade-show stands */
  banterSeed?: number;
  /** If true, one speech bubble is drawn above the stand (not every booth). */
  showTradeBanter?: boolean;
}

type SeasonalTheme = 'christmas' | 'valentines' | 'mothers_day' | 'fathers_day' | 'easter';
type SeasonalMessage = { text: string; theme: SeasonalTheme };

const SEASONAL_BILLBOARD_MESSAGES: readonly SeasonalMessage[] = [
  { text: 'January 1st, time to Pre Order Xmas Cards lol 🎄😂', theme: 'christmas' },
  { text: "Valentine's Day: Pre Order now, for the one you love. 💘😅", theme: 'valentines' },
  { text: 'Love you Mum. Mother\'s Day cards available to pre-order now. 💐💖', theme: 'mothers_day' },
  { text: "Father's Day cards: because Dad definitely won't say he wants one... but he does. 👔😂", theme: 'fathers_day' },
  { text: "Easter isn't just about chocolate — buy a card too. 🐣💌", theme: 'easter' },
] as const;

const NEC_TRADE_BANTER: readonly string[] = [
  'Our stand is carbon-neutral* (*the PDF says so).',
  'Lead time: yesterday, if you sign now.',
  'Sample? That counts as a handshake in law.',
  'Hall 5 energy, Hall 2 budget.',
  'Everything you order will definitely arrive in April.',
  "I don't want to eat in Resorts World again.",
  "I'm not going to the casino tonight.",
  'Who booked the airport hotel?',
  'Is it time for the PG Pub yet?',
];

const HARROGATE_XMAS_TRADE_BANTER: readonly string[] = [
  'That bauble is *limited* — like my patience.',
  'Crackers: snap first, terms later.',
  'Glitter is a feature, not a defect.',
  'Mince pie NDA — sign before crumbs.',
  "Santa's watching... our sell-through.",
  'Rudolph runs on commission.',
  'Jingle all the way to MOQ.',
  'Yule be sorry if you skip the pre-book.',
  'We deck halls — you deck forecasts.',
  'See you in Christies after the show, my round',
];

/** Silly Beans coming-soon board — brand sky blue ~#A2D9F7 */
const SILLY_BEANS_BILLBOARD_SRC = encodeURI('/images/Silly Beans Counter Top Spinner.png');
const SILLY_BEANS_BILLBOARD_OHH_DEER_SRC = encodeURI('/images/The Silly Beans are Coming Ohh Deer.png');
const SILLY_BEANS_BRAND = {
  outer: '#A2D9F7',
  inner: '#C8ECFC',
  text: '#0C4A6E',
  stroke: '#0284C7',
} as const;

/** Obstacle art under `public/images/Game/` (matches on-disk folder name). */
const SNAKE_GAME_PNG_SRC = encodeURI('/images/Game/Snake.png');
const FAULTY_CAR_PNG_SRC = encodeURI('/images/Game/Faulty Car.png');
const CLIPBOARD_GAME_PNG_SRC = encodeURI('/images/Game/Clipboard.png');
const COFFEE_GAME_PNG_SRC = encodeURI('/images/Game/coffee.png');
const BOX_GAME_PNG_SRC = encodeURI('/images/Game/box.png');
const XMAS_TREE_GAME_PNG_SRC = encodeURI('/images/Game/Xmas Tree.png');
const REINDEER_GAME_PNG_SRC = encodeURI('/images/Game/Reindeer.png');
const SLEIGH_GAME_PNG_SRC = encodeURI('/images/Game/Sleigh.png');

/**
 * Word-wrap without dropping words. If more than `maxLines` lines are needed, the tail is merged
 * into one last line (then scaled down horizontally in `fillTextScaledCenter`).
 */
function wrapWords(text: string, maxCharsPerLine: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [text];
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    const candidate = current ? `${current} ${w}` : w;
    if (candidate.length <= maxCharsPerLine || current.length === 0) {
      current = candidate;
      continue;
    }
    lines.push(current);
    current = w;
  }
  if (current) lines.push(current);
  if (maxLines > 0 && lines.length > maxLines) {
    return [...lines.slice(0, maxLines - 1), lines.slice(maxLines - 1).join(' ')];
  }
  return lines;
}

function getCompanyBillboardLogoUrl(c: (typeof companies)[number]): string {
  return c.logoUrlDark ?? c.logoUrl;
}

/** Full-colour mark for trade-stand headers (readable on NEC / Harrogate header strips). */
function getTradeStandHeaderLogoUrl(c: (typeof companies)[number]): string {
  const primary = (c.logoUrl || '').trim();
  if (primary) return primary;
  return (c.logoUrlDark ?? '').trim();
}

/** Matches `drawBillboard` width math so spawn checks align with on-screen billboards. */
function approxBillboardWidth(b: Billboard, canvasW: number, canvasH: number): number {
  const aspect = 1.82;
  let boardH = Math.max(86, Math.min(canvasH * 0.21, 142));
  let boardW = Math.min(boardH * aspect, canvasW * 0.48, 200);
  if (boardW <= boardH) {
    boardW = Math.min(canvasW * 0.5, 200);
    boardH = Math.min(boardH, boardW / aspect);
  }
  if (b.kind === 'promo') {
    const promoAspect = 2.12;
    boardH = Math.max(92, Math.min(canvasH * 0.24, 156));
    boardW = Math.min(boardH * promoAspect, canvasW * 0.58, 252);
    if (boardW <= boardH) {
      boardW = Math.min(canvasW * 0.58, 252);
      boardH = Math.min(boardH, Math.max(86, Math.floor(boardW / promoAspect)));
    }
  }
  return boardW;
}

/** `depthScale` < 1 shrinks hall stands so they read as background vs the play lane. */
function tradeStandLayout(
  canvasW: number,
  canvasH: number,
  depthScale = 1
): { standW: number; standH: number } {
  /** ~1.5× prior size so backdrop / logo banner is much taller and brand marks read clearly. */
  let standH = Math.max(165, Math.min(canvasH * 0.435, 237));
  let standW = Math.min(standH * 1.88, canvasW * 0.55, 236);
  if (standW < 124) standW = Math.min(canvasW * 0.56, 236);
  return { standW: standW * depthScale, standH: standH * depthScale };
}

const TRADE_STAND_DEPTH_SCALE = 0.86;
/** Booth floor line matches game `groundY` (hall floor / ice edge). */
const TRADE_STAND_FLOOR_GAP = 0;
/** Horizontal gap between jump obstacles and trade-stand footprint (incl. NPCs). */
const TRADE_STAND_OBSTACLE_CLEARANCE_PX = 56;

function tradeStandFootprintRange(
  standLeftX: number,
  canvasW: number,
  canvasH: number
): { left: number; right: number } {
  const { standW } = tradeStandLayout(canvasW, canvasH, TRADE_STAND_DEPTH_SCALE);
  const npcScale = Math.min(1.78, Math.max(1.35, standW / 62));
  const out = 16 * npcScale;
  const pad = TRADE_STAND_OBSTACLE_CLEARANCE_PX;
  return {
    left: standLeftX - out - pad,
    right: standLeftX + standW + out + pad,
  };
}

/**
 * Horizontal band where a new jump hazard at the right edge must not overlap a booth.
 * Uses table/skirt width only — not the full NPC lateral footprint. The wide footprint caused
 * `obsBlocked` on almost every frame and the spawn loop pushed `nextObstacleAtRef` thousands of
 * pixels ahead of run distance, so Spring Fair / Harrogate had few or no obstacles.
 */
function tradeStandObstacleSpawnClearanceRange(
  standLeftX: number,
  canvasW: number,
  canvasH: number
): { left: number; right: number } {
  const { standW } = tradeStandLayout(canvasW, canvasH, TRADE_STAND_DEPTH_SCALE);
  const pad = 26;
  return {
    left: standLeftX - pad,
    right: standLeftX + standW + pad,
  };
}

function rangesOverlap1D(a0: number, a1: number, b0: number, b1: number): boolean {
  return !(a1 < b0 || a0 > b1);
}

function tradeShowNpcBanter(level: GameLevelId, companyIndex: number, seed: number): string {
  const pool = level === 'harrogate' ? HARROGATE_XMAS_TRADE_BANTER : NEC_TRADE_BANTER;
  const n = pool.length;
  const s = seed >>> 0;
  const i = (s + companyIndex * 19) % n;
  return pool[i]!;
}

function wrapCanvasBubbleLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxW: number,
  fontPx: number,
  maxLines = 5
): string[] {
  ctx.font = `${fontPx}px system-ui, sans-serif`;
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(t).width <= maxW || cur.length === 0) cur = t;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, maxLines);
}

const TRADE_SPEECH_BUBBLE_PAD = 8;

function layoutTradeSpeechBubble(
  ctx: CanvasRenderingContext2D,
  maxInnerW: number,
  text: string,
  fontPx: number,
  maxLines: number
): { bw: number; bh: number; lines: string[]; lh: number; pad: number } {
  const pad = TRADE_SPEECH_BUBBLE_PAD;
  const lines = wrapCanvasBubbleLines(ctx, text, maxInnerW, fontPx, maxLines);
  const lh = fontPx + 4;
  ctx.font = `${fontPx}px system-ui, sans-serif`;
  let bw = 0;
  for (const ln of lines) bw = Math.max(bw, ctx.measureText(ln).width);
  bw = Math.ceil(Math.min(maxInnerW + pad * 2 + 8, bw + pad * 2 + 6));
  const bh = pad * 2 + lines.length * lh + 4;
  return { bw, bh, lines, lh, pad };
}

function drawTradeSpeechBubble(
  ctx: CanvasRenderingContext2D,
  bubbleLeft: number,
  bubbleTop: number,
  maxInnerW: number,
  text: string,
  tailTipX: number,
  tailTipY: number,
  opts?: {
    fontPx?: number;
    maxLines?: number;
    centerX?: number;
    canvasClampW?: number;
  }
) {
  const fontPx = opts?.fontPx ?? 12;
  const maxLines = opts?.maxLines ?? 5;
  const { bw, bh, lines, lh, pad } = layoutTradeSpeechBubble(
    ctx,
    maxInnerW,
    text,
    fontPx,
    maxLines
  );

  let left = bubbleLeft;
  if (typeof opts?.centerX === 'number') {
    left = Math.round(opts.centerX - bw / 2);
    const cw = opts.canvasClampW;
    if (typeof cw === 'number' && cw > 0) {
      const margin = 6;
      left = Math.min(Math.max(left, margin), cw - bw - margin);
    }
  }

  roundRectPath(ctx, left, bubbleTop, bw, bh, 9);
  ctx.fillStyle = 'rgba(255,255,255,0.97)';
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.stroke();

  const br = left + bw;
  const bb = bubbleTop + bh;
  const tcx = Math.min(Math.max(tailTipX, left + 14), br - 14);
  ctx.fillStyle = 'rgba(255,255,255,0.97)';
  ctx.beginPath();
  ctx.moveTo(tcx - 7, bb);
  ctx.lineTo(tcx + 7, bb);
  ctx.lineTo(tailTipX, tailTipY);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  lines.forEach((ln, i) => {
    ctx.fillText(ln, left + pad, bubbleTop + pad + (i + 1) * lh - 2);
  });
}

/** Stable hue from company id; skips yellow–green so stands never read as “branded green”. */
function brandHueFromCompanyId(id: string): number {
  let acc = 2166136261;
  for (let i = 0; i < id.length; i++) {
    acc ^= id.charCodeAt(i);
    acc = Math.imul(acc, 16777619);
  }
  const hue = (acc >>> 0) % 360;
  if (hue >= 52 && hue <= 168) return (hue + 155) % 360;
  return hue;
}

function tradeStandBrandTones(companyId: string | undefined, level: GameLevelId) {
  const fallbackHue = level === 'harrogate' ? 328 : 214;
  const h = companyId ? brandHueFromCompanyId(companyId) : fallbackHue;
  const h2 = (h + 14) % 360;
  return {
    fasciaTop: `hsl(${h}, 38%, 44%)`,
    fasciaBot: `hsl(${h2}, 42%, 36%)`,
    backdropWash: `hsl(${h}, 14%, 94%)`,
    tableSkirt: `hsl(${h}, 24%, 38%)`,
    tableSkirtHi: `hsl(${h2}, 20%, 44%)`,
    strokeSoft: `hsl(${h}, 25%, 78%)`,
  };
}

/** Expo staff in side view — clipboard angled toward booth centre (draw after table so visible). */
function drawTradeShowStaff(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  footY: number,
  scale: number,
  clipboardSide: 'left' | 'right'
) {
  const headR = 4.2 * scale;
  const bodyW = 9 * scale;
  const bodyH = 16 * scale;
  const legH = 7 * scale;
  const topY = footY - legH - bodyH - headR * 1.85;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(centerX - bodyW * 0.45, footY - legH, bodyW * 0.38, legH);
  ctx.fillRect(centerX + bodyW * 0.08, footY - legH, bodyW * 0.38, legH);

  ctx.fillStyle = '#334155';
  roundRectPath(ctx, centerX - bodyW / 2, footY - legH - bodyH, bodyW, bodyH, 2.5 * scale);
  ctx.fill();
  ctx.strokeStyle = 'rgba(15,23,42,0.35)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#fdba8c';
  ctx.beginPath();
  ctx.arc(centerX, topY + headR, headR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(124,45,18,0.35)';
  ctx.lineWidth = 0.75;
  ctx.stroke();

  const cbW = 7 * scale;
  const cbH = 9 * scale;
  const cbY = footY - legH - bodyH * 0.68;
  const cbX = clipboardSide === 'right' ? centerX + bodyW * 0.38 : centerX - bodyW * 0.38 - cbW;
  ctx.fillStyle = '#fafafa';
  roundRectPath(ctx, cbX, cbY, cbW, cbH, 1.2 * scale);
  ctx.fill();
  ctx.strokeStyle = '#44403c';
  ctx.lineWidth = 1.1;
  ctx.stroke();
  ctx.fillStyle = '#a8a29e';
  ctx.fillRect(cbX + 1.4 * scale, cbY + cbH - 2.2 * scale, cbW - 2.8 * scale, 1.8 * scale);
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(cbX + 1.8 * scale, cbY + 2 * scale, cbW - 3.6 * scale, 0.9 * scale);
  ctx.fillRect(cbX + 1.8 * scale, cbY + 4 * scale, cbW - 3.6 * scale, 0.7 * scale);
}

function pathRoundedTopRect(ctx: CanvasRenderingContext2D, rx: number, ry: number, rw: number, rh: number, rad: number) {
  const r = Math.min(rad, rw / 2, rh / 2);
  ctx.beginPath();
  ctx.moveTo(rx, ry + r);
  ctx.quadraticCurveTo(rx, ry, rx + r, ry);
  ctx.lineTo(rx + rw - r, ry);
  ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + r);
  ctx.lineTo(rx + rw, ry + rh);
  ctx.lineTo(rx, ry + rh);
  ctx.closePath();
}

function approxForegroundSignWidth(b: Billboard, canvasW: number, canvasH: number, level: GameLevelId): number {
  if (isTradeShowLevel(level) && b.kind === 'company') {
    const { standW } = tradeStandLayout(canvasW, canvasH, TRADE_STAND_DEPTH_SCALE);
    return standW + 28;
  }
  return approxBillboardWidth(b, canvasW, canvasH);
}

function isOrderSpawnBlocked(
  spawnX: number,
  canvasW: number,
  canvasH: number,
  obstacles: Obstacle[],
  billboards: Billboard[],
  existingOrders: OrderPickup[],
  gameLevel: GameLevelId
): boolean {
  const pad = ORDER_ASSET_CLEARANCE_PX;
  const spawnW = orderPickupSizeForLevel(gameLevel).w;
  const a0 = spawnX - pad;
  const a1 = spawnX + spawnW + pad;

  for (const o of obstacles) {
    const ox = obstacleEffectiveLeft(o);
    if (!(a1 < ox || a0 > ox + o.w)) return true;
  }
  for (const b of billboards) {
    const bw = approxForegroundSignWidth(b, canvasW, canvasH, gameLevel);
    const b0 = b.x - pad;
    const b1 = b.x + bw + pad;
    if (!(a1 < b0 || a0 > b1)) return true;
  }
  for (const q of existingOrders) {
    if (!(a1 < q.x || a0 > q.x + q.w)) return true;
  }
  return false;
}

/**
 * Side-on shell scheme: display wall behind a foreground table; company logo on the wall (not a roadside pole sign).
 * Two staff with clipboards; brand hues only on trim / skirt (no green band).
 */
function drawTradeStand(
  ctx: CanvasRenderingContext2D,
  b: Billboard,
  groundY: number,
  canvasH: number,
  canvasW: number,
  logos: Map<string, HTMLImageElement>,
  level: GameLevelId
) {
  const { standW, standH } = tradeStandLayout(canvasW, canvasH, TRADE_STAND_DEPTH_SCALE);
  const x = b.x;
  const minPanelTop = 70;
  const floorY = groundY - TRADE_STAND_FLOOR_GAP;
  const maxStandH = Math.max(72, floorY - minPanelTop - 4);
  const useH = Math.min(standH, maxStandH);
  const panelBottom = floorY;
  const panelTop = floorY - useH;

  const c = typeof b.companyIndex === 'number' ? companies[b.companyIndex] : undefined;
  const tones = tradeStandBrandTones(c?.id, level);
  const url = c ? getTradeStandHeaderLogoUrl(c) : '';
  const isCambridgeConfectioneryStand = c?.id === 'cambridge-confectionery-company';

  const tableBlockH = Math.max(22, Math.min(36, Math.round(useH * 0.28)));
  const tableTopY = panelBottom - tableBlockH;
  const fasciaH = Math.max(5, Math.min(8, Math.round(useH * 0.048)));
  const backdropTop = panelTop + fasciaH + 5;
  const backdropH = Math.max(72, tableTopY - backdropTop);

  const matW = standW + 22;
  const matX = x + (standW - matW) / 2;
  ctx.fillStyle = '#52525b';
  ctx.fillRect(matX, groundY - 6, matW, 6);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(matX, groundY - 1, matW, 1);

  ctx.fillStyle = '#b4b1ad';
  pathRoundedTopRect(ctx, x - 4, panelTop - 1, standW + 8, backdropH + fasciaH + tableBlockH + 8, 9);
  ctx.fill();

  const fasciaGrad = ctx.createLinearGradient(0, panelTop, 0, panelTop + fasciaH + 2);
  fasciaGrad.addColorStop(0, tones.fasciaTop);
  fasciaGrad.addColorStop(1, tones.fasciaBot);
  ctx.fillStyle = fasciaGrad;
  roundRectPath(ctx, x + 3, panelTop + 3, standW - 6, fasciaH, 2);
  ctx.fill();

  pathRoundedTopRect(ctx, x, backdropTop, standW, backdropH, 7);
  if (isCambridgeConfectioneryStand) {
    ctx.fillStyle = '#0a0a0a';
    ctx.fill();
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 1;
    ctx.stroke();
  } else {
    const wallGrad = ctx.createLinearGradient(0, backdropTop, 0, backdropTop + backdropH);
    wallGrad.addColorStop(0, tones.backdropWash);
    wallGrad.addColorStop(0.55, '#fafaf9');
    wallGrad.addColorStop(1, '#f4f4f3');
    ctx.fillStyle = wallGrad;
    ctx.fill();
    ctx.strokeStyle = tones.strokeSoft;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  const logoPad = Math.max(7, standW * 0.06);
  const logoAreaTop = backdropTop + 6;
  const logoAreaH = Math.min(backdropH - 12, backdropH * 0.88);
  const logoAreaW = standW - logoPad * 2;
  ctx.fillStyle = isCambridgeConfectioneryStand ? '#000000' : '#ffffff';
  roundRectPath(ctx, x + logoPad, logoAreaTop, logoAreaW, logoAreaH, 5);
  ctx.fill();
  ctx.strokeStyle = isCambridgeConfectioneryStand ? '#52525b' : '#e4e4e7';
  ctx.stroke();

  const img = logos.get(url);
  const innerPad = 5;
  const iw = logoAreaW - innerPad * 2;
  const ih = logoAreaH - innerPad * 2;
  if (img && img.complete && img.naturalWidth > 0) {
    const sc = Math.min(iw / img.naturalWidth, ih / img.naturalHeight);
    const dw = img.naturalWidth * sc;
    const dh = img.naturalHeight * sc;
    const dx = x + logoPad + innerPad + (iw - dw) / 2;
    const dy = logoAreaTop + innerPad + (ih - dh) / 2;
    ctx.save();
    roundRectPath(
      ctx,
      x + logoPad + innerPad,
      logoAreaTop + innerPad,
      iw,
      ih,
      3
    );
    ctx.clip();
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();
  } else {
    ctx.fillStyle = isCambridgeConfectioneryStand ? '#171717' : '#f4f4f5';
    roundRectPath(ctx, x + logoPad + innerPad, logoAreaTop + innerPad, iw, ih, 3);
    ctx.fill();
    ctx.fillStyle = isCambridgeConfectioneryStand ? '#fafafa' : '#3f3f46';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(c?.name.split(' ')[0] ?? 'Brand', x + standW / 2, logoAreaTop + logoAreaH / 2 + 4);
    ctx.textAlign = 'left';
  }

  ctx.strokeStyle = isCambridgeConfectioneryStand ? '#64748b' : '#94a3b8';
  ctx.lineWidth = 1.1;
  const shelfX = x + 5;
  const shelfBot = backdropTop + backdropH - 6;
  ctx.beginPath();
  ctx.moveTo(shelfX, logoAreaTop + logoAreaH + 4);
  ctx.lineTo(shelfX, shelfBot);
  ctx.stroke();
  const shelfCount = 4;
  for (let s = 0; s < shelfCount; s++) {
    const t = (s + 1) / (shelfCount + 1);
    const sy = logoAreaTop + logoAreaH + 6 + t * (shelfBot - logoAreaTop - logoAreaH - 10);
    ctx.beginPath();
    ctx.moveTo(shelfX, sy);
    ctx.lineTo(shelfX + standW * 0.18, sy);
    ctx.stroke();
  }

  ctx.fillStyle = isCambridgeConfectioneryStand ? '#64748b' : '#1e293b';
  const spotW = 4;
  ctx.fillRect(x + standW * 0.3, backdropTop - 1, spotW, 2);
  ctx.fillRect(x + standW * 0.7 - spotW, backdropTop - 1, spotW, 2);

  if (isCambridgeConfectioneryStand) {
    const badgeW = Math.min(46, standW * 0.24);
    const badgeH = 14;
    const badgeX = x + standW - badgeW - 6;
    const badgeY = backdropTop + 5;
    ctx.fillStyle = '#dc2626';
    roundRectPath(ctx, badgeX, badgeY, badgeW, badgeH, 3);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    fillTextScaledCenter(ctx, 'NEW', badgeX + badgeW / 2, badgeY + badgeH * 0.66, badgeW - 6, 8, 6, 'bold');
  }

  const topSlabH = Math.max(6, Math.round(tableBlockH * 0.22));
  const tableTopW = standW + 10;
  const tableTopX = x + (standW - tableTopW) / 2;
  const wood = ctx.createLinearGradient(0, tableTopY - topSlabH, 0, tableTopY + 2);
  wood.addColorStop(0, '#e7d5b8');
  wood.addColorStop(0.5, '#d4bc96');
  wood.addColorStop(1, '#c4a57a');
  ctx.fillStyle = wood;
  ctx.fillRect(tableTopX, tableTopY - topSlabH, tableTopW, topSlabH);
  ctx.strokeStyle = 'rgba(62,39,35,0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(tableTopX + 0.5, tableTopY - topSlabH + 0.5, tableTopW - 1, topSlabH - 1);

  const skirtH = tableBlockH - topSlabH;
  const skirtTop = tableTopY;
  const skirtWTop = tableTopW - 8;
  const skirtXTop = tableTopX + 4;
  const skirtWBot = standW * 0.94;
  const skirtXBot = x + (standW - skirtWBot) / 2;
  const skGrad = ctx.createLinearGradient(skirtXBot, skirtTop, skirtXBot + skirtWBot, skirtTop + skirtH);
  skGrad.addColorStop(0, tones.tableSkirt);
  skGrad.addColorStop(0.45, tones.tableSkirtHi);
  skGrad.addColorStop(1, tones.tableSkirt);
  ctx.fillStyle = skGrad;
  ctx.beginPath();
  ctx.moveTo(skirtXTop, skirtTop);
  ctx.lineTo(skirtXTop + skirtWTop, skirtTop);
  ctx.lineTo(skirtXBot + skirtWBot, panelBottom);
  ctx.lineTo(skirtXBot, panelBottom);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(15,23,42,0.28)';
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(skirtXBot + skirtWBot * 0.08, skirtTop + skirtH * 0.35, skirtWBot * 0.84, 1.5);

  const legW = Math.max(4, standW * 0.035);
  const legInset = standW * 0.12;
  const legLen = groundY - panelBottom;
  if (legLen > 0.5) {
    ctx.fillStyle = '#292524';
    ctx.fillRect(skirtXBot + legInset, panelBottom, legW, legLen);
    ctx.fillRect(skirtXBot + skirtWBot - legInset - legW, panelBottom, legW, legLen);
  }

  const npcScale = Math.min(1.78, Math.max(1.35, standW / 62));
  const footY = groundY - 0.5;
  const out = 16 * npcScale;
  drawTradeShowStaff(ctx, x - out, footY, npcScale, 'right');
  drawTradeShowStaff(ctx, x + standW + out, footY, npcScale, 'left');

  if (b.showTradeBanter) {
    const headR = 4.2 * npcScale;
    const bodyH = 16 * npcScale;
    const legH = 7 * npcScale;
    const headCy = footY - legH - bodyH - headR * 0.85;
    const headCxL = x - out;
    const headCxR = x + standW + out;
    const seed =
      b.banterSeed ?? (((b.companyIndex ?? 0) * 1103515245 + 12345) | 0);
    const line = tradeShowNpcBanter(level, b.companyIndex ?? 0, seed);
    const speakerLeft = ((seed >>> 0) + (b.companyIndex ?? 0)) % 2 === 0;
    const speakerHeadX = speakerLeft ? headCxL : headCxR;
    const mouthY = headCy + headR * 0.35;
    const bubbleOutward = Math.round(16 * Math.min(1.35, npcScale));
    const bubbleCenterX = speakerLeft
      ? speakerHeadX - bubbleOutward
      : speakerHeadX + bubbleOutward;
    const maxInnerW = Math.min(280, Math.max(150, canvasW * 0.65));
    const fontPx = Math.max(11, Math.min(15, Math.round(canvasW * 0.036)));
    const speechMaxLines = 6;
    const { bh } = layoutTradeSpeechBubble(ctx, maxInnerW, line, fontPx, speechMaxLines);
    const gapAboveFascia = 10;
    const bubbleTop = Math.max(minPanelTop + 4, panelTop - bh - gapAboveFascia);
    const headInView =
      speakerHeadX + headR > -4 && speakerHeadX - headR < canvasW + 4;
    if (!headInView) return;
    drawTradeSpeechBubble(
      ctx,
      0,
      bubbleTop,
      maxInnerW,
      line,
      speakerHeadX,
      mouthY,
      {
        fontPx,
        maxLines: speechMaxLines,
        centerX: bubbleCenterX,
      }
    );
  }
}

/** Roadside billboards / promos — not used on NEC or Harrogate (those use `drawTradeStand` only). */
function drawBillboard(
  ctx: CanvasRenderingContext2D,
  b: Billboard,
  groundY: number,
  canvasH: number,
  canvasW: number,
  logos: Map<string, HTMLImageElement>
) {
  // Landscape (width > height); vertical span similar to before; bottom edge above obstacles.
  const aspect = 1.82;
  let boardH = Math.max(86, Math.min(canvasH * 0.21, 142));
  let boardW = Math.min(boardH * aspect, canvasW * 0.48, 200);
  if (boardW <= boardH) {
    boardW = Math.min(canvasW * 0.5, 200);
    boardH = Math.min(boardH, boardW / aspect);
  }
  // Promo: wider + a bit taller so product art can sit large beside copy.
  if (b.kind === 'promo') {
    const promoAspect = 2.12;
    boardH = Math.max(92, Math.min(canvasH * 0.24, 156));
    boardW = Math.min(boardH * promoAspect, canvasW * 0.58, 252);
    if (boardW <= boardH) {
      boardW = Math.min(canvasW * 0.58, 252);
      boardH = Math.min(boardH, Math.max(86, Math.floor(boardW / promoAspect)));
    }
  }
  const poleW = Math.max(9, boardW * 0.065);
  const x = b.x;
  // Keep billboards visually away from the "jump obstacle" lane (which tops out ~64px above ground).
  // A larger clearance prevents any apparent touching when billboards scroll near obstacles.
  const clearanceAboveRoad = Math.max(120, Math.min(groundY * 0.18, 160));
  const boardBottom = groundY - clearanceAboveRoad;
  const boardTop = boardBottom - boardH;
  const c = typeof b.companyIndex === 'number' ? companies[b.companyIndex] : undefined;
  const url = c ? getCompanyBillboardLogoUrl(c) : '';
  const isNewAgency = c?.id === 'cambridge-confectionery-company';

  ctx.fillStyle = '#3f3f46';
  // Prevent the billboard panel from visually "climbing into" the scoreboard HUD,
  // while still keeping it far above the tallest jump obstacles.
  const maxObstacleH = 64;
  const maxPanelBottom = groundY - (maxObstacleH + 8);
  const minPanelTop = 70; // scoreboard background ends around y ~= 66

  let panelTop = boardTop;
  let panelBottom = boardBottom;
  if (panelTop < minPanelTop) {
    panelTop = minPanelTop;
    panelBottom = panelTop + boardH;
  }
  if (panelBottom > maxPanelBottom) {
    panelBottom = maxPanelBottom;
    panelTop = panelBottom - boardH;
  }

  // Pole reaches the road/floor; the panel itself is positioned via `panelTop/panelBottom`.
  ctx.fillRect(x + boardW / 2 - poleW / 2, panelBottom, poleW, groundY - panelBottom);

  const seasonalPalette: Record<SeasonalTheme, { outer: string; inner: string; text: string; stroke: string }> = {
    christmas: { outer: '#fee2e2', inner: '#fecaca', text: '#14532d', stroke: '#b91c1c' }, // red + green
    valentines: { outer: '#fee2e2', inner: '#fecaca', text: '#9f1239', stroke: '#be123c' }, // reddish
    mothers_day: { outer: '#fce7f3', inner: '#fbcfe8', text: '#9d174d', stroke: '#db2777' }, // pink
    fathers_day: { outer: '#dbeafe', inner: '#bfdbfe', text: '#1e3a8a', stroke: '#2563eb' }, // blue
    easter: { outer: '#fef9c3', inner: '#fef3c7', text: '#854d0e', stroke: '#ca8a04' }, // yellow
  };
  const seasonal = b.seasonalTheme ? seasonalPalette[b.seasonalTheme] : null;

  if (b.kind === 'seasonal') {
    ctx.fillStyle = seasonal?.outer ?? '#fef9c3';
  } else if (b.kind === 'promo') {
    ctx.fillStyle = SILLY_BEANS_BRAND.outer;
  } else {
    ctx.fillStyle = '#fafafa';
  }
  roundRectPath(ctx, x, panelTop, boardW, boardH, 5);
  ctx.fill();
  ctx.strokeStyle =
    b.kind === 'seasonal'
      ? (seasonal?.stroke ?? '#a16207')
      : b.kind === 'promo'
        ? SILLY_BEANS_BRAND.stroke
        : '#27272a';
  ctx.lineWidth = 2;
  ctx.stroke();

  const pad = 7;
  const innerW = boardW - pad * 2;
  const innerH = boardH - pad * 2;
  if (b.kind === 'seasonal') {
    ctx.fillStyle = seasonal?.inner ?? '#fef3c7';
    roundRectPath(ctx, x + pad, panelTop + pad, innerW, innerH, 3);
    ctx.fill();
    ctx.fillStyle = seasonal?.text ?? '#854d0e';
    const seasonalText = b.message ?? 'Seasonal stock ready?';
    const textPadX = 10;
    const maxWidth = innerW - textPadX;
    // ~6.5px per character at bold 13px — tighter wrap on narrow boards, wider on large.
    const maxChars = Math.max(16, Math.min(34, Math.floor(maxWidth / 6.5)));
    const lineGap = Math.max(10, Math.min(15, Math.floor((innerH - 12) / 6)));
    const maxLines = Math.max(4, Math.min(8, Math.floor((innerH - 10) / lineGap)));
    const lines = wrapWords(seasonalText, maxChars, maxLines);
    const cx = x + boardW / 2;
    const innerTop = panelTop + pad;
    const textBlockH = (lines.length - 1) * lineGap + 14;
    const startY = innerTop + Math.max(2, (innerH - textBlockH) / 2) + 12;
    lines.forEach((line, idx) => {
      fillTextScaledCenter(ctx, line, cx, startY + idx * lineGap, maxWidth, 13, 7, 'bold');
    });
  } else if (b.kind === 'promo') {
    const promoUrl = b.promoImageUrl ?? SILLY_BEANS_BILLBOARD_SRC;
    ctx.fillStyle = SILLY_BEANS_BRAND.inner;
    roundRectPath(ctx, x + pad, panelTop + pad, innerW, innerH, 3);
    ctx.fill();

    const imgGap = 6;
    const tileW = Math.max(42, Math.floor((innerW - imgGap) / 2));
    const tileH = innerH;
    const leftX = x + pad;
    const rightX = leftX + tileW + imgGap;
    const tileY = panelTop + pad;
    const promoUrls = [promoUrl, SILLY_BEANS_BILLBOARD_OHH_DEER_SRC];
    const tileXs = [leftX, rightX];

    promoUrls.forEach((u, i) => {
      const img = logos.get(u);
      const tx = tileXs[i];
      if (img && img.complete && img.naturalWidth > 0) {
        const scale = Math.min(tileW / img.naturalWidth, tileH / img.naturalHeight);
        const dw = img.naturalWidth * scale;
        const dh = img.naturalHeight * scale;
        const dx = tx + (tileW - dw) / 2;
        const dy = tileY + (tileH - dh) / 2;
        ctx.drawImage(img, dx, dy, dw, dh);
      } else {
        ctx.fillStyle = SILLY_BEANS_BRAND.outer;
        roundRectPath(ctx, tx, tileY, tileW, tileH, 3);
        ctx.fill();
        ctx.fillStyle = SILLY_BEANS_BRAND.text;
        ctx.font = '600 9px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('…', tx + tileW / 2, tileY + tileH / 2);
        ctx.textAlign = 'left';
      }
    });
  } else {
    if (isNewAgency) {
      ctx.fillStyle = '#0a0a0a';
      roundRectPath(ctx, x + pad, panelTop + pad, innerW, innerH, 3);
      ctx.fill();
    }
    const img = logos.get(url);
    if (img && img.complete && img.naturalWidth > 0) {
      const scale = Math.min(innerW / img.naturalWidth, innerH / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      const dx = x + pad + (innerW - dw) / 2;
      const dy = panelTop + pad + (innerH - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      ctx.fillStyle = '#e4e4e7';
      roundRectPath(ctx, x + pad, panelTop + pad, innerW, innerH, 3);
      ctx.fill();
      ctx.fillStyle = '#71717a';
      ctx.font = '600 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(c?.name.split(' ')[0] ?? 'Brand', x + boardW / 2, panelTop + pad + innerH / 2 + 4);
      ctx.textAlign = 'left';
    }
    if (isNewAgency) {
      const badgeW = Math.max(36, Math.min(56, boardW * 0.28));
      const badgeH = Math.max(16, Math.min(22, boardH * 0.2));
      const badgeX = x + boardW - badgeW - 5;
      const badgeY = panelTop + 5;
      ctx.fillStyle = '#dc2626';
      roundRectPath(ctx, badgeX, badgeY, badgeW, badgeH, 4);
      ctx.fill();
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      fillTextScaledCenter(ctx, 'NEW', badgeX + badgeW / 2, badgeY + badgeH * 0.66, badgeW - 8, 11, 8, 'bold');
    }
  }
}

function drawForegroundSign(
  ctx: CanvasRenderingContext2D,
  b: Billboard,
  groundY: number,
  canvasH: number,
  canvasW: number,
  logos: Map<string, HTMLImageElement>,
  level: GameLevelId
) {
  if (isTradeShowLevel(level)) {
    if (b.kind === 'company' && typeof b.companyIndex === 'number') {
      drawTradeStand(ctx, b, groundY, canvasH, canvasW, logos, level);
    }
    return;
  }
  drawBillboard(ctx, b, groundY, canvasH, canvasW, logos);
}

function dimsFor(kind: ObstacleKind): { w: number; h: number } {
  switch (kind) {
    case 'speed_camera':
      return { w: 52, h: 64 };
    case 'pcn':
      return { w: 42, h: 56 };
    case 'pro_forma_invoice':
      return { w: 50, h: 60 };
    case 'broken_car':
      return { w: 80, h: 58 };
    case 'sales_target':
      return { w: 50, h: 62 };
    case 'hmrc':
      return { w: 54, h: 58 };
    case 'snake':
      return { w: 86, h: 44 };
    case 'trade_clipboard':
      return { w: 50, h: 62 };
    case 'trade_coffee':
      return { w: 46, h: 54 };
    case 'trade_box':
      return { w: 58, h: 56 };
    case 'hg_xmas_tree':
      return { w: 54, h: 66 };
    case 'hg_reindeer':
      return { w: 72, h: 58 };
    case 'hg_sleigh':
      return { w: 96, h: 56 };
    case 'bonus_fire_emoji':
      return { w: 76, h: 84 };
  }
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
  ctx.lineTo(x + rad, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
  ctx.lineTo(x, y + rad);
  ctx.quadraticCurveTo(x, y, x + rad, y);
  ctx.closePath();
}

function fillTextScaled(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  maxPx: number,
  minPx: number,
  weight: '' | 'bold' = ''
) {
  let px = maxPx;
  const w = weight === 'bold' ? 'bold ' : '';
  while (px > minPx) {
    ctx.font = `${w}${px}px system-ui, sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) break;
    px -= 0.5;
  }
  px = Math.max(minPx, px);
  ctx.font = `${w}${px}px system-ui, sans-serif`;
  ctx.fillText(text, x, y);
}

function fillTextScaledCenter(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  maxWidth: number,
  maxPx: number,
  minPx: number,
  weight: '' | 'bold' = ''
) {
  let px = maxPx;
  const w = weight === 'bold' ? 'bold ' : '';
  while (px > minPx) {
    ctx.font = `${w}${px}px system-ui, sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) break;
    px -= 0.5;
  }
  px = Math.max(minPx, px);
  ctx.font = `${w}${px}px system-ui, sans-serif`;
  const tw = ctx.measureText(text).width;
  ctx.fillText(text, cx - tw / 2, y);
}

/** Hitbox excludes top smoke puffs so jumping through smoke is fair. */
const BROKEN_CAR_COLLISION_H = 44;
/** Tall emoji/glow art; only the lower flame band is lethal (same idea as the car). */
const BONUS_FIRE_COLLISION_H = 40;
/** Horizontal sway (px); `swayOffset` updated each tick from world run distance. */
const BONUS_FIRE_SWAY_PX = 16;
const BONUS_FIRE_SWAY_FREQ = 0.0095;
/** Bonus Hell Mode (replaces disco there): score gate, lasts one Hell track. */
const BONUS_HELL_MIN_SCORE = 5000;
const HELL_FIRE_VISUAL_MULT = 1.14;
const HELL_FIRE_COLLISION_MULT = 1.12;
const HELL_FIRE_SWAY_MULT = 1.28;
/** Wall-clock: harder stretch every interval (bonus only). */
const BONUS_HEAT_WAVE_INTERVAL_MS = 90_000;
const BONUS_HEAT_WAVE_DURATION_MS = 10_000;
const BONUS_HEAT_WAVE_SCROLL_MULT = 1.22;
const BONUS_HEAT_WAVE_SWAY_MULT = 1.72;
const BONUS_PARTICLE_CAP = 72;
const HEAT_WAVE_HUD_FRAMES = 66;
/** Rare bonus pickup — random buff on collect; toast explains outcome. */
const MYSTERY_BOX_SPAWN_CHANCE = 0.2;
const MYSTERY_JACKPOT_SCORE = 950;
const BONUS_SLOWMO_DURATION_MS = 5200;
/** World scroll during slow-mo; same factor scales player physics so jump timing still matches fire. */
const BONUS_SLOWMO_SCROLL_MULT = 0.56;
const BONUS_MYSTERY_TOAST_FRAMES = 96;
/** After shield absorbs a fire hit, skip fire damage briefly so a wide flame doesn’t kill next frame. */
const BONUS_SHIELD_FIRE_INVULN_FRAMES = 26;
/** Square mystery pickup — smaller than normal bonus collectibles; bottom aligns with them. */
const MYSTERY_BOX_SIDE = 58;

function rollBonusMysteryEffect(): 'jackpot' | 'slowmo' | 'shield' {
  const r = Math.random();
  if (r < 1 / 3) return 'jackpot';
  if (r < 2 / 3) return 'slowmo';
  return 'shield';
}

function drawBonusToastBox(
  ctx: CanvasRenderingContext2D,
  W: number,
  _H: number,
  text: string,
  opacity: number
) {
  const lines = text.split('\n').filter(Boolean);
  if (lines.length === 0) return;
  const fsTitle = Math.min(20, Math.max(15, W * 0.045));
  const fsBody = Math.min(15, Math.max(12, W * 0.034));
  ctx.save();
  ctx.globalAlpha = opacity;
  let maxW = 0;
  ctx.font = `bold ${fsTitle}px system-ui, sans-serif`;
  maxW = Math.max(maxW, ctx.measureText(lines[0]!).width);
  for (let i = 1; i < lines.length; i++) {
    ctx.font = `${fsBody}px system-ui, sans-serif`;
    maxW = Math.max(maxW, ctx.measureText(lines[i]!).width);
  }
  const padX = 20;
  const padY = 14;
  const lineGap = 8;
  const bodyLines = Math.max(0, lines.length - 1);
  const boxW = maxW + padX * 2;
  const boxH = padY * 2 + fsTitle + (bodyLines > 0 ? lineGap + bodyLines * (fsBody + 3) : 0);
  const bx = (W - boxW) / 2;
  const by = Math.floor(_H * 0.34);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  roundRectPath(ctx, bx, by, boxW, boxH, 14);
  ctx.fill();
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.9)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#fef3c7';
  ctx.font = `bold ${fsTitle}px system-ui, sans-serif`;
  let ty = by + padY + fsTitle * 0.8;
  ctx.fillText(lines[0]!, bx + boxW / 2, ty);
  if (bodyLines > 0) {
    ctx.fillStyle = '#e2e8f0';
    ctx.font = `${fsBody}px system-ui, sans-serif`;
    ty += lineGap;
    for (let li = 1; li < lines.length; li++) {
      ty += fsBody;
      ctx.fillText(lines[li]!, bx + boxW / 2, ty);
      ty += 3;
    }
  }
  ctx.textAlign = 'left';
  ctx.globalAlpha = 1;
  ctx.restore();
}

function bonusFireSwayOffset(runDist: number, phase: number, pxScale = 1): number {
  return Math.sin(runDist * BONUS_FIRE_SWAY_FREQ + phase) * BONUS_FIRE_SWAY_PX * pxScale;
}

interface BonusParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  phase: number;
}

function drawBonusParticleTrail(
  ctx: CanvasRenderingContext2D,
  parts: readonly BonusParticle[],
  heatWave: boolean
) {
  for (const p of parts) {
    const a = Math.min(1, p.life) * 0.88;
    if (a < 0.04) continue;
    const r = 1.1 + (1 - p.life) * 2.4;
    ctx.fillStyle = heatWave
      ? `rgba(255, ${120 + Math.floor(100 * p.life)}, ${60 + Math.floor(40 * p.life)}, ${a})`
      : `rgba(253, 224, ${90 + Math.floor(120 * p.life)}, ${a})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(255,255,255,${a * 0.35})`;
    ctx.beginPath();
    ctx.arc(p.x - r * 0.35, p.y - r * 0.35, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }
}

function obstacleEffectiveLeft(o: Obstacle): number {
  return o.x + (o.swayOffset ?? 0);
}

/** Road strip + image scaled into obstacle box; sprite bottom flush with ground (`top + h`). */
function drawObstacleImageOnFloor(
  ctx: CanvasRenderingContext2D,
  x: number,
  top: number,
  w: number,
  h: number,
  img: HTMLImageElement | null | undefined,
  fallback: 'snake' | 'car' | 'clipboard' | 'coffee' | 'box' | 'xmasTree' | 'reindeer' | 'sleigh'
) {
  const groundY = top + h;
  const stripH = 4;
  ctx.fillStyle = '#292524';
  ctx.fillRect(x, groundY - stripH, w, stripH);
  if (img?.complete && img.naturalWidth > 0) {
    const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = x + (w - dw) / 2;
    const dy = groundY - dh;
    ctx.drawImage(img, dx, dy, dw, dh);
    return;
  }
  if (fallback === 'snake') {
    ctx.fillStyle = '#166534';
    roundRectPath(ctx, x + 4, top + 6, w - 8, h - stripH - 8, 4);
    ctx.fill();
  } else if (fallback === 'car') {
    ctx.fillStyle = '#2563eb';
    roundRectPath(ctx, x + 6, top + 8, w - 12, h - stripH - 14, 4);
    ctx.fill();
  } else if (fallback === 'clipboard') {
    ctx.fillStyle = '#e7e5e4';
    roundRectPath(ctx, x + 5, top + 6, w - 10, h - stripH - 10, 3);
    ctx.fill();
    ctx.strokeStyle = '#78716c';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else if (fallback === 'coffee') {
    ctx.fillStyle = '#fef3c7';
    roundRectPath(ctx, x + 6, top + 8, w - 12, h - stripH - 12, 4);
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.stroke();
  } else if (fallback === 'xmasTree') {
    const cx = x + w / 2;
    const gy = top + h;
    ctx.fillStyle = '#78350f';
    ctx.fillRect(cx - 5, gy - stripH - 14, 10, 14);
    ctx.fillStyle = '#166534';
    ctx.beginPath();
    ctx.moveTo(cx, top + 4);
    ctx.lineTo(cx + w * 0.38, gy - stripH - 16);
    ctx.lineTo(cx - w * 0.38, gy - stripH - 16);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(cx, top + 10, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (fallback === 'reindeer') {
    ctx.fillStyle = '#92400e';
    roundRectPath(ctx, x + 4, top + 8, w - 8, h - stripH - 10, 5);
    ctx.fill();
  } else if (fallback === 'sleigh') {
    ctx.fillStyle = '#b91c1c';
    roundRectPath(ctx, x + 5, top + 10, w - 10, h - stripH - 12, 4);
    ctx.fill();
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else {
    ctx.fillStyle = '#d6d3d1';
    roundRectPath(ctx, x + 4, top + 6, w - 8, h - stripH - 8, 3);
    ctx.fill();
    ctx.strokeStyle = '#a8a29e';
    ctx.stroke();
  }
}

function drawOrderPickup(
  ctx: CanvasRenderingContext2D,
  o: OrderPickup,
  groundY: number,
  level: GameLevelId,
  logos: Map<string, HTMLImageElement>
) {
  const { x, w, h } = o;
  let top = orderPickupTop(groundY, level);
  if (o.isMysteryBox && level === 'bonus') {
    top = top + BONUS_ORDER_H - h;
  }
  if (o.isMysteryBox) {
    const r = 4;
    ctx.save();
    ctx.shadowColor = 'rgba(250, 204, 21, 0.75)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 0;
    const g = ctx.createLinearGradient(x, top, x + w, top + h);
    g.addColorStop(0, '#fcd34d');
    g.addColorStop(0.35, '#f59e0b');
    g.addColorStop(0.7, '#ea580c');
    g.addColorStop(1, '#a21caf');
    ctx.fillStyle = g;
    roundRectPath(ctx, x - 2, top - 2, w + 4, h + 4, r + 2);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    roundRectPath(ctx, x - 1, top - 1, w + 2, h + 2, r + 1);
    ctx.stroke();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    roundRectPath(ctx, x, top, w, h, r);
    ctx.stroke();

    const fs = Math.min(32, Math.max(20, Math.floor(w * 0.48)));
    const cx = x + w / 2;
    const cy = top + h / 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `900 ${fs}px system-ui, -apple-system, sans-serif`;
    const lw = Math.max(2.5, fs * 0.14);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = lw;
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;
    ctx.strokeText('?', cx, cy);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('?', cx, cy);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    return;
  }
  const src = o.collectibleSrc;
  if (src) {
    const img = logos.get(src);
    if (img && img.complete && img.naturalWidth > 0) {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.min(w / iw, h / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = x + (w - dw) / 2;
      const dy = top + (h - dh) / 2;
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.28)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetY = 2;
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    }
    return;
  }

  const rBezel = 5;
  ctx.fillStyle = '#94a3b8';
  roundRectPath(ctx, x - 1, top - 1, w + 2, h + 2, rBezel + 1);
  ctx.fill();
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#1e293b';
  roundRectPath(ctx, x, top, w, h, rBezel);
  ctx.fill();

  const inset = 5;
  const sx = x + inset;
  const sy = top + inset;
  const sw = w - inset * 2;
  const sh = h - inset * 2;
  ctx.fillStyle = '#e2e8f0';
  roundRectPath(ctx, sx, sy, sw, sh, 3);
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#1d4ed8';
  fillTextScaledCenter(ctx, 'ORDER', x + w / 2, sy + sh * 0.58, sw - 4, 11, 7, 'bold');

  const homeR = 2.2;
  const hx = x + w * 0.5;
  const hy = top + h - 5;
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.arc(hx, hy, homeR, 0, Math.PI * 2);
  ctx.fill();
}

function drawObstacle(
  ctx: CanvasRenderingContext2D,
  o: Obstacle,
  top: number,
  gameImages: Map<string, HTMLImageElement>,
  bonusHellFireScale = 1
) {
  const { x, w, h, kind } = o;

  switch (kind) {
    case 'snake': {
      drawObstacleImageOnFloor(ctx, x, top, w, h, gameImages.get(SNAKE_GAME_PNG_SRC), 'snake');
      break;
    }
    case 'pcn': {
      const pad = 6;
      const tw = w - pad * 2;
      ctx.fillStyle = '#fef3c7';
      roundRectPath(ctx, x, top, w, h, 4);
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#dc2626';
      fillTextScaled(ctx, 'PCN', x + pad, top + 15, tw, 11, 8, 'bold');
      ctx.fillStyle = '#1c1917';
      fillTextScaled(ctx, 'Penalty', x + pad, top + 26, tw, 8, 6, '');
      fillTextScaled(ctx, 'charge', x + pad, top + 35, tw, 8, 6, '');
      fillTextScaled(ctx, '£60', x + pad, top + 45, tw, 10, 7, '');
      ctx.fillRect(x + 6, top + h - 12, w - 12, 2);
      ctx.fillStyle = '#78716c';
      const tickCount = Math.min(6, Math.floor((w - 16) / 6));
      for (let i = 0; i < tickCount; i++) ctx.fillRect(x + 8 + i * 6, top + h - 8, 3, 4);
      break;
    }
    case 'pro_forma_invoice': {
      const innerPad = 6;
      const textW = w - innerPad * 2;
      const cx = x + w / 2;
      ctx.fillStyle = '#fafaf9';
      roundRectPath(ctx, x + 1, top + 2, w - 2, h - 4, 3);
      ctx.fill();
      ctx.strokeStyle = '#a8a29e';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#44403c';
      fillTextScaled(ctx, 'PRO FORMA', x + innerPad, top + 14, textW, 8, 6, '');
      ctx.fillStyle = '#b91c1c';
      fillTextScaled(ctx, 'INVOICE', x + innerPad, top + 25, textW, 11, 8, 'bold');
      ctx.fillStyle = '#78716c';
      ctx.fillRect(x + innerPad, top + 30, Math.min(w - 24, textW * 0.85), 2);
      ctx.fillRect(x + innerPad, top + 34, Math.min(w - 16, textW), 2);
      const stampH = 15;
      const stampY = top + h - stampH - 4;
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 2]);
      roundRectPath(ctx, x + 5, stampY, w - 10, stampH, 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#b91c1c';
      const stampInner = w - 14;
      fillTextScaledCenter(ctx, 'NOT A TAX', cx, stampY + 7, stampInner, 6, 4, 'bold');
      fillTextScaledCenter(ctx, 'INVOICE', cx, stampY + 13, stampInner, 6, 4, 'bold');
      break;
    }
    case 'hmrc': {
      const hx = x + w / 2;
      const inner = w - 12;
      ctx.fillStyle = '#008670';
      roundRectPath(ctx, x + 2, top + 4, w - 4, h - 8, 5);
      ctx.fill();
      ctx.strokeStyle = '#006854';
      ctx.lineWidth = 2;
      ctx.stroke();

      const alertX = x + 11;
      const alertY = top + 11;
      ctx.fillStyle = '#fecaca';
      ctx.beginPath();
      ctx.arc(alertX, alertY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#991b1b';
      ctx.font = 'bold 7px system-ui, sans-serif';
      ctx.fillText('!', alertX - 2.5, alertY + 3);

      ctx.fillStyle = '#ffffff';
      fillTextScaledCenter(ctx, 'HMRC', hx, top + 32, inner, 15, 10, 'bold');
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      fillTextScaledCenter(ctx, 'Return /', hx, top + 44, inner, 9, 6, '');
      fillTextScaledCenter(ctx, 'payment', hx, top + 54, inner, 9, 6, '');
      break;
    }
    case 'broken_car': {
      drawObstacleImageOnFloor(ctx, x, top, w, h, gameImages.get(FAULTY_CAR_PNG_SRC), 'car');
      break;
    }
    case 'sales_target': {
      ctx.fillStyle = '#fef2f2';
      roundRectPath(ctx, x, top, w, h, 4);
      ctx.fill();
      ctx.strokeStyle = '#be185d';
      ctx.stroke();
      const cx = x + w / 2;
      const cy = top + h * 0.36;
      const r = Math.min(w, h) * 0.24;
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      const k = r * 0.72;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - k, cy - k);
      ctx.lineTo(cx + k, cy + k);
      ctx.moveTo(cx + k, cy - k);
      ctx.lineTo(cx - k, cy + k);
      ctx.stroke();
      ctx.fillStyle = '#991b1b';
      fillTextScaledCenter(ctx, 'Sales', cx, top + h - 20, w - 10, 9, 7, 'bold');
      fillTextScaledCenter(ctx, 'Targets', cx, top + h - 8, w - 10, 9, 7, 'bold');
      break;
    }
    case 'speed_camera': {
      const pad = 3;
      const boxW = w - pad * 2 - 6;
      const boxH = Math.max(26, h * 0.36);
      const boxX = x + pad + 3;
      const boxY = top + 5;
      const bottomY = top + h;
      const postW = 10;
      const postX = x + w / 2 - postW / 2;

      ctx.fillStyle = '#9ca3af';
      ctx.fillRect(boxX - 2, boxY - 4, boxW + 4, 4);

      ctx.fillStyle = '#78716c';
      ctx.fillRect(boxX - 5, boxY, 5, boxH);

      ctx.fillStyle = '#facc15';
      ctx.fillRect(boxX, boxY, boxW, boxH);

      ctx.fillStyle = '#a8a29e';
      ctx.fillRect(boxX + boxW, boxY, 5, boxH);
      ctx.fillStyle = '#171717';
      ctx.font = 'bold 7px system-ui, sans-serif';
      const numX = boxX + boxW + 2;
      const numCy = boxY + boxH * 0.48;
      ctx.fillText('2', numX, numCy - 4);
      ctx.fillText('1', numX, numCy + 4);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(boxX + 5, boxY + 5, 7, 6);

      ctx.fillStyle = '#d4d4d8';
      ctx.fillRect(boxX + 6, boxY + boxH * 0.38, boxW - 12, Math.max(6, boxH * 0.16));
      ctx.strokeStyle = 'rgba(15,23,42,0.15)';
      ctx.strokeRect(boxX + 6, boxY + boxH * 0.38, boxW - 12, Math.max(6, boxH * 0.16));

      ctx.fillStyle = '#171717';
      ctx.fillRect(boxX + boxW - 17, boxY + boxH - 15, 13, 12);
      ctx.fillStyle = '#27272a';
      ctx.fillRect(boxX + boxW - 15, boxY + boxH - 13, 9, 4);

      ctx.fillStyle = '#6b7280';
      ctx.fillRect(postX - 2, boxY + boxH - 1, postW + 4, 5);
      ctx.fillRect(postX, boxY + boxH + 3, postW, bottomY - (boxY + boxH + 3));
      break;
    }
    case 'trade_clipboard': {
      drawObstacleImageOnFloor(
        ctx,
        x,
        top,
        w,
        h,
        gameImages.get(CLIPBOARD_GAME_PNG_SRC),
        'clipboard'
      );
      break;
    }
    case 'trade_coffee': {
      drawObstacleImageOnFloor(ctx, x, top, w, h, gameImages.get(COFFEE_GAME_PNG_SRC), 'coffee');
      break;
    }
    case 'trade_box': {
      drawObstacleImageOnFloor(ctx, x, top, w, h, gameImages.get(BOX_GAME_PNG_SRC), 'box');
      break;
    }
    case 'hg_xmas_tree': {
      drawObstacleImageOnFloor(
        ctx,
        x,
        top,
        w,
        h,
        gameImages.get(XMAS_TREE_GAME_PNG_SRC),
        'xmasTree'
      );
      break;
    }
    case 'hg_reindeer': {
      drawObstacleImageOnFloor(
        ctx,
        x,
        top,
        w,
        h,
        gameImages.get(REINDEER_GAME_PNG_SRC),
        'reindeer'
      );
      break;
    }
    case 'hg_sleigh': {
      drawObstacleImageOnFloor(ctx, x, top, w, h, gameImages.get(SLEIGH_GAME_PNG_SRC), 'sleigh');
      break;
    }
    case 'bonus_fire_emoji': {
      const x0 = obstacleEffectiveLeft(o);
      const bottom = top + h;
      const s = bonusHellFireScale;
      const th = h * s;
      const tw = w * s;
      const x0s = x0 + (w - tw) / 2;
      const cx = x0s + tw * 0.5;
      const baseY = bottom - 2;
      const glowR = Math.max(18, tw * 0.42);
      const rg = ctx.createRadialGradient(cx, baseY - 8, 2, cx, baseY, glowR);
      rg.addColorStop(0, 'rgba(255, 250, 200, 0.95)');
      rg.addColorStop(0.35, 'rgba(255, 140, 40, 0.85)');
      rg.addColorStop(0.7, 'rgba(220, 60, 20, 0.55)');
      rg.addColorStop(1, 'rgba(80, 20, 10, 0)');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.ellipse(cx, baseY - 4, glowR, glowR * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
      ctx.beginPath();
      ctx.ellipse(cx, bottom + 2, glowR * 0.65, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      const em = Math.max(44, Math.min(84, Math.floor(th * 1.02)));
      ctx.font = `${em}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",system-ui,sans-serif`;
      ctx.shadowColor = 'rgba(255, 130, 40, 1)';
      ctx.shadowBlur = 14;
      ctx.fillText('🔥', cx, bottom + 4);
      ctx.shadowBlur = 0;
      ctx.fillText('🔥', cx, bottom + 4);
      ctx.restore();
      break;
    }
  }
}

function drawRoadBackdrop(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  groundY: number,
  score: number
) {
  const grd = ctx.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, '#87CEEB');
  grd.addColorStop(1, '#E0F4FF');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#6B5344';
  ctx.fillRect(0, groundY, W, H - groundY);
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(0, groundY, W, 8);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  const cloudShift = (score * 0.35) % (W + 120);
  ctx.beginPath();
  ctx.arc(W - cloudShift + 40, 52, 20, 0, Math.PI * 2);
  ctx.arc(W - cloudShift + 62, 48, 26, 0, Math.PI * 2);
  ctx.arc(W - cloudShift + 88, 52, 20, 0, Math.PI * 2);
  ctx.fill();
}

/** Abstract “bonus room” — not road / NEC / Harrogate. */
function drawBonusBackdrop(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  groundY: number,
  score: number
) {
  const sky = ctx.createLinearGradient(0, 0, 0, groundY + 24);
  sky.addColorStop(0, '#0f0a1f');
  sky.addColorStop(0.4, '#1e1b4b');
  sky.addColorStop(1, '#4c1d95');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, groundY + 8);

  const drift = (score * 0.22) % 280;
  ctx.strokeStyle = 'rgba(250,204,21,0.12)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 9; i++) {
    const x0 = -drift + i * 110;
    ctx.beginPath();
    ctx.moveTo(x0, 18);
    ctx.lineTo(x0 + 80, groundY - 30);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(250,204,21,0.5)';
  for (let i = 0; i < 14; i++) {
    const px = ((i * 73 + drift * 1.4) % (W + 36)) - 18;
    const py = 24 + (i * 19) % Math.max(32, groundY - 70);
    ctx.globalAlpha = 0.35 + (i % 4) * 0.1;
    ctx.beginPath();
    ctx.arc(px, py, 1.8 + (i % 3) * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const floor = ctx.createLinearGradient(0, groundY, 0, H);
  floor.addColorStop(0, '#312e81');
  floor.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = floor;
  ctx.fillRect(0, groundY, W, H - groundY);
  ctx.fillStyle = 'rgba(251,191,36,0.45)';
  ctx.fillRect(0, groundY, W, 3);
  ctx.fillStyle = 'rgba(15,23,42,0.35)';
  ctx.fillRect(0, groundY + 3, W, 6);
}

/** Festive string lights along the hall ceiling (Harrogate only — not a gameplay hazard). */
function drawHarrogateCeilingStringLights(
  ctx: CanvasRenderingContext2D,
  W: number,
  ceilH: number,
  score: number
) {
  const parallax = score * 0.14;
  const segW = 98;
  const wireY = Math.min(15, Math.max(8, ceilH * 0.14));
  const hues = ['#ef4444', '#22c55e', '#eab308', '#3b82f6', '#a855f7'] as const;
  const startX = -((parallax * 0.22) % segW) - segW;
  for (let sx = startX; sx < W + segW * 2; sx += segW) {
    const x0 = sx;
    const x1 = sx + segW - 10;
    const mid = (x0 + x1) / 2;
    ctx.strokeStyle = '#1c1917';
    ctx.lineWidth = 1.35;
    ctx.beginPath();
    ctx.moveTo(x0, wireY);
    ctx.quadraticCurveTo(mid, wireY + 15, x1, wireY);
    ctx.stroke();
    for (let i = 0; i < 6; i++) {
      const t = i / 5;
      const bx = x0 + (x1 - x0) * t;
      const by = wireY + Math.sin(t * Math.PI) * 15;
      ctx.fillStyle = hues[i % hues.length]!;
      ctx.beginPath();
      ctx.arc(bx, by, 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.beginPath();
      ctx.arc(bx - 1, by - 1, 1.15, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawIndoorHallBackdrop(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  groundY: number,
  score: number,
  theme: 'nec' | 'harrogate'
) {
  const scroll = score * 0.18;
  const ceilH = Math.min(groundY * 0.22, 72);
  const cg = ctx.createLinearGradient(0, 0, 0, ceilH + 40);
  if (theme === 'harrogate') {
    cg.addColorStop(0, '#1e1b4b');
    cg.addColorStop(0.5, '#312e81');
    cg.addColorStop(1, '#475569');
  } else {
    cg.addColorStop(0, '#0f172a');
    cg.addColorStop(1, '#334155');
  }
  ctx.fillStyle = cg;
  ctx.fillRect(0, 0, W, groundY);

  if (theme === 'harrogate') {
    drawHarrogateCeilingStringLights(ctx, W, ceilH, score);
  }

  const panelW = 56;
  const lightY = ceilH * 0.35;
  for (let px = -((scroll * 0.2) % (panelW * 1.3)); px < W + panelW; px += panelW * 1.35) {
    ctx.fillStyle = 'rgba(15,23,42,0.45)';
    roundRectPath(ctx, px, lightY - 2, panelW, 20, 4);
    ctx.fill();
    const warm = theme === 'harrogate';
    ctx.fillStyle = warm ? 'rgba(253,230,138,0.5)' : 'rgba(248,250,252,0.4)';
    roundRectPath(ctx, px + 5, lightY + 2, panelW - 10, 12, 2);
    ctx.fill();
    ctx.fillStyle = warm ? 'rgba(254,243,199,0.75)' : 'rgba(255,255,255,0.55)';
    ctx.fillRect(px + 10, lightY + 5, panelW - 20, 6);
  }

  /* Depth only — avoid tall rectangles that read like scrolling billboards; real branding is foreground trade stands. */
  const beamScroll = (score * 0.08) % 72;
  for (let bx = -beamScroll; bx < W + 40; bx += 68) {
    const beamW = 10;
    const beamTop = ceilH + 18;
    const beamBot = groundY - 36;
    ctx.fillStyle = 'rgba(30,41,59,0.22)';
    ctx.fillRect(bx, beamTop, beamW, beamBot - beamTop);
    ctx.fillStyle = 'rgba(148,163,184,0.12)';
    ctx.fillRect(bx + 2, beamTop, 2, beamBot - beamTop);
  }

  if (theme === 'harrogate') {
    const floorTop = groundY;
    const floorH = H - floorTop;
    const iceTop = ctx.createLinearGradient(0, floorTop, 0, floorTop + Math.min(48, floorH * 0.35));
    iceTop.addColorStop(0, '#f0f9ff');
    iceTop.addColorStop(0.45, '#bae6fd');
    iceTop.addColorStop(1, '#7dd3fc');
    ctx.fillStyle = iceTop;
    ctx.fillRect(0, floorTop, W, floorH);
    const iceDeep = ctx.createLinearGradient(0, floorTop + floorH * 0.4, 0, H);
    iceDeep.addColorStop(0, '#38bdf8');
    iceDeep.addColorStop(1, '#0c4a6e');
    ctx.fillStyle = iceDeep;
    ctx.fillRect(0, floorTop + floorH * 0.4, W, floorH * 0.6 + 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 1;
    for (let sx = -((scroll * 0.55) % 120); sx < W + 60; sx += 45) {
      ctx.beginPath();
      ctx.moveTo(sx, floorTop + 8);
      ctx.quadraticCurveTo(sx + 22, floorTop + floorH * 0.35, sx + 50, floorTop + floorH * 0.55);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillRect(0, floorTop, W, 5);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(0, floorTop, W, 1);
    ctx.fillStyle = 'rgba(56,189,248,0.15)';
    for (let gx = -((scroll * 0.8) % 90); gx < W + 40; gx += 70) {
      ctx.fillRect(gx, floorTop + floorH * 0.2, 28, 3);
    }
    ctx.fillStyle = 'rgba(15,23,42,0.25)';
    ctx.font = '600 8px system-ui, sans-serif';
    ctx.fillText('ICY (apparently) — watch your step', 10, floorTop + 18);
  } else {
    ctx.fillStyle = '#4b5563';
    ctx.fillRect(0, groundY, W, H - groundY);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, groundY, W, 7);
    ctx.strokeStyle = 'rgba(148,163,184,0.4)';
    ctx.lineWidth = 1;
    for (let lx = -((scroll * 0.35) % 80); lx < W + 40; lx += 78) {
      ctx.beginPath();
      ctx.moveTo(lx, groundY + 10);
      ctx.lineTo(lx + 36, H);
      ctx.stroke();
    }
  }
}

/** Indoor “snow” for Harrogate (joke): flakes drift over the hall. */
function drawHarrogateIndoorSnow(
  ctx: CanvasRenderingContext2D,
  W: number,
  groundY: number,
  score: number
) {
  const t = performance.now() * 0.0012;
  const drift = score * 0.08;
  const n = 72;
  for (let i = 0; i < n; i++) {
    const seed = i * 997 + 1337;
    const sx = ((seed * 0.413 + drift + Math.sin(t * 0.7 + i * 0.2) * 12) % (W + 24)) - 4;
    const col = (i * 47) % 3;
    const speed = 22 + col * 9 + (i % 5) * 3;
    const y = ((seed * 0.07 + t * speed + i * 17) % (groundY + 30)) - 8;
    if (y < 4 || y > groundY - 2) continue;
    const r = 0.9 + (i % 4) * 0.35;
    const a = 0.35 + (i % 7) * 0.08;
    ctx.fillStyle = `rgba(248,250,252,${a})`;
    ctx.beginPath();
    ctx.arc(sx, y, r, 0, Math.PI * 2);
    ctx.fill();
    if (i % 5 === 0) {
      ctx.strokeStyle = `rgba(255,255,255,${a * 0.6})`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(sx - r * 1.8, y);
      ctx.lineTo(sx + r * 1.8, y);
      ctx.moveTo(sx, y - r * 1.8);
      ctx.lineTo(sx, y + r * 1.8);
      ctx.stroke();
    }
  }
}

function drawPlayer(ctx: CanvasRenderingContext2D, px: number, yTop: number, pw: number, ph: number) {
  const skin = '#d4a574';
  const quiff = '#4a3020';
  const quiffHi = '#6b4423';
  const olive = '#5f6b47';
  const oliveDark = '#4a5336';
  const olivePocket = '#515f3d';
  const flop = '#fb923c';
  const flopStrap = '#ea580c';
  const cx = px + pw / 2;

  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(cx, yTop + 17, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = quiff;
  ctx.beginPath();
  ctx.moveTo(cx - 9, yTop + 13);
  ctx.quadraticCurveTo(cx - 7, yTop + 4, cx, yTop + 2);
  ctx.quadraticCurveTo(cx + 7, yTop + 4, cx + 9, yTop + 13);
  ctx.quadraticCurveTo(cx + 5, yTop + 11, cx, yTop + 10);
  ctx.quadraticCurveTo(cx - 5, yTop + 11, cx - 9, yTop + 13);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = quiffHi;
  ctx.beginPath();
  ctx.ellipse(cx, yTop + 7, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#292524';
  ctx.fillRect(cx - 6, yTop + 16, 2, 2);
  ctx.fillRect(cx + 4, yTop + 16, 2, 2);

  const shirtY = yTop + 22;
  const shirtH = 15;
  const shirtW = pw - 8;
  const shirtX = px + 4;

  ctx.save();
  roundRectPath(ctx, shirtX, shirtY, shirtW, shirtH, 3);
  ctx.clip();
  ctx.fillStyle = '#c4b5a4';
  ctx.fillRect(shirtX, shirtY, shirtW, shirtH);
  ctx.strokeStyle = 'rgba(111, 47, 31, 0.55)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= shirtW; i += 4) {
    ctx.beginPath();
    ctx.moveTo(shirtX + i, shirtY);
    ctx.lineTo(shirtX + i, shirtY + shirtH);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(41, 59, 82, 0.5)';
  for (let j = 0; j <= shirtH; j += 4) {
    ctx.beginPath();
    ctx.moveTo(shirtX, shirtY + j);
    ctx.lineTo(shirtX + shirtW, shirtY + j);
    ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = '#a89f91';
  ctx.beginPath();
  ctx.moveTo(shirtX + 4, shirtY);
  ctx.lineTo(shirtX + 14, shirtY - 6);
  ctx.lineTo(cx - 3, shirtY);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(shirtX + shirtW - 4, shirtY);
  ctx.lineTo(shirtX + shirtW - 14, shirtY - 6);
  ctx.lineTo(cx + 3, shirtY);
  ctx.closePath();
  ctx.fill();

  roundRectPath(ctx, shirtX, shirtY, shirtW, shirtH, 3);
  ctx.strokeStyle = '#57534e';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.strokeStyle = '#44403c';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, shirtY + 3);
  ctx.lineTo(cx, shirtY + shirtH - 2);
  ctx.stroke();
  ctx.fillStyle = '#e7e5e4';
  for (let b = 0; b < 3; b++) {
    ctx.beginPath();
    ctx.arc(cx, shirtY + 6 + b * 5, 1.3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = skin;
  ctx.fillRect(px, yTop + 24, 6, 12);
  ctx.fillRect(px + pw - 6, yTop + 24, 6, 12);

  const shortsY = shirtY + shirtH;
  ctx.fillStyle = olive;
  roundRectPath(ctx, px + 3, shortsY, pw - 6, 10, 2);
  ctx.fill();
  ctx.strokeStyle = oliveDark;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = olivePocket;
  ctx.fillRect(px + 4, shortsY + 3, 10, 6);
  ctx.fillRect(px + pw - 14, shortsY + 3, 10, 6);
  ctx.strokeStyle = '#3d4530';
  ctx.strokeRect(px + 4, shortsY + 3, 10, 6);
  ctx.strokeRect(px + pw - 14, shortsY + 3, 10, 6);
  ctx.fillStyle = olive;
  ctx.fillRect(px + 5, shortsY + 4, 8, 2);
  ctx.fillRect(px + pw - 13, shortsY + 4, 8, 2);

  ctx.fillStyle = skin;
  ctx.fillRect(px + 8, shortsY + 8, 5, 7);
  ctx.fillRect(px + pw - 13, shortsY + 8, 5, 7);

  const footY = yTop + ph - 5;
  ctx.fillStyle = flop;
  ctx.fillRect(px + 4, footY, 15, 5);
  ctx.fillRect(px + pw - 19, footY, 15, 5);

  ctx.strokeStyle = flopStrap;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(px + 8, footY + 1);
  ctx.quadraticCurveTo(px + 12, footY - 3, px + 16, footY + 1);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(px + pw - 16, footY + 1);
  ctx.quadraticCurveTo(px + pw - 12, footY - 3, px + pw - 8, footY + 1);
  ctx.stroke();
}

function drawDiscoStarburst(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, alpha: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = 'rgba(255,255,255,0.95)';
  ctx.lineWidth = 1.4;
  const rays = 8;
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.98)';
  ctx.beginPath();
  ctx.arc(0, 0, 2.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawDiscoFlashes(ctx: CanvasRenderingContext2D, W: number, H: number, groundY: number) {
  const t = performance.now() * 0.0035;
  const beat = Math.sin(t * 4.2) * 0.5 + 0.5;
  const n = 6;
  for (let i = 0; i < n; i++) {
    const hue = (t * 90 + i * (360 / n)) % 360;
    const x = (W / n) * i - 1;
    ctx.fillStyle = `hsla(${hue}, 88%, 52%, ${0.06 + beat * 0.1})`;
    ctx.fillRect(x, 0, W / n + 3, groundY + 14);
  }
  ctx.fillStyle = `rgba(255,255,255,${0.04 + beat * 0.07})`;
  ctx.fillRect(0, 0, W, groundY + 10);
  if (Math.floor(t * 10) % 2 === 0) {
    ctx.fillStyle = 'rgba(250, 204, 21, 0.07)';
    ctx.fillRect(0, groundY - 6, W, H - groundY + 6);
  }
}

function drawHellFlashes(ctx: CanvasRenderingContext2D, W: number, H: number, groundY: number) {
  const t = performance.now() * 0.0042;
  const beat = Math.sin(t * 5.5) * 0.5 + 0.5;
  const n = 5;
  for (let i = 0; i < n; i++) {
    const x = (W / n) * i - 2;
    ctx.fillStyle = `rgba(220, 38, 38, ${0.07 + beat * 0.12})`;
    ctx.fillRect(x, 0, W / n + 5, groundY + 16);
    ctx.fillStyle = `rgba(234, 88, 12, ${0.05 + beat * 0.08})`;
    ctx.fillRect(x + 4, 0, W / n - 2, groundY + 12);
  }
  ctx.fillStyle = `rgba(254, 243, 199, ${0.035 + beat * 0.06})`;
  ctx.fillRect(0, 0, W, groundY + 8);
  ctx.fillStyle = `rgba(127, 29, 29, ${0.08 + beat * 0.05})`;
  ctx.fillRect(0, groundY - 10, W, H - groundY + 12);
}

function drawDiscoBall(ctx: CanvasRenderingContext2D, W: number, dropProgress: number) {
  const cx = W / 2;
  const ballR = 0.5 * Math.min(38, Math.max(24, W * 0.082));
  const mountY = 2;
  const targetBallCy = ballR + 20;
  const startCy = -ballR - 14;
  const ballCy = startCy + (targetBallCy - startCy) * dropProgress;
  const t = performance.now() * 0.0018;

  const cordBot = ballCy - ballR - 3;
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 1.25;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, mountY);
  ctx.lineTo(cx, cordBot);
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.ellipse(cx, cordBot + 0.5, 3, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 0.75;
  ctx.stroke();

  const capBot = ballCy - ballR + 1;
  ctx.fillStyle = '#0d9488';
  ctx.beginPath();
  ctx.moveTo(cx - 3.5, capBot);
  ctx.quadraticCurveTo(cx, capBot - 4.5, cx + 3.5, capBot);
  ctx.lineTo(cx + 2.5, capBot + 2);
  ctx.lineTo(cx - 2.5, capBot + 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#0f766e';
  ctx.lineWidth = 0.75;
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, ballCy, ballR, 0, Math.PI * 2);
  ctx.clip();

  const dim = Math.ceil(ballR * 2.2);
  const baseGrad = ctx.createRadialGradient(
    cx - ballR * 0.38,
    ballCy - ballR * 0.42,
    ballR * 0.06,
    cx + ballR * 0.22,
    ballCy + ballR * 0.22,
    ballR * 1.12
  );
  baseGrad.addColorStop(0, '#ffffff');
  baseGrad.addColorStop(0.35, '#e2e8f0');
  baseGrad.addColorStop(0.72, '#94a3b8');
  baseGrad.addColorStop(1, '#475569');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(cx - ballR - 1, ballCy - ballR - 1, dim + 2, dim + 2);

  const cell = Math.max(3, ballR / 13);
  for (let iy = -ballR; iy <= ballR; iy += cell * 0.88) {
    for (let ix = -ballR; ix <= ballR; ix += cell * 0.95) {
      const fx = ix + cell * 0.48;
      const fy = iy + cell * 0.44;
      const d2 = fx * fx + fy * fy;
      if (d2 > ballR * ballR * 0.98) continue;
      const ang = Math.atan2(fy, fx);
      const dist = Math.sqrt(d2) / ballR;
      const hue = (ang * 57.2957795 + dist * 140 + t * 72 + fy) % 360;
      const sat = 78 + 18 * Math.sin(ang * 2 + t * 3);
      const lit = 36 + 42 * (1 - dist * 0.55) + 14 * Math.sin(ang * 3 + dist * 6);
      const cw = cell * 0.9;
      const ch = cell * 0.86;
      ctx.fillStyle = `hsl(${hue}, ${Math.min(96, Math.max(55, sat))}%, ${Math.min(88, Math.max(22, lit))}%)`;
      ctx.fillRect(cx + ix, ballCy + iy, cw, ch);
      ctx.strokeStyle = 'rgba(15,23,42,0.22)';
      ctx.lineWidth = 0.55;
      ctx.strokeRect(cx + ix + 0.35, ballCy + iy + 0.35, cw - 0.7, ch - 0.7);
    }
  }

  const hi = ctx.createRadialGradient(
    cx - ballR * 0.35,
    ballCy - ballR * 0.42,
    0,
    cx - ballR * 0.22,
    ballCy - ballR * 0.32,
    ballR * 0.58
  );
  hi.addColorStop(0, 'rgba(255,255,255,0.52)');
  hi.addColorStop(0.4, 'rgba(255,255,255,0.09)');
  hi.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = hi;
  ctx.beginPath();
  ctx.arc(cx, ballCy, ballR, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  ctx.strokeStyle = 'rgba(30,41,59,0.48)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, ballCy, ballR, 0, Math.PI * 2);
  ctx.stroke();

  const sparklePulse = 0.62 + 0.38 * Math.sin(t * 7);
  const sparks = [
    { ox: -0.38, oy: -0.2, sz: 1 },
    { ox: -0.28, oy: 0.2, sz: 0.88 },
    { ox: 0.34, oy: -0.1, sz: 0.94 },
  ];
  for (const s of sparks) {
    const sx = cx + s.ox * ballR;
    const sy = ballCy + s.oy * ballR;
    if ((sx - cx) ** 2 + (sy - ballCy) ** 2 <= (ballR * 0.94) ** 2) {
      drawDiscoStarburst(ctx, sx, sy, 5.5 * s.sz * sparklePulse, 0.9);
    }
  }
}

function readHighScoreForLevel(level: GameLevelId): number {
  if (typeof window === 'undefined') return 0;
  const key = `${STORAGE_KEY}:${level}`;
  let raw = window.localStorage.getItem(key);
  if (raw == null && level === 'road') {
    const legacy = window.localStorage.getItem(STORAGE_KEY);
    if (legacy != null) {
      window.localStorage.setItem(key, legacy);
      raw = legacy;
    }
  }
  const n = parseInt(raw ?? '', 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function writeHighScoreForLevel(level: GameLevelId, score: number) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(`${STORAGE_KEY}:${level}`, String(score));
}

export default function SalesAgentDash({ onClose }: { onClose: () => void }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** Touch target below canvas (mobile): same non-passive touch handling as canvas. */
  const tapBelowRef = useRef<HTMLDivElement>(null);
  const leaderboardSectionRef = useRef<HTMLDivElement>(null);
  const lossScreenSubmitRef = useRef<HTMLDivElement>(null);
  /** Ignore stale leaderboard fetch results when level changes mid-request. */
  const leaderboardFetchGenRef = useRef(0);
  /** Main column with overflow-y-auto — reset scroll on new run so mobile isn’t stuck below the fold. */
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const [screen, setScreen] = useState<'menu' | 'game'>('menu');
  const [outcome, setOutcome] = useState<null | 'lost'>(null);
  const [menuLevel, setMenuLevel] = useState<GameLevelId>('road');
  const [highScore, setHighScore] = useState(() => readHighScoreForLevel('road'));
  const activeGameLevelRef = useRef<GameLevelId>('road');
  /** First click selects a level; second click on the same row starts the run. */
  const secondTapSameLevelRef = useRef<GameLevelId | null>(null);

  useEffect(() => {
    setHighScore(readHighScoreForLevel(menuLevel));
  }, [menuLevel]);

  useEffect(() => {
    if (screen === 'menu') secondTapSameLevelRef.current = null;
  }, [screen]);
  const [lastRunScore, setLastRunScore] = useState<number | null>(null);
  /** Venue for the run that produced `lastRunScore` — sent with global leaderboard POST. */
  const [lastRunLevel, setLastRunLevel] = useState<GameLevelId | null>(null);
  const [wasRecord, setWasRecord] = useState(false);
  const [losePhrase, setLosePhrase] = useState<string | null>(null);
  const [globalLb, setGlobalLb] = useState<GameLeaderboardEntry[]>([]);
  const [globalLbConfigured, setGlobalLbConfigured] = useState<boolean | null>(null);
  /** When set, `configured === false` was caused by a failed request — not “Redis off”. */
  const [globalLbLoadError, setGlobalLbLoadError] = useState<
    'invalid_level' | 'server' | 'network' | null
  >(null);
  const [globalLbLoading, setGlobalLbLoading] = useState(false);
  const [lbDisplayName, setLbDisplayName] = useState('');
  const [lbSubmitting, setLbSubmitting] = useState(false);
  const [lbSubmitError, setLbSubmitError] = useState<string | null>(null);
  const [lbSubmittedThisRun, setLbSubmittedThisRun] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    const v = window.localStorage.getItem(AUDIO_ENABLED_KEY);
    return v ? v === 'true' : true;
  });

  const scoreRef = useRef(0);
  const audioEnabledRef = useRef(audioEnabled);

  useEffect(() => {
    audioEnabledRef.current = audioEnabled;
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(AUDIO_ENABLED_KEY, String(audioEnabled));
  }, [audioEnabled]);

  const loadLeaderboard = useCallback(async (levelOverride?: GameLevelId) => {
    const level = levelOverride ?? menuLevel;
    const gen = ++leaderboardFetchGenRef.current;
    setGlobalLbLoading(true);
    setGlobalLbLoadError(null);
    try {
      const q = new URLSearchParams({ level });
      const res = await fetch(`/api/game-leaderboard?${q}`, { cache: 'no-store' });
      let data: {
        ok?: boolean;
        error?: string;
        configured?: boolean;
        entries?: GameLeaderboardEntry[];
      };
      try {
        data = (await res.json()) as typeof data;
      } catch {
        if (gen !== leaderboardFetchGenRef.current) return;
        setGlobalLb([]);
        setGlobalLbConfigured(false);
        setGlobalLbLoadError('server');
        return;
      }
      if (!res.ok) {
        if (gen !== leaderboardFetchGenRef.current) return;
        setGlobalLb([]);
        setGlobalLbConfigured(false);
        setGlobalLbLoadError(data.error === 'invalid_level' ? 'invalid_level' : 'server');
        return;
      }
      if (data.ok && Array.isArray(data.entries)) {
        if (gen !== leaderboardFetchGenRef.current) return;
        setGlobalLb(data.entries);
        setGlobalLbConfigured(data.configured === true);
        setGlobalLbLoadError(null);
      } else {
        if (gen !== leaderboardFetchGenRef.current) return;
        setGlobalLb([]);
        setGlobalLbConfigured(false);
        setGlobalLbLoadError('server');
      }
    } catch {
      if (gen !== leaderboardFetchGenRef.current) return;
      setGlobalLb([]);
      setGlobalLbConfigured(false);
      setGlobalLbLoadError('network');
    } finally {
      if (gen === leaderboardFetchGenRef.current) {
        setGlobalLbLoading(false);
      }
    }
  }, [menuLevel]);

  useEffect(() => {
    if (screen !== 'menu') return;
    void loadLeaderboard();
  }, [screen, menuLevel, loadLeaderboard]);

  /** Game over: refresh board + configured flag for the level you just played (menu fetch may still be pending or wrong level). */
  useEffect(() => {
    if (screen !== 'game' || outcome !== 'lost' || lastRunLevel == null) return;
    void loadLeaderboard(lastRunLevel);
  }, [screen, outcome, lastRunLevel, loadLeaderboard]);

  useEffect(() => {
    if (screen !== 'game' || outcome !== 'lost' || globalLbConfigured !== true) return;
    const el = lossScreenSubmitRef.current;
    if (!el) return;
    const id = window.requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    return () => window.cancelAnimationFrame(id);
  }, [screen, outcome, globalLbConfigured]);

  useEffect(() => {
    if (screen !== 'menu' || !lbSubmittedThisRun) return;
    const el = leaderboardSectionRef.current;
    if (!el) return;
    const id = window.requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => window.cancelAnimationFrame(id);
  }, [screen, lbSubmittedThisRun]);

  const submitGlobalScore = useCallback(async () => {
    if (lastRunScore == null || lastRunLevel == null || lbSubmitting || lbSubmittedThisRun) return;
    setLbSubmitting(true);
    setLbSubmitError(null);
    try {
      const res = await fetch('/api/game-leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: lastRunScore,
          displayName: lbDisplayName,
          level: lastRunLevel,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setLbSubmitError(
          data.error === 'not_configured'
            ? 'Global boards are not configured on the server yet (add Upstash env vars and redeploy).'
            : data.error === 'invalid_level'
              ? 'Server rejected this level — deploy the latest build so Bonus is in the leaderboard API.'
              : 'Could not save your score. Try again later.'
        );
        return;
      }
      setLbSubmittedThisRun(true);
      await loadLeaderboard();
      setScreen('menu');
    } catch {
      setLbSubmitError('Network error. Check your connection.');
    } finally {
      setLbSubmitting(false);
    }
  }, [lastRunScore, lastRunLevel, lbSubmitting, lbSubmittedThisRun, lbDisplayName, loadLeaderboard]);

  // World-distance based spawning so we can align billboards between obstacles.
  // `runDistanceRef` increases by `scroll` each tick; we spawn events when it passes
  // their scheduled distances.
  const runDistanceRef = useRef(0);
  const nextObstacleAtRef = useRef(OBSTACLE_SPAWN_GAP_PX);
  // First billboard is halfway between obstacle 1 and obstacle 2.
  const nextBillboardAtRef = useRef(OBSTACLE_SPAWN_GAP_PX + OBSTACLE_SPAWN_GAP_PX / 2);
  /** First order slightly before the first obstacle clears — encourages a jump collect. */
  const nextOrderAtRef = useRef(OBSTACLE_SPAWN_GAP_PX * 0.42);

  const pyRef = useRef(0);
  const vyRef = useRef(0);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const ordersRef = useRef<OrderPickup[]>([]);
  const billboardsRef = useRef<Billboard[]>([]);
  const billboardCompanyDeckRef = useRef<number[]>([]);
  const billboardDeckIndexRef = useRef(0);
  /** Counts trade-show company stands spawned this run (for speech bubble cycle). */
  const tradeStandSpawnCountRef = useRef(0);
  const tradeConsecutiveStandsRef = useRef(0);
  const tradeConsecutiveObstaclesRef = useRef(0);
  const lastBillboardKindRef = useRef<'company' | 'seasonal' | 'promo'>('company');
  const logoImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  /** Set synchronously on collision so resize (canvas bitmap clear) can repaint before React commits `outcome`. */
  const lostDuringRunRef = useRef(false);
  /** HUD "Best" for active run — avoids `localStorage` reads every animation frame (slow on mobile). */
  const personalBestHudRef = useRef(0);
  const discoWasActiveRef = useRef(false);
  /** One-shot disco per run: idle until score threshold, then playing until track ends. */
  const discoSegmentRef = useRef<'idle' | 'playing' | 'done'>('idle');
  /** Bonus only: Hell segment (separate audio), replaces disco on that level. */
  const bonusHellSegmentRef = useRef<'idle' | 'playing' | 'done'>('idle');
  const bonusHellWallEndMsRef = useRef(0);
  const bonusHellSegmentStartWallMsRef = useRef(0);
  /** Wall-clock end if disco clip metadata is not ready in time. */
  const discoWallEndMsRef = useRef(0);
  /** When audio is off, disco visuals follow wall time from this moment. */
  const discoSegmentStartWallMsRef = useRef(0);
  /** 0 → 1 while disco segment runs; eases the ball down from above. */
  const discoBallDropRef = useRef(0);
  /** 0 = normal look, 1 = full disco overlay (smooth in/out). */
  const discoVisualBlendRef = useRef(0);
  /** Countdown frames for order pickup toast (“Added to Order” on bonus, “Nice order” elsewhere). */
  const niceOrderMessageFramesRef = useRef(0);
  /** Bonus level: wall-clock next heat-wave start (`performance.now()`). */
  const bonusNextHeatWaveAtMsRef = useRef(Number.POSITIVE_INFINITY);
  /** Bonus level: heat wave active until this wall time (compare with `performance.now()`). */
  const bonusHeatWaveEndMsRef = useRef(0);
  /** Frames to show “Heat wave!” banner. */
  const heatWaveHudFramesRef = useRef(0);
  const bonusParticlesRef = useRef<BonusParticle[]>([]);
  const bonusSlowMoEndMsRef = useRef(0);
  const bonusShieldChargesRef = useRef(0);
  /** Bonus: countdown after shield pop — fire overlaps still ignored (one charge = one survivable brush with fire). */
  const bonusShieldFireInvulnFramesRef = useRef(0);
  const bonusToastFramesRef = useRef(0);
  const bonusToastMessageRef = useRef('');
  /** While true, game tick skips `setMusicMode` so BGM does not overlap one-shot priming (mobile Safari). */
  const primingOneShotAudioRef = useRef(false);
  /** Bumps on each `startGame`; only the latest prime sequence may start BGM. */
  const audioPrimeGenerationRef = useRef(0);

  // Audio: start normal music when the run starts; switch to disco during disco segments.
  const gameMusicRef = useRef<HTMLAudioElement | null>(null);
  const discoMusicRef = useRef<HTMLAudioElement | null>(null);
  const bonusHellMusicRef = useRef<HTMLAudioElement | null>(null);
  const musicModeRef = useRef<'none' | 'game' | 'disco' | 'hell'>('none');
  const htmlAudioUnlockRef = useRef<HTMLAudioElement | null>(null);

  const ensureMusicElements = useCallback(() => {
    // Only create the elements on the client (this is a `use client` component).
    if (!gameMusicRef.current) {
      const a = new Audio(GAME_MUSIC_SRC);
      a.loop = true;
      a.preload = 'auto';
      a.volume = GAME_MUSIC_VOLUME;
      gameMusicRef.current = a;
    }
    if (!discoMusicRef.current) {
      const a = new Audio(DISCO_MUSIC_SRC);
      a.loop = false;
      a.preload = 'auto';
      a.volume = DISCO_MUSIC_VOLUME;
      discoMusicRef.current = a;
    }
    if (!bonusHellMusicRef.current) {
      const a = new Audio(BONUS_HELL_MUSIC_SRC);
      a.loop = false;
      a.preload = 'auto';
      a.volume = DISCO_MUSIC_VOLUME;
      bonusHellMusicRef.current = a;
    }
  }, []);

  const setMusicMode = useCallback((mode: 'none' | 'game' | 'disco' | 'hell') => {
    const previousMode = musicModeRef.current;
    if (previousMode === mode) return;
    musicModeRef.current = mode;

    const gameAudio = gameMusicRef.current;
    const discoAudio = discoMusicRef.current;
    const hellAudio = bonusHellMusicRef.current;

    if (mode === 'none') {
      gameAudio?.pause();
      discoAudio?.pause();
      hellAudio?.pause();
      return;
    }

    // For 'game'/'disco'/'hell', ensure elements exist before attempting to play.
    ensureMusicElements();

    const gameAudio2 = gameMusicRef.current;
    const discoAudio2 = discoMusicRef.current;
    const hellAudio2 = bonusHellMusicRef.current;
    if (!gameAudio2 || !discoAudio2 || !hellAudio2) return;

    if (mode === 'game') {
      syncGameBgmElement(gameAudio2, activeGameLevelRef.current);
      gameAudio2.volume = GAME_MUSIC_VOLUME;
      discoAudio2.volume = DISCO_MUSIC_VOLUME;
      discoAudio2.pause();
      discoAudio2.currentTime = 0;
      hellAudio2.pause();
      hellAudio2.currentTime = 0;
      if (previousMode !== 'disco' && previousMode !== 'hell') {
        gameAudio2.currentTime = 0;
      }
      void gameAudio2.play().catch(() => {
        // Autoplay policies can still block play() in some environments.
        // If that happens, we'll just stay silent until the next user gesture.
      });
      return;
    }

    if (mode === 'hell') {
      syncBonusHellBgmElement(hellAudio2);
      hellAudio2.volume = DISCO_MUSIC_VOLUME;
      discoAudio2.pause();
      discoAudio2.currentTime = 0;
      gameAudio2.pause();
      hellAudio2.currentTime = 0;
      void hellAudio2.play().catch(() => {});
      return;
    }

    // mode === 'disco' — pause main music but keep its timeline for when disco ends.
    gameAudio2.volume = GAME_MUSIC_VOLUME;
    syncDiscoBgmElement(discoAudio2, activeGameLevelRef.current);
    discoAudio2.volume = DISCO_MUSIC_VOLUME;
    hellAudio2.pause();
    hellAudio2.currentTime = 0;
    gameAudio2.pause();
    discoAudio2.currentTime = 0;
    void discoAudio2.play().catch(() => {});
  }, [ensureMusicElements]);

  const orderPickupPoolRef = useRef<HTMLAudioElement[]>([]);

  const ensureOrderPickupElements = useCallback(() => {
    const pool = orderPickupPoolRef.current;
    if (pool.length === ORDER_PICKUP_SRCS.length) return;
    pool.length = 0;
    for (const src of ORDER_PICKUP_SRCS) {
      const a = new Audio(src);
      a.preload = 'auto';
      a.loop = false;
      a.volume = ORDER_PICKUP_VOLUME;
      pool.push(a);
    }
  }, []);

  /**
   * One gesture-triggered `play()` unlocks HTMLAudioElement for the page.
   * Must not use death/order assets — muted real clips still leak a blip on some browsers when restarting a run.
   */
  const primeHtmlAudioUnlockSilently = useCallback(async (attempt: boolean) => {
    if (!attempt) return;
    if (!htmlAudioUnlockRef.current) {
      const el = new Audio(SILENT_WAV_DATA_URL);
      el.preload = 'auto';
      htmlAudioUnlockRef.current = el;
    }
    const a = htmlAudioUnlockRef.current;
    try {
      a.pause();
      a.currentTime = 0;
      a.muted = true;
      a.volume = 0;
      await a.play();
      a.pause();
      a.currentTime = 0;
    } catch {
      // ignore
    } finally {
      a.muted = false;
      a.volume = 1;
      a.currentTime = 0;
    }
  }, []);

  const pauseAllOrderPickup = useCallback(() => {
    for (const a of orderPickupPoolRef.current) {
      a.pause();
      a.currentTime = 0;
    }
  }, []);

  const playOrderPickup = useCallback(() => {
    if (!audioEnabledRef.current) return;
    ensureOrderPickupElements();
    const pool = orderPickupPoolRef.current;
    if (!pool.length) return;
    const idx = Math.floor(Math.random() * pool.length);
    const a = pool[idx]!;
    for (let i = 0; i < pool.length; i++) {
      if (i !== idx) {
        pool[i]!.pause();
        pool[i]!.currentTime = 0;
      }
    }
    a.pause();
    a.currentTime = 0;
    const p = a.play();
    p.catch(() => {
      requestAnimationFrame(() => {
        try {
          a.pause();
          a.currentTime = 0;
          void a.play().catch(() => {});
        } catch {
          // ignore
        }
      });
    });
  }, [ensureOrderPickupElements]);

  const laughAudioPoolRef = useRef<HTMLAudioElement[]>([]);

  const ensureLaughElements = useCallback(() => {
    const pool = laughAudioPoolRef.current;
    if (pool.length === DEATH_LAUGH_SRCS.length) return;
    pool.length = 0;
    for (const src of DEATH_LAUGH_SRCS) {
      const a = new Audio(src);
      a.preload = 'auto';
      a.loop = false;
      a.volume = LAUGH_VOLUME;
      pool.push(a);
    }
  }, []);

  const pauseAllLaugh = useCallback(() => {
    for (const a of laughAudioPoolRef.current) {
      a.pause();
      a.currentTime = 0;
    }
  }, []);

  const playLaugh = useCallback(() => {
    // Death sting should be the only sound: stop music and order SFX immediately
    // (before React re-renders), not only after `outcome` updates.
    gameMusicRef.current?.pause();
    discoMusicRef.current?.pause();
    bonusHellMusicRef.current?.pause();
    musicModeRef.current = 'none';
    discoSegmentRef.current = 'idle';
    bonusHellSegmentRef.current = 'idle';
    discoVisualBlendRef.current = 0;
    pauseAllOrderPickup();
    if (!audioEnabledRef.current) return;
    ensureLaughElements();
    const pool = laughAudioPoolRef.current;
    if (!pool.length) return;
    const idx = Math.floor(Math.random() * pool.length);
    const a = pool[idx]!;
    for (let i = 0; i < pool.length; i++) {
      if (i !== idx) {
        pool[i]!.pause();
        pool[i]!.currentTime = 0;
      }
    }
    a.pause();
    a.currentTime = 0;
    const p = a.play();
    p.catch(() => {
      requestAnimationFrame(() => {
        try {
          a.pause();
          a.currentTime = 0;
          void a.play().catch(() => {});
        } catch {
          // ignore
        }
      });
    });
  }, [ensureLaughElements, pauseAllOrderPickup]);

  useEffect(() => {
    // If audio is turned off, stop any currently playing tracks immediately.
    if (audioEnabled) return;
    gameMusicRef.current?.pause();
    discoMusicRef.current?.pause();
    bonusHellMusicRef.current?.pause();
    htmlAudioUnlockRef.current?.pause();
    pauseAllLaugh();
    pauseAllOrderPickup();
    musicModeRef.current = 'none';
    discoVisualBlendRef.current = 0;
  }, [audioEnabled, pauseAllLaugh, pauseAllOrderPickup]);

  useEffect(() => {
    // Safety: stop audio if the component unmounts.
    return () => {
      gameMusicRef.current?.pause();
      discoMusicRef.current?.pause();
      bonusHellMusicRef.current?.pause();
      htmlAudioUnlockRef.current?.pause();
      pauseAllLaugh();
      pauseAllOrderPickup();
    };
  }, [pauseAllLaugh, pauseAllOrderPickup]);

  useEffect(() => {
    trackSalesAgentDashOpen();
  }, []);

  const paintGameFrame = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const W = canvas.width;
      const H = canvas.height;
      if (W < 2 || H < 2) return;

      const groundY = H * GROUND_RATIO;
      const pw = 40;
      const ph = 52;
      const px = W * 0.18;

      const level = activeGameLevelRef.current;
      if (level === 'road') {
        drawRoadBackdrop(ctx, W, H, groundY, scoreRef.current);
      } else if (level === 'bonus') {
        drawBonusBackdrop(ctx, W, H, groundY, scoreRef.current);
      } else {
        drawIndoorHallBackdrop(ctx, W, H, groundY, scoreRef.current, level === 'harrogate' ? 'harrogate' : 'nec');
      }

      if (level === 'harrogate') {
        drawHarrogateIndoorSnow(ctx, W, groundY, scoreRef.current);
      }

      const vBlend = discoVisualBlendRef.current;
      const hellPlayingUi = bonusHellSegmentRef.current === 'playing';
      if (vBlend > 0.02) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, vBlend);
        if (activeGameLevelRef.current === 'bonus' && hellPlayingUi) {
          drawHellFlashes(ctx, W, H, groundY);
        } else {
          drawDiscoFlashes(ctx, W, H, groundY);
        }
        ctx.restore();
      }

      const runLvl = activeGameLevelRef.current;
      if (isTradeShowLevel(runLvl)) {
        for (const bb of billboardsRef.current) {
          drawForegroundSign(ctx, bb, groundY, H, W, logoImagesRef.current, runLvl);
        }
      }

      const hellFireDraw =
        runLvl === 'bonus' && hellPlayingUi ? HELL_FIRE_VISUAL_MULT : 1;
      for (const o of obstaclesRef.current) {
        const top = groundY - o.h;
        drawObstacle(ctx, o, top, logoImagesRef.current, hellFireDraw);
      }

      if (runLvl === 'road') {
        for (const bb of billboardsRef.current) {
          drawForegroundSign(ctx, bb, groundY, H, W, logoImagesRef.current, runLvl);
        }
      }

      for (const ord of ordersRef.current) {
        drawOrderPickup(ctx, ord, groundY, activeGameLevelRef.current, logoImagesRef.current);
      }

      const yTop = groundY + pyRef.current - ph;
      if (runLvl === 'bonus' && bonusParticlesRef.current.length > 0) {
        const heat = performance.now() < bonusHeatWaveEndMsRef.current;
        drawBonusParticleTrail(ctx, bonusParticlesRef.current, heat);
      }
      drawPlayer(ctx, px, yTop, pw, ph);

      if (
        vBlend > 0.02 &&
        discoBallDropRef.current > 0.02 &&
        !(runLvl === 'bonus' && hellPlayingUi)
      ) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, vBlend);
        drawDiscoBall(ctx, W, discoBallDropRef.current);
        ctx.restore();
      }

      const displayScore = Math.floor(scoreRef.current);
      const venueLabel = hudVenueLabel(activeGameLevelRef.current, scoreRef.current);
      const venueHue = hudVenueHue(activeGameLevelRef.current, scoreRef.current);
      const bestForLevel = personalBestHudRef.current;
      const hudPadL = 10;
      const hudPadR = 10;
      const hudX = 8;
      const hudY = 8;
      const textX = hudX + hudPadL;
      ctx.font = 'bold 12px system-ui, sans-serif';
      const wVenue = ctx.measureText(venueLabel).width;
      ctx.font = 'bold 13px system-ui, sans-serif';
      const wScore = ctx.measureText(`Score ${displayScore.toLocaleString()}`).width;
      ctx.font = '11px system-ui, sans-serif';
      const wBest = ctx.measureText(`Best ${bestForLevel.toLocaleString()}`).width;
      const hudW = Math.ceil(
        Math.max(wVenue, wScore, wBest) + hudPadL + hudPadR
      );
      ctx.fillStyle = 'rgba(255,255,255,0.94)';
      roundRectPath(ctx, hudX, hudY, hudW, 58, 8);
      ctx.fill();
      ctx.strokeStyle = 'rgba(15,23,42,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = venueHue;
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillText(venueLabel, textX, 24);
      ctx.fillStyle = '#1a1a1a';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillText(`Score ${displayScore.toLocaleString()}`, textX, 42);
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillStyle = '#52525b';
      ctx.fillText(`Best ${bestForLevel.toLocaleString()}`, textX, 56);

      const niceFrames = niceOrderMessageFramesRef.current;
      if (niceFrames > 0) {
        const opacity = Math.min(1, niceFrames / 9);
        ctx.save();
        ctx.globalAlpha = 0.96 * opacity;
        const msg = runLvl === 'bonus' ? 'Added to Order' : 'Nice order';
        const fs = Math.min(20, Math.max(15, Math.floor(W * 0.048)));
        ctx.font = `bold ${fs}px system-ui, sans-serif`;
        const tw = ctx.measureText(msg).width;
        const boxPadX = 16;
        const boxW = tw + boxPadX * 2;
        const boxH = 40;
        const padR = 10;
        const padT = 8;
        const bx = Math.max(8, W - boxW - padR);
        const by = padT;
        ctx.fillStyle = 'rgba(15,23,42,0.9)';
        roundRectPath(ctx, bx, by, boxW, boxH, 12);
        ctx.fill();
        ctx.strokeStyle = 'rgba(34,197,94,0.9)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#fef9c3';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(msg, bx + boxW / 2, by + boxH / 2 + 1);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      const heatHudFrames = heatWaveHudFramesRef.current;
      if (heatHudFrames > 0) {
        const opacity = Math.min(1, heatHudFrames / 10);
        ctx.save();
        ctx.globalAlpha = 0.95 * opacity;
        const msg = 'Heat wave!';
        const fs = Math.min(22, Math.max(16, Math.floor(W * 0.05)));
        ctx.font = `bold ${fs}px system-ui, sans-serif`;
        const tw = ctx.measureText(msg).width;
        const boxPadX = 18;
        const boxW = tw + boxPadX * 2;
        const boxH = 44;
        const bx = (W - boxW) / 2;
        const by = Math.max(10, Math.floor(H * 0.06));
        ctx.fillStyle = 'rgba(127, 29, 29, 0.92)';
        roundRectPath(ctx, bx, by, boxW, boxH, 12);
        ctx.fill();
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.95)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#ffedd5';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(msg, bx + boxW / 2, by + boxH / 2 + 1);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      const bonusToastFrames = bonusToastFramesRef.current;
      const bonusToastMsg = bonusToastMessageRef.current;
      if (bonusToastFrames > 0 && bonusToastMsg) {
        const opacity = Math.min(1, bonusToastFrames / 12);
        drawBonusToastBox(ctx, W, H, bonusToastMsg, 0.96 * opacity);
      }
    },
    []
  );

  const resizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c?.parentElement || typeof window === 'undefined') return;
    const parent = c.parentElement;
    const w = Math.min(720, Math.max(260, parent.clientWidth - 8));
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const narrow = vw < 640;
    let h: number;
    if (narrow) {
      const parentH = parent.clientHeight;
      const fromLayout = parentH > 64 ? parentH - 8 : 0;
      const target = fromLayout > 0 ? Math.min(fromLayout, vh * 0.62) : Math.min(vh * 0.58, 560);
      h = Math.floor(Math.max(target, w * 0.58));
      h = Math.min(h, Math.floor(vh * 0.68));
    } else {
      h = Math.min(400, Math.floor(w * 0.52));
    }
    // Avoid resetting canvas backing store unless dimensions change — on mobile,
    // ResizeObserver + resize can fire in bursts; each width/height assignment clears the buffer and janks.
    if (c.width === w && c.height === h) return;
    c.width = w;
    c.height = h;
    if (lostDuringRunRef.current) {
      const ctx = c.getContext('2d', CTX_2D_OPTS);
      if (ctx) paintGameFrame(ctx, c);
    }
  }, [paintGameFrame]);

  useEffect(() => {
    if (screen !== 'game') return;
    const parent = canvasRef.current?.parentElement;
    if (!parent) return;

    let rafId = 0;
    let debounceId: ReturnType<typeof setTimeout> | undefined;
    const scheduleResize = () => {
      const narrow = typeof window !== 'undefined' && window.innerWidth < 640;
      const run = () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          resizeCanvas();
        });
      };
      if (narrow) {
        clearTimeout(debounceId);
        debounceId = setTimeout(run, 100);
      } else {
        clearTimeout(debounceId);
        run();
      }
    };

    resizeCanvas();
    const ro = new ResizeObserver(scheduleResize);
    ro.observe(parent);
    window.addEventListener('resize', scheduleResize);
    return () => {
      clearTimeout(debounceId);
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('resize', scheduleResize);
    };
  }, [screen, resizeCanvas]);

  const startGame = useCallback(() => {
    scoreRef.current = 0;
    runDistanceRef.current = 0;
    const level0 = activeGameLevelRef.current;
    personalBestHudRef.current = readHighScoreForLevel(level0);
    if (isTradeShowLevel(level0)) {
      const obsAdv0 = tradeShowObstacleAdvancePx(level0);
      const stAdv0 = tradeShowStandAdvancePx(level0);
      nextObstacleAtRef.current = obsAdv0;
      nextBillboardAtRef.current = obsAdv0 + stAdv0 / 2;
      nextOrderAtRef.current = obstacleSpawnGapPx(level0) * 0.42;
    } else {
      const gap0 = obstacleSpawnGapPx(level0);
      nextObstacleAtRef.current = gap0;
      nextBillboardAtRef.current = gap0 + gap0 / 2;
      nextOrderAtRef.current = gap0 * 0.42;
    }
    pyRef.current = 0;
    vyRef.current = 0;
    obstaclesRef.current = [];
    ordersRef.current = [];
    lostDuringRunRef.current = false;
    discoWasActiveRef.current = false;
    discoSegmentRef.current = 'idle';
    bonusHellSegmentRef.current = 'idle';
    bonusHellWallEndMsRef.current = 0;
    bonusHellSegmentStartWallMsRef.current = 0;
    discoBallDropRef.current = 0;
    niceOrderMessageFramesRef.current = 0;
    billboardsRef.current = [];
    billboardCompanyDeckRef.current = [];
    billboardDeckIndexRef.current = 0;
    tradeStandSpawnCountRef.current = 0;
    tradeConsecutiveStandsRef.current = 0;
    tradeConsecutiveObstaclesRef.current = 0;
    lastBillboardKindRef.current = 'company';
    bonusParticlesRef.current = [];
    heatWaveHudFramesRef.current = 0;
    if (level0 === 'bonus') {
      const t = performance.now();
      bonusNextHeatWaveAtMsRef.current = t + BONUS_HEAT_WAVE_INTERVAL_MS;
      bonusHeatWaveEndMsRef.current = 0;
    } else {
      bonusNextHeatWaveAtMsRef.current = Number.POSITIVE_INFINITY;
      bonusHeatWaveEndMsRef.current = 0;
    }
    bonusSlowMoEndMsRef.current = 0;
    bonusShieldChargesRef.current = 0;
    bonusShieldFireInvulnFramesRef.current = 0;
    bonusToastFramesRef.current = 0;
    bonusToastMessageRef.current = '';
    setOutcome(null);
    setLastRunScore(null);
    setLastRunLevel(null);
    setWasRecord(false);
    setLosePhrase(null);
    setLbSubmittedThisRun(false);
    setLbSubmitError(null);
    pauseAllLaugh();
    pauseAllOrderPickup();
    discoVisualBlendRef.current = 0;
    setScreen('game');
    // Unlock one-shots with a silent clip only, then start BGM after (avoids overlapping `play()` / stray stings).
    if (audioEnabledRef.current) {
      primingOneShotAudioRef.current = true;
      const gen = ++audioPrimeGenerationRef.current;
      void (async () => {
        try {
          await primeHtmlAudioUnlockSilently(true);
        } finally {
          if (audioPrimeGenerationRef.current === gen) {
            primingOneShotAudioRef.current = false;
            setMusicMode(audioEnabledRef.current ? 'game' : 'none');
          }
        }
      })();
    } else {
      audioPrimeGenerationRef.current += 1;
      primingOneShotAudioRef.current = false;
      setMusicMode('none');
    }
    const scrollEl = mainScrollRef.current;
    if (scrollEl) {
      scrollEl.scrollTop = 0;
      requestAnimationFrame(() => {
        scrollEl.scrollTop = 0;
        scrollEl.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      });
    }
  }, [pauseAllLaugh, pauseAllOrderPickup, primeHtmlAudioUnlockSilently, setMusicMode]);

  const onMenuLevelCardClick = useCallback(
    (lv: GameLevelId) => {
      if (menuLevel !== lv) {
        setMenuLevel(lv);
        secondTapSameLevelRef.current = null;
        return;
      }
      if (secondTapSameLevelRef.current === lv) {
        secondTapSameLevelRef.current = null;
        activeGameLevelRef.current = lv;
        startGame();
      } else {
        secondTapSameLevelRef.current = lv;
      }
    },
    [menuLevel, startGame]
  );

  const jump = useCallback(() => {
    if (outcome !== null) return;
    if (pyRef.current >= 0 && vyRef.current >= 0) {
      vyRef.current = JUMP_V;
    }
  }, [outcome]);

  useEffect(() => {
    const map = new Map<string, HTMLImageElement>();
    for (const comp of companies) {
      for (const url of [getCompanyBillboardLogoUrl(comp), getTradeStandHeaderLogoUrl(comp)]) {
        if (!url || map.has(url)) continue;
        const img = new Image();
        img.decoding = 'async';
        img.src = url;
        map.set(url, img);
      }
    }
    if (!map.has(SILLY_BEANS_BILLBOARD_SRC)) {
      const promo = new Image();
      promo.decoding = 'async';
      promo.src = SILLY_BEANS_BILLBOARD_SRC;
      map.set(SILLY_BEANS_BILLBOARD_SRC, promo);
    }
    if (!map.has(SILLY_BEANS_BILLBOARD_OHH_DEER_SRC)) {
      const promo2 = new Image();
      promo2.decoding = 'async';
      promo2.src = SILLY_BEANS_BILLBOARD_OHH_DEER_SRC;
      map.set(SILLY_BEANS_BILLBOARD_OHH_DEER_SRC, promo2);
    }
    if (!map.has(SNAKE_GAME_PNG_SRC)) {
      const snake = new Image();
      snake.decoding = 'async';
      snake.src = SNAKE_GAME_PNG_SRC;
      map.set(SNAKE_GAME_PNG_SRC, snake);
    }
    if (!map.has(FAULTY_CAR_PNG_SRC)) {
      const car = new Image();
      car.decoding = 'async';
      car.src = FAULTY_CAR_PNG_SRC;
      map.set(FAULTY_CAR_PNG_SRC, car);
    }
    for (const src of [
      CLIPBOARD_GAME_PNG_SRC,
      COFFEE_GAME_PNG_SRC,
      BOX_GAME_PNG_SRC,
      XMAS_TREE_GAME_PNG_SRC,
      REINDEER_GAME_PNG_SRC,
      SLEIGH_GAME_PNG_SRC,
      ...BONUS_COLLECTIBLE_SRCS,
    ]) {
      if (map.has(src)) continue;
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      map.set(src, img);
    }
    logoImagesRef.current = map;
  }, []);

  /**
   * React 17+ delegates touch with { passive: true } on mobile, so synthetic onTouchStart’s
   * preventDefault won’t stop long-press / “copy image” on canvas. Use non-passive touchstart.
   * We intentionally do NOT listen to touchmove with preventDefault — that runs every frame
   * while the finger moves and can jank the main thread; touchstart is enough for callout UX.
   */
  useEffect(() => {
    if (screen !== 'game') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const blockDefault = (e: Event) => {
      e.preventDefault();
    };

    const touch: AddEventListenerOptions = { passive: false };
    canvas.addEventListener('touchstart', blockDefault, touch);
    canvas.addEventListener('gesturestart', blockDefault);

    return () => {
      canvas.removeEventListener('touchstart', blockDefault, touch);
      canvas.removeEventListener('gesturestart', blockDefault);
    };
  }, [screen]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const blockSelect = (e: Event) => e.preventDefault();
    shell.addEventListener('selectstart', blockSelect);
    shell.addEventListener('dragstart', blockSelect);
    return () => {
      shell.removeEventListener('selectstart', blockSelect);
      shell.removeEventListener('dragstart', blockSelect);
    };
  }, []);

  useEffect(() => {
    if (screen !== 'game' || outcome !== null) return;

    let raf = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', CTX_2D_OPTS);
    if (!ctx) return;

    const tick = () => {
      const W = canvas.width;
      const H = canvas.height;
      if (W < 2 || H < 2) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const groundY = H * GROUND_RATIO;
      const pw = 40;
      const ph = 52;
      const px = W * 0.18;

      const runLevel = activeGameLevelRef.current;
      const nowWall = performance.now();
      let bonusHeatWave = false;
      if (runLevel === 'bonus') {
        if (bonusHeatWaveEndMsRef.current <= nowWall && nowWall >= bonusNextHeatWaveAtMsRef.current) {
          bonusHeatWaveEndMsRef.current = nowWall + BONUS_HEAT_WAVE_DURATION_MS;
          bonusNextHeatWaveAtMsRef.current += BONUS_HEAT_WAVE_INTERVAL_MS;
          heatWaveHudFramesRef.current = HEAT_WAVE_HUD_FRAMES;
        }
        bonusHeatWave = bonusHeatWaveEndMsRef.current > nowWall;
      }

      const difficulty = 1 + Math.min(2, scoreRef.current / 4000);
      let scroll = BASE_SCROLL * difficulty * levelScrollMultiplier(runLevel);
      if (runLevel === 'bonus' && bonusHeatWave) {
        scroll *= BONUS_HEAT_WAVE_SCROLL_MULT;
      }
      const bonusSlowMoActive =
        runLevel === 'bonus' && bonusSlowMoEndMsRef.current > nowWall;
      if (bonusSlowMoActive) {
        scroll *= BONUS_SLOWMO_SCROLL_MULT;
      }
      /** Match vertical integration to scroll scale so fire stays jumpable during mystery slow-mo. */
      const physicsDt = bonusSlowMoActive ? BONUS_SLOWMO_SCROLL_MULT : 1;
      scoreRef.current += scroll * 0.35;

      const sFloor = Math.floor(scoreRef.current);
      const lvlAudio = activeGameLevelRef.current;
      let inDisco = false;
      let inHell = false;
      const dSeg = discoSegmentRef.current;
      const hHell = bonusHellSegmentRef.current;

      if (lvlAudio === 'bonus') {
        if (hHell === 'done') {
          inHell = false;
        } else if (hHell === 'idle') {
          if (sFloor >= BONUS_HELL_MIN_SCORE) {
            bonusHellSegmentRef.current = 'playing';
            const fallMs = BONUS_HELL_TRACK_FALLBACK_SEC * 1000 + 400;
            bonusHellWallEndMsRef.current = performance.now() + fallMs;
            bonusHellSegmentStartWallMsRef.current = performance.now();
          }
          inHell = bonusHellSegmentRef.current === 'playing';
        } else {
          inHell = true;
          const aHell = bonusHellMusicRef.current;
          const durOk =
            !!aHell &&
            Number.isFinite(aHell.duration) &&
            aHell.duration > 0.05;
          let trackDone = false;
          if (!audioEnabledRef.current) {
            trackDone =
              performance.now() >=
              bonusHellSegmentStartWallMsRef.current +
                BONUS_HELL_TRACK_FALLBACK_SEC * 1000;
          } else if (durOk) {
            trackDone =
              aHell!.ended || aHell!.currentTime >= aHell!.duration - 0.12;
          } else {
            trackDone = performance.now() >= bonusHellWallEndMsRef.current;
          }
          if (trackDone) {
            bonusHellSegmentRef.current = 'done';
            inHell = false;
          }
        }
      } else if (dSeg === 'done') {
        inDisco = false;
      } else if (dSeg === 'idle') {
        if (sFloor >= DISCO_MIN_SCORE) {
          discoSegmentRef.current = 'playing';
          const fallMs = discoTrackFallbackDurationSec(lvlAudio) * 1000 + 800;
          discoWallEndMsRef.current = performance.now() + fallMs;
          discoSegmentStartWallMsRef.current = performance.now();
        }
        inDisco = discoSegmentRef.current === 'playing';
      } else {
        inDisco = true;
        const aDisco = discoMusicRef.current;
        const durOk =
          !!aDisco &&
          Number.isFinite(aDisco.duration) &&
          aDisco.duration > 0.05;
        let trackDone = false;
        if (!audioEnabledRef.current) {
          trackDone =
            performance.now() >=
            discoSegmentStartWallMsRef.current +
              discoTrackFallbackDurationSec(lvlAudio) * 1000;
        } else if (durOk) {
          trackDone =
            aDisco!.ended || aDisco!.currentTime >= aDisco!.duration - 0.12;
        } else {
          trackDone = performance.now() >= discoWallEndMsRef.current;
        }
        if (trackDone) {
          discoSegmentRef.current = 'done';
          inDisco = false;
        }
      }

      {
        const tgtV = inDisco || inHell ? 1 : 0;
        let vb = discoVisualBlendRef.current;
        vb += (tgtV - vb) * DISCO_VISUAL_BLEND_RATE;
        if (Math.abs(vb - tgtV) < 0.012) vb = tgtV;
        discoVisualBlendRef.current = vb;
      }

      if (inDisco) {
        if (!discoWasActiveRef.current) discoBallDropRef.current = 0;
        discoBallDropRef.current = Math.min(1, discoBallDropRef.current + 0.052);
        discoWasActiveRef.current = true;
      } else {
        discoWasActiveRef.current = false;
        discoBallDropRef.current = Math.max(0, discoBallDropRef.current - 0.07);
      }

      const desiredMode: 'none' | 'game' | 'disco' | 'hell' = audioEnabledRef.current
        ? inHell
          ? 'hell'
          : inDisco
            ? 'disco'
            : 'game'
        : 'none';
      if (!primingOneShotAudioRef.current && musicModeRef.current !== desiredMode) {
        setMusicMode(desiredMode);
      }

      const obsGap = obstacleSpawnGapPx(runLevel);
      runDistanceRef.current += scroll;

      const nCompanies = companies.length;
      const SPAWN_COORD_LOOP = 36;

      if (isTradeShowLevel(runLevel)) {
        const standAdv = tradeShowStandAdvancePx(runLevel);
        const obsAdv = tradeShowObstacleAdvancePx(runLevel);
        let coordGuard = 0;
        while (
          (runDistanceRef.current >= nextObstacleAtRef.current ||
            runDistanceRef.current >= nextBillboardAtRef.current) &&
          coordGuard < SPAWN_COORD_LOOP
        ) {
          coordGuard += 1;
          const canObs = runDistanceRef.current >= nextObstacleAtRef.current;
          const canStand =
            nCompanies > 0 && runDistanceRef.current >= nextBillboardAtRef.current;
          const runD = runDistanceRef.current;

          let standFirst =
            canStand &&
            (!canObs || nextBillboardAtRef.current <= nextObstacleAtRef.current);

          if (
            standFirst &&
            tradeConsecutiveStandsRef.current >= TRADE_MAX_CONSECUTIVE_STANDS &&
            canObs
          ) {
            standFirst = false;
          }
          if (
            !standFirst &&
            canObs &&
            tradeConsecutiveObstaclesRef.current >= TRADE_MAX_CONSECUTIVE_OBSTACLES &&
            canStand
          ) {
            standFirst = true;
          }
          if (
            !standFirst &&
            canObs &&
            tradeConsecutiveObstaclesRef.current >= TRADE_MAX_CONSECUTIVE_OBSTACLES &&
            !canStand
          ) {
            nextObstacleAtRef.current = runD + obsAdv * 0.45;
            break;
          }

          if (standFirst) {
            nextBillboardAtRef.current += standAdv;
            const { left: zL, right: zR } = tradeStandFootprintRange(W + 24, W, H);
            const standBlocked = obstaclesRef.current.some((o) =>
              rangesOverlap1D(o.x, o.x + o.w, zL, zR)
            );
            if (standBlocked) {
              nextBillboardAtRef.current = runD + standAdv * 0.35;
              break;
            }
            if (billboardDeckIndexRef.current >= billboardCompanyDeckRef.current.length) {
              billboardCompanyDeckRef.current = shuffleCompanyIndices(nCompanies);
              billboardDeckIndexRef.current = 0;
            }
            const companyIndex =
              billboardCompanyDeckRef.current[billboardDeckIndexRef.current]!;
            billboardDeckIndexRef.current += 1;
            const standIdx = tradeStandSpawnCountRef.current;
            tradeStandSpawnCountRef.current += 1;
            billboardsRef.current.push({
              x: W + 24,
              kind: 'company',
              companyIndex,
              banterSeed: (Math.random() * 0x7fffffff) | 0,
              showTradeBanter:
                standIdx % TRADE_STAND_SPEECH_CYCLE_LEN ===
                TRADE_STAND_SPEECH_CYCLE_INDEX,
            });
            lastBillboardKindRef.current = 'company';
            tradeConsecutiveStandsRef.current += 1;
            tradeConsecutiveObstaclesRef.current = 0;
            nextObstacleAtRef.current = Math.max(
              nextObstacleAtRef.current,
              runD + TRADE_MIN_RUN_DIST_AFTER_STAND_BEFORE_OBS
            );
          } else if (canObs) {
            nextObstacleAtRef.current += obsAdv;
            const kinds = obstacleKindsForLevel(activeGameLevelRef.current);
            const kind = kinds[Math.floor(Math.random() * kinds.length)]!;
            const { w: ow } = dimsFor(kind);
            const oRight = W + 24 + ow;
            let obsBlocked = false;
            for (const b of billboardsRef.current) {
              if (b.kind !== 'company') continue;
              const { left, right } = tradeStandObstacleSpawnClearanceRange(b.x, W, H);
              if (rangesOverlap1D(W + 24, oRight, left, right)) {
                obsBlocked = true;
                break;
              }
            }
            if (obsBlocked) {
              nextObstacleAtRef.current = runD + obsAdv * 0.3;
              break;
            }
            const { h: oh } = dimsFor(kind);
            obstaclesRef.current.push({
              x: W + 24,
              w: ow,
              h: oh,
              kind,
              ...(kind === 'broken_car'
                ? { collisionH: BROKEN_CAR_COLLISION_H }
                : kind === 'bonus_fire_emoji'
                  ? {
                      collisionH: BONUS_FIRE_COLLISION_H,
                      swayPhase: Math.random() * Math.PI * 2,
                    }
                  : {}),
            });
            tradeConsecutiveObstaclesRef.current += 1;
            tradeConsecutiveStandsRef.current = 0;
            nextBillboardAtRef.current = Math.max(
              nextBillboardAtRef.current,
              runD + TRADE_MIN_RUN_DIST_AFTER_OBS_BEFORE_STAND
            );
          } else {
            break;
          }
        }
      } else {
        while (runDistanceRef.current >= nextObstacleAtRef.current) {
          nextObstacleAtRef.current += obsGap;
          const kinds = obstacleKindsForLevel(activeGameLevelRef.current);
          const kind = kinds[Math.floor(Math.random() * kinds.length)]!;
          const { w: ow, h: oh } = dimsFor(kind);
          obstaclesRef.current.push({
            x: W + 24,
            w: ow,
            h: oh,
            kind,
            ...(kind === 'broken_car'
              ? { collisionH: BROKEN_CAR_COLLISION_H }
              : kind === 'bonus_fire_emoji'
                ? {
                    collisionH: BONUS_FIRE_COLLISION_H,
                    swayPhase: Math.random() * Math.PI * 2,
                  }
                : {}),
          });
        }

        if (runLevel === 'road' && nCompanies > 0) {
          while (runDistanceRef.current >= nextBillboardAtRef.current) {
            nextBillboardAtRef.current += obsGap;
            const lastKind = lastBillboardKindRef.current;
            const rollPromo = lastKind !== 'promo' && Math.random() < 0.12;
            const rollSeasonal =
              !rollPromo &&
              SEASONAL_BILLBOARD_MESSAGES.length > 0 &&
              lastKind !== 'seasonal' &&
              Math.random() < 0.38;
            if (rollPromo) {
              billboardsRef.current.push({
                x: W + 24,
                kind: 'promo',
                promoImageUrl: SILLY_BEANS_BILLBOARD_SRC,
              });
              lastBillboardKindRef.current = 'promo';
            } else if (rollSeasonal) {
              const seasonal =
                SEASONAL_BILLBOARD_MESSAGES[
                  Math.floor(Math.random() * SEASONAL_BILLBOARD_MESSAGES.length)
                ];
              billboardsRef.current.push({
                x: W + 24,
                kind: 'seasonal',
                message: seasonal.text,
                seasonalTheme: seasonal.theme,
              });
              lastBillboardKindRef.current = 'seasonal';
            } else {
              if (billboardDeckIndexRef.current >= billboardCompanyDeckRef.current.length) {
                billboardCompanyDeckRef.current = shuffleCompanyIndices(nCompanies);
                billboardDeckIndexRef.current = 0;
              }
              const companyIndex =
                billboardCompanyDeckRef.current[billboardDeckIndexRef.current]!;
              billboardDeckIndexRef.current += 1;
              billboardsRef.current.push({
                x: W + 24,
                kind: 'company',
                companyIndex,
              });
              lastBillboardKindRef.current = 'company';
            }
          }
        }
      }

      let bonusSwayScale = 1;
      if (runLevel === 'bonus') {
        bonusSwayScale =
          (bonusHeatWave ? BONUS_HEAT_WAVE_SWAY_MULT : 1) *
          (inHell ? HELL_FIRE_SWAY_MULT : 1);
      }
      obstaclesRef.current = obstaclesRef.current.filter((o) => {
        o.x -= scroll;
        if (o.kind === 'bonus_fire_emoji') {
          o.swayOffset = bonusFireSwayOffset(
            runDistanceRef.current,
            o.swayPhase ?? 0,
            bonusSwayScale
          );
        } else {
          o.swayOffset = undefined;
        }
        return o.x + o.w > -20;
      });
      billboardsRef.current = billboardsRef.current.filter((bb) => {
        bb.x -= scroll;
        const tail = approxForegroundSignWidth(bb, W, H, runLevel) + 72;
        return bb.x + tail > -100;
      });

      let orderSpawnGuard = 0;
      while (runDistanceRef.current >= nextOrderAtRef.current && orderSpawnGuard < 24) {
        orderSpawnGuard += 1;
        const spawnX = W + ORDER_SPAWN_EDGE_X;
        if (
          isOrderSpawnBlocked(
            spawnX,
            W,
            H,
            obstaclesRef.current,
            billboardsRef.current,
            ordersRef.current,
            activeGameLevelRef.current
          )
        ) {
          nextOrderAtRef.current += ORDER_SPAWN_RETRY_PX;
        } else {
          nextOrderAtRef.current += orderSpawnGapPx(runLevel);
          const { w: ow, h: oh } = orderPickupSizeForLevel(runLevel);
          if (runLevel === 'bonus' && Math.random() < MYSTERY_BOX_SPAWN_CHANCE) {
            ordersRef.current.push({
              x: spawnX,
              w: MYSTERY_BOX_SIDE,
              h: MYSTERY_BOX_SIDE,
              isMysteryBox: true,
            });
          } else {
            const collectibleSrc =
              runLevel === 'bonus'
                ? BONUS_COLLECTIBLE_SRCS[Math.floor(Math.random() * BONUS_COLLECTIBLE_SRCS.length)]
                : undefined;
            ordersRef.current.push({
              x: spawnX,
              w: ow,
              h: oh,
              ...(collectibleSrc ? { collectibleSrc } : {}),
            });
          }
        }
      }
      if (runDistanceRef.current >= nextOrderAtRef.current) {
        nextOrderAtRef.current = runDistanceRef.current + ORDER_SPAWN_GAP_PX * 0.35;
      }

      ordersRef.current = ordersRef.current.filter((ord) => {
        ord.x -= scroll;
        return ord.x + ord.w > -24;
      });

      vyRef.current += GRAVITY * physicsDt;
      pyRef.current += vyRef.current * physicsDt;
      if (pyRef.current >= 0) {
        pyRef.current = 0;
        vyRef.current = 0;
      }

      if (runLevel === 'bonus') {
        const parts = bonusParticlesRef.current;
        const yTopP = groundY + pyRef.current - ph;
        const spawns = bonusHeatWave ? 3 : 2;
        for (let s = 0; s < spawns; s++) {
          parts.push({
            x: px + pw * 0.18 + Math.random() * pw * 0.58,
            y: yTopP + ph * 0.15 + Math.random() * ph * 0.72,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -0.4 - Math.random() * 1.05,
            life: 1,
            phase: Math.random() * Math.PI * 2,
          });
        }
        const lifeDecay = bonusHeatWave ? 0.039 : 0.031;
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i]!;
          p.x -= scroll * 0.36 + p.vx * 0.14;
          p.y += p.vy;
          p.vy += 0.042;
          p.life -= lifeDecay;
          if (p.life <= 0) parts.splice(i, 1);
        }
        while (parts.length > BONUS_PARTICLE_CAP) parts.shift();
      } else {
        bonusParticlesRef.current = [];
      }

      const playerTop = groundY + pyRef.current - ph;
      const playerBottom = groundY + pyRef.current;
      const hitLeft = px + PLAYER_HIT_INSET_X;
      const hitRight = px + pw - PLAYER_HIT_INSET_X;
      const hitTop = playerTop + PLAYER_HIT_INSET_TOP;
      const hitBottom = playerBottom - PLAYER_HIT_INSET_BOTTOM;
      const orderTopY = orderPickupTop(groundY, activeGameLevelRef.current);
      const collectPad = 5;
      for (let i = ordersRef.current.length - 1; i >= 0; i--) {
        const ord = ordersRef.current[i]!;
        if (
          px + pw > ord.x + collectPad &&
          px + collectPad < ord.x + ord.w &&
          playerBottom > orderTopY + collectPad &&
          playerTop < orderTopY + ord.h - collectPad
        ) {
          ordersRef.current.splice(i, 1);
          playOrderPickup();
          if (ord.isMysteryBox) {
            const roll = rollBonusMysteryEffect();
            if (roll === 'jackpot') {
              scoreRef.current += MYSTERY_JACKPOT_SCORE;
              bonusToastMessageRef.current =
                'Jackpot!\nHuge score burst from the mystery box.';
            } else if (roll === 'slowmo') {
              bonusSlowMoEndMsRef.current = nowWall + BONUS_SLOWMO_DURATION_MS;
              bonusToastMessageRef.current =
                'Slow-mo!\nScroll eases off for a few seconds — breathe.';
            } else {
              bonusShieldChargesRef.current += 1;
              bonusToastMessageRef.current =
                'Shield!\nThe next fire hit is absorbed — one charge.';
            }
            bonusToastFramesRef.current = BONUS_MYSTERY_TOAST_FRAMES;
          } else {
            scoreRef.current += ORDER_BONUS_SCORE;
            niceOrderMessageFramesRef.current = NICE_ORDER_MESSAGE_FRAMES;
          }
        }
      }
      for (const o of obstaclesRef.current) {
        let hitH = o.collisionH ?? o.h;
        let obInsetX = OBSTACLE_HIT_INSET_X;
        let obHitTopPad = OBSTACLE_HIT_INSET_TOP;
        if (isTradeShowLevel(runLevel) && o.collisionH == null) {
          const tun = tradeJumpObstacleHitTuning(runLevel);
          hitH = Math.max(tun.hMin, Math.round(o.h * tun.hFrac));
          obInsetX = tun.insetX;
          obHitTopPad = OBSTACLE_HIT_INSET_TOP + Math.round(o.h * tun.topTrimFrac);
        }
        let effW = o.w;
        if (runLevel === 'bonus' && o.kind === 'bonus_fire_emoji' && inHell) {
          effW = o.w * HELL_FIRE_COLLISION_MULT;
          hitH = Math.ceil(hitH * HELL_FIRE_COLLISION_MULT);
        }
        const obTop = groundY - hitH;
        const obBottom = groundY;
        const innerW = Math.max(OBSTACLE_HIT_MIN_W, effW - obInsetX * 2);
        const xEff = obstacleEffectiveLeft(o);
        const obLeft = xEff + o.w / 2 - innerW / 2;
        const obHitTop = obTop + obHitTopPad;
        if (
          hitRight > obLeft &&
          hitLeft < obLeft + innerW &&
          hitBottom > obHitTop &&
          hitTop < obBottom
        ) {
          if (
            runLevel === 'bonus' &&
            o.kind === 'bonus_fire_emoji' &&
            bonusShieldFireInvulnFramesRef.current > 0
          ) {
            continue;
          }
          if (
            runLevel === 'bonus' &&
            o.kind === 'bonus_fire_emoji' &&
            bonusShieldChargesRef.current > 0
          ) {
            bonusShieldChargesRef.current -= 1;
            bonusShieldFireInvulnFramesRef.current = BONUS_SHIELD_FIRE_INVULN_FRAMES;
            const left = bonusShieldChargesRef.current;
            bonusToastMessageRef.current =
              left > 0
                ? `Shield absorbed the hit!\n${left} charge${left === 1 ? '' : 's'} left.`
                : 'Shield absorbed the hit!\nNo shield left — grab a mystery box.';
            bonusToastFramesRef.current = BONUS_MYSTERY_TOAST_FRAMES;
            continue;
          }
          const final = Math.floor(scoreRef.current);
          const lvl = activeGameLevelRef.current;
          const prevHi = readHighScoreForLevel(lvl);
          const nextHi = Math.max(prevHi, final);
          writeHighScoreForLevel(lvl, nextHi);
          lostDuringRunRef.current = true;
          setHighScore(nextHi);
          setLastRunScore(final);
          setLastRunLevel(lvl);
          setWasRecord(final > prevHi);
          setLosePhrase(randomLosePhrase());
          paintGameFrame(ctx, canvas);
          playLaugh();
          setOutcome('lost');
          return;
        }
      }

      paintGameFrame(ctx, canvas);

      if (niceOrderMessageFramesRef.current > 0) {
        niceOrderMessageFramesRef.current -= 1;
      }
      if (heatWaveHudFramesRef.current > 0) {
        heatWaveHudFramesRef.current -= 1;
      }
      if (bonusToastFramesRef.current > 0) {
        bonusToastFramesRef.current -= 1;
      }
      if (bonusShieldFireInvulnFramesRef.current > 0) {
        bonusShieldFireInvulnFramesRef.current -= 1;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [screen, outcome, paintGameFrame, playLaugh, playOrderPickup, setMusicMode]);

  useEffect(() => {
    // Ensure music never plays in the menu state or after a loss.
    if (screen !== 'game' || outcome !== null) {
      gameMusicRef.current?.pause();
      discoMusicRef.current?.pause();
      bonusHellMusicRef.current?.pause();
      musicModeRef.current = 'none';
      discoSegmentRef.current = 'idle';
      bonusHellSegmentRef.current = 'idle';
      discoVisualBlendRef.current = 0;
    }
  }, [screen, outcome]);

  useEffect(() => {
    if (screen !== 'game' || outcome !== null) return;
    const kd = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
      if (e.code === 'Escape') onClose();
    };
    window.addEventListener('keydown', kd);
    return () => window.removeEventListener('keydown', kd);
  }, [screen, outcome, jump, onClose]);

  const playing = screen === 'game' && outcome === null;

  useEffect(() => {
    if (!playing) return;
    const el = tapBelowRef.current;
    if (!el) return;

    const blockDefault = (e: Event) => {
      e.preventDefault();
    };

    const touch: AddEventListenerOptions = { passive: false };
    el.addEventListener('touchstart', blockDefault, touch);
    el.addEventListener('gesturestart', blockDefault);

    return () => {
      el.removeEventListener('touchstart', blockDefault, touch);
      el.removeEventListener('gesturestart', blockDefault);
    };
  }, [playing]);

  return (
    <div
      ref={shellRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-neutral-950/95 p-2 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:p-4 select-none [-webkit-touch-callout:none] [-webkit-user-select:none] [-webkit-tap-highlight-color:transparent]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sales-agent-dash-title"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className={`flex w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-neutral-600 bg-neutral-900 shadow-2xl max-h-[96dvh] min-h-0 ${screen === 'game' ? 'min-h-[min(82dvh,96dvh)] sm:min-h-0' : 'lg:max-h-[min(90vh,820px)]'}`}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-neutral-700 px-3 py-2 sm:px-4 sm:py-2.5">
          <h2 id="sales-agent-dash-title" className="text-base font-semibold text-white sm:text-lg">
            Sales Agent Dash
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setAudioEnabled((v) => {
                  const next = !v;
                  // When enabling audio, prime silently from this click gesture.
                  if (next) {
                    void primeHtmlAudioUnlockSilently(true);
                  }
                  return next;
                });
              }}
              aria-pressed={audioEnabled}
              className="rounded-md border border-neutral-600 px-3 py-1.5 text-sm text-white hover:bg-neutral-800"
            >
              Audio: {audioEnabled ? 'On' : 'Off'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-neutral-600 px-3 py-1.5 text-sm text-white hover:bg-neutral-800"
            >
              Close
            </button>
          </div>
        </div>

        <div
          ref={mainScrollRef}
          className={`flex min-h-0 flex-1 flex-col items-center overflow-x-hidden p-2 sm:p-3 ${
            screen === 'menu' ? 'overflow-y-auto lg:overflow-y-hidden' : 'overflow-y-auto'
          }`}
        >
          {screen === 'menu' && (
            <div className="w-full py-3 text-center text-neutral-200 md:py-4">
              <p className="mb-1.5 max-w-md mx-auto px-1 text-xs leading-snug text-neutral-300 md:text-sm md:leading-snug">
                Pick a level, run and jump. Collect floating pickups for bonus score — hazards change per level.
              </p>
              <div className="mb-3 flex w-full max-w-md mx-auto items-center justify-center gap-1 px-2 sm:gap-1.5">
                <span className="h-0.5 w-5 shrink-0 rounded-full bg-gradient-to-r from-transparent to-teal-400/90 sm:w-8" />
                <span className="h-0.5 min-w-[0.75rem] flex-1 max-w-[3rem] rounded-full bg-gradient-to-r from-teal-600/80 to-teal-400" />
                <h2 className="mx-0.5 shrink-0 rounded-full border border-teal-400/40 bg-gradient-to-b from-neutral-800/95 to-neutral-950/95 px-3 py-1.5 shadow-[0_0_20px_rgba(45,212,191,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] sm:px-4 sm:py-2">
                  <span className="block bg-gradient-to-r from-teal-200 via-cyan-100 to-teal-200 bg-clip-text text-center text-[0.6rem] font-black leading-none tracking-[0.26em] text-transparent sm:text-[0.65rem] sm:tracking-[0.3em]">
                    LEVEL SELECT
                  </span>
                </h2>
                <span className="h-0.5 min-w-[0.75rem] flex-1 max-w-[3rem] rounded-full bg-gradient-to-l from-teal-600/80 to-teal-400" />
                <span className="h-0.5 w-5 shrink-0 rounded-full bg-gradient-to-l from-transparent to-teal-400/90 sm:w-8" />
              </div>
              <div className="mb-2 grid max-w-md mx-auto w-full gap-1 px-1 sm:gap-1.5">
                {GAME_LEVELS.map((lv) => (
                  <button
                    key={lv.id}
                    type="button"
                    title={`${lv.blurb} — Click again when highlighted to start.`}
                    onClick={() => onMenuLevelCardClick(lv.id)}
                    className={`rounded-lg border px-2.5 py-1.5 text-left transition-colors sm:px-3 ${
                      menuLevel === lv.id
                        ? 'border-teal-500 bg-teal-950/35 ring-1 ring-teal-500/40'
                        : 'border-neutral-600 bg-neutral-800/45 hover:bg-neutral-800'
                    }`}
                  >
                    <span className="block text-sm font-semibold leading-tight text-white">{lv.title}</span>
                    <span className="mt-0.5 block line-clamp-1 text-left text-[11px] leading-tight text-neutral-400 sm:text-xs">
                      {lv.blurb}
                    </span>
                  </button>
                ))}
              </div>
              {lbSubmittedThisRun ? (
                <p className="mb-2 max-w-md mx-auto text-xs font-medium text-teal-400 sm:text-sm">
                  Your score for{' '}
                  <span className="text-teal-200">
                    {GAME_LEVELS.find((l) => l.id === menuLevel)?.title ?? 'this venue'}
                  </span>{' '}
                  is on the board below.
                </p>
              ) : null}
              <div
                ref={leaderboardSectionRef}
                className="mb-3 w-full max-w-md mx-auto rounded-lg border border-neutral-700 bg-neutral-800/40 px-3 py-2 text-left"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-xs font-semibold text-white sm:text-sm">
                    Global board —{' '}
                    <span className="font-normal text-neutral-400">
                      {GAME_LEVELS.find((l) => l.id === menuLevel)?.title ?? menuLevel}
                    </span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => void loadLeaderboard()}
                    className="text-[11px] text-teal-400 hover:text-teal-300 sm:text-xs"
                    disabled={globalLbLoading}
                  >
                    Refresh
                  </button>
                </div>
                {globalLbLoading ? (
                  <p className="text-xs text-neutral-500 sm:text-sm">Loading scores…</p>
                ) : globalLbConfigured === false ? (
                  <p className="text-xs text-neutral-500 leading-snug sm:text-sm sm:leading-relaxed">
                    {globalLbLoadError === 'invalid_level' ? (
                      <>
                        This deployment’s API does not recognise a level id (e.g.{' '}
                        <code className="text-neutral-400">bonus</code>). Deploy the latest code so the leaderboard route
                        matches <code className="text-neutral-400">game-levels.ts</code>.
                      </>
                    ) : globalLbLoadError === 'network' ? (
                      <>Could not reach the server. Check your connection and tap Refresh.</>
                    ) : globalLbLoadError === 'server' ? (
                      <>Could not load scores. Tap Refresh or try again shortly.</>
                    ) : (
                      <>
                        Global boards need a Redis REST API on the server (every level, including Bonus). Use either{' '}
                        <code className="text-neutral-400">UPSTASH_REDIS_REST_URL</code> +{' '}
                        <code className="text-neutral-400">UPSTASH_REDIS_REST_TOKEN</code>, or Vercel Storage / KV:{' '}
                        <code className="text-neutral-400">KV_REST_API_URL</code> +{' '}
                        <code className="text-neutral-400">KV_REST_API_TOKEN</code>. See{' '}
                        <code className="text-neutral-400">.env.example</code>, then redeploy.
                      </>
                    )}
                  </p>
                ) : globalLb.length === 0 ? (
                  <p className="text-xs text-neutral-500 sm:text-sm">No scores yet — be the first.</p>
                ) : (
                  <ol className="max-h-28 overflow-y-auto text-xs space-y-0.5 pr-1 sm:max-h-36 sm:text-sm sm:space-y-1">
                    {globalLb.map((e) => (
                      <li
                        key={`${e.rank}-${e.submittedAt}-${e.score}-${e.name}`}
                        className="flex justify-between gap-2 border-b border-neutral-700/80 py-0.5 last:border-0 sm:py-1"
                      >
                        <span className="text-neutral-300">
                          <span className="text-neutral-500 tabular-nums">{e.rank}.</span> {e.name}
                        </span>
                        <span className="font-medium text-teal-400 tabular-nums shrink-0">
                          {e.score.toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
              <p className="mb-2 text-[11px] text-neutral-500 max-w-md mx-auto leading-snug sm:mb-3 sm:text-xs sm:leading-relaxed">
                Personal best on this device for{' '}
                <span className="text-neutral-400">{GAME_LEVELS.find((l) => l.id === menuLevel)?.title}</span>:{' '}
                {highScore.toLocaleString()}. That stays on this device. The list above is the shared global top for this
                venue only — pick another level to see its board.
              </p>
              <button
                type="button"
                onClick={() => {
                  activeGameLevelRef.current = menuLevel;
                  startGame();
                }}
                className="rounded-lg border border-white bg-white px-5 py-1.5 text-sm font-medium text-neutral-950 hover:bg-neutral-200 sm:px-6 sm:py-2"
              >
                Start run
              </button>
            </div>
          )}

          {screen === 'game' && (
            <>
              <div className="relative flex w-full shrink-0 items-stretch justify-center min-h-[min(52dvh,50svh)] max-h-[68dvh] sm:min-h-0 sm:max-h-none sm:flex-none [-webkit-touch-callout:none]">
                <canvas
                  ref={canvasRef}
                  className={`block h-auto w-full max-w-2xl touch-none select-none rounded-lg border border-neutral-700 sm:max-h-[400px] [-webkit-touch-callout:none] [-webkit-user-select:none] ${playing ? 'cursor-pointer' : ''}`}
                  style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTouchCallout: 'none',
                    touchAction: 'none',
                  }}
                  onMouseDown={playing ? jump : undefined}
                  onContextMenu={(e) => e.preventDefault()}
                  onTouchStart={
                    playing
                      ? (e) => {
                          e.preventDefault();
                          jump();
                        }
                      : undefined
                  }
                />
              </div>
              {playing ? (
                <div
                  ref={tapBelowRef}
                  className="mt-2 w-full max-w-2xl min-h-[min(36dvh,240px)] shrink-0 touch-none select-none sm:min-h-20"
                  style={{
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTouchCallout: 'none',
                    touchAction: 'none',
                  }}
                  aria-label="Tap to jump"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      jump();
                    }
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    jump();
                  }}
                  onMouseDown={(e) => {
                    if (e.button !== 0) return;
                    e.preventDefault();
                    jump();
                  }}
                />
              ) : null}
              {outcome === 'lost' && lastRunScore !== null && (
                <div className="mt-4 flex flex-col gap-2 text-center">
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-neutral-100">
                      Score: <span className="text-white">{lastRunScore.toLocaleString()}</span>
                    </p>
                    <p className="text-sm text-neutral-400">
                      Best: {highScore.toLocaleString()}
                      {wasRecord ? (
                        <span className="ml-2 font-semibold text-amber-400">New personal best!</span>
                      ) : null}
                    </p>
                    <p className="text-sm italic text-red-400/95">
                      {losePhrase ?? 'Bumped into something — try again!'}
                    </p>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Level:{' '}
                    <span className="text-neutral-300">
                      {GAME_LEVELS.find((l) => l.id === activeGameLevelRef.current)?.title ?? '—'}
                    </span>
                  </p>
                  {globalLbLoading && !lbSubmittedThisRun ? (
                    <p className="text-xs text-neutral-500">Loading global leaderboard for this level…</p>
                  ) : null}
                  <div className="mt-1 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={startGame}
                      className="rounded-lg border border-neutral-500 px-4 py-2 text-white hover:bg-neutral-800"
                    >
                      Play again
                    </button>
                    <button
                      type="button"
                      onClick={() => setScreen('menu')}
                      className="rounded-lg border border-neutral-500 px-4 py-2 text-neutral-200 hover:bg-neutral-800"
                    >
                      Choose level
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-lg border border-white bg-white px-4 py-2 text-neutral-950 hover:bg-neutral-200"
                    >
                      Back to site
                    </button>
                  </div>
                  {globalLbConfigured === true && !lbSubmittedThisRun ? (
                    <div
                      ref={lossScreenSubmitRef}
                      className="mt-3 w-full max-w-sm mx-auto rounded-lg border border-neutral-600 bg-neutral-800/50 p-4 text-left"
                    >
                      <p className="text-sm text-neutral-300 mb-2">
                        Add this run to the global board for{' '}
                        <span className="font-medium text-white">
                          {GAME_LEVELS.find((l) => l.id === lastRunLevel)?.title ?? 'this venue'}
                        </span>
                        ? Enter a display name and submit.
                      </p>
                      <input
                        type="text"
                        value={lbDisplayName}
                        onChange={(e) => setLbDisplayName(e.target.value.slice(0, 24))}
                        placeholder="Display name"
                        autoComplete="nickname"
                        className="mb-3 w-full rounded-md border border-neutral-600 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500"
                        maxLength={24}
                      />
                      <button
                        type="button"
                        onClick={() => void submitGlobalScore()}
                        disabled={lbSubmitting}
                        className="w-full rounded-lg border border-teal-600 bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {lbSubmitting ? 'Submitting…' : 'Submit to global board'}
                      </button>
                    </div>
                  ) : null}
                  {globalLbConfigured === false && !globalLbLoading ? (
                    <p className="mt-2 text-xs text-neutral-500 max-w-sm mx-auto leading-snug">
                      {globalLbLoadError === 'invalid_level' ? (
                        <>
                          Deploy the latest site: this server’s leaderboard does not accept the Bonus level id yet (it
                          should match <code className="text-neutral-400">game-levels.ts</code>).
                        </>
                      ) : globalLbLoadError === 'network' ? (
                        <>Could not reach the leaderboard. Check your connection, or open Choose level and tap Refresh.</>
                      ) : globalLbLoadError === 'server' ? (
                        <>Leaderboard request failed. Try Choose level → Refresh, or Play again.</>
                      ) : (
                        <>
                          Global boards need Redis REST credentials on this host (Bonus uses the same API as other
                          levels). Set either Upstash{' '}
                          <code className="text-neutral-400">UPSTASH_REDIS_REST_URL</code> +{' '}
                          <code className="text-neutral-400">UPSTASH_REDIS_REST_TOKEN</code>, or Vercel KV{' '}
                          <code className="text-neutral-400">KV_REST_API_URL</code> +{' '}
                          <code className="text-neutral-400">KV_REST_API_TOKEN</code>, then redeploy.
                        </>
                      )}
                    </p>
                  ) : null}
                  {lbSubmitError ? (
                    <p className="text-sm text-red-400 max-w-sm mx-auto">{lbSubmitError}</p>
                  ) : null}
                </div>
              )}
            </>
          )}
        </div>

        <p className="shrink-0 border-t border-neutral-800 px-3 py-1.5 text-center text-[11px] text-neutral-500 sm:px-4 sm:py-2 sm:text-xs">
          <span className="sm:hidden">Touch screen to jump</span>
          <span className="hidden sm:inline">Click or press Space to jump</span>
        </p>
      </div>
    </div>
  );
}