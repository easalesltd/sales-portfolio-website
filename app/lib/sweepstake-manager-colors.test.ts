import { describe, expect, it } from '@jest/globals';
import { managerColorForPlayer } from '@/app/lib/sweepstake-manager-colors';

const PYRAMID_MANAGER_IDS = ['ash', 'jon', 'nest', 'chris', 'scott', 'dave', 'ben'] as const;

function rgb(hex: string): { r: number; g: number; b: number } {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbDistance(a: string, b: string): number {
  const A = rgb(a);
  const B = rgb(b);
  return Math.hypot(A.r - B.r, A.g - B.g, A.b - B.b);
}

describe('english pyramid manager colours', () => {
  it('gives every manager a colour', () => {
    for (const id of PYRAMID_MANAGER_IDS) {
      expect(managerColorForPlayer(id, 'english-pyramid')).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('keeps Ash and Chris on different hues so gold/yellow no longer clash', () => {
    const ash = managerColorForPlayer('ash', 'english-pyramid')!;
    const chris = managerColorForPlayer('chris', 'english-pyramid')!;
    expect(rgbDistance(ash, chris)).toBeGreaterThan(80);
    expect(ash).not.toBe('#d4af37');
  });

  it('keeps every pair far enough apart to tell apart on the navy UI', () => {
    const colors = PYRAMID_MANAGER_IDS.map((id) => ({
      id,
      hex: managerColorForPlayer(id, 'english-pyramid')!,
    }));

    for (let i = 0; i < colors.length; i += 1) {
      for (let j = i + 1; j < colors.length; j += 1) {
        expect(rgbDistance(colors[i].hex, colors[j].hex)).toBeGreaterThan(80);
      }
    }
  });
});
