#!/usr/bin/env node

/**
 * Rebase the current checkout onto origin/main before automation reads data files.
 */

const { execFileSync } = require('node:child_process');

const branch = process.env.CI_GIT_BRANCH || 'main';
const remote = process.env.CI_GIT_REMOTE || 'origin';

function run(args) {
  execFileSync('git', args, { stdio: 'inherit' });
}

try {
  run(['fetch', remote, branch]);
  run(['pull', '--rebase', `${remote}/${branch}`]);
  console.log(`Checkout is up to date with ${remote}/${branch}.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
