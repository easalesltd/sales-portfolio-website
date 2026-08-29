/** Title, description, chart margin, tap hint, and a little slack so the plot stays on-screen. */
export const PYRAMID_MOBILE_PROGRESS_SECTION_CHROME = 148;

/** Floor so a short viewport does not crush the lines into an unreadable strip. */
export const PYRAMID_MOBILE_PROGRESS_MIN_HEIGHT = 292;

/**
 * Height for the season-progress SVG on phones: leftover viewport after the
 * crest header, jump nav, and section copy. iPhone 17 Pro Max is 440×956 CSS;
 * Safari chrome plus those bars is why a fixed 500px plot falls off-screen.
 */
export function pyramidMobileProgressChartHeight(input: {
  viewportHeight: number;
  overlayPadTop: number;
  overlayPadBottom: number;
  headerHeight: number;
  navHeight: number;
}): number {
  const used =
    input.overlayPadTop +
    input.overlayPadBottom +
    input.headerHeight +
    input.navHeight +
    PYRAMID_MOBILE_PROGRESS_SECTION_CHROME;
  return Math.max(PYRAMID_MOBILE_PROGRESS_MIN_HEIGHT, Math.round(input.viewportHeight - used));
}
