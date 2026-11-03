import { describe, expect, it } from 'vitest';
import { rehypeImageBase } from './rehype-image-base';

function image(src: string) {
  return { type: 'element', tagName: 'img', properties: { src } };
}

describe('Markdown image base paths', () => {
  it('prefixes local images in nested content for preview', () => {
    const node = image(
      '/images/articles/marco-legal-dos-games/marco-legal-assinado.jpg',
    );
    rehypeImageBase({ base: '/dev/' })({
      type: 'root',
      children: [{ type: 'element', tagName: 'p', children: [node] }],
    });
    expect(node.properties.src).toBe(
      '/dev/images/articles/marco-legal-dos-games/marco-legal-assinado.jpg',
    );
  });

  it.each(['/', '/dev'])('preserves other URL forms with base %s', (base) => {
    const sources = [
      'https://example.com/image.jpg',
      '//cdn.example.com/image.jpg',
      './image.jpg',
      'data:image/png;base64,abc',
      '/dev/images/image.jpg',
    ];
    const nodes = sources.map(image);
    rehypeImageBase({ base })({ type: 'root', children: nodes });
    expect(nodes.map((node) => node.properties.src)).toEqual(sources);
  });

  it('keeps production paths and links unchanged', () => {
    const node = image('/images/image.jpg');
    rehypeImageBase()({ type: 'root', children: [node] });
    expect(node.properties.src).toBe('/images/image.jpg');
    const link = {
      type: 'element',
      tagName: 'a',
      properties: { src: '/images/image.jpg' },
    };
    rehypeImageBase({ base: '/dev' })(link);
    expect(link.properties.src).toBe('/images/image.jpg');
  });
});
