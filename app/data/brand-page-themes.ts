export type BrandPageTheme = {
  slug: string;
  accent: string;
  accentForeground: string;
  text: string;
  heading: string;
  card: string;
  headingFont: 'jost' | 'playfair' | 'outfit' | 'libre' | 'poppins';
  bodyFont: 'poppins' | 'outfit' | 'libre';
  headingTransform: 'uppercase' | 'none';
  headingTracking: string;
  radius: string;
  page?: string;
};

const DEFAULT_THEME: Omit<BrandPageTheme, 'slug'> = {
  accent: '#171717',
  accentForeground: '#ffffff',
  text: '#4b5563',
  heading: '#111827',
  card: 'rgba(255,255,255,0.92)',
  headingFont: 'outfit',
  bodyFont: 'outfit',
  headingTransform: 'none',
  headingTracking: '0',
  radius: '0.75rem',
  page: 'transparent',
};

const THEMES: Record<string, Omit<BrandPageTheme, 'slug'>> = {
  'paper-salad': {
    accent: '#ee59a0',
    accentForeground: '#ffffff',
    text: '#5c5c5c',
    heading: '#1c1c1c',
    card: '#ffffff',
    headingFont: 'jost',
    bodyFont: 'poppins',
    headingTransform: 'uppercase',
    headingTracking: '0.16em',
    radius: '0px',
    page: '#ee59a0',
  },
  'ohh-deer': {
    accent: '#111111',
    accentForeground: '#ffffff',
    text: '#3f3f46',
    heading: '#111111',
    card: '#fffdf8',
    headingFont: 'outfit',
    bodyFont: 'outfit',
    headingTransform: 'none',
    headingTracking: '0',
    radius: '1.5rem',
  },
  'peppermint-grove': {
    accent: '#b08d57',
    accentForeground: '#ffffff',
    text: '#5c5346',
    heading: '#3f3428',
    card: '#fbf7f0',
    headingFont: 'playfair',
    bodyFont: 'libre',
    headingTransform: 'none',
    headingTracking: '0.02em',
    radius: '0.25rem',
  },
  'museums-and-galleries': {
    accent: '#1e3a5f',
    accentForeground: '#f7f1e3',
    text: '#4b5563',
    heading: '#1e3a5f',
    card: '#f7f1e3',
    headingFont: 'playfair',
    bodyFont: 'libre',
    headingTransform: 'none',
    headingTracking: '0.04em',
    radius: '0.25rem',
  },
  'mint-publishing': {
    accent: '#2dd4bf',
    accentForeground: '#042f2e',
    text: '#334155',
    heading: '#042f2e',
    card: '#ffffff',
    headingFont: 'outfit',
    bodyFont: 'outfit',
    headingTransform: 'uppercase',
    headingTracking: '0.08em',
    radius: '0.35rem',
  },
  'boxer-gifts': {
    accent: '#b8328f',
    accentForeground: '#ffffff',
    text: '#3f3f46',
    heading: '#111111',
    card: '#ffffff',
    headingFont: 'outfit',
    bodyFont: 'outfit',
    headingTransform: 'none',
    headingTracking: '0',
    radius: '0.75rem',
  },
  'emotional-rescue': {
    accent: '#9f1239',
    accentForeground: '#fff7f8',
    text: '#4c1d24',
    heading: '#4c0519',
    card: '#fff7f8',
    headingFont: 'jost',
    bodyFont: 'poppins',
    headingTransform: 'none',
    headingTracking: '0.02em',
    radius: '0.5rem',
  },
  'star-editions': {
    accent: '#0f172a',
    accentForeground: '#f8fafc',
    text: '#475569',
    heading: '#0f172a',
    card: '#ffffff',
    headingFont: 'outfit',
    bodyFont: 'outfit',
    headingTransform: 'none',
    headingTracking: '0',
    radius: '0.5rem',
  },
  'cgb-giftware': {
    accent: '#7c3f1d',
    accentForeground: '#fffaf5',
    text: '#57534e',
    heading: '#44403c',
    card: '#fffaf5',
    headingFont: 'playfair',
    bodyFont: 'libre',
    headingTransform: 'none',
    headingTracking: '0.03em',
    radius: '0.5rem',
  },
  'global-journey-gifts': {
    accent: '#0f766e',
    accentForeground: '#ecfdf5',
    text: '#334155',
    heading: '#134e4a',
    card: '#ffffff',
    headingFont: 'outfit',
    bodyFont: 'outfit',
    headingTransform: 'none',
    headingTracking: '0.02em',
    radius: '0.75rem',
  },
  'david-fischhoff': {
    accent: '#3f6212',
    accentForeground: '#f7fee7',
    text: '#3f3f46',
    heading: '#365314',
    card: '#f7fee7',
    headingFont: 'libre',
    bodyFont: 'libre',
    headingTransform: 'none',
    headingTracking: '0.03em',
    radius: '0.35rem',
  },
  'cambridge-confectionery-company': {
    accent: '#ffffff',
    accentForeground: '#0a0a0a',
    text: '#d4d4d4',
    heading: '#fafafa',
    card: 'rgba(10,10,10,0.88)',
    headingFont: 'jost',
    bodyFont: 'poppins',
    headingTransform: 'uppercase',
    headingTracking: '0.12em',
    radius: '0px',
  },
  'rudi-and-bear': {
    accent: '#dc954d',
    accentForeground: '#ffffff',
    text: '#4d4c4b',
    heading: '#111111',
    card: '#ffffff',
    headingFont: 'jost',
    bodyFont: 'poppins',
    headingTransform: 'none',
    headingTracking: '0',
    radius: '0.75rem',
    page: '#fffdf9',
  },
};

export function getBrandPageTheme(slug: string): BrandPageTheme {
  return { slug, page: 'transparent', ...DEFAULT_THEME, ...(THEMES[slug] ?? {}) };
}

export function brandFontVar(font: BrandPageTheme['headingFont'] | BrandPageTheme['bodyFont']): string {
  return `var(--font-brand-${font})`;
}
