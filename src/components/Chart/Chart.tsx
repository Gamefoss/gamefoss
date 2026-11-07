import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styles from './Chart.module.css';
import { numberFormatter, slugify } from '@/lib/site';
import classNames from 'classnames';

type Datum = Record<string, string | number>;

export type ChartSeries = {
  dataKey: string;
  label: string;
  color?: string;
};

type Props = {
  type: 'bar' | 'line' | 'pie';
  title: string;
  description?: string;
  data: Datum[];
  categoryKey: string;
  series: ChartSeries[];
  caption?: string;
  valueSuffix?: string;
  valueDomain?: [number, number];
  className?: string;
  style?: React.CSSProperties;
};

const palette = [
  'var(--chart-color-1)',
  'var(--chart-color-2)',
  'var(--chart-color-3)',
  'var(--chart-color-4)',
];

export default function Chart(props: Props) {
  const {
    type,
    title,
    description,
    data,
    categoryKey,
    series,
    caption,
    valueSuffix = '',
    valueDomain,
    className,
    style,
  } = props;
  const titleId = `chart-${slugify(title)}`;
  const formatValue = (value: number) =>
    `${numberFormatter.format(value)}${valueSuffix}`;
  const commonProps = {
    accessibilityLayer: true,
    data,
    margin: { top: 12, right: 12, bottom: 8, left: 8 },
    responsive: true,
    style: { width: '100%', height: '100%' },
  } as const;
  const pieData = data.map((item, index) => ({
    ...item,
    fill: palette[index % palette.length],
  }));

  const tooltip = (
    <Tooltip
      contentStyle={{}}
      formatter={(value, name) => [formatValue(Number(value)), String(name)]}
      labelStyle={{ fontWeight: 700, marginBottom: '0.35rem' }}
      wrapperClassName={styles.tooltip}
    />
  );

  const axes = (
    <>
      <CartesianGrid
        stroke="var(--color-line)"
        strokeDasharray="3 5"
        strokeOpacity={0.28}
        vertical={false}
      />
      <XAxis
        dataKey={categoryKey}
        interval={0}
        stroke="var(--color-line)"
        tick={{ fill: 'var(--color-ink)', fontSize: 11 }}
        tickLine={false}
      />
      <YAxis
        domain={valueDomain}
        stroke="var(--color-line)"
        tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
        tickFormatter={formatValue}
        tickLine={false}
        width={58}
      />
      {tooltip}
      {series.length > 1 && <Legend />}
    </>
  );

  const Content = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {axes}
            {series.map((item, index) => (
              <Bar
                key={item.dataKey}
                dataKey={item.dataKey}
                fill={item.color ?? palette[index % palette.length]}
                isAnimationActive={false}
                name={item.label}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            {axes}
            {series.map((item, index) => (
              <Line
                key={item.dataKey}
                dataKey={item.dataKey}
                dot={{ fill: 'var(--color-surface)', strokeWidth: 3, r: 4 }}
                isAnimationActive={false}
                name={item.label}
                stroke={item.color ?? palette[index % palette.length]}
                strokeWidth={3}
              />
            ))}
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart {...commonProps}>
            {tooltip}
            <Legend />
            <Pie
              data={pieData}
              dataKey={series[0].dataKey}
              nameKey={categoryKey}
              innerRadius="32%"
              outerRadius="78%"
              paddingAngle={2}
              stroke="var(--color-surface)"
              strokeWidth={3}
              isAnimationActive={false}
            />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <figure
      className={classNames('chart', className, styles.chart)}
      aria-labelledby={titleId}
      style={style}
    >
      <header className={styles.header}>
        <h3 className={styles.title} id={titleId}>
          {title}
        </h3>
        {description && <p className={styles.description}>{description}</p>}
      </header>

      <div className={styles.plot}>
        <Content />
      </div>

      <div className={styles.tableWrapper}>
        <table>
          <caption>{title}</caption>
          <thead>
            <tr>
              <th scope="col">Categoria</th>
              {series.map((item) => (
                <th key={item.dataKey} scope="col">
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={String(item[categoryKey])}>
                <th scope="row">{item[categoryKey]}</th>
                {series.map((chartSeries) => (
                  <td key={chartSeries.dataKey}>
                    {formatValue(Number(item[chartSeries.dataKey]))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
