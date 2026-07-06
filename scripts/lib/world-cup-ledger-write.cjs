/**
 * Append World Cup manual ledger entries to world-cup-fantasy.ts.
 */

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

function findManualMatchesArrayOpen(source, exportName) {
  const header = `export const ${exportName}`;
  const exportIndex = source.indexOf(header);
  if (exportIndex === -1) {
    throw new Error(`Unable to locate ${exportName}.`);
  }

  const arrayOpen = source.indexOf('= [', exportIndex);
  if (arrayOpen === -1) {
    throw new Error(`Unable to locate ${exportName} array opener.`);
  }

  return arrayOpen + 2;
}

function appendManualMatches(source, entries, exportName = 'WORLD_CUP_FANTASY_MANUAL_MATCHES') {
  if (entries.length === 0) return source;

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
  findManualMatchesArrayOpen,
  formatManualMatchEntry,
};
