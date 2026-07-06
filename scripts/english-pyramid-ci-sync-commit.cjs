#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const TRACKED_PATHS = 'app/data/english-pyramid-fantasy.ts';

const commitMessage =
  process.env.ENGLISH_PYRAMID_CI_COMMIT_MESSAGE ||
  'Sync English pyramid sweepstake scores from ESPN.\n\nDeterministic ledger append for finished league fixtures on ESPN tiers; NL North/South and matchday sweeps may still need the agent.';

function runNodeScript(relativePath, args = []) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, relativePath), ...args], {
    cwd: repoRoot,
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

runNodeScript('scripts/english-pyramid-sync-ledger.cjs', ['--write']);

runNodeScript('scripts/lib/ci-git-commit.cjs', [
  '--paths',
  TRACKED_PATHS,
  '--message',
  commitMessage,
  '--output-name',
  'scores_changed',
]);
