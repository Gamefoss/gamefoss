import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Grid, type GridProps, FloatyGrid, type FloatyGridProps } from './Grid';

function renderGrid(props: Omit<GridProps, 'children'> = {}) {
  return renderToStaticMarkup(<Grid {...props}>Conteúdo</Grid>);
}

function renderFloatyGrid(
  props: Omit<FloatyGridProps, 'children'> = { floaty: 'left' },
) {
  return renderToStaticMarkup(<FloatyGrid {...props}>Conteúdo</FloatyGrid>);
}

describe('Grid', () => {
  it('renders one column at every breakpoint by default', () => {
    const markup = renderGrid();

    expect(markup).toContain(
      'style="--grid-cols-xs:1;--grid-cols-sm:1;--grid-cols-md:1;--grid-cols-lg:1;--grid-cols-xl:1"',
    );
  });

  it('applies a column count from the specified breakpoint upward', () => {
    const markup = renderGrid({ md: 3 });

    expect(markup).toContain(
      'style="--grid-cols-xs:1;--grid-cols-sm:1;--grid-cols-md:3;--grid-cols-lg:3;--grid-cols-xl:3"',
    );
  });

  it('preserves each explicit override until the next breakpoint', () => {
    const markup = renderGrid({ base: 2, sm: 3, lg: 4 });

    expect(markup).toContain(
      'style="--grid-cols-xs:2;--grid-cols-sm:3;--grid-cols-md:3;--grid-cols-lg:4;--grid-cols-xl:4"',
    );
  });

  it('forwards div attributes, custom classes, and styles', () => {
    const markup = renderGrid({
      'aria-label': 'Destaques',
      className: 'featured-grid',
      id: 'highlights',
      style: { alignItems: 'start' },
    });

    expect(markup).toContain('featured-grid');
    expect(markup).toContain('aria-label="Destaques"');
    expect(markup).toContain('id="highlights"');
    expect(markup).toContain('align-items:start');
  });
});

describe('FloatyGrid', () => {
  it.each([
    ['left', 'floaty-grid-component__floaty--left'],
    ['right', 'floaty-grid-component__floaty--right'],
  ])(
    'renders with the correct floaty class for %s',
    (floaty, expectedClass) => {
      const markup = renderFloatyGrid({ floaty: floaty as 'left' | 'right' });
      expect(markup).toContain(expectedClass);
    },
  );
});
