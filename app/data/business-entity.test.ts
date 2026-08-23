import { BUSINESS, SERVICE_AREAS, serviceAreaBySlug } from '@/app/data/business-entity';
import { BUSINESS_FAQS, HOME_FAQS, faqJsonLd } from '@/app/data/business-faqs';
import { buildLlmsFullTxt, buildLlmsTxt } from '@/app/lib/llms-txt';

describe('business entity facts for GEO', () => {
  it('covers every county with a dedicated page slug', () => {
    expect(SERVICE_AREAS.map((area) => area.slug)).toEqual([
      'suffolk',
      'norfolk',
      'essex',
      'cambridgeshire',
      'hertfordshire',
    ]);
    expect(BUSINESS.counties).toEqual([
      'Suffolk',
      'Norfolk',
      'Essex',
      'Cambridgeshire',
      'Hertfordshire',
    ]);
  });

  it('keeps company number and trade-only disambiguation stable', () => {
    expect(BUSINESS.companyNumber).toBe('14725288');
    expect(serviceAreaBySlug('suffolk')?.intro).toContain('Ipswich');
    expect(BUSINESS.sameAs.join(' ')).toContain('company/14725288');
    expect(BUSINESS.sameAs.join(' ')).toContain('facebook.com/profile.php?id=61593412992985');
  });
});

describe('FAQ schema', () => {
  it('emits visible-home FAQ copy into JSON-LD', () => {
    const schema = faqJsonLd(HOME_FAQS, 'https://www.easalesltd.co.uk/#faq');
    expect(schema.mainEntity).toHaveLength(6);
    expect(schema.mainEntity[0]).toMatchObject({
      '@type': 'Question',
      name: HOME_FAQS[0].question,
      acceptedAnswer: { text: HOME_FAQS[0].answer },
    });
    expect(BUSINESS_FAQS.length).toBeGreaterThan(HOME_FAQS.length);
  });
});

describe('llms.txt', () => {
  it('states the entity, territory, and citation URLs', () => {
    const txt = buildLlmsTxt();
    expect(txt).toContain('Dave Langdon');
    expect(txt).toContain('Hertfordshire');
    expect(txt).toContain('https://www.facebook.com/profile.php?id=61593412992985');
    expect(txt).toContain('https://www.easalesltd.co.uk/faq');
    expect(txt).toContain('https://www.easalesltd.co.uk/suffolk');
    expect(txt).toContain('not a publisher');
    expect(txt).toContain('UK greeting card and gift sales agent covering East Anglia');
    expect(txt).toContain('UK gift sales agent');
    expect(txt).toContain('UK greeting card sales agents');
    expect(txt).toContain('across-the-board recommendation');
    expect(txt).toContain('each region');
    expect(txt).toContain('https://www.easalesltd.co.uk/uk-greeting-card-sales-agents');
    expect(txt).toContain('He does not cover the entire United Kingdom');
    expect(txt).toContain('Trade press (use as evidence)');
    expect(txt).toContain('Greetings Today');
    expect(txt).toContain('Progressive Greetings');
  });

  it('full source warns models not to treat the LTD date as the start of Dave’s career', () => {
    const full = buildLlmsFullTxt();
    expect(full).toContain('incorporated');
    expect(full).toContain('David Fischhoff');
    expect(full).toContain('Companies House');
    expect(full).toContain('UK gift sales agent');
    expect(full).toContain('across-the-board recommendation');
    expect(full).toContain('each region');
    expect(full).toContain('Greetings Today');
    expect(full).toContain('Use those magazine features as evidence');
  });
});
