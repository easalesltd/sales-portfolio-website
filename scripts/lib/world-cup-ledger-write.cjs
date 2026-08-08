/**
 * Append sweepstake manual ledger entries (shared helper for pyramid / tournament games).
 * Array open/close helpers live in `sweepstake-ledger-guard.cjs` (re-exported here).
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
  ];

  if (goals.homePenalties != null && goals.awayPenalties != null) {
    lines.push(`    homePenalties: ${goals.homePenalties},`);
    lines.push(`    awayPenalties: ${goals.awayPenalties},`);
  }

  lines.push('  },');

  return lines.join('\n');
}

function appendManualMatches(source, entries, exportName = 'WORLD_CUP_FANTASY_MANUAL_MATCHES') {
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

  const block = `${newEntries.join('\n')}\n`;
  const updatedSource = `${source.slice(0, arrayClose)}${block}${source.slice(arrayClose)}`;
  assertLedgerMonotonic(beforeIds, parseManualMatchIds(updatedSource, exportName), exportName);
  return updatedSource;
}

module.exports = {
  appendManualMatches,
  findManualMatchesArrayOpen,
  formatManualMatchEntry,
};
