'use client';

import { useState } from 'react';
import type { EnglishPyramidPrizeFundSnapshot } from '@/app/lib/english-pyramid-prize-fund';
import type { PlayerStanding } from '@/app/lib/english-pyramid-scoring';

const WIDTH = 1080;
const HEIGHT = 1350;

type Props = {
  standings: PlayerStanding[];
  roast: string;
  prizeFund: EnglishPyramidPrizeFundSnapshot | null;
};

function formatGbp(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
): number {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
      if (lines.length === maxLines - 1) break;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);

  if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) {
    let last = lines[maxLines - 1];
    while (last.length > 0 && ctx.measureText(`${last}…`).width > maxWidth) {
      last = last.slice(0, -1);
    }
    lines[maxLines - 1] = `${last.trim()}…`;
  }

  lines.forEach((value, index) => ctx.fillText(value, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
}

async function renderWeeklyCard({
  standings,
  roast,
  prizeFund,
}: Props): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, '#182642');
  gradient.addColorStop(0.55, '#0a0f1a');
  gradient.addColorStop(1, '#170d24');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.strokeStyle = 'rgba(212,175,55,0.5)';
  ctx.lineWidth = 5;
  ctx.strokeRect(42, 42, WIDTH - 84, HEIGHT - 84);

  const now = new Date();
  const date = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/London',
  });

  ctx.textAlign = 'left';
  ctx.fillStyle = '#d4af37';
  ctx.font = '700 27px system-ui, sans-serif';
  ctx.fillText('ENGLISH PYRAMID SWEEPSTAKE', 80, 110);
  ctx.fillStyle = '#f5f5f0';
  ctx.font = '800 58px system-ui, sans-serif';
  ctx.fillText('Weekly damage report', 80, 175);
  ctx.fillStyle = 'rgba(232,223,200,0.65)';
  ctx.font = '500 24px system-ui, sans-serif';
  ctx.fillText(date, 80, 215);

  const tableTop = 260;
  ctx.fillStyle = 'rgba(212,175,55,0.12)';
  ctx.fillRect(70, tableTop, WIDTH - 140, 62);
  ctx.fillStyle = '#d4af37';
  ctx.font = '700 22px system-ui, sans-serif';
  ctx.fillText('#', 92, tableTop + 40);
  ctx.fillText('MANAGER', 145, tableTop + 40);
  ctx.textAlign = 'right';
  ctx.fillText('W-D-L', 845, tableTop + 40);
  ctx.fillText('PTS', 985, tableTop + 40);

  standings.slice(0, 7).forEach((player, index) => {
    const y = tableTop + 62 + index * 82;
    ctx.fillStyle = index === 0 ? 'rgba(212,175,55,0.1)' : index % 2 ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.12)';
    ctx.fillRect(70, y, WIDTH - 140, 82);
    ctx.textAlign = 'left';
    ctx.fillStyle = index === 0 ? '#d4af37' : '#b9c2d1';
    ctx.font = '800 28px system-ui, sans-serif';
    ctx.fillText(String(index + 1), 92, y + 51);
    ctx.fillStyle = '#f5f5f0';
    ctx.font = '700 27px system-ui, sans-serif';
    ctx.fillText(player.teamName ?? player.name, 145, y + 36);
    ctx.fillStyle = 'rgba(232,223,200,0.58)';
    ctx.font = '500 19px system-ui, sans-serif';
    ctx.fillText(player.name, 145, y + 62);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#b9c2d1';
    ctx.font = '600 22px system-ui, sans-serif';
    ctx.fillText(`${player.wins}-${player.draws}-${player.losses}`, 845, y + 50);
    ctx.fillStyle = index === 0 ? '#f2d36b' : '#ffffff';
    ctx.font = '800 32px system-ui, sans-serif';
    ctx.fillText(String(player.points), 985, y + 52);
  });

  const roastTop = 920;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#d4af37';
  ctx.font = '700 22px system-ui, sans-serif';
  ctx.fillText('THIS WEEK’S ROAST', 80, roastTop);
  ctx.fillStyle = '#f5f5f0';
  ctx.font = '600 27px system-ui, sans-serif';
  const roastBottom = drawWrappedText(ctx, `“${roast}”`, 80, roastTop + 48, WIDTH - 160, 38, 5);

  const potValue = prizeFund?.currentValueGbp ?? prizeFund?.investedAmountGbp;
  if (potValue != null) {
    ctx.fillStyle = 'rgba(212,175,55,0.12)';
    ctx.fillRect(80, Math.max(1130, roastBottom + 28), WIDTH - 160, 86);
    ctx.fillStyle = '#d4af37';
    ctx.font = '700 20px system-ui, sans-serif';
    ctx.fillText('LIVE PRIZE POT', 105, Math.max(1130, roastBottom + 28) + 34);
    ctx.fillStyle = '#f5f5f0';
    ctx.font = '800 32px system-ui, sans-serif';
    ctx.fillText(formatGbp(potValue), 105, Math.max(1130, roastBottom + 28) + 69);
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(212,175,55,0.62)';
  ctx.font = '600 22px system-ui, sans-serif';
  ctx.fillText('easalesltd.co.uk/p/ep2627', WIDTH / 2, HEIGHT - 72);

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

export default function EnglishPyramidWeeklyShareButton(props: Props) {
  const [status, setStatus] = useState<'idle' | 'working' | 'done' | 'error'>('idle');

  const share = async () => {
    setStatus('working');
    try {
      const blob = await renderWeeklyCard(props);
      if (!blob) throw new Error('Card render failed');
      const file = new File([blob], 'epffl-weekly-table.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'English Pyramid Sweepstake',
          text: 'This week’s table, roast and prize pot.',
          files: [file],
        });
      } else if (navigator.clipboard && 'ClipboardItem' in window) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        link.click();
        URL.revokeObjectURL(url);
      }
      setStatus('done');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setStatus('idle');
        return;
      }
      setStatus('error');
    }
    window.setTimeout(() => setStatus('idle'), 2500);
  };

  const label =
    status === 'working'
      ? 'Building card…'
      : status === 'done'
        ? 'Shared!'
        : status === 'error'
          ? 'Try again'
          : 'Share weekly damage report';

  return (
    <button
      type="button"
      onClick={() => void share()}
      disabled={status === 'working'}
      className="mt-3 inline-flex items-center rounded-md border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-1.5 text-xs font-bold text-[#f2d36b] transition hover:bg-[#d4af37]/20 disabled:opacity-60"
    >
      {label}
    </button>
  );
}
