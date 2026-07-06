const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..', '..');

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function patchFixtureKickoffInSource(source, fixtureId, newUtcDate) {
  const pattern = new RegExp(
    `(id: '${escapeRegExp(fixtureId)}',\\s*\\n\\s*utcDate: ')[^']+(')`,
  );
  if (!pattern.test(source)) return null;
  return source.replace(pattern, `$1${newUtcDate}$2`);
}

function updateFixtureKickoffInFile(relativePath, fixtureId, newUtcDate) {
  const filePath = path.join(repoRoot, relativePath);
  const source = fs.readFileSync(filePath, 'utf8');
  const updated = patchFixtureKickoffInSource(source, fixtureId, newUtcDate);
  if (!updated || updated === source) return false;
  fs.writeFileSync(filePath, updated, 'utf8');
  return true;
}

function updateWorldCupFixtureKickoff(fixtureId, newUtcDate) {
  const targets = [
    'app/lib/world-cup-knockout-bracket.ts',
    'scripts/lib/world-cup-knockout-bracket.cjs',
    'app/data/world-cup-fantasy.ts',
  ];

  let updatedAny = false;
  for (const target of targets) {
    if (updateFixtureKickoffInFile(target, fixtureId, newUtcDate)) {
      updatedAny = true;
      console.log(`Updated ${fixtureId} kick-off to ${newUtcDate} in ${target}.`);
    }
  }

  return updatedAny;
}

module.exports = {
  patchFixtureKickoffInSource,
  updateWorldCupFixtureKickoff,
};
