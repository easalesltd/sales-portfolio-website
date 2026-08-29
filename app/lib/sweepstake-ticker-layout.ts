/**
 * Latest-result ticker sizing.
 *
 * The mobile rotator stacks every card in one grid cell so height stays
 * stable. If those cards can grow with content (`min-w-[17rem]` with no cap),
 * the widest invisible card expands the track and the visible board sits
 * off-centre. Pin every phone card to the content column; keep a compact
 * min-width only for the desktop marquee.
 */
export const TICKER_CARD_SIZE =
  'w-full min-w-0 max-w-full sm:w-auto sm:min-w-[17rem] sm:max-w-none sm:shrink-0 md:min-w-[21rem] xl:min-w-[24rem]';

export const LATEST_RESULT_MOBILE_STACK =
  'grid w-full min-w-0 justify-items-stretch overflow-x-clip sm:hidden';

export const LATEST_RESULT_MOBILE_SLOT = 'col-start-1 row-start-1 w-full min-w-0 max-w-full';

export function tickerCardFillsMobileColumn(className: string): boolean {
  const tokens = className.split(/\s+/);
  return (
    tokens.includes('w-full') &&
    tokens.includes('min-w-0') &&
    tokens.includes('sm:min-w-[17rem]') &&
    !tokens.includes('min-w-[17rem]') &&
    !tokens.includes('shrink-0')
  );
}
