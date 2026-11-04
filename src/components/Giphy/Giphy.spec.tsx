import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Giphy } from './Giphy';

describe('Giphy', () => {
  it('renders a captioned content figure using the alt text by default', () => {
    const markup = renderToStaticMarkup(
      <Giphy id="a8n1UNTJXoLz01dpg0" alt="Oh crap, here we go again" />,
    );
    expect(markup).toContain('<figure class="content-figure">');
    expect(markup).toContain(
      'src="https://media.giphy.com/media/a8n1UNTJXoLz01dpg0/giphy.gif"',
    );
    expect(markup).toContain('alt="Oh crap, here we go again"');
    expect(markup).toContain(
      '<figcaption>Oh crap, here we go again</figcaption>',
    );
  });

  it('supports a custom caption or no caption', () => {
    const customCaption = renderToStaticMarkup(
      <Giphy id="gif" alt="Descrição acessível" caption="Legenda visível" />,
    );
    const noCaption = renderToStaticMarkup(
      <Giphy id="gif" alt="Descrição acessível" caption="" />,
    );

    expect(customCaption).toContain('<figcaption>Legenda visível</figcaption>');
    expect(noCaption).not.toContain('<figcaption>');
  });
});
