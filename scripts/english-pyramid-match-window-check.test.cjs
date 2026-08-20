#!/usr/bin/env node

const assert = require('node:assert/strict');
const { shouldRunScoreWorkflow } = require('./english-pyramid-match-window-check.cjs');

const source = `
export const ENGLISH_PYRAMID_TEAM_BY_CODE = {
  ARS: { code: 'ARS', name: 'Arsenal', divisionId: 'PL', outrightOddsDecimal: 2.5 },
  COV: { code: 'COV', name: 'Coventry City', divisionId: 'PL', outrightOddsDecimal: 9 },
};
export const ENGLISH_PYRAMID_MANUAL_MATCHES: readonly EnglishPyramidManualMatch[] = [];
export const ENGLISH_PYRAMID_FIXTURES: readonly EnglishPyramidFixture[] = [
  {
    id: '2026-08-20-shw-brd',
    utcDate: '2026-08-20T19:00Z',
    homeTeam: { name: 'Sheffield Wednesday', tla: 'SHW' },
    awayTeam: { name: 'Bradford City', tla: 'BRD' },
  },
];
`;

assert.equal(
  shouldRunScoreWorkflow(source, new Date('2026-08-20T17:59:00Z')),
  false,
  'more than 60 minutes before kick-off should skip',
);
assert.equal(
  shouldRunScoreWorkflow(source, new Date('2026-08-20T18:00:00Z')),
  true,
  '60 minutes before kick-off should run',
);
assert.equal(
  shouldRunScoreWorkflow(source, new Date('2026-08-20T21:00:00Z')),
  true,
  'after full-time the workflow must keep running until the result is recorded',
);

const recordedSource = source.replace(
  'export const ENGLISH_PYRAMID_MANUAL_MATCHES: readonly EnglishPyramidManualMatch[] = [];',
  `export const ENGLISH_PYRAMID_MANUAL_MATCHES: readonly EnglishPyramidManualMatch[] = [
  { id: '2026-08-20-shw-brd', utcDate: '2026-08-20T19:00Z' },
];`,
);

assert.equal(
  shouldRunScoreWorkflow(recordedSource, new Date('2026-08-20T21:00:00Z')),
  false,
  'recorded fixtures should not keep the workflow open',
);

console.log('english-pyramid-match-window-check tests passed');
