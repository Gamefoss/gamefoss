import classNames from 'classnames';
import styles from './Grid.module.css';

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
};

/**
 * A responsive grid component that adjusts the number of columns based on screen size.
 * @param props The props for the Grid component, including children and column counts for different screen sizes.
 * @returns A JSX element representing the responsive grid.
 */
function Grid(props: GridProps & React.HTMLAttributes<HTMLDivElement>) {
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
      className={classNames(styles.grid, className)}
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

export default Grid;
