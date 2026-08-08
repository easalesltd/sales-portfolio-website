const {
  findFotMobMatchForFixture,
  normalizeTeamName,
  parseFotMobFinal,
} = require('./english-pyramid-fotmob.cjs');

describe('english-pyramid-fotmob', () => {
  it('matches harmless club-name variants', () => {
    expect(normalizeTeamName('AFC Hornchurch')).toBe('hornchurch');
    expect(normalizeTeamName('Dagenham & Redbridge FC')).toBe('dagenham and redbridge');
    expect(normalizeTeamName('Hampton & Richmond Borough')).toBe('hampton and richmond');
    expect(normalizeTeamName('Billericay Town')).toBe('billericay');
    expect(normalizeTeamName('Dover Athletic')).toBe('dover');
    expect(normalizeTeamName('Chelmsford City')).toBe('chelmsford');
  });

  it('finds the correct National League fixture in a daily payload', () => {
    const match = findFotMobMatchForFixture(
      {
        leagues: [
          {
            name: 'National League',
            matches: [
              {
                id: 5906358,
                home: { name: 'Altrincham', longName: 'Altrincham', score: 1 },
                away: { name: 'Southend', longName: 'Southend United', score: 0 },
                status: { started: true },
              },
            ],
          },
        ],
      },
      {
        homeName: 'Altrincham',
        awayName: 'Southend United',
      },
    );

    expect(match?.id).toBe(5906358);
  });

  it('parses final scores and explicit red-card totals', () => {
    expect(
      parseFotMobFinal(
        {
          home: { score: 2 },
          away: { score: 1 },
          status: { finished: true },
        },
        {
          header: {
            status: {
              finished: true,
              numberOfHomeRedCards: 1,
              numberOfAwayRedCards: 0,
            },
            teams: [{ score: 2 }, { score: 1 }],
          },
        },
      ),
    ).toEqual({
      homeGoals: 2,
      awayGoals: 1,
      homeRedCards: 1,
      awayRedCards: 0,
    });
  });
});
