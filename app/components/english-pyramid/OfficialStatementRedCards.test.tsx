/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react';
import OfficialStatementRedCards from './OfficialStatementRedCards';
import type { AwardedRedCard } from '@/app/lib/english-pyramid-scoring';

const award = (
  partial: Pick<AwardedRedCard, 'matchId' | 'utcDate' | 'team' | 'opponent' | 'isHome' | 'redCards'> &
    Partial<AwardedRedCard>
): AwardedRedCard => ({
  homeTeam: partial.isHome ? partial.team : partial.opponent,
  awayTeam: partial.isHome ? partial.opponent : partial.team,
  homeGoals: partial.homeGoals ?? 1,
  awayGoals: partial.awayGoals ?? 0,
  points: partial.points ?? 0,
  managers: partial.managers ?? [],
  ...partial,
});

describe('OfficialStatementRedCards', () => {
  it('lists every awarded red at the bottom of the statement', () => {
    render(
      <OfficialStatementRedCards
        awards={[
          award({
            matchId: '2026-08-08-bux-her',
            utcDate: '2026-08-08T14:00:00Z',
            team: { name: 'Hereford', tla: 'HER' },
            opponent: { name: 'Buxton', tla: 'BUX' },
            isHome: false,
            redCards: 1,
            homeGoals: 2,
            awayGoals: 1,
            redsUnchecked: true,
          }),
          award({
            matchId: '2026-08-31-rad-dar',
            utcDate: '2026-08-31T14:00:00Z',
            team: { name: 'Darlington', tla: 'DAR' },
            opponent: { name: 'Radcliffe', tla: 'RAD' },
            isHome: false,
            redCards: 1,
            homeGoals: 0,
            awayGoals: 1,
            points: 1,
            managers: [{ id: 'scott', name: 'Scott', teamName: 'Scott FC', teamCode: 'DAR' }],
          }),
        ]}
      />
    );

    expect(screen.getByRole('heading', { name: /red card audit/i })).toBeInTheDocument();
    expect(screen.getByText(/2 dismissals in 2 matches/i)).toBeInTheDocument();
    expect(screen.getByText('Hereford, 1 red away at Buxton (2-1)')).toBeInTheDocument();
    expect(screen.getByText('Darlington, 1 red away at Radcliffe (0-1)')).toBeInTheDocument();
    expect(screen.getByText(/Scott/)).toBeInTheDocument();
    expect(screen.getByText(/reds unchecked/i)).toBeInTheDocument();
    expect(screen.getByText(/No manager/)).toBeInTheDocument();
  });

  it('renders nothing when the ledger has no reds', () => {
    const { container } = render(<OfficialStatementRedCards awards={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
