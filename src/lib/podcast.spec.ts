import { describe, expect, it } from 'vitest';
import { sanitizeEpisodeHtml, removeHtmlTags } from './podcast';
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
