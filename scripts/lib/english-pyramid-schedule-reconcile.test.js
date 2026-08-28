/** @jest-environment node */

const {
  htmlToVisibleText,
  isFwpPostponedText,
  isFwpScoreText,
  parseFinishedHomeAwayGoals,
} = require('./english-pyramid-fwp-nln-nls.cjs');
const {
  compareFixtureLists,
  formatFixtureBlock,
  mergeRemoteFixturesWithLocal,
} = require('./english-pyramid-fixture-lib.cjs');
const {
  applySchedulePatches,
  patchesFromFotMobDay,
} = require('./english-pyramid-schedule-reconcile.cjs');

describe('FWP postponed and finished-score cells', () => {
  it('treats P:P / postponed labels as postponements', () => {
    expect(isFwpPostponedText('P:P')).toBe(true);
    expect(isFwpPostponedText('Postponed')).toBe(true);
    expect(isFwpPostponedText('7.45pm')).toBe(false);
  });

  it('reads a finished KO cell that wraps the score in spans', () => {
    const visible = htmlToVisibleText(
      '<span class="d-none d-sm-inline half-time-score">(1)</span>1 - 0<span class="d-none d-sm-inline"></span>',
    );
    expect(isFwpScoreText(visible)).toBe(true);
    expect(parseFinishedHomeAwayGoals('Scarborough Athletic 0-1 South Shields', visible, 'A')).toEqual(
      expect.objectContaining({ final: true, homeGoals: 0, awayGoals: 1 }),
    );
  });
});

describe('fixture merge and compare', () => {
  const saturday = {
    id: '2026-08-29-oxc-bux',
    utcDate: '2026-08-29T14:00:00Z',
    homeTeam: { name: 'Oxford City', tla: 'OXC' },
    awayTeam: { name: 'Buxton', tla: 'BUX' },
  };
  const friday = {
    id: '2026-08-28-oxc-bux',
    utcDate: '2026-08-28T18:45:00Z',
    homeTeam: { name: 'Oxford City', tla: 'OXC' },
    awayTeam: { name: 'Buxton', tla: 'BUX' },
  };

  it('reports a calendar-day move by home+away pairing, not as unrelated add/remove', () => {
    const diff = compareFixtureLists([saturday], [friday]);
    expect(diff.movedCalendarDay).toHaveLength(1);
    expect(diff.added).toHaveLength(0);
    expect(diff.removed).toHaveLength(0);
  });

  it('keeps the stored 19:45 kick-off when FWP later infers 15:00 from a score', () => {
    const merged = mergeRemoteFixturesWithLocal(
      [{ ...friday }],
      [{ ...friday, utcDate: '2026-08-28T14:00:00Z', id: '2026-08-28-oxc-bux', kickoffInferred: true }],
    );
    expect(merged[0].utcDate).toBe('2026-08-28T18:45:00Z');
  });

  it('preserves postponed flags when rewriting the fixture block', () => {
    const block = formatFixtureBlock([{ ...saturday, postponed: true }]);
    expect(block).toContain("postponed: true");
  });
});

describe('live schedule patches', () => {
  const horsham = {
    id: '2026-08-29-hor-fnh',
    utcDate: '2026-08-29T14:00:00Z',
    homeTeam: { name: 'Horsham', tla: 'HOR' },
    awayTeam: { name: 'Farnham Town', tla: 'FNH' },
  };

  it('marks FotMob cancelled matches postponed', () => {
    const patches = patchesFromFotMobDay(
      [horsham],
      '2026-08-29',
      {
        leagues: [
          {
            name: 'National League South',
            matches: [
              {
                id: 1,
                home: { name: 'Horsham', longName: 'Horsham' },
                away: { name: 'Farnham', longName: 'Farnham Town' },
                status: { cancelled: true, utcTime: '2026-08-29T14:00:00Z' },
              },
            ],
          },
        ],
      },
    );
    expect(patches).toEqual([
      expect.objectContaining({ type: 'postpone', id: '2026-08-29-hor-fnh' }),
    ]);
  });

  it('moves a fixture when FotMob lists it on a different London day', () => {
    const patches = patchesFromFotMobDay(
      [horsham],
      '2026-08-28',
      {
        leagues: [
          {
            name: 'National League South',
            matches: [
              {
                id: 2,
                home: { name: 'Horsham', longName: 'Horsham' },
                away: { name: 'Farnham', longName: 'Farnham Town' },
                status: {
                  cancelled: false,
                  utcTime: '2026-08-28T18:45:00Z',
                },
              },
            ],
          },
        ],
      },
    );
    expect(patches[0]).toMatchObject({
      type: 'move',
      fromId: '2026-08-29-hor-fnh',
      toId: '2026-08-28-hor-fnh',
    });
  });

  it('writes postponed: true into the fixtures object', () => {
    const source = `export const ENGLISH_PYRAMID_FIXTURES: readonly EnglishPyramidFixture[] = [
  {
    id: '2026-08-29-hor-fnh',
    utcDate: '2026-08-29T14:00:00Z',
    homeTeam: { name: 'Horsham', tla: 'HOR' },
    awayTeam: { name: 'Farnham Town', tla: 'FNH' },
  },
];`;
    const updated = applySchedulePatches(source, [
      { type: 'postpone', id: '2026-08-29-hor-fnh', note: 'FotMob marked postponed (2026-08-29).' },
    ]);
    expect(updated).toContain('postponed: true');
    expect(updated).toContain('FotMob marked postponed');
  });
});
