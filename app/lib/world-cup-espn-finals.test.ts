/** @jest-environment node */

import {
  isEspnFinalPeriod,
  isEspnFullTimePeriod,
  resolveLedgerGoalsFromEspnMatch,
} from '@/app/lib/world-cup-espn-finals';

describe('world-cup-espn-finals', () => {
  it('detects regular and penalty final periods', () => {
    expect(isEspnFullTimePeriod('FT')).toBe(true);
    expect(isEspnFullTimePeriod('Full Time')).toBe(true);
    expect(isEspnFinalPeriod('FT-Pens')).toBe(true);
    expect(isEspnFinalPeriod('Final Score - After Penalties')).toBe(true);
    expect(isEspnFinalPeriod('41\'')).toBe(false);
    expect(isEspnFinalPeriod('90\'+8\'', { statusState: 'post', statusName: 'STATUS_FULL_TIME' })).toBe(
      true
    );
  });

  it('records post-pens winners in knockout ledger scores', () => {
    expect(
      resolveLedgerGoalsFromEspnMatch(
        {
          homeGoals: 1,
          awayGoals: 1,
          homeWinner: false,
          awayWinner: true,
        },
        true
      )
    ).toEqual({ homeGoals: 1, awayGoals: 2 });

    expect(
      resolveLedgerGoalsFromEspnMatch(
        {
          homeGoals: 1,
          awayGoals: 1,
          homeWinner: true,
          awayWinner: false,
        },
        true
      )
    ).toEqual({ homeGoals: 2, awayGoals: 1 });
  });

  it('leaves group-stage draws unchanged', () => {
    expect(
      resolveLedgerGoalsFromEspnMatch(
        {
          homeGoals: 1,
          awayGoals: 1,
          homeWinner: false,
          awayWinner: false,
        },
        false
      )
    ).toEqual({ homeGoals: 1, awayGoals: 1 });
  });
});
