import { describe, expect, it } from 'vitest';
import {
  formatVideoDuration,
  formatYouTubeDescription,
  parseYouTubeDuration,
} from './videos';

describe('YouTube video helpers', () => {
  it('parses and formats ISO-8601 durations', () => {
    expect(parseYouTubeDuration('PT3M1S')).toBe(181);
    expect(parseYouTubeDuration('PT1H2M3S')).toBe(3723);
    expect(formatVideoDuration(3723)).toBe('1:02:03');
    expect(() => parseYouTubeDuration('3:01')).toThrow();
  });

  it('escapes markup, preserves paragraphs, and linkifies safe URLs', () => {
    const html = formatYouTubeDescription(
      '<script>alert(1)</script>\n\nVeja https://gamefoss.com.br/teste.',
    );
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain(
      '<a href="https://gamefoss.com.br/teste" target="_blank" rel="noopener noreferrer">',
    );
    expect(html).toContain('</a>.');
  });

  it('links YouTube hashtags without changing URL fragments', () => {
    const html = formatYouTubeDescription(
      "Veja #GameDesign, #jogos_indígenas e https://example.com/video#capitulo. Não ligue teste#solto nem 'entidades'.",
    );

    expect(html).toContain(
      '<a href="https://www.youtube.com/hashtag/GameDesign" target="_blank" rel="noopener noreferrer">#GameDesign</a>',
    );
    expect(html).toContain(
      '<a href="https://www.youtube.com/hashtag/jogos_ind%C3%ADgenas" target="_blank" rel="noopener noreferrer">#jogos_indígenas</a>',
    );
    expect(html).toContain(
      '<a href="https://example.com/video#capitulo" target="_blank" rel="noopener noreferrer">https://example.com/video#capitulo</a>',
    );
    expect(html).toContain('teste#solto');
    expect(html).toContain("'entidades'");
  });
});
