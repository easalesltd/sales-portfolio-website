/** @jest-environment node */

import {
  isFwpAbandonedOrPostponedText,
  parseFwpCompetitionDayHtml,
} from '@/app/lib/english-pyramid-fwp-live-scores';

describe('english-pyramid-fwp-live-scores abandoned rows', () => {
  it('treats A-A as postponed, not a score', () => {
    expect(isFwpAbandonedOrPostponedText('A-A')).toBe(true);
    expect(isFwpAbandonedOrPostponedText('A - A')).toBe(true);
    expect(isFwpAbandonedOrPostponedText('Abandoned')).toBe(true);
    expect(isFwpAbandonedOrPostponedText('Weston-super-Mare A-A Billericay Town')).toBe(true);
    expect(isFwpAbandonedOrPostponedText('1-0')).toBe(false);
  });

  it('does not promote Weston vs Billericay A-A to a live 0-1', () => {
    const html = `
      <tr title="Weston-super-Mare 0-1 Billericay Town" data-href="match/2026-2027/national-league-south/weston-super-mare/billericay-town/573999">
        <td id="fwp-status-1">A-A</td>
      </tr>`;

    expect(parseFwpCompetitionDayHtml(html)).toEqual([
      {
        homeTla: 'WSM',
        awayTla: 'BIL',
        homeGoals: 0,
        awayGoals: 0,
        period: 'Postponed',
        homeRedCards: 0,
        awayRedCards: 0,
        postponed: true,
      },
    ]);
  });
});
