import classNames from 'classnames';
import './Grid.css';

export type GridProps = {
  /** The content to be displayed inside the grid. */
  children: React.ReactNode;
  /** The number of columns for the base (default) screen size. */
  base?: number;
  /** The number of columns for small screens and above. */
  sm?: number;
  /** The number of columns for medium screens and above. */
  md?: number;
  /** The number of columns for large screens and above. */
  lg?: number;
  /** The number of columns for extra-large screens and above. */
  xl?: number;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * A responsive grid component that adjusts the number of columns based on screen size.
 * @param props The props for the Grid component, including children and column counts for different screen sizes.
 * @returns A JSX element representing the responsive grid.
 */
export function Grid(props: GridProps) {
  const {
    children,
    base = 1,
    sm = base,
    md = sm,
    lg = md,
    xl = lg,
    style,
    className,
    ...divProps
  } = props;

  return (
    <div
      className={classNames(
        'grid-component',
        className,
      )}
      {...divProps}
      style={
        {
          '--grid-cols-xs': base,
          '--grid-cols-sm': sm,
          '--grid-cols-md': md,
          '--grid-cols-lg': lg,
          '--grid-cols-xl': xl,
          ...style,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

export type FloatyGridProps = {
  /** The float direction for the grid component. */
  floaty: 'left' | 'right';
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * A grid component that floats to the left or right based on the `floaty` prop.
 * @param props The props for the FloatyGrid component, including the float direction and children.
 * @returns A JSX element representing the floaty grid.
 */
export function FloatyGrid(props: FloatyGridProps) {
  const { floaty, children, ...divProps } = props;

  return (
    <div
      className={classNames(
        'floaty-grid-component',
        {
          'floaty-grid-component__floaty--left': floaty === 'left',
          'floaty-grid-component__floaty--right': floaty === 'right',
        },
      )}
      {...divProps}
    >
      {children}
    </div>
  );
}

export default Grid;
