/**
 * Guardrails so automated sync never drops manual ledger entries.
 */

function parseManualMatchIds(source, exportName) {
  const pattern = new RegExp(
    `export const ${exportName}[\\s\\S]*?= \\[([\\s\\S]*?)\\n\\](?: as const)?;`,
  );
  const match = source.match(pattern);
  if (!match) {
    throw new Error(`Unable to find ${exportName} in data source.`);
  }

  return [...match[1].matchAll(/id: '([^']+)'/g)].map((entry) => entry[1]);
}

function findRemovedLedgerIds(beforeIds, afterIds) {
  const after = new Set(afterIds);
  return beforeIds.filter((id) => !after.has(id));
}

function findDuplicateLedgerIds(ids) {
  const seen = new Set();
  const duplicates = [];

  for (const id of ids) {
    if (seen.has(id)) duplicates.push(id);
    seen.add(id);
  }

  return duplicates;
}

function assertLedgerMonotonic(beforeIds, afterIds, label = 'manual ledger') {
  const removed = findRemovedLedgerIds(beforeIds, afterIds);
  if (removed.length === 0) return;

  throw new Error(
    `${label} would remove ${removed.length} recorded match(es): ${removed.join(', ')}. ` +
      'Automation may only append new results — never delete or overwrite existing entries.',
  );
}

function assertNoDuplicateLedgerIds(ids, label = 'manual ledger') {
  const duplicates = findDuplicateLedgerIds(ids);
  if (duplicates.length === 0) return;

  throw new Error(
    `${label} contains duplicate fixture id(s): ${[...new Set(duplicates)].join(', ')}.`,
  );
}

function filterNewLedgerEntries(source, entries, exportName, idPattern = /id: '([^']+)'/) {
  if (entries.length === 0) return [];

  const existingIds = new Set(parseManualMatchIds(source, exportName));
  return entries.filter((entry) => {
    const match = entry.match(idPattern);
    const id = match?.[1];
    if (!id) {
      throw new Error(`Unable to parse fixture id from ledger entry:\n${entry}`);
    }
    return !existingIds.has(id);
  });
}

module.exports = {
  assertLedgerMonotonic,
  assertNoDuplicateLedgerIds,
  filterNewLedgerEntries,
  findDuplicateLedgerIds,
  findRemovedLedgerIds,
  parseManualMatchIds,
};
