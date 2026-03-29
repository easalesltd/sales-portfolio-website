'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'sales-agent-dash-high-score';

const GROUND_RATIO = 0.78;
const GRAVITY = 0.72;
const JUMP_V = -13;
const BASE_SCROLL = 4.2;
const BASE_OBSTACLE_INTERVAL = 88;

const OBSTACLE_KINDS = [
  'parking_ticket',
  'broken_car',
  'sales_target',
  'competitor_agent',
  'coffee_spill',
  'spreadsheet',
  'cone_zone',
  'sample_trolley',
  'speed_camera',
  'inbox_zero',
] as const;

type ObstacleKind = (typeof OBSTACLE_KINDS)[number];

interface Obstacle {
  x: number;
  w: number;
  h: number;
  kind: ObstacleKind;
}

function dimsFor(kind: ObstacleKind): { w: number; h: number } {
  switch (kind) {
    case 'parking_ticket':
      return { w: 42, h: 56 };
    case 'broken_car':
      return { w: 78, h: 48 };
    case 'sales_target':
      return { w: 50, h: 62 };
    case 'competitor_agent':
      return { w: 46, h: 58 };
    case 'coffee_spill':
      return { w: 52, h: 26 };
    case 'spreadsheet':
      return { w: 58, h: 50 };
    case 'cone_zone':
      return { w: 62, h: 46 };
    case 'sample_trolley':
      return { w: 64, h: 54 };
    case 'speed_camera':
      return { w: 44, h: 60 };
    case 'inbox_zero':
      return { w: 56, h: 44 };
    default:
      return { w: 50, h: 50 };
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

function drawObstacle(ctx: CanvasRenderingContext2D, o: Obstacle, top: number, groundY: number) {
  const { x, w, h, kind } = o;

  switch (kind) {
    case 'parking_ticket': {
      ctx.fillStyle = '#fef3c7';
      roundRectPath(ctx, x, top, w, h, 4);
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillText('PCN', x + 8, top + 18);
      ctx.fillStyle = '#1c1917';
      ctx.font = '10px system-ui, sans-serif';
      ctx.fillText('£60', x + 8, top + 34);
      ctx.fillRect(x + 6, top + h - 12, w - 12, 2);
      ctx.fillStyle = '#78716c';
      for (let i = 0; i < 6; i++) ctx.fillRect(x + 8 + i * 6, top + h - 8, 3, 4);
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
      ctx.fillStyle = '#fce7f3';
      roundRectPath(ctx, x, top, w, h, 4);
      ctx.fill();
      ctx.strokeStyle = '#be185d';
      ctx.stroke();
      const cx = x + w / 2;
      const cy = top + h * 0.42;
      const r = Math.min(w, h) * 0.28;
      for (let i = 3; i >= 1; i--) {
        ctx.strokeStyle = i === 1 ? '#dc2626' : '#9ca3af';
        ctx.lineWidth = i === 1 ? 3 : 2;
        ctx.beginPath();
        ctx.arc(cx, cy, (r * i) / 3, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = '#16a34a';
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.fillText('TARGET', x + 6, top + h - 10);
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 8, top + h - 22);
      ctx.lineTo(x + w - 8, top + 14);
      ctx.stroke();
      break;
    }
    case 'competitor_agent': {
      ctx.fillStyle = '#e2e8f0';
      roundRectPath(ctx, x + 10, top, w - 20, h - 8, 4);
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.stroke();
      ctx.fillStyle = '#1e3a5f';
      ctx.fillRect(x + 16, top + 38, w - 32, 22);
      ctx.fillStyle = '#fca5a5';
      ctx.beginPath();
      ctx.arc(x + w / 2, top + 18, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(x + w / 2 - 7, top + 10, 14, 6);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(x + w / 2 - 2, top + 28, 4, 10);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(x + 6, top + 44, 10, 14);
      ctx.fillRect(x + w - 16, top + 44, 10, 14);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + w - 14, top + 52, 12, 10);
      ctx.font = '8px system-ui, sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('“We’ll', x + 8, top + h - 18);
      ctx.fillText('match it”', x + 8, top + h - 8);
      break;
    }
    case 'coffee_spill': {
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(x + w * 0.35, top + h * 0.55, w * 0.32, h * 0.35, 0.2, 0, Math.PI * 2);
      ctx.ellipse(x + w * 0.65, top + h * 0.5, w * 0.28, h * 0.4, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.ellipse(x + w / 2, top + h * 0.45, w * 0.4, h * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff7ed';
      ctx.fillRect(x + w * 0.42, top + 2, 10, 14);
      ctx.strokeStyle = '#d6d3d1';
      ctx.strokeRect(x + w * 0.42, top + 2, 10, 14);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(x + w * 0.44, top + 6, 8, 4);
      break;
    }
    case 'spreadsheet': {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(x, top, w, h);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(x, top, w, h);
      ctx.strokeStyle = '#86efac';
      ctx.lineWidth = 1;
      for (let r = 0; r < 5; r++) {
        ctx.beginPath();
        ctx.moveTo(x, top + 10 + r * 8);
        ctx.lineTo(x + w, top + 10 + r * 8);
        ctx.stroke();
      }
      ctx.strokeStyle = '#86efac';
      for (let c = 0; c < 6; c++) {
        ctx.beginPath();
        ctx.moveTo(x + 8 + c * 9, top);
        ctx.lineTo(x + 8 + c * 9, top + h);
        ctx.stroke();
      }
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('Q4 vLOOKUP', x + 4, top + h - 8);
      ctx.fillStyle = '#b91c1c';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('#REF!', x + w - 36, top + 20);
      break;
    }
    case 'cone_zone': {
      ctx.fillStyle = '#ea580c';
      const w1 = w * 0.28;
      ctx.beginPath();
      ctx.moveTo(x + 10, groundY);
      ctx.lineTo(x + 10 + w1 / 2, top);
      ctx.lineTo(x + 10 + w1, groundY);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + w / 2 - w1 / 2, groundY);
      ctx.lineTo(x + w / 2, top + 6);
      ctx.lineTo(x + w / 2 + w1 / 2, groundY);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + w - 10 - w1, groundY);
      ctx.lineTo(x + w - 10 - w1 / 2, top + 4);
      ctx.lineTo(x + w - 10, groundY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#fcd34d';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(x + 6, top + h * 0.35);
      ctx.lineTo(x + w - 6, top + h * 0.45);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#1e293b';
      ctx.font = '8px system-ui, sans-serif';
      ctx.fillText('DO NOT STACK', x + 8, top + h * 0.75);
      break;
    }
    case 'sample_trolley': {
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 12, top + 16, w - 24, h - 26);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(x + 14, top + 18, w - 28, 6);
      ctx.fillStyle = '#ef4444';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(x + 18 + i * 12, top + 26, 6, 8);
      }
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(x + 22, top + h - 4, 6, 0, Math.PI * 2);
      ctx.arc(x + w - 22, top + h - 4, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = '8px system-ui, sans-serif';
      ctx.fillText('HEAVY', x + w / 2 - 14, top + 12);
      break;
    }
    case 'speed_camera': {
      ctx.fillStyle = '#57534e';
      ctx.fillRect(x + w / 2 - 10, top + 12, 20, h - 12);
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(x + w / 2, top + 22, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.arc(x + w / 2 - 6, top + 20, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#44403c';
      ctx.fillRect(x + w / 2 - 22, top + h - 8, 44, 8);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 8px system-ui, sans-serif';
      ctx.fillText('FLASH', x + w / 2 - 16, top + h - 2);
      break;
    }
    case 'inbox_zero': {
      ctx.fillStyle = '#fefce8';
      roundRectPath(ctx, x, top, w, h, 6);
      ctx.fill();
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#ca8a04';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillText('999+', x + 8, top + 22);
      ctx.fillStyle = '#1c1917';
      ctx.font = '9px system-ui, sans-serif';
      ctx.fillText('unread', x + 8, top + 36);
      ctx.fillStyle = '#b91c1c';
      ctx.font = '8px system-ui, sans-serif';
      ctx.fillText('ASAP!!!', x + 8, top + h - 8);
      break;
    }
  }
}

function drawPlayer(ctx: CanvasRenderingContext2D, px: number, yTop: number, pw: number, ph: number) {
  const skin = '#d4a574';
  const hair = '#3d2914';
  const hairMid = '#5c3d24';
  const hairHi = '#6b4423';
  const olive = '#5f6b47';
  const oliveDark = '#4a5336';
  const olivePocket = '#515f3d';
  const flop = '#fb923c';
  const flopStrap = '#ea580c';
  const cx = px + pw / 2;

  ctx.fillStyle = hair;
  ctx.beginPath();
  ctx.ellipse(cx, yTop + 7, 14, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hairMid;
  ctx.beginPath();
  ctx.ellipse(cx, yTop + 11, 13, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hair;
  ctx.fillRect(px, yTop + 10, 6, 14);
  ctx.fillRect(px + pw - 6, yTop + 10, 6, 14);

  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(cx, yTop + 17, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = hairMid;
  ctx.fillRect(px + 5, yTop + 8, pw - 10, 6);
  ctx.fillStyle = hairHi;
  ctx.fillRect(px + 8, yTop + 6, 4, 9);
  ctx.fillRect(px + pw - 12, yTop + 7, 3, 8);

  ctx.fillStyle = '#292524';
  ctx.fillRect(cx - 6, yTop + 15, 2, 2);
  ctx.fillRect(cx + 4, yTop + 15, 2, 2);

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

function readHighScore(): number {
  if (typeof window === 'undefined') return 0;
  const v = window.localStorage.getItem(STORAGE_KEY);
  const n = parseInt(v ?? '', 10);
  return Number.isFinite(n) ? n : 0;
}

export default function SalesAgentDash({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [screen, setScreen] = useState<'menu' | 'game'>('menu');
  const [outcome, setOutcome] = useState<null | 'lost'>(null);
  const [highScore, setHighScore] = useState(() => readHighScore());
  const [lastRunScore, setLastRunScore] = useState<number | null>(null);
  const [wasRecord, setWasRecord] = useState(false);

  const scoreRef = useRef(0);
  const frameRef = useRef(0);
  const pyRef = useRef(0);
  const vyRef = useRef(0);
  const obstaclesRef = useRef<Obstacle[]>([]);

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
    c.width = w;
    c.height = h;
  }, []);

  useEffect(() => {
    if (screen !== 'game') return;
    const parent = canvasRef.current?.parentElement;
    if (!parent) return;
    resizeCanvas();
    const ro = new ResizeObserver(() => resizeCanvas());
    ro.observe(parent);
    window.addEventListener('resize', resizeCanvas);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [screen, resizeCanvas]);

  const startGame = useCallback(() => {
    scoreRef.current = 0;
    frameRef.current = 0;
    pyRef.current = 0;
    vyRef.current = 0;
    obstaclesRef.current = [];
    setOutcome(null);
    setLastRunScore(null);
    setWasRecord(false);
    setScreen('game');
  }, []);

  const jump = useCallback(() => {
    if (outcome !== null) return;
    if (pyRef.current >= 0 && vyRef.current >= 0) {
      vyRef.current = JUMP_V;
    }
  }, [outcome]);

  useEffect(() => {
    if (screen !== 'game' || outcome !== null) return;

    let raf = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
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

      frameRef.current += 1;
      const difficulty = 1 + Math.min(2.2, scoreRef.current / 3500);
      const scroll = BASE_SCROLL * difficulty;
      scoreRef.current += scroll * 0.35;

      const interval = Math.max(
        46,
        Math.floor(BASE_OBSTACLE_INTERVAL / Math.min(1.45, 0.65 + scoreRef.current / 8000))
      );

      if (frameRef.current % interval === 0) {
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
          setHighScore(nextHi);
          setLastRunScore(final);
          setWasRecord(final > prevHi);
          setOutcome('lost');
          return;
        }
      }

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
      const cloudShift = (scoreRef.current * 0.35) % (W + 120);
      ctx.beginPath();
      ctx.arc(W - cloudShift + 40, 52, 20, 0, Math.PI * 2);
      ctx.arc(W - cloudShift + 62, 48, 26, 0, Math.PI * 2);
      ctx.arc(W - cloudShift + 88, 52, 20, 0, Math.PI * 2);
      ctx.fill();

      for (const o of obstaclesRef.current) {
        const top = groundY - o.h;
        drawObstacle(ctx, o, top, groundY);
      }

      const yTop = groundY + pyRef.current - ph;
      drawPlayer(ctx, px, yTop, pw, ph);

      const displayScore = Math.floor(scoreRef.current);
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      roundRectPath(ctx, 8, 8, 168, 44, 8);
      ctx.fill();
      ctx.strokeStyle = 'rgba(15,23,42,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#1a1a1a';
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.fillText(`Score ${displayScore.toLocaleString()}`, 18, 26);
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillStyle = '#52525b';
      ctx.fillText(`Best ${readHighScore().toLocaleString()}`, 18, 40);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
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

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-neutral-950/95 p-2 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sales-agent-dash-title"
    >
      <div
        className={`flex w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-neutral-600 bg-neutral-900 shadow-2xl max-h-[96dvh] ${screen === 'game' ? 'min-h-[min(82dvh,96dvh)] sm:min-h-0' : ''}`}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-neutral-700 px-4 py-3">
          <h2 id="sales-agent-dash-title" className="text-lg font-semibold text-white">
            Sales Agent Dash
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-neutral-600 px-3 py-1.5 text-sm text-white hover:bg-neutral-800"
          >
            Close
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col items-center p-3 sm:p-4">
          {screen === 'menu' && (
            <div className="py-8 text-center text-neutral-200">
              <p className="mb-2 text-lg">Endless run: dodge parking tickets, knackered cars, targets, rivals, and sales-life hazards.</p>
              <p className="mb-2 text-sm text-neutral-400">
                Score ticks up the longer you survive — speed ramps up. Beat your personal best (saved on this device).
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
              <div className="relative flex w-full flex-1 items-stretch justify-center min-h-[52dvh] max-h-[68dvh] sm:min-h-0 sm:max-h-none sm:flex-none">
                <canvas
                  ref={canvasRef}
                  className={`w-full max-w-2xl touch-none rounded-lg border border-neutral-700 sm:max-h-[400px] ${playing ? 'cursor-pointer' : ''}`}
                  onMouseDown={playing ? jump : undefined}
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
                  <p className="text-sm text-red-400">Bumped into something you should&apos;ve jumped — try again!</p>
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
          Easter egg: double-click the logo in the header (two quick clicks before you navigate home).
        </p>
      </div>
    </div>
  );
}