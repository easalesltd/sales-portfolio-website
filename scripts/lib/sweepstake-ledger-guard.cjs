/**
 * Guardrails so automated sync never drops manual ledger entries.
 */

/**
 * Index of the `[` that opens `export const <exportName> … = [ … ]`.
 * Handles empty one-line arrays (`= []`) and multiline ledgers.
 */
function findManualMatchesArrayOpen(source, exportName) {
  const header = `export const ${exportName}`;
  const exportIndex = source.indexOf(header);
  if (exportIndex === -1) {
    throw new Error(`Unable to locate ${exportName}.`);
  }

  // Only search until the next top-level export so we never latch onto a later
  // fixtures array when the ledger is still the empty one-liner `= []`.
  const afterExport = source.slice(exportIndex);
  const nextExportOffset = afterExport.indexOf('\nexport ', header.length);
  const searchWindow =
    nextExportOffset === -1 ? afterExport : afterExport.slice(0, nextExportOffset);
  const opener = searchWindow.match(/=\s*\[/);
  if (!opener || opener.index == null) {
    throw new Error(`Unable to locate ${exportName} array opener.`);
  }

  return exportIndex + opener.index + opener[0].length - 1;
}

function extractManualMatchesArrayBody(source, exportName) {
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

  return source.slice(arrayOpen + 1, arrayClose);
}

function parseManualMatchIds(source, exportName) {
  const body = extractManualMatchesArrayBody(source, exportName);
  return [...body.matchAll(/id: '([^']+)'/g)].map((entry) => entry[1]);
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
  extractManualMatchesArrayBody,
  filterNewLedgerEntries,
  findDuplicateLedgerIds,
  findManualMatchesArrayOpen,
  findRemovedLedgerIds,
  parseManualMatchIds,
};
