#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const TRACKED_PATHS = [
  'app/data/world-cup-fantasy.ts',
  'app/lib/world-cup-knockout-bracket.ts',
  'scripts/lib/world-cup-knockout-bracket.cjs',
].join(',');

const commitMessage =
  process.env.WORLD_CUP_CI_COMMIT_MESSAGE ||
  'Sync World Cup sweepstake scores from ESPN.\n\nDeterministic ledger append for finished fixtures; roast updates follow separately when needed.';

function runNodeScript(relativePath, args = []) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, relativePath), ...args], {
    cwd: repoRoot,
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

runNodeScript('scripts/world-cup-sync-ledger.cjs', ['--write']);

runNodeScript('scripts/lib/ci-git-commit.cjs', [
  '--paths',
  TRACKED_PATHS,
  '--message',
  commitMessage,
  '--output-name',
  'scores_changed',
]);
