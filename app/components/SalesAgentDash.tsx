'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { companies } from '@/app/data/companies';

const STORAGE_KEY = 'sales-agent-dash-high-score';
const AUDIO_ENABLED_KEY = 'sales-agent-dash-audio-enabled';

/** Opaque backing store — slightly cheaper compositing than default alpha on many mobile GPUs. */
const CTX_2D_OPTS: CanvasRenderingContext2DSettings = { alpha: false };

const GROUND_RATIO = 0.78;
const GRAVITY = 0.68;
const JUMP_V = -13.5;
const BASE_SCROLL = 3.9;
/** World pixels travelled between obstacle spawns (keeps density as scroll speed ramps up). */
const OBSTACLE_SPAWN_GAP_PX = 465;
/** Scenic billboards (no collision); spaced apart from obstacle cadence. */
const BILLBOARD_SPAWN_GAP_PX = 820;

/** No disco below this floor score. */
const DISCO_MIN_SCORE = 3000;
/** First disco block: `DISCO_MIN_SCORE`..`DISCO_MIN_SCORE + DISCO_DURATION_SCORE - 1`. */
const DISCO_DURATION_SCORE = 1000;
/** After the first block, repeating cycle: this many normal, then `DISCO_DURATION_SCORE` disco. */
const DISCO_REPEAT_NORMAL_SCORE = 2000;
const DISCO_REPEAT_CYCLE = DISCO_REPEAT_NORMAL_SCORE + DISCO_DURATION_SCORE;

// Game audio lives under `public/` so it's served from the site root (`/Audio/...`).
// Note: the folder name is capitalized in your project (`public/Audio`).
const GAME_MUSIC_SRC = '/Audio/Game%20Audio.m4a';
const DISCO_MUSIC_SRC = '/Audio/Disco%20Mode.m4a';
const LAUGH_SRC = '/Audio/Laugh.m4a';
const GAME_MUSIC_VOLUME = 0.35;
const DISCO_MUSIC_VOLUME = 0.45;
const LAUGH_VOLUME = 0.8;

function isDiscoScore(score: number): boolean {
  const s = Math.floor(score);
  if (s < DISCO_MIN_SCORE) return false;
  if (s < DISCO_MIN_SCORE + DISCO_DURATION_SCORE) return true;
  const v = s - (DISCO_MIN_SCORE + DISCO_DURATION_SCORE);
  const pos = v % DISCO_REPEAT_CYCLE;
  return pos >= DISCO_REPEAT_NORMAL_SCORE;
}

const COUNTIES = ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'] as const;
/** "Now entering" overlay only for the first four county transitions per run (one lap). */
const COUNTY_BANNER_MAX_SHOWS = 4;

function countyForScore(score: number): (typeof COUNTIES)[number] {
  return COUNTIES[Math.floor(score / 500) % 4];
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

const OBSTACLE_KINDS = [
  'speed_camera',
  'pcn',
  'pro_forma_invoice',
  'broken_car',
  'sales_target',
  'hmrc',
  'snake',
] as const;

type ObstacleKind = (typeof OBSTACLE_KINDS)[number];

interface Obstacle {
  x: number;
  w: number;
  h: number;
  kind: ObstacleKind;
}

interface Billboard {
  x: number;
  /** Index into `companies` */
  companyIndex: number;
}

function drawBillboard(
  ctx: CanvasRenderingContext2D,
  b: Billboard,
  groundY: number,
  canvasH: number,
  canvasW: number,
  logos: Map<string, HTMLImageElement>
) {
  const c = companies[b.companyIndex];
  if (!c) return;

  // Landscape (width > height); vertical span similar to before; bottom edge above obstacles.
  const aspect = 1.82;
  let boardH = Math.max(86, Math.min(canvasH * 0.21, 142));
  let boardW = Math.min(boardH * aspect, canvasW * 0.48, 200);
  if (boardW <= boardH) {
    boardW = Math.min(canvasW * 0.5, 200);
    boardH = Math.min(boardH, boardW / aspect);
  }
  const poleW = Math.max(9, boardW * 0.065);
  const x = b.x;
  // Keep billboards visually away from the "jump obstacle" lane (which tops out ~64px above ground).
  // A larger clearance prevents any apparent touching when billboards scroll near obstacles.
  const clearanceAboveRoad = Math.max(120, Math.min(groundY * 0.18, 160));
  const boardBottom = groundY - clearanceAboveRoad;
  const boardTop = boardBottom - boardH;
  const url = c.logoUrlDark ?? c.logoUrl;

  ctx.fillStyle = '#3f3f46';
  // Pole reaches the road/floor; the panel itself is already positioned higher
  // via `clearanceAboveRoad`.
  ctx.fillRect(x + boardW / 2 - poleW / 2, boardBottom, poleW, groundY - boardBottom);

  ctx.fillStyle = '#fafafa';
  roundRectPath(ctx, x, boardTop, boardW, boardH, 5);
  ctx.fill();
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 2;
  ctx.stroke();

  const pad = 7;
  const innerW = boardW - pad * 2;
  const innerH = boardH - pad * 2;
  const img = logos.get(url);
  if (img && img.complete && img.naturalWidth > 0) {
    const scale = Math.min(innerW / img.naturalWidth, innerH / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = x + pad + (innerW - dw) / 2;
    const dy = boardTop + pad + (innerH - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
  } else {
    ctx.fillStyle = '#e4e4e7';
    roundRectPath(ctx, x + pad, boardTop + pad, innerW, innerH, 3);
    ctx.fill();
    ctx.fillStyle = '#71717a';
    ctx.font = '600 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(c.name.split(' ')[0] ?? '…', x + boardW / 2, boardTop + pad + innerH / 2 + 4);
    ctx.textAlign = 'left';
  }
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
      return { w: 78, h: 48 };
    case 'sales_target':
      return { w: 50, h: 62 };
    case 'hmrc':
      return { w: 54, h: 58 };
    case 'snake':
      return { w: 86, h: 44 };
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

/**
 * Shrinks font until the string fits within maxWidth.
 * Uses `>=` so the size at hardMinPx is actually measured; if it still overflows, continues down to absoluteMinPx.
 */
function measureFitFontPxHard(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxPx: number,
  hardMinPx: number,
  weight: '' | 'bold' = '',
  absoluteMinPx = 4.5
): number {
  let px = maxPx;
  const w = weight === 'bold' ? 'bold ' : '';
  while (px >= hardMinPx) {
    ctx.font = `${w}${px}px system-ui, sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) return px;
    px -= 0.5;
  }
  px = hardMinPx - 0.5;
  while (px >= absoluteMinPx) {
    ctx.font = `${w}${px}px system-ui, sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) return px;
    px -= 0.5;
  }
  ctx.font = `${w}${absoluteMinPx}px system-ui, sans-serif`;
  return absoluteMinPx;
}

function fillTextCenterAtBaseline(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  baselineY: number,
  px: number,
  weight: '' | 'bold'
) {
  const w = weight === 'bold' ? 'bold ' : '';
  ctx.font = `${w}${px}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(text, cx, baselineY);
}

/** Same as fillTextCenterAtBaseline but never exceeds maxWidth (safety net for long strings). */
function fillTextCenterAtBaselineClamped(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  baselineY: number,
  px: number,
  maxWidth: number,
  weight: '' | 'bold',
  absoluteMinPx = 4
) {
  const w = weight === 'bold' ? 'bold ' : '';
  let p = px;
  while (p >= absoluteMinPx) {
    ctx.font = `${w}${p}px system-ui, sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) break;
    p -= 0.5;
  }
  ctx.textAlign = 'center';
  ctx.fillText(text, cx, baselineY);
}

/**
 * 8-bit side-view snake: tail left → head right (toward the player), belly below.
 * Chars: _ empty, # outline, G/g/l body, o/O eyes, r tongue, t tail tip.
 */
const SNAKE_PIXEL_ROWS = [
  '____________________________________',
  '____________________________________',
  '______________________________oOo___',
  '____________________________GGGGGG__',
  '__________________________GGGGGGGGGG',
  '_gggGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
  '_gggGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGr',
  '_gggGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
  '____GGGGGGGGGGGGGGGGGGGGGGGGGG______',
  '______GGGGGGGGGGGGGGGGGGGGGG________',
  '__________GGGGGGGGGGGGGGGG__________',
  '______________GGGGGGGGGG____________',
  '__________________GGGG______________',
  '____________________tt______________',
] as const;

const SNAKE_PALETTE: Record<string, string | undefined> = {
  _: 'transparent',
  '#': '#14532d',
  G: '#15803d',
  g: '#22c55e',
  l: '#4ade80',
  o: '#fef9c3',
  O: '#0f172a',
  r: '#dc2626',
  t: '#166534',
};

function drawPixelSprite8bit(
  ctx: CanvasRenderingContext2D,
  x: number,
  top: number,
  w: number,
  h: number,
  rows: readonly string[],
  palette: Record<string, string | undefined>
) {
  const cols = rows[0]!.length;
  const rowCount = rows.length;
  const scale = Math.min(w / cols, h / rowCount);
  const drawW = cols * scale;
  const drawH = rowCount * scale;
  const ox = x + (w - drawW) / 2;
  const oy = top + (h - drawH) / 2;

  for (let ry = 0; ry < rowCount; ry++) {
    const row = rows[ry]!;
    for (let rx = 0; rx < cols; rx++) {
      const ch = row[rx]!;
      const color = palette[ch];
      if (!color || color === 'transparent') continue;
      ctx.fillStyle = color;
      ctx.fillRect(ox + rx * scale, oy + ry * scale, Math.ceil(scale), Math.ceil(scale));
    }
  }
}

function drawSnake8bit(ctx: CanvasRenderingContext2D, x: number, top: number, w: number, h: number) {
  drawPixelSprite8bit(ctx, x, top, w, h, SNAKE_PIXEL_ROWS, SNAKE_PALETTE);
}

function drawObstacle(ctx: CanvasRenderingContext2D, o: Obstacle, top: number) {
  const { x, w, h, kind } = o;

  switch (kind) {
    case 'snake': {
      ctx.fillStyle = '#292524';
      ctx.fillRect(x, top + h - 4, w, 4);
      drawSnake8bit(ctx, x, top, w, h - 4);
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
      ctx.fillStyle = '#64748b';
      ctx.fillRect(x + 8, top + 18, w - 16, 22);
      roundRectPath(ctx, x + 4, top + 14, w - 8, 18, 6);
      ctx.fill();
      ctx.fillStyle = '#475569';
      ctx.fillRect(x + 22, top + 10, 28, 12);
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(x + 22, top + 38, 8, 0, Math.PI * 2);
      ctx.arc(x + w - 22, top + 38, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(x + 12, top + 22, 16, 10);
      ctx.fillRect(x + w - 28, top + 22, 16, 10);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 34, top + 8);
      ctx.lineTo(x + 42, top + 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(148,163,184,0.7)';
      ctx.beginPath();
      ctx.arc(x + 46, top - 2, 6, 0, Math.PI * 2);
      ctx.arc(x + 54, top - 6, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(x + 54, top + 12, 4, 3);
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

function drawDiscoBall(ctx: CanvasRenderingContext2D, W: number, dropProgress: number) {
  const cx = W / 2;
  const ballR = Math.min(24, Math.max(16, W * 0.055));
  const mountY = 2;
  const targetBallCy = ballR + 32;
  const startCy = -ballR - 20;
  const ballCy = startCy + (targetBallCy - startCy) * dropProgress;
  const spin = performance.now() * 0.0022;

  ctx.strokeStyle = 'rgba(51,65,85,0.95)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, mountY);
  ctx.lineTo(cx, Math.max(mountY + 4, ballCy - ballR));
  ctx.stroke();

  const spark = ctx.createRadialGradient(
    cx - ballR * 0.4,
    ballCy - ballR * 0.4,
    ballR * 0.1,
    cx,
    ballCy,
    ballR
  );
  spark.addColorStop(0, '#f8fafc');
  spark.addColorStop(0.4, '#94a3b8');
  spark.addColorStop(0.75, '#475569');
  spark.addColorStop(1, '#1e293b');
  ctx.fillStyle = spark;
  ctx.beginPath();
  ctx.arc(cx, ballCy, ballR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  const facets = 10;
  for (let i = 0; i < facets; i++) {
    const a = (i / facets) * Math.PI * 2 + spin;
    const hx = cx + Math.cos(a) * ballR * 0.52;
    const hy = ballCy + Math.sin(a) * ballR * 0.52;
    const sz = 2.5 + (i % 3) * 0.9;
    const hue = (i * 41 + spin * 180) % 360;
    ctx.fillStyle = `hsla(${hue}, 92%, ${48 + 22 * Math.sin(spin * 3 + i)}%, 0.88)`;
    ctx.fillRect(hx - sz / 2, hy - sz / 2, sz, sz);
  }
}

function readHighScore(): number {
  if (typeof window === 'undefined') return 0;
  const v = window.localStorage.getItem(STORAGE_KEY);
  const n = parseInt(v ?? '', 10);
  return Number.isFinite(n) ? n : 0;
}

export default function SalesAgentDash({ onClose }: { onClose: () => void }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** Touch target below canvas (mobile): same non-passive touch handling as canvas. */
  const tapBelowRef = useRef<HTMLDivElement>(null);
  const [screen, setScreen] = useState<'menu' | 'game'>('menu');
  const [outcome, setOutcome] = useState<null | 'lost'>(null);
  const [highScore, setHighScore] = useState(() => readHighScore());
  const [lastRunScore, setLastRunScore] = useState<number | null>(null);
  const [wasRecord, setWasRecord] = useState(false);
  const [losePhrase, setLosePhrase] = useState<string | null>(null);
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

  const obstacleSpawnCarryRef = useRef(0);
  const pyRef = useRef(0);
  const vyRef = useRef(0);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const billboardsRef = useRef<Billboard[]>([]);
  const billboardSpawnCarryRef = useRef(0);
  const billboardCompanyDeckRef = useRef<number[]>([]);
  const billboardDeckIndexRef = useRef(0);
  const logoImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const lastCountyBucketRef = useRef(0);
  const countyBannerShowsCountRef = useRef(0);
  const countyBannerRef = useRef({ frames: 0, name: '' as string });
  /** Set synchronously on collision so resize (canvas bitmap clear) can repaint before React commits `outcome`. */
  const lostDuringRunRef = useRef(false);
  const discoWasActiveRef = useRef(false);
  /** 0 → 1 while disco segment runs; eases the ball down from above. */
  const discoBallDropRef = useRef(0);

  // Audio: start normal music when the run starts; switch to disco during disco segments.
  const gameMusicRef = useRef<HTMLAudioElement | null>(null);
  const discoMusicRef = useRef<HTMLAudioElement | null>(null);
  const musicModeRef = useRef<'none' | 'game' | 'disco'>('none');

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
      a.loop = true;
      a.preload = 'auto';
      a.volume = DISCO_MUSIC_VOLUME;
      discoMusicRef.current = a;
    }
  }, []);

  const setMusicMode = useCallback((mode: 'none' | 'game' | 'disco') => {
    // No-op if we're already in the requested mode.
    if (musicModeRef.current === mode) return;
    musicModeRef.current = mode;

    const gameAudio = gameMusicRef.current;
    const discoAudio = discoMusicRef.current;

    if (mode === 'none') {
      gameAudio?.pause();
      discoAudio?.pause();
      return;
    }

    // For 'game'/'disco', ensure elements exist before attempting to play.
    ensureMusicElements();

    const gameAudio2 = gameMusicRef.current;
    const discoAudio2 = discoMusicRef.current;
    if (!gameAudio2 || !discoAudio2) return;

    // Switch tracks: reset time so each disco segment feels like a fresh "drop in".
    if (mode === 'game') {
      discoAudio2.pause();
      discoAudio2.currentTime = 0;
      gameAudio2.currentTime = 0;
      void gameAudio2.play().catch(() => {
        // Autoplay policies can still block play() in some environments.
        // If that happens, we'll just stay silent until the next user gesture.
      });
      return;
    }

    // mode === 'disco'
    gameAudio2.pause();
    gameAudio2.currentTime = 0;
    discoAudio2.currentTime = 0;
    void discoAudio2.play().catch(() => {});
  }, [ensureMusicElements]);

  const laughAudioRef = useRef<HTMLAudioElement | null>(null);

  const ensureLaughElement = useCallback(() => {
    if (laughAudioRef.current) return;
    const a = new Audio(LAUGH_SRC);
    a.preload = 'auto';
    a.loop = false;
    a.volume = LAUGH_VOLUME;
    laughAudioRef.current = a;
  }, []);

  const playLaugh = useCallback(() => {
    if (!audioEnabledRef.current) return;
    ensureLaughElement();
    const a = laughAudioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    void a.play().catch(() => {});
  }, [ensureLaughElement]);

  useEffect(() => {
    // If audio is turned off, stop any currently playing tracks immediately.
    if (audioEnabled) return;
    gameMusicRef.current?.pause();
    discoMusicRef.current?.pause();
    laughAudioRef.current?.pause();
    musicModeRef.current = 'none';
  }, [audioEnabled]);

  useEffect(() => {
    // Safety: stop audio if the component unmounts.
    return () => {
      gameMusicRef.current?.pause();
      discoMusicRef.current?.pause();
      laughAudioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    trackSalesAgentDashOpen();
  }, []);

  const paintGameFrame = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, advanceCountyBanner: boolean) => {
      const W = canvas.width;
      const H = canvas.height;
      if (W < 2 || H < 2) return;

      const groundY = H * GROUND_RATIO;
      const pw = 40;
      const ph = 52;
      const px = W * 0.18;

      const ci = Math.floor(scoreRef.current / 500) % 4;
      const skyPairs = [
        ['#87CEEB', '#E0F4FF'],
        ['#7dd3fc', '#e0f2fe'],
        ['#93c5fd', '#f0f9ff'],
        ['#a5b4fc', '#eef2ff'],
      ];
      const grd = ctx.createLinearGradient(0, 0, 0, H);
      grd.addColorStop(0, skyPairs[ci][0]);
      grd.addColorStop(1, skyPairs[ci][1]);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      const disco = isDiscoScore(scoreRef.current);
      if (disco) {
        drawDiscoFlashes(ctx, W, H, groundY);
      }

      ctx.fillStyle = '#6B5344';
      ctx.fillRect(0, groundY, W, H - groundY);
      ctx.fillStyle = '#8B7355';
      ctx.fillRect(0, groundY, W, 8);

      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      const cloudShift = (scoreRef.current * 0.35) % (W + 120);
      ctx.beginPath();
      ctx.arc(W - cloudShift + 40, 52, 20, 0, Math.PI * 2);
      ctx.arc(W - cloudShift + 62, 48, 26, 0, Math.PI * 2);
      ctx.arc(W - cloudShift + 88, 52, 20, 0, Math.PI * 2);
      ctx.fill();

      for (const o of obstaclesRef.current) {
        const top = groundY - o.h;
        drawObstacle(ctx, o, top);
      }

      // Draw billboards after obstacles so the poles don't appear "behind" the
      // jump-over objects as they scroll.
      for (const bb of billboardsRef.current) {
        drawBillboard(ctx, bb, groundY, H, W, logoImagesRef.current);
      }

      const yTop = groundY + pyRef.current - ph;
      drawPlayer(ctx, px, yTop, pw, ph);

      if (disco) {
        drawDiscoBall(ctx, W, discoBallDropRef.current);
      }

      const displayScore = Math.floor(scoreRef.current);
      const countyLabel = countyForScore(scoreRef.current);
      const countyHue = ['#6d28d9', '#047857', '#b91c1c', '#0369a1'][ci];
      ctx.fillStyle = 'rgba(255,255,255,0.94)';
      roundRectPath(ctx, 8, 8, 216, 58, 8);
      ctx.fill();
      ctx.strokeStyle = 'rgba(15,23,42,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = countyHue;
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillText(countyLabel, 18, 24);
      ctx.fillStyle = '#1a1a1a';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillText(`Score ${displayScore.toLocaleString()}`, 18, 42);
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillStyle = '#52525b';
      ctx.fillText(`Best ${readHighScore().toLocaleString()}`, 18, 56);

      const banner = countyBannerRef.current;
      if (banner.frames > 0) {
        const fade = Math.min(1, banner.frames / 28);
        const isCompact = W < 420;
        // Tighter horizontal padding on narrow canvases so long county names get more width.
        const outerPad = isCompact ? Math.max(6, Math.floor(W * 0.022)) : Math.max(10, Math.floor(W * 0.032));
        const innerPad = Math.max(6, Math.floor(W * 0.022));
        const maxTextW = Math.max(64, W - outerPad * 2 - 4);
        const line1Max = isCompact ? Math.min(15, W * 0.046) : Math.min(14, W * 0.028);
        const line2Max = isCompact ? Math.min(26, W * 0.095) : Math.min(24, W * 0.05);
        const line3Max = isCompact ? Math.min(12, W * 0.036) : Math.min(11, W * 0.026);

        const panelTop = H * 0.23;
        const panelH = Math.min(118, Math.max(isCompact ? 80 : 74, Math.floor(H * 0.32)));

        ctx.save();
        ctx.fillStyle = `rgba(15,23,42,${0.82 * fade})`;
        ctx.fillRect(0, panelTop, W, panelH);
        ctx.strokeStyle = 'rgba(255,255,255,0.22)';
        ctx.lineWidth = 2;
        ctx.strokeRect(outerPad, panelTop + innerPad, W - outerPad * 2, panelH - innerPad * 2);

        const innerTop = panelTop + innerPad;
        const innerBot = panelTop + panelH - innerPad;
        const innerMid = (innerTop + innerBot) / 2;

        const px1 = measureFitFontPxHard(ctx, 'Now entering', maxTextW, line1Max, 7, '');
        const px2 = measureFitFontPxHard(ctx, banner.name, maxTextW, line2Max, 6, 'bold', 4);
        const px3 = measureFitFontPxHard(ctx, 'East Anglia route', maxTextW, line3Max, 6, '');
        const gap12 = Math.max(4, Math.round(Math.min(px1, px2) * 0.16));
        const gap23 = Math.max(3, Math.round(Math.min(px2, px3) * 0.14));
        const span1 = px1 * 1.08 + gap12 * 0.35;
        const span2 = px2 * 1.08 + gap23 * 0.35;
        const span3 = px3 * 0.92;
        ctx.font = `bold ${px2}px system-ui, sans-serif`;
        const countyDesc =
          ctx.measureText(banner.name).actualBoundingBoxDescent ?? px2 * 0.24;
        const blockH = span1 + span2 + span3 + countyDesc * 0.35;
        let b1 = innerMid - blockH / 2 + px1 * 0.78;
        let b2 = b1 + span1;
        let b3 = b2 + span2 + countyDesc * 0.35;
        const minBaselineTop = innerTop + px1 + 2;
        const maxBaselineBot = innerBot - Math.max(px3 * 0.28, (px3 * 0.85) / 3) - 3;
        if (b1 < minBaselineTop) {
          const s = minBaselineTop - b1;
          b1 += s;
          b2 += s;
          b3 += s;
        }
        if (b3 > maxBaselineBot) {
          const s = b3 - maxBaselineBot;
          b1 -= s;
          b2 -= s;
          b3 -= s;
        }

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        fillTextCenterAtBaselineClamped(ctx, 'Now entering', W / 2, b1, px1, maxTextW, '');
        fillTextCenterAtBaselineClamped(ctx, banner.name, W / 2, b2, px2, maxTextW, 'bold', 4);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        fillTextCenterAtBaselineClamped(ctx, 'East Anglia route', W / 2, b3, px3, maxTextW, '', 4);
        ctx.textAlign = 'left';
        ctx.restore();
        if (advanceCountyBanner) {
          countyBannerRef.current = { ...banner, frames: banner.frames - 1 };
        }
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
      if (ctx) paintGameFrame(ctx, c, false);
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
    obstacleSpawnCarryRef.current = 0;
    pyRef.current = 0;
    vyRef.current = 0;
    obstaclesRef.current = [];
    lastCountyBucketRef.current = 0;
    countyBannerShowsCountRef.current = 0;
    countyBannerRef.current = { frames: 0, name: '' };
    lostDuringRunRef.current = false;
    discoWasActiveRef.current = false;
    discoBallDropRef.current = 0;
    billboardsRef.current = [];
    billboardSpawnCarryRef.current = 0;
    billboardCompanyDeckRef.current = [];
    billboardDeckIndexRef.current = 0;
    setOutcome(null);
    setLastRunScore(null);
    setWasRecord(false);
    setLosePhrase(null);
    laughAudioRef.current?.pause();
    if (laughAudioRef.current) laughAudioRef.current.currentTime = 0;
    setMusicMode(audioEnabledRef.current ? 'game' : 'none');
    setScreen('game');
  }, []);

  const jump = useCallback(() => {
    if (outcome !== null) return;
    if (pyRef.current >= 0 && vyRef.current >= 0) {
      vyRef.current = JUMP_V;
    }
  }, [outcome]);

  useEffect(() => {
    const map = new Map<string, HTMLImageElement>();
    for (const comp of companies) {
      const url = comp.logoUrlDark ?? comp.logoUrl;
      if (map.has(url)) continue;
      const img = new Image();
      img.decoding = 'async';
      img.src = url;
      map.set(url, img);
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

      const difficulty = 1 + Math.min(2, scoreRef.current / 4000);
      const scroll = BASE_SCROLL * difficulty;
      scoreRef.current += scroll * 0.35;

      const sFloor = Math.floor(scoreRef.current);
      const inDisco = isDiscoScore(sFloor);

      // Audio mode switches only when the disco state flips, not every frame.
      // This keeps play/pause calls from spamming.
      const desiredMode: 'none' | 'game' | 'disco' = audioEnabledRef.current
        ? inDisco
          ? 'disco'
          : 'game'
        : 'none';
      if (musicModeRef.current !== desiredMode) {
        setMusicMode(desiredMode);
      }

      if (inDisco) {
        if (!discoWasActiveRef.current) discoBallDropRef.current = 0;
        discoBallDropRef.current = Math.min(1, discoBallDropRef.current + 0.052);
        discoWasActiveRef.current = true;
      } else {
        discoWasActiveRef.current = false;
        discoBallDropRef.current = 0;
      }

      const scoreBucket = Math.floor(scoreRef.current / 500);
      if (scoreBucket > lastCountyBucketRef.current) {
        lastCountyBucketRef.current = scoreBucket;
        if (countyBannerShowsCountRef.current < COUNTY_BANNER_MAX_SHOWS) {
          countyBannerShowsCountRef.current += 1;
          countyBannerRef.current = {
            frames: 120,
            name: COUNTIES[scoreBucket % 4],
          };
        }
      }

      obstacleSpawnCarryRef.current += scroll;
      while (obstacleSpawnCarryRef.current >= OBSTACLE_SPAWN_GAP_PX) {
        obstacleSpawnCarryRef.current -= OBSTACLE_SPAWN_GAP_PX;
        const kind = OBSTACLE_KINDS[Math.floor(Math.random() * OBSTACLE_KINDS.length)];
        const { w: ow, h: oh } = dimsFor(kind);
        obstaclesRef.current.push({
          x: W + 24,
          w: ow,
          h: oh,
          kind,
        });
      }

      obstaclesRef.current = obstaclesRef.current.filter((o) => {
        o.x -= scroll;
        return o.x + o.w > -20;
      });

      const nCompanies = companies.length;
      if (nCompanies > 0) {
        billboardSpawnCarryRef.current += scroll;
        while (billboardSpawnCarryRef.current >= BILLBOARD_SPAWN_GAP_PX) {
          billboardSpawnCarryRef.current -= BILLBOARD_SPAWN_GAP_PX;
          if (billboardDeckIndexRef.current >= billboardCompanyDeckRef.current.length) {
            billboardCompanyDeckRef.current = shuffleCompanyIndices(nCompanies);
            billboardDeckIndexRef.current = 0;
          }
          const companyIndex =
            billboardCompanyDeckRef.current[billboardDeckIndexRef.current]!;
          billboardDeckIndexRef.current += 1;
          billboardsRef.current.push({
            x: W + 32 + Math.random() * 80,
            companyIndex,
          });
        }
      }
      billboardsRef.current = billboardsRef.current.filter((bb) => {
        bb.x -= scroll;
        return bb.x + 210 > -100;
      });

      vyRef.current += GRAVITY;
      pyRef.current += vyRef.current;
      if (pyRef.current >= 0) {
        pyRef.current = 0;
        vyRef.current = 0;
      }

      const playerTop = groundY + pyRef.current - ph;
      const playerBottom = groundY + pyRef.current;
      for (const o of obstaclesRef.current) {
        const obTop = groundY - o.h;
        const obBottom = groundY;
        if (px + pw > o.x && px < o.x + o.w && playerBottom > obTop && playerTop < obBottom) {
          const final = Math.floor(scoreRef.current);
          const prevHi = readHighScore();
          const nextHi = Math.max(prevHi, final);
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, String(nextHi));
          }
          lostDuringRunRef.current = true;
          setHighScore(nextHi);
          setLastRunScore(final);
          setWasRecord(final > prevHi);
          setLosePhrase(randomLosePhrase());
          paintGameFrame(ctx, canvas, false);
          playLaugh();
          setOutcome('lost');
          return;
        }
      }

      paintGameFrame(ctx, canvas, true);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [screen, outcome, paintGameFrame]);

  useEffect(() => {
    // Ensure music never plays in the menu state or after a loss.
    if (screen !== 'game' || outcome !== null) {
      gameMusicRef.current?.pause();
      discoMusicRef.current?.pause();
      musicModeRef.current = 'none';
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
        className={`flex w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-neutral-600 bg-neutral-900 shadow-2xl max-h-[96dvh] min-h-0 ${screen === 'game' ? 'min-h-[min(82dvh,96dvh)] sm:min-h-0' : ''}`}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-neutral-700 px-4 py-3">
          <h2 id="sales-agent-dash-title" className="text-lg font-semibold text-white">
            Sales Agent Dash
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAudioEnabled((v) => !v)}
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

        <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto overflow-x-hidden p-3 sm:p-4">
          {screen === 'menu' && (
            <div className="py-8 text-center text-neutral-200">
              <p className="mb-6 max-w-md mx-auto text-lg leading-relaxed">
                Join Dave on the road, as he navigates East Anglia, avoiding peril.
              </p>
              <p className="mb-6 text-sm font-medium text-teal-400">
                High score: {highScore.toLocaleString()}
              </p>
              <button
                type="button"
                onClick={startGame}
                className="rounded-lg border border-white bg-white px-6 py-2 font-medium text-neutral-950 hover:bg-neutral-200"
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
                <div className="mt-4 space-y-2 text-center">
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
              )}
              {outcome !== null && (
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={startGame}
                    className="rounded-lg border border-neutral-500 px-4 py-2 text-white hover:bg-neutral-800"
                  >
                    Play again
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border border-white bg-white px-4 py-2 text-neutral-950 hover:bg-neutral-200"
                  >
                    Back to site
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <p className="shrink-0 border-t border-neutral-800 px-4 py-2 text-center text-xs text-neutral-500">
          <span className="sm:hidden">Touch screen to jump</span>
          <span className="hidden sm:inline">Click or press Space to jump</span>
        </p>
      </div>
    </div>
  );
}