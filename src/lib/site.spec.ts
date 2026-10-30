import { describe, expect, it } from 'vitest';
import { formatDate, slugify } from './site';

describe('formatDate', () => {
  it.each([
    ['2026-10-30', '30 de outubro de 2026'],
    ['2026-01-01', '01 de janeiro de 2026'],
    ['2024-02-29', '29 de fevereiro de 2024'],
  ])('preserves the calendar day of %s', (date, expected) => {
    expect(formatDate(date)).toBe(expected);
  });

  it('displays timestamped feeds in São Paulo time', () => {
    expect(formatDate('2026-10-30T01:00:00Z')).toBe('29 de outubro de 2026');
    expect(formatDate(new Date('2026-10-30T01:00:00Z'))).toBe(
      '29 de outubro de 2026',
    );
  });
});

describe('slugify', () => {
  it('normalizes accents and punctuation', () =>
    expect(slugify('Heróis & Vilões!')).toBe('herois-viloes'));
});
