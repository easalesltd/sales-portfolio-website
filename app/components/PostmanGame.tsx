'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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
}

export default function PostmanGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [screen, setScreen] = useState<'menu' | 'game'>('menu');
  const [outcome, setOutcome] = useState<null | 'won' | 'lost'>(null);

  const distanceRef = useRef(0);
  const frameRef = useRef(0);
  const pyRef = useRef(0);
  const vyRef = useRef(0);
  const obstaclesRef = useRef<Obstacle[]>([]);

  const resizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c?.parentElement) return;
    const w = Math.min(720, c.parentElement.clientWidth - 8);
    const h = Math.min(400, Math.floor(w * 0.52));
    c.width = w;
    c.height = h;
  }, []);

  useEffect(() => {
    if (screen !== 'game') return;
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
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
      const pw = 34;
      const ph = 48;
      const px = W * 0.18;

      frameRef.current += 1;
      distanceRef.current += SCROLL;

      if (frameRef.current % OBSTACLE_INTERVAL_FRAMES === 0) {
        const h = 36 + Math.random() * 52;
        obstaclesRef.current.push({
          x: W + 20,
          w: 28 + Math.floor(Math.random() * 18),
          h,
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

      for (const o of obstaclesRef.current) {
        ctx.fillStyle = '#4a3728';
        ctx.fillRect(o.x, groundY - o.h, o.w, o.h);
        ctx.fillStyle = '#2d2118';
        ctx.fillRect(o.x + 4, groundY - o.h + 6, o.w - 8, 6);
      }

      const y = groundY + pyRef.current - ph;
      ctx.fillStyle = '#1e3a5f';
      ctx.fillRect(px + 8, y + 18, 18, 26);
      ctx.fillStyle = '#f4d0b5';
      ctx.fillRect(px + 6, y + 4, 22, 18);
      ctx.fillStyle = '#333';
      ctx.fillRect(px + 10, y + 22, 12, 4);
      ctx.fillStyle = '#b22222';
      ctx.fillRect(px - 4, y + 24, 14, 18);
      ctx.fillStyle = '#fff';
      ctx.fillRect(px + 24, y + 28, 14, 10);
      ctx.strokeStyle = '#c9a227';
      ctx.strokeRect(px + 24, y + 28, 14, 10);

      const pct = Math.min(99, Math.floor((distanceRef.current / WIN_DISTANCE) * 100));
      ctx.fillStyle = '#1a1a1a';
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.fillText(`Deliver the card: ${pct}%`, 12, 22);

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
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-neutral-950/95 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="postman-game-title"
    >
      <div className="w-full max-w-2xl rounded-xl border border-neutral-600 bg-neutral-900 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b border-neutral-700 px-4 py-3">
          <h2 id="postman-game-title" className="text-lg font-semibold text-white">
            Special Delivery
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-neutral-600 px-3 py-1.5 text-sm text-white hover:bg-neutral-800"
          >
            Close
          </button>
        </div>

        <div className="flex flex-col items-center p-4">
          {screen === 'menu' && (
            <div className="py-8 text-center text-neutral-200">
              <p className="mb-2 text-lg">Jump over bins and letterboxes!</p>
              <p className="mb-6 text-sm text-neutral-400">
                Space, ↑, or tap the game to jump. Fill the bar to 100% to deliver the greeting card.
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
              <div className="relative w-full flex justify-center">
                <canvas
                  ref={canvasRef}
                  className={`max-h-[min(400px,50vh)] w-full max-w-2xl rounded-lg border border-neutral-700 touch-none ${playing ? 'cursor-pointer' : ''}`}
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
                  Card delivered! Nice one, postie.
                </p>
              )}
              {outcome === 'lost' && (
                <p className="mt-4 text-center text-lg font-medium text-red-400">Spilled the mail — try again!</p>
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

        <p className="border-t border-neutral-800 px-4 py-2 text-center text-xs text-neutral-500">
          Easter egg: double-click the logo in the header (two quick clicks before you navigate home).
        </p>
      </div>
    </div>
  );
}
