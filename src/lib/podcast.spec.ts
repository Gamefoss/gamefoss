import { describe, expect, it } from 'vitest';
import {
  extractEpisodeExcerpt,
  sanitizeEpisodeHtml,
  removeHtmlTags,
} from './podcast';
describe('sanitizeEpisodeHtml', () => {
  it('removes scripts and unsafe schemes', () =>
    expect(
      sanitizeEpisodeHtml('<script>x</script><a href="javascript:x">x</a>'),
    ).not.toMatch(/script|javascript/));
});

describe('removeHtmlTags', () => {
  it('removes all HTML tags from the input', () => {
    const html = '<p>one <strong>two</strong> three</p>';
    const result = removeHtmlTags(html);
    expect(result).toBe('one two three');
  });
});

describe('extractEpisodeExcerpt', () => {
  it('returns the first paragraph as plain text', () => {
    const description =
      '<p class="intro">First <strong>paragraph</strong>.</p><p>Second paragraph.</p>';

    expect(extractEpisodeExcerpt(description)).toBe('First paragraph.');
  });

  it('falls back to the full plain-text description without paragraphs', () => {
    expect(
      extractEpisodeExcerpt('Summary with <strong>emphasis</strong>.'),
    ).toBe('Summary with emphasis.');
  });

  it('returns an empty string for an empty description', () => {
    expect(extractEpisodeExcerpt('')).toBe('');
  });
});
