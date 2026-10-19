import { describe, expect, it } from 'vitest';
import { sanitizeEpisodeHtml, formatEpisodeExcerpt } from './podcast';
describe('sanitizeEpisodeHtml', () => {
  it('removes scripts and unsafe schemes', () =>
    expect(
      sanitizeEpisodeHtml('<script>x</script><a href="javascript:x">x</a>'),
    ).not.toMatch(/script|javascript/));
});

describe('formatEpisodeExcerpt', () => {
  it('truncates to the specified word limit', () => {
    const text = 'one two three four five six seven eight nine ten';
    const result = formatEpisodeExcerpt(text, 5);
    expect(result).toBe('one two three four five…');
  });
}); 
