import { describe, expect, it } from 'vitest';
import { sanitizeEpisodeHtml } from './podcast';
describe('sanitizeEpisodeHtml', () => {
  it('removes scripts and unsafe schemes', () =>
    expect(
      sanitizeEpisodeHtml('<script>x</script><a href="javascript:x">x</a>'),
    ).not.toMatch(/script|javascript/));
});
