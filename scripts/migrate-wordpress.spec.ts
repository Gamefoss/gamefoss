import { describe, expect, it } from 'vitest';
import { htmlToMarkdown } from './migrate-wordpress';

describe('htmlToMarkdown', () => {
  it('converts common WordPress HTML to Markdown', () => {
    const markdown = htmlToMarkdown('<h2 class="wp-block-heading">Título</h2><p>Texto <strong>forte</strong>.</p><ul><li>Item</li></ul>');
    expect(markdown).toBe('## Título\n\nTexto **forte**.\n\n-   Item');
    expect(markdown).not.toContain('<p>');
  });

  it('converts YouTube iframes to the MDX component', () => {
    const markdown = htmlToMarkdown('<p><iframe src="https://www.youtube.com/embed/abc123?feature=oembed" title="Demo"></iframe></p>');
    expect(markdown).toBe('<YouTube id="abc123" title="Demo" />');
  });

  it('keeps figures separate from surrounding paragraphs', () => {
    const markdown = htmlToMarkdown('<figure><img src="image.jpg" alt="Cena"></figure><p>Próximo parágrafo.</p>');
    expect(markdown).toBe('![Cena](image.jpg)\n\nPróximo parágrafo.');
  });

  it('separates an image from text even inside a WordPress wrapper', () => {
    const markdown = htmlToMarkdown('<div class="wp-block-image"><figure><img src="image.jpg" alt=""></figure></div><p>Texto seguinte.</p>');
    expect(markdown).toBe('![](image.jpg)\n\nTexto seguinte.');
  });
});
