/** @jest-environment node */

const {
  loadValidationContext,
  validateWorldCupDailyRoast,
} = require('../../scripts/world-cup-validate-daily-roast.cjs');

describe('validateWorldCupDailyRoast', () => {
  const context = loadValidationContext();

  it('passes validation for the live World Cup daily roast', () => {
    const errors = validateWorldCupDailyRoast(context, {
      roastDay: context.manualMatches
        .map((match) => match.utcDate.slice(0, 10))
        .sort()
        .at(-1),
    });

    expect(errors).toEqual([]);
  });

  it('rejects a previous roast that mixed in the wrong day and player teams', () => {
    const badRoast =
      'Wednesday ran the full gamut from Seattle’s graveyard shift to Vancouver’s Group B curtain-raiser: Croatia and Colombia both squeezed out 1-0 wins over Panama and Congo DR, then Switzerland edged Canada 2-1 and Bosnia put three past Qatar to settle the evening. Nest leads on 25, Scott and Chris are locked on 23 after Chris watched Canada and Qatar leak points again, Jon stays on 20 despite Switzerland doing him a favour, Ash has 19, and Dave remains bottom on 18 — Bosnia’s three-goal haul was welcome, but not enough to lift him off the floor.';

    const errors = validateWorldCupDailyRoast(
      { ...context, roast: badRoast },
      { roastDay: '2026-06-24' },
    );

    expect(errors.some((error) => error.includes('Croatia'))).toBe(true);
    expect(errors.some((error) => error.includes('Panama'))).toBe(true);
    expect(errors.some((error) => error.includes('Chris') && error.includes('Canada'))).toBe(true);
    expect(errors.some((error) => error.includes('Jon') && error.includes('Switzerland'))).toBe(true);
  });

  it('rejects incorrect standings totals', () => {
    const errors = validateWorldCupDailyRoast(
      {
        ...context,
        roast:
          'Colombia edged Congo DR, Switzerland held off Canada, and Bosnia beat Qatar. Nest leads on 99, Dave stays bottom on 18.',
      },
      {
        roastDay: '2026-06-24',
      },
    );

    expect(errors.some((error) => error.includes('leads on 99'))).toBe(true);
  });
});
