/**
 * Append English pyramid manual ledger entries to english-pyramid-fantasy.ts.
 */

const {
  assertLedgerMonotonic,
  filterNewLedgerEntries,
  findManualMatchesArrayOpen,
  parseManualMatchIds,
} = require('./sweepstake-ledger-guard.cjs');

function escapeSingleQuotes(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/**
 * @param {object} fixture
 * @param {{ homeGoals: number, awayGoals: number }} goals
 * @param {{ homeRedCards: number, awayRedCards: number }} redCards
 * @param {string} [comment]
 * @param {{ redsUnchecked?: boolean }} [options]
 */
function formatManualMatchEntry(
  fixture,
  goals,
  redCards,
  comment = 'Verified final result (ESPN sync).',
  options = {}
) {
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
  ];

  if (options.redsUnchecked === true) {
    lines.push('    redsUnchecked: true,');
  }

  lines.push('  },');

  return lines.join('\n');
}

function appendManualMatches(source, entries) {
  const exportName = 'ENGLISH_PYRAMID_MANUAL_MATCHES';
  const newEntries = filterNewLedgerEntries(source, entries, exportName);
  if (newEntries.length === 0) return source;

  const beforeIds = parseManualMatchIds(source, exportName);
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

  const arrayBody = source.slice(arrayOpen + 1, arrayClose);
  const insertingIntoEmpty = arrayBody.trim().length === 0;
  const block = insertingIntoEmpty
    ? `\n${newEntries.join('\n')}\n`
    : `${newEntries.join('\n')}\n`;
  const updatedSource = `${source.slice(0, arrayClose)}${block}${source.slice(arrayClose)}`;
  assertLedgerMonotonic(beforeIds, parseManualMatchIds(updatedSource, exportName), exportName);
  return updatedSource;
}

module.exports = {
  appendManualMatches,
  formatManualMatchEntry,
};
