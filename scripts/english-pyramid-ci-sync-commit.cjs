#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { countManualMatches } = require('./lib/sweepstake-ledger-guard.cjs');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'app/data/english-pyramid-fantasy.ts');
const TRACKED_PATHS = 'app/data/english-pyramid-fantasy.ts';

const commitMessage =
  process.env.ENGLISH_PYRAMID_CI_COMMIT_MESSAGE ||
  'Sync English pyramid sweepstake scores from ESPN.\n\nDeterministic ledger append for finished league fixtures on ESPN tiers; NL North/South via FWP. Template roast refreshes when new results land.';

function runNodeScript(relativePath, args = []) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, relativePath), ...args], {
    cwd: repoRoot,
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function ledgerSize(source) {
  return countManualMatches(source, 'ENGLISH_PYRAMID_MANUAL_MATCHES');
}

runNodeScript('scripts/ci-pull-main.cjs');

const beforeSource = fs.readFileSync(dataPath, 'utf8');
const beforeCount = ledgerSize(beforeSource);

runNodeScript('scripts/english-pyramid-sync-ledger.cjs', ['--write']);

const afterSource = fs.readFileSync(dataPath, 'utf8');
const afterCount = ledgerSize(afterSource);

if (afterCount > beforeCount) {
  runNodeScript('scripts/english-pyramid-refresh-roast.cjs', ['--write']);
}

runNodeScript('scripts/lib/ci-git-commit.cjs', [
  '--paths',
  TRACKED_PATHS,
  '--message',
  commitMessage,
  '--output-name',
  'scores_changed',
  '--ledger-guard',
  'english-pyramid',
]);
