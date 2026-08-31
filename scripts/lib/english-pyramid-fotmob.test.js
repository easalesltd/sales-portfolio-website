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

  it('finds National League North/South fixtures in the same daily payload', () => {
    const match = findFotMobMatchForFixture(
      {
        leagues: [
          {
            name: 'National League South',
            matches: [
              {
                id: 5907484,
                home: { name: 'Billericay', longName: 'Billericay', score: 2 },
                away: { name: 'Dover', longName: 'Dover', score: 0 },
                status: { finished: true },
              },
            ],
          },
        ],
      },
      {
        homeName: 'Billericay Town',
        awayName: 'Dover Athletic',
      },
    );

    expect(match?.id).toBe(5907484);
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

  it('keeps match-event reds when the finished status total has dropped to 0', () => {
    expect(
      parseFotMobFinal(
        {
          home: { score: 0 },
          away: { score: 1 },
          status: { finished: true, numberOfHomeRedCards: 0, numberOfAwayRedCards: 0 },
        },
        {
          header: {
            status: { finished: true, numberOfHomeRedCards: 0, numberOfAwayRedCards: 0 },
            teams: [{ score: 0 }, { score: 1 }],
          },
          content: {
            matchFacts: {
              events: {
                events: [{ type: 'Card', card: 'Red', isHome: false }],
              },
            },
          },
        },
      ),
    ).toEqual({
      homeGoals: 0,
      awayGoals: 1,
      homeRedCards: 0,
      awayRedCards: 1,
    });
  });
});
