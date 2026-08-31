/** @jest-environment node */

import {
  countRedCardsFromEspnCompetition,
  isEspnRedCardDetail,
} from '@/app/lib/espn-red-cards';

describe('espn red-card counting', () => {
  it('counts type-id reds after the live redCard flag has dropped', () => {
    const counts = countRedCardsFromEspnCompetition({
      competitors: [
        { homeAway: 'home', team: { id: '1' } },
        { homeAway: 'away', team: { id: '2' } },
      ],
      details: [
        { redCard: false, type: { id: '93', text: 'Red Card' }, team: { id: '2' } },
        { redCard: false, type: { id: '94', text: 'Yellow Card' }, team: { id: '1' } },
      ],
    });

    expect(counts).toEqual({ homeRedCards: 0, awayRedCards: 1 });
  });

  it('keeps competitor redCards statistics when details are empty', () => {
    const counts = countRedCardsFromEspnCompetition({
      competitors: [
        {
          homeAway: 'home',
          team: { id: '1' },
          statistics: [{ name: 'redCards', displayValue: '1' }],
        },
        {
          homeAway: 'away',
          team: { id: '2' },
          statistics: [{ name: 'redCards', displayValue: '0' }],
        },
      ],
      details: [],
    });

    expect(counts).toEqual({ homeRedCards: 1, awayRedCards: 0 });
  });

  it('does not treat a yellow card as a dismissal', () => {
    expect(
      isEspnRedCardDetail({ redCard: false, type: { id: '94', text: 'Yellow Card' } })
    ).toBe(false);
  });
});
