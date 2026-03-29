'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { companies } from '../data/companies';

const BRAND_LOGO_URLS = [...new Set(companies.map((c) => c.logoUrl))];

type LogoEntry = HTMLImageElement | 'bad';

const GROUND_RATIO = 0.78;
const GRAVITY = 0.72;
const JUMP_V = -13;
const SCROLL = 4.2;
const OBSTACLE_INTERVAL_FRAMES = 88;
const WIN_DISTANCE = 2200;

interface Obstacle {
  x: number;
  w: number;
  h: number;
  logoSrc: string;
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

function drawPlayer(ctx: CanvasRenderingContext2D, px: number, yTop: number, pw: number, ph: number) {
  const skin = '#e0ac8d';
  const shirt = '#14b8a6';
  const shorts = '#475569';
  const flop = '#fb923c';
  const flopStrap = '#ea580c';

  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(px + pw / 2, yTop + 13, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(px + 7, yTop + 9, 16, 4);

  ctx.fillStyle = shirt;
  roundRectPath(ctx, px + 5, yTop + 21, pw - 10, 15, 3);
  ctx.fill();

  ctx.fillStyle = skin;
  ctx.fillRect(px + 1, yTop + 23, 5, 12);
  ctx.fillRect(px + pw - 6, yTop + 23, 5, 12);

  ctx.fillStyle = shorts;
  ctx.fillRect(px + 4, yTop + 34, pw - 8, 11);

  ctx.fillStyle = skin;
  ctx.fillRect(px + 7, yTop + 43, 5, 12);
  ctx.fillRect(px + pw - 12, yTop + 43, 5, 12);

  ctx.fillStyle = flop;
  ctx.fillRect(px + 4, yTop + ph - 7, 14, 5);
  ctx.fillRect(px + pw - 18, yTop + ph - 7, 14, 5);

  ctx.strokeStyle = flopStrap;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(px + 7, yTop + ph - 6);
  ctx.quadraticCurveTo(px + 11, yTop + ph - 11, px + 15, yTop + ph - 6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(px + pw - 15, yTop + ph - 6);
  ctx.quadraticCurveTo(px + pw - 11, yTop + ph - 11, px + pw - 7, yTop + ph - 6);
  ctx.stroke();
}

export default function SalesAgentDash({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoCacheRef = useRef<Map<string, LogoEntry>>(new Map());
  const [screen, setScreen] = useState<'menu' | 'game'>('menu');
  const [outcome, setOutcome] = useState<null | 'won' | 'lost'>(null);

  const distanceRef = useRef(0);
  const frameRef = useRef(0);
  const pyRef = useRef(0);
  const vyRef = useRef(0);
  const obstaclesRef = useRef<Obstacle[]>([]);

  useEffect(() => {
    BRAND_LOGO_URLS.forEach((src) => {
      const im = new Image();
      im.decoding = 'async';
      im.onload = () => {
        if (im.naturalWidth > 0) logoCacheRef.current.set(src, im);
        else logoCacheRef.current.set(src, 'bad');
      };
      im.onerror = () => logoCacheRef.current.set(src, 'bad');
      im.src = src;
    });
  }, []);

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
    distanceRef.current = 0;
    frameRef.current = 0;
    pyRef.current = 0;
    vyRef.current = 0;
    obstaclesRef.current = [];
    setOutcome(null);
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
      const pw = 36;
      const ph = 50;
      const px = W * 0.18;

      frameRef.current += 1;
      distanceRef.current += SCROLL;

      if (frameRef.current % OBSTACLE_INTERVAL_FRAMES === 0) {
        const logoSrc = BRAND_LOGO_URLS[Math.floor(Math.random() * BRAND_LOGO_URLS.length)];
        const cached = logoCacheRef.current.get(logoSrc);
        let obsW = 50 + Math.floor(Math.random() * 12);
        let obsH = 52 + Math.floor(Math.random() * 16);
        if (cached && cached !== 'bad' && cached.complete && cached.naturalWidth > 0) {
          const ar = cached.naturalHeight / cached.naturalWidth;
          obsH = Math.min(92, Math.max(46, Math.floor(obsW * ar)));
        }
        obstaclesRef.current.push({
          x: W + 20,
          w: obsW,
          h: obsH,
          logoSrc,
        });
      }

      obstaclesRef.current = obstaclesRef.current.filter((o) => {
        o.x -= SCROLL;
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
          setOutcome('lost');
          return;
        }
      }

      if (distanceRef.current >= WIN_DISTANCE) {
        setOutcome('won');
        return;
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
      const cloudShift = (distanceRef.current * 0.12) % (W + 120);
      ctx.beginPath();
      ctx.arc(W - cloudShift + 40, 52, 20, 0, Math.PI * 2);
      ctx.arc(W - cloudShift + 62, 48, 26, 0, Math.PI * 2);
      ctx.arc(W - cloudShift + 88, 52, 20, 0, Math.PI * 2);
      ctx.fill();

      const pad = 5;
      for (const o of obstaclesRef.current) {
        const top = groundY - o.h;
        const entry = logoCacheRef.current.get(o.logoSrc);
        roundRectPath(ctx, o.x, top, o.w, o.h, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.18)';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (entry && entry !== 'bad' && entry.complete && entry.naturalWidth > 0) {
          ctx.save();
          ctx.beginPath();
          roundRectPath(ctx, o.x + pad, top + pad, o.w - pad * 2, o.h - pad * 2, 5);
          ctx.clip();
          ctx.drawImage(entry, o.x + pad, top + pad, o.w - pad * 2, o.h - pad * 2);
          ctx.restore();
        } else {
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(o.x + pad, top + pad, o.w - pad * 2, o.h - pad * 2);
        }
      }

      const yTop = groundY + pyRef.current - ph;
      drawPlayer(ctx, px, yTop, pw, ph);

      const pct = Math.min(99, Math.floor((distanceRef.current / WIN_DISTANCE) * 100));
      ctx.fillStyle = '#1a1a1a';
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.fillText(`Round complete: ${pct}%`, 12, 22);

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
              <p className="mb-2 text-lg">Jump the brands you represent — shorts and flip-flops mode.</p>
              <p className="mb-6 text-sm text-neutral-400">
                Space, ↑, or tap to jump. Reach 100% to finish the round.
              </p>
              <button
                type="button"
                onClick={startGame}
                className="rounded-lg border border-white bg-white px-6 py-2 font-medium text-neutral-950 hover:bg-neutral-200"
              >
                Start
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
              {outcome === 'won' && (
                <p className="mt-4 text-center text-lg font-medium text-green-400">
                  Round cleared — that&apos;s a full territory!
                </p>
              )}
              {outcome === 'lost' && (
                <p className="mt-4 text-center text-lg font-medium text-red-400">
                  Caught out on the road — try again!
                </p>
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
