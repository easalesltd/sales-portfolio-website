'use client';

import { useState } from 'react';
import type { PlayerStanding } from '@/app/lib/english-pyramid-scoring';

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1080;

function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

async function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function renderEnglishPyramidShareCard(
  player: PlayerStanding,
  rank: number,
  totalPlayers: number
): Promise<Blob | null> {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT);
  gradient.addColorStop(0, '#141f38');
  gradient.addColorStop(1, '#0a0f1a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 6;
  ctx.strokeRect(48, 48, CARD_WIDTH - 96, CARD_HEIGHT - 96);

  ctx.fillStyle = '#d4af37';
  ctx.font = '600 28px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ENGLISH PYRAMID SWEEPSTAKE 2026/27', CARD_WIDTH / 2, 120);

  const photoSize = 220;
  const crestSize = 200;
  const mediaGap = 48;
  const mediaTop = 155;

  const managerPhoto = player.managerImage
    ? await loadImage(`${player.managerImage}?v=20260701`)
    : null;
  const crest = await loadImage(player.clubCrest);

  if (managerPhoto && crest) {
    const pairWidth = photoSize + mediaGap + crestSize;
    const pairLeft = CARD_WIDTH / 2 - pairWidth / 2;
    const photoX = pairLeft;
    const photoY = mediaTop;

    ctx.save();
    const radius = 18;
    ctx.beginPath();
    ctx.moveTo(photoX + radius, photoY);
    ctx.arcTo(photoX + photoSize, photoY, photoX + photoSize, photoY + photoSize, radius);
    ctx.arcTo(photoX + photoSize, photoY + photoSize, photoX, photoY + photoSize, radius);
    ctx.arcTo(photoX, photoY + photoSize, photoX, photoY, radius);
    ctx.arcTo(photoX, photoY, photoX + photoSize, photoY, radius);
    ctx.closePath();
    ctx.clip();

    const scale = Math.max(photoSize / managerPhoto.width, photoSize / managerPhoto.height);
    const drawW = managerPhoto.width * scale;
    const drawH = managerPhoto.height * scale;
    ctx.drawImage(
      managerPhoto,
      photoX + (photoSize - drawW) / 2,
      photoY + (photoSize - drawH) / 2,
      drawW,
      drawH
    );
    ctx.restore();

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.55)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(photoX + radius, photoY);
    ctx.arcTo(photoX + photoSize, photoY, photoX + photoSize, photoY + photoSize, radius);
    ctx.arcTo(photoX + photoSize, photoY + photoSize, photoX, photoY + photoSize, radius);
    ctx.arcTo(photoX, photoY + photoSize, photoX, photoY, radius);
    ctx.arcTo(photoX, photoY, photoX + photoSize, photoY, radius);
    ctx.closePath();
    ctx.stroke();

    const crestX = pairLeft + photoSize + mediaGap;
    const crestY = mediaTop + (photoSize - crestSize) / 2;
    ctx.drawImage(crest, crestX, crestY, crestSize, crestSize);
  } else if (managerPhoto) {
    const photoX = CARD_WIDTH / 2 - photoSize / 2;
    const photoY = mediaTop;
    ctx.save();
    const radius = 18;
    ctx.beginPath();
    ctx.moveTo(photoX + radius, photoY);
    ctx.arcTo(photoX + photoSize, photoY, photoX + photoSize, photoY + photoSize, radius);
    ctx.arcTo(photoX + photoSize, photoY + photoSize, photoX, photoY + photoSize, radius);
    ctx.arcTo(photoX, photoY + photoSize, photoX, photoY, radius);
    ctx.arcTo(photoX, photoY, photoX + photoSize, photoY, radius);
    ctx.closePath();
    ctx.clip();
    const scale = Math.max(photoSize / managerPhoto.width, photoSize / managerPhoto.height);
    const drawW = managerPhoto.width * scale;
    const drawH = managerPhoto.height * scale;
    ctx.drawImage(
      managerPhoto,
      photoX + (photoSize - drawW) / 2,
      photoY + (photoSize - drawH) / 2,
      drawW,
      drawH
    );
    ctx.restore();
  } else if (crest) {
    ctx.drawImage(crest, CARD_WIDTH / 2 - crestSize / 2, mediaTop, crestSize, crestSize);
  }

  const displayName = player.teamName ?? player.name;
  ctx.fillStyle = '#f5f5f0';
  ctx.font = '700 56px system-ui, sans-serif';
  ctx.fillText(displayName, CARD_WIDTH / 2, 450);

  ctx.fillStyle = '#e8dfc8';
  ctx.font = '500 32px system-ui, sans-serif';
  ctx.fillText(player.name, CARD_WIDTH / 2, 500);

  ctx.fillStyle = '#d4af37';
  ctx.font = '800 96px system-ui, sans-serif';
  ctx.fillText(`${player.points} pts`, CARD_WIDTH / 2, 620);

  ctx.fillStyle = '#f5f5f0';
  ctx.font = '600 44px system-ui, sans-serif';
  ctx.fillText(`${ordinal(rank)} of ${totalPlayers}`, CARD_WIDTH / 2, 700);

  ctx.fillStyle = 'rgba(232, 223, 200, 0.75)';
  ctx.font = '500 28px system-ui, sans-serif';
  ctx.fillText(
    `GD ${player.goalDifference >= 0 ? '+' : ''}${player.goalDifference} · W${player.wins} D${player.draws} L${player.losses}`,
    CARD_WIDTH / 2,
    760
  );

  ctx.fillStyle = 'rgba(212, 175, 55, 0.55)';
  ctx.font = '500 24px system-ui, sans-serif';
  ctx.fillText('easalesltd.co.uk/p/ep2627', CARD_WIDTH / 2, CARD_HEIGHT - 80);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

type Props = {
  player: PlayerStanding;
  rank: number;
  totalPlayers: number;
  className?: string;
};

export default function EnglishPyramidShareButton({
  player,
  rank,
  totalPlayers,
  className = '',
}: Props) {
  const [status, setStatus] = useState<'idle' | 'working' | 'done' | 'error'>('idle');

  const handleShare = async () => {
    setStatus('working');
    try {
      const blob = await renderEnglishPyramidShareCard(player, rank, totalPlayers);
      if (!blob) throw new Error('Could not render card');

      if (navigator.clipboard && 'ClipboardItem' in window) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setStatus('done');
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${(player.teamName ?? player.name).replace(/\s+/g, '-').toLowerCase()}-standing.png`;
        link.click();
        URL.revokeObjectURL(url);
        setStatus('done');
      }
      window.setTimeout(() => setStatus('idle'), 2500);
    } catch {
      setStatus('error');
      window.setTimeout(() => setStatus('idle'), 2500);
    }
  };

  const label =
    status === 'working'
      ? 'Generating…'
      : status === 'done'
        ? 'Copied!'
        : status === 'error'
          ? 'Try again'
          : 'Copy standing card';

  return (
    <button
      type="button"
      onClick={() => void handleShare()}
      disabled={status === 'working'}
      className={`rounded-md border border-[#d4af37]/35 bg-[#1a2744]/80 px-2.5 py-1 text-[11px] font-semibold text-[#e8dfc8] transition hover:bg-[#d4af37]/15 disabled:opacity-60 sm:text-xs ${className}`}
    >
      {label}
    </button>
  );
}
