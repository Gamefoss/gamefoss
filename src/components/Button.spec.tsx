import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders a styled link with a left icon', () => {
    const markup = renderToStaticMarkup(
      <Button as="a" href="/busca/" variant="accent" icon="search">Buscar</Button>,
    );

    expect(markup).toContain('<a href="/busca/" class="button button--accent">');
    expect(markup).toContain('<svg');
    expect(markup.indexOf('<svg')).toBeLessThan(markup.indexOf('<span>Buscar</span>'));
  });

  it('renders a native submit button with a right icon', () => {
    const markup = renderToStaticMarkup(
      <Button type="submit" value="accept" icon="arrow-right" iconPosition="right">Aceitar</Button>,
    );

    expect(markup).toContain('<button type="submit" value="accept" class="button">');
    expect(markup.indexOf('<span>Aceitar</span>')).toBeLessThan(markup.indexOf('<svg'));
  });

  it('renders an accessible icon-only link without an empty text wrapper', () => {
    const markup = renderToStaticMarkup(
      <Button as="a" href="https://example.com" variant="accent" icon="twitter" iconOnly aria-label="Twitter" />,
    );

    expect(markup).toContain('class="button button--accent button--icon-only"');
    expect(markup).toContain('aria-label="Twitter"');
    expect(markup).toContain('<svg');
    expect(markup).not.toContain('<span>');
  });
});
