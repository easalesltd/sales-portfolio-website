/**
 * Append English pyramid manual ledger entries to english-pyramid-fantasy.ts.
 */

const { findManualMatchesArrayOpen } = require('./world-cup-ledger-write.cjs');

function escapeSingleQuotes(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formatManualMatchEntry(fixture, goals, redCards, comment = 'Verified final result (ESPN sync).') {
  const lines = [
    '  {',
    `    /** ${comment} */`,
    `    id: '${escapeSingleQuotes(fixture.id)}',`,
    `    utcDate: '${escapeSingleQuotes(fixture.utcDate)}',`,
    `    homeTeam: { name: '${escapeSingleQuotes(fixture.homeName)}', tla: '${escapeSingleQuotes(fixture.homeTla)}' },`,
    `    awayTeam: { name: '${escapeSingleQuotes(fixture.awayName)}', tla: '${escapeSingleQuotes(fixture.awayTla)}' },`,
    `    homeGoals: ${goals.homeGoals},`,
    `    awayGoals: ${goals.awayGoals},`,
    `    homeRedCards: ${redCards.homeRedCards},`,
    `    awayRedCards: ${redCards.awayRedCards},`,
    '  },',
  ];

  return lines.join('\n');
}

function appendManualMatches(source, entries) {
  if (entries.length === 0) return source;

  const exportName = 'ENGLISH_PYRAMID_MANUAL_MATCHES';
  const arrayOpen = findManualMatchesArrayOpen(source, exportName);
  let depth = 0;
  let arrayClose = -1;

  for (let i = arrayOpen; i < source.length; i += 1) {
    const char = source[i];
    if (char === '[') depth += 1;
    else if (char === ']') {
      depth -= 1;
      if (depth === 0) {
        arrayClose = i;
        break;
      }
    }
  }

  if (arrayClose === -1) {
    throw new Error(`Unable to locate ${exportName} closing bracket.`);
  }

  const block = `${entries.join('\n')}\n`;
  return `${source.slice(0, arrayClose)}${block}${source.slice(arrayClose)}`;
}

module.exports = {
  appendManualMatches,
  formatManualMatchEntry,
};
