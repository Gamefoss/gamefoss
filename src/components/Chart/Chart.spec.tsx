import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Chart from './Chart';

describe('Chart', () => {
  it('renders an accessible data table and localized values', () => {
    const markup = renderToStaticMarkup(
      <Chart
        type="bar"
        title="Pessoas empregadas"
        description="Comparação entre os anos pesquisados"
        data={[
          { ano: '2018', pessoas: 5292 },
          { ano: '2022', pessoas: 12441 },
        ]}
        categoryKey="ano"
        series={[{ dataKey: 'pessoas', label: 'Pessoas' }]}
        caption="Fonte: pesquisa de exemplo."
      />,
    );

    expect(markup).toContain('aria-labelledby="chart-pessoas-empregadas"');
    expect(markup).toContain('<table');
    expect(markup).toContain('<caption>Pessoas empregadas</caption>');
    expect(markup).toContain('<td>5.292</td>');
    expect(markup).toContain('<td>12.441</td>');
    expect(markup).toContain('Fonte: pesquisa de exemplo.');
  });

  it('supports pie charts with the same accessible data fallback', () => {
    const markup = renderToStaticMarkup(
      <Chart
        type="pie"
        title="Distribuição por plataforma"
        data={[
          { plataforma: 'PC', percentual: 60 },
          { plataforma: 'Console', percentual: 40 },
        ]}
        categoryKey="plataforma"
        series={[{ dataKey: 'percentual', label: 'Participação' }]}
        valueSuffix="%"
      />,
    );

    expect(markup).toContain(
      'aria-labelledby="chart-distribuicao-por-plataforma"',
    );
    expect(markup).toContain('<th scope="row">PC</th>');
    expect(markup).toContain('<td>60%</td>');
    expect(markup).toContain('<th scope="row">Console</th>');
    expect(markup).toContain('<td>40%</td>');
  });
});
