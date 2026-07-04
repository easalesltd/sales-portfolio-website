/** @jest-environment node */

import { WORLD_CUP_FANTASY_FIXTURES } from '@/app/data/world-cup-fantasy';
import {
  resolveWorldCupKnockoutFixtures,
  resolveWorldCupScheduleFixtures,
} from '@/app/lib/world-cup-knockout-bracket';
import {
  computeEliminatedTeamCodes,
  type WorldCupMatchResult,
} from '@/app/lib/world-cup-scoring';

describe('world-cup-knockout-bracket', () => {
  it('adds placeholder ties through the final', () => {
    const resolved = resolveWorldCupKnockoutFixtures(WORLD_CUP_FANTASY_FIXTURES, []);

    expect(resolved.some((fixture) => fixture.id === '2026-07-19-final')).toBe(true);
    expect(resolved.find((fixture) => fixture.id === '2026-07-04-r16-1')).toMatchObject({
      homeTeam: { tla: 'TBD', name: 'Winner · RSA vs CAN' },
      awayTeam: { tla: 'TBD', name: 'Winner · NED vs MAR' },
      round: 'R16',
    });
  });

  it('fills later rounds when winners are known', () => {
    const r32Win: WorldCupMatchResult = {
      id: '2026-06-28-rsa-can',
      utcDate: '2026-06-28T19:00:00Z',
      status: 'FINISHED',
      homeTeam: { name: 'South Africa', tla: 'RSA' },
      awayTeam: { name: 'Canada', tla: 'CAN' },
      homeGoals: 0,
      awayGoals: 2,
      homeRedCards: 0,
      awayRedCards: 0,
    };

    const resolved = resolveWorldCupKnockoutFixtures(WORLD_CUP_FANTASY_FIXTURES, [r32Win]);
    const r16 = resolved.find((fixture) => fixture.id === '2026-07-04-r16-1');

    expect(r16?.homeTeam).toMatchObject({ tla: 'CAN', name: 'Canada' });
    expect(r16?.awayTeam.tla).toBe('TBD');
  });

  it('pairs Canada and Morocco in round of 16 after both R32 ties finish', () => {
    const r32Wins: WorldCupMatchResult[] = [
      {
        id: '2026-06-28-rsa-can',
        utcDate: '2026-06-28T19:00:00Z',
        status: 'FINISHED',
        homeTeam: { name: 'South Africa', tla: 'RSA' },
        awayTeam: { name: 'Canada', tla: 'CAN' },
        homeGoals: 0,
        awayGoals: 2,
        homeRedCards: 0,
        awayRedCards: 0,
      },
      {
        id: '2026-06-30-ned-mar',
        utcDate: '2026-06-30T01:00:00Z',
        status: 'FINISHED',
        homeTeam: { name: 'Netherlands', tla: 'NED' },
        awayTeam: { name: 'Morocco', tla: 'MAR' },
        homeGoals: 1,
        awayGoals: 2,
        homeRedCards: 0,
        awayRedCards: 0,
      },
    ];

    const resolved = resolveWorldCupKnockoutFixtures(WORLD_CUP_FANTASY_FIXTURES, r32Wins);
    const r16 = resolved.find((fixture) => fixture.id === '2026-07-04-r16-1');

    expect(r16).toMatchObject({
      homeTeam: { tla: 'CAN', name: 'Canada' },
      awayTeam: { tla: 'MAR', name: 'Morocco' },
      round: 'R16',
    });
  });

  it('marks knockout losers as eliminated once a tie is final', () => {
    const r32Win: WorldCupMatchResult = {
      id: '2026-06-28-rsa-can',
      utcDate: '2026-06-28T19:00:00Z',
      status: 'FINISHED',
      homeTeam: { name: 'South Africa', tla: 'RSA' },
      awayTeam: { name: 'Canada', tla: 'CAN' },
      homeGoals: 0,
      awayGoals: 2,
      homeRedCards: 0,
      awayRedCards: 0,
    };

    const eliminated = computeEliminatedTeamCodes(['RSA', 'CAN', 'KSA'], WORLD_CUP_FANTASY_FIXTURES, [r32Win]);

    expect(eliminated.has('RSA')).toBe(true);
    expect(eliminated.has('CAN')).toBe(false);
    expect(eliminated.has('KSA')).toBe(true);
  });

  it('merges group and resolved knockout fixtures for the schedule', () => {
    const scheduleFixtures = resolveWorldCupScheduleFixtures(WORLD_CUP_FANTASY_FIXTURES, []);
    const knockoutCount = scheduleFixtures.filter((fixture) => fixture.stage === 'knockout').length;

    expect(knockoutCount).toBe(32);
  });
});
