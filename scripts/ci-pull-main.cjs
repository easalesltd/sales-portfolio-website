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

// Configure git to use GitHub token for authentication in CI
if (process.env.GITHUB_TOKEN) {
  try {
    const repoUrl = execFileSync('git', ['config', '--get', 'remote.origin.url'], { encoding: 'utf8' }).trim();
    if (repoUrl.startsWith('https://github.com/')) {
      const authUrl = repoUrl.replace('https://github.com/', `https://x-access-token:${process.env.GITHUB_TOKEN}@github.com/`);
      execFileSync('git', ['remote', 'set-url', 'origin', authUrl]);
      console.log('Configured git remote with GitHub token authentication.');
    }
  } catch (error) {
    console.warn('Failed to configure git remote with token:', error instanceof Error ? error.message : error);
  }
}

try {
  run(['fetch', remote, branch]);
  run(['pull', '--rebase', `${remote}/${branch}`]);
  console.log(`Checkout is up to date with ${remote}/${branch}.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
