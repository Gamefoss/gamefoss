import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Giphy from './Giphy';

describe('Giphy', () => {
  it('renders an image with the correct src and alt attributes', () => {
    const markup = renderToStaticMarkup(
      <Giphy id="a8n1UNTJXoLz01dpg0" alt="Oh crap, here we go again" />,
    );
    expect(markup).toContain(
      'src="https://media.giphy.com/media/a8n1UNTJXoLz01dpg0/giphy.gif"',
    );
    expect(markup).toContain('alt="Oh crap, here we go again"');
  });
});
