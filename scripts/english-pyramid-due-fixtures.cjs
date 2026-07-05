#!/usr/bin/env node

const fs = require('node:fs');
const {
  formatDueFixturesWithEspnHints,
  getDueFixtureOptionsFromEnv,
  getDueFixtures,
  getMatchdaySweepDue,
  readDataFileSource,
} = require('./lib/english-pyramid-due-fixtures-lib.cjs');

const forceAgent = process.env.ENGLISH_PYRAMID_FORCE_AGENT === '1';

function setOutput(name, value) {
  const githubOutput = process.env.GITHUB_OUTPUT;
  if (!githubOutput) return;

  fs.appendFileSync(githubOutput, `${name}<<EOF\n${value}\nEOF\n`);
}

async function main() {
  const source = readDataFileSource();
  const dueOptions = getDueFixtureOptionsFromEnv();
  const dueFixtures = getDueFixtures(source, dueOptions);
  const { london, ukWindow, matchdaySweepDue, matchdaySweepMessage } = getMatchdaySweepDue(
    source,
    dueFixtures,
    dueOptions.now,
  );

  const hasDueFixtures = dueFixtures.length > 0;
  const isDue = hasDueFixtures || matchdaySweepDue;

  const fixtureList = hasDueFixtures
    ? await formatDueFixturesWithEspnHints(dueFixtures, source)
    : matchdaySweepMessage;

  setOutput('due', isDue ? 'true' : 'false');
  setOutput('forced', forceAgent ? 'true' : 'false');
  setOutput('scan_mode', hasDueFixtures ? 'fixtures' : matchdaySweepDue ? 'matchday' : 'none');
  setOutput('fixtures', fixtureList);
  setOutput('update_delay_minutes', `${dueOptions.updateDelayMinutes}`);
  setOutput('due_lead_minutes', `${dueOptions.dueLeadMinutes}`);
  setOutput(
    'london_context',
    `${london.calendarDate} ${london.weekday} ${london.hour}:${String(london.minute).padStart(2, '0')} Europe/London`,
  );
  setOutput('uk_results_window', ukWindow.inWindow ? 'true' : 'false');

  if (hasDueFixtures) {
    console.log(`English pyramid automation is due for ${dueFixtures.length} fixture(s):`);
    console.log(fixtureList);
  } else if (matchdaySweepDue) {
    console.log('English pyramid matchday sweep is due:');
    console.log(matchdaySweepMessage);
  } else if (forceAgent) {
    console.log('English pyramid automation forced by ENGLISH_PYRAMID_FORCE_AGENT=1.');
  } else {
    console.log('No unrecorded fixtures are past the finality buffer yet.');
    console.log(`London context: ${london.calendarDate} ${london.weekday} — ${ukWindow.label}.`);
  }

  console.log(
    `Expected result check delay: ${dueOptions.updateDelayMinutes} minutes after kick-off (UTC stored in fixtures).`,
  );
  console.log(`Due check lead window: ${dueOptions.dueLeadMinutes} minutes.`);
  console.log('Due fixtures stay active until recorded (no lookback expiry).');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
