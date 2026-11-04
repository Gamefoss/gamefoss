import { describe, expect, it } from 'vitest';
import { rehypeContentImages } from './rehype-content-images';

interface TestNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: TestNode[];
}

function paragraphWithImage(alt: string): TestNode {
  return {
    type: 'element',
    tagName: 'p',
    children: [
      {
        type: 'element',
        tagName: 'img',
        properties: { src: '/image.jpg', alt },
      },
    ],
  };
}

describe('Markdown content images', () => {
  it('turns a standalone image into a captioned figure', () => {
    const tree = { type: 'root', children: [paragraphWithImage('A legenda')] };

    rehypeContentImages()(tree);

    expect(tree.children[0]).toEqual({
      type: 'element',
      tagName: 'figure',
      properties: { className: ['content-figure'] },
      children: [
        {
          type: 'element',
          tagName: 'img',
          properties: { src: '/image.jpg', alt: 'A legenda' },
        },
        {
          type: 'element',
          tagName: 'figcaption',
          properties: {},
          children: [{ type: 'text', value: 'A legenda' }],
        },
      ],
    });
  });

  it('preserves an image link inside the figure', () => {
    const image = paragraphWithImage('Imagem');
    const linkedImage = image.children![0];
    image.children = [
      {
        type: 'element',
        tagName: 'a',
        properties: { href: '/full-size.jpg' },
        children: [linkedImage],
      },
    ];
    const tree = { type: 'root', children: [image] };

    rehypeContentImages()(tree);

    expect(tree.children[0].tagName).toBe('figure');
    expect(tree.children[0].children![0].tagName).toBe('a');
    expect(tree.children[0].children![1].tagName).toBe('figcaption');
  });

  it('omits the caption when the image has no alt text', () => {
    const tree = { type: 'root', children: [paragraphWithImage('')] };

    rehypeContentImages()(tree);

    expect(tree.children[0].tagName).toBe('figure');
    expect(tree.children[0].children).toHaveLength(1);
  });

  it('leaves inline images in paragraphs unchanged', () => {
    const paragraph = paragraphWithImage('Ícone');
    paragraph.children!.push({ type: 'text', value: ' texto' });
    const tree = { type: 'root', children: [paragraph] };

    rehypeContentImages()(tree);

    expect(tree.children[0]).toBe(paragraph);
  });
});
