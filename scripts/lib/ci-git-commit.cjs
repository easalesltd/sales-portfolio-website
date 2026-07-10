#!/usr/bin/env node

/**
 * Stage, commit, rebase onto origin/main, and push with retries.
 * Used by sweepstake CI workflows so score syncs survive concurrent pushes.
 */

const { execFileSync, execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const {
  assertLedgerMonotonic,
  parseManualMatchIds,
} = require('./sweepstake-ledger-guard.cjs');

const LEDGER_GUARDS = {
  'world-cup': {
    relativePath: 'app/data/world-cup-fantasy.ts',
    exportName: 'WORLD_CUP_FANTASY_MANUAL_MATCHES',
  },
  'english-pyramid': {
    relativePath: 'app/data/english-pyramid-fantasy.ts',
    exportName: 'ENGLISH_PYRAMID_MANUAL_MATCHES',
  },
};

const DEFAULT_BOT_NAME = 'github-actions[bot]';
const DEFAULT_BOT_EMAIL = '41898282+github-actions[bot]@users.noreply.github.com';
const DEFAULT_BRANCH = 'main';
const DEFAULT_REMOTE = 'origin';
const DEFAULT_MAX_ATTEMPTS = 5;

function sleep(ms) {
  execSync(`sleep ${Math.max(1, Math.ceil(ms / 1000))}`);
}

function run(command, args, options = {}) {
  execFileSync(command, args, { stdio: 'inherit', ...options });
}

function capture(command, args) {
  return execFileSync(command, args, { encoding: 'utf8' }).trim();
}

function parseArgs(argv) {
  const paths = [];
  let message = '';
  let outputName = 'changed';
  let dryRun = false;
  let maxAttempts = DEFAULT_MAX_ATTEMPTS;
  let branch = DEFAULT_BRANCH;
  let remote = DEFAULT_REMOTE;
  let botName = process.env.CI_GIT_USER_NAME || DEFAULT_BOT_NAME;
  let botEmail = process.env.CI_GIT_USER_EMAIL || DEFAULT_BOT_EMAIL;
  let ledgerGuard = '';

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--paths') {
      paths.push(...argv[++index].split(',').map((value) => value.trim()).filter(Boolean));
      continue;
    }
    if (arg === '--message') {
      message = argv[++index];
      continue;
    }
    if (arg === '--output-name') {
      outputName = argv[++index];
      continue;
    }
    if (arg === '--branch') {
      branch = argv[++index];
      continue;
    }
    if (arg === '--remote') {
      remote = argv[++index];
      continue;
    }
    if (arg === '--max-attempts') {
      maxAttempts = Number.parseInt(argv[++index], 10);
      continue;
    }
    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }
    if (arg === '--bot-name') {
      botName = argv[++index];
      continue;
    }
    if (arg === '--bot-email') {
      botEmail = argv[++index];
      continue;
    }
    if (arg === '--ledger-guard') {
      ledgerGuard = argv[++index];
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (paths.length === 0) {
    throw new Error('At least one --paths entry is required.');
  }
  if (!message) {
    throw new Error('--message is required.');
  }

  return { paths, message, outputName, dryRun, maxAttempts, branch, remote, botName, botEmail, ledgerGuard };
}

function hasPathChanges(paths) {
  for (const trackedPath of paths) {
    try {
      execFileSync('git', ['diff', '--quiet', '--', trackedPath]);
      execFileSync('git', ['diff', '--cached', '--quiet', '--', trackedPath]);
    } catch {
      return true;
    }
  }

  return false;
}

function setGitHubOutput(name, value) {
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (!githubOutput) return;
  fs.appendFileSync(githubOutput, `${name}=${value}\n`);
}

function pushWithRetry({ branch, remote, maxAttempts }) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      run('git', ['fetch', remote, branch]);
      run('git', ['pull', '--rebase', remote, branch]);
      run('git', ['push', `${remote}`, `HEAD:${branch}`]);
      return;
    } catch (error) {
      if (attempt >= maxAttempts) {
        throw error;
      }
      const delayMs = Math.min(2000 * attempt, 10000);
      console.warn(
        `Push failed (attempt ${attempt}/${maxAttempts}). Retrying in ${delayMs}ms...`,
      );
      sleep(delayMs);
    }
  }
}

function assertLedgerGuard(options) {
  if (!options.ledgerGuard) return;

  const guard = LEDGER_GUARDS[options.ledgerGuard];
  if (!guard) {
    throw new Error(`Unknown ledger guard: ${options.ledgerGuard}`);
  }

  const repoRoot = path.resolve(__dirname, '..', '..');
  const filePath = path.join(repoRoot, guard.relativePath);
  let headSource = '';

  try {
    headSource = capture('git', ['show', `HEAD:${guard.relativePath}`]);
  } catch {
    headSource = '';
  }

  const workSource = fs.readFileSync(filePath, 'utf8');
  const beforeIds = headSource ? parseManualMatchIds(headSource, guard.exportName) : [];
  const afterIds = parseManualMatchIds(workSource, guard.exportName);
  assertLedgerMonotonic(beforeIds, afterIds, guard.exportName);
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const changed = hasPathChanges(options.paths);

  setGitHubOutput(options.outputName, changed ? 'true' : 'false');

  if (!changed) {
    console.log('No git changes to commit.');
    return;
  }

  console.log('Changed files:');
  console.log(capture('git', ['status', '--short']));

  if (options.dryRun) {
    console.log('Dry run: skipping commit and push.');
    return;
  }

  assertLedgerGuard(options);

  run('git', ['config', 'user.name', options.botName]);
  run('git', ['config', 'user.email', options.botEmail]);

  for (const trackedPath of options.paths) {
    run('git', ['add', '--', trackedPath]);
  }

  run('git', ['commit', '-m', options.message]);
  pushWithRetry(options);
  console.log('Committed and pushed changes to main.');
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
