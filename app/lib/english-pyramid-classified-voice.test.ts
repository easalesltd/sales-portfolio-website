/** @jest-environment node */

import { describe, expect, it } from '@jest/globals';
import {
  CLASSIFIED_ROAST_INTRO,
  formatRoastForClassifiedSpeech,
  pickClassifiedVoice,
  scoreClassifiedVoice,
} from '@/app/lib/english-pyramid-classified-voice';

describe('formatRoastForClassifiedSpeech', () => {
  it('opens with the classified intro and speaks scores as nil phrases', () => {
    const lines = formatRoastForClassifiedSpeech(
      'Chris lost 0-1 at home.\n\nJon served a boring 0-0. Totton stuffed 0-3.'
    );
    expect(lines[0]).toBe(CLASSIFIED_ROAST_INTRO);
    expect(lines[1]).toContain('nil, one');
    expect(lines[2]).toContain('nil, nil');
    expect(lines[2]).toContain('nil, three');
  });
});

describe('pickClassifiedVoice', () => {
  it('prefers a British male voice over a US female one', () => {
    const picked = pickClassifiedVoice([
      { name: 'Samantha', lang: 'en-US', localService: true },
      { name: 'Daniel', lang: 'en-GB', localService: true },
      { name: 'Google US English', lang: 'en-US' },
    ]);
    expect(picked?.name).toBe('Daniel');
    expect(scoreClassifiedVoice({ name: 'Daniel', lang: 'en-GB' })).toBeGreaterThan(
      scoreClassifiedVoice({ name: 'Samantha', lang: 'en-US' })
    );
  });
});
