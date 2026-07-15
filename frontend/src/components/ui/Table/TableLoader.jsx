/**
 * KisanO Design System — Table Package
 * TableLoader
 *
 * A skeleton loader for Table components. Renders placeholder content
 * with pulse or shimmer animations to indicate loading state.
 *
 * Single Responsibility: Render skeleton loading UI for tables.
 * Does not manage table state or content.
 *
 * @module components/ui/Table/TableLoader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  TABLE_DEFAULTS,
  getTableSize,
} from './tableVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './tableUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Height presets for skeleton cells. */
const SKELETON_HEIGHTS = {
  xs: 'h-3',
  sm: 'h-3.5',
  md: 'h-4',
  lg: 'h-5',
  xl: 'h-6',
};

/** Width presets for skeleton columns. */
const SKELETON_WIDTHS = {
  xs: 'w-8',
  sm: 'w-10',
  md: 'w-12',
  lg: 'w-14',
  xl: 'w-16',
};

/** Default number of columns. */
const DEFAULT_COLUMNS = 4;

/** Default number of rows. */
const DEFAULT_ROWS = 5;

/** Motion variants for loader animation. */
const LOADER_MOTION = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * TableLoader – a skeleton loader for tables.
 *
 * @component
 * @example
 * <TableLoader size="md" variant="shimmer" columns={5} rows={3} />
 */
const TableLoader = memo(
  forwardRef(function TableLoader(
    {
      size = TABLE_DEFAULTS.size,
      variant = 'shimmer',
      animated = true,
      columns = DEFAULT_COLUMNS,
      rows = DEFAULT_ROWS,
      showHeader = true,
      disabled = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading table',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if animations should be active.
    const isAnimated = animated && !prefersReducedMotion && !disabled;

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getTableSize(size),
      [size],
    );

    // Get skeleton dimensions for the size.
    const skeletonHeight = useMemo(
      () => SKELETON_HEIGHTS[size] || SKELETON_HEIGHTS.md,
      [size],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Container classes.
    const containerClasses = useMemo(() => {
      const base = mergeClasses(
        'w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [disabled, className, responsiveClasses]);

    // Table wrapper classes.
    const tableWrapperClasses = useMemo(() => {
      const base = mergeClasses(
        'w-full border-collapse',
        'bg-white dark:bg-gray-900',
        sizeConfig.text,
        'rounded-lg overflow-hidden',
        'border border-gray-200 dark:border-gray-700',
      );
      return base;
    }, [sizeConfig.text]);

    // Header skeleton.
    const headerSkeleton = useMemo(() => {
      if (!showHeader) return null;

      return (
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            {Array.from({ length: columns }).map((_, index) => (
              <th
                key={index}
                className={mergeClasses(
                  'px-4 py-3 text-left',
                  'relative',
                  'bg-gray-50 dark:bg-gray-800',
                )}
              >
                <div
                  className={mergeClasses(
                    'relative bg-gray-200 dark:bg-gray-700 rounded-md',
                    skeletonHeight,
                    SKELETON_WIDTHS[size] || 'w-12',
                    isAnimated && variant === 'pulse' && 'animate-pulse',
                  )}
                >
                  {isAnimated && variant === 'shimmer' && (
                    <motion.div
                      className="absolute inset-0 overflow-hidden rounded-inherit"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'ease-in-out',
                        delay: index * 0.05,
                      }}
                    >
                      <div
                        className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                        style={{ borderRadius: 'inherit' }}
                      />
                    </motion.div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
      );
    }, [showHeader, columns, skeletonHeight, size, isAnimated, variant]);

    // Body skeleton.
    const bodySkeleton = useMemo(() => {
      return (
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr
              key={rowIndex}
              className={mergeClasses(
                'border-b border-gray-200 dark:border-gray-700',
                rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800',
              )}
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <div
                    className={mergeClasses(
                      'relative bg-gray-200 dark:bg-gray-700 rounded-md',
                      skeletonHeight,
                      colIndex === 0 ? 'w-3/4' : colIndex % 3 === 1 ? 'w-full' : 'w-5/6',
                      isAnimated && variant === 'pulse' && 'animate-pulse',
                    )}
                  >
                    {isAnimated && variant === 'shimmer' && (
                      <motion.div
                        className="absolute inset-0 overflow-hidden rounded-inherit"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'ease-in-out',
                          delay: rowIndex * 0.03 + colIndex * 0.03,
                        }}
                      >
                        <div
                          className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                          style={{ borderRadius: 'inherit' }}
                        />
                      </motion.div>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      );
    }, [rows, columns, skeletonHeight, isAnimated, variant]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return LOADER_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-busy': true,
        'aria-disabled': disabled || undefined,
      }),
      [role, ariaLabel, disabled],
    );

    return (
      <motion.div
        ref={ref}
        className={containerClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        <div className={tableWrapperClasses}>
          <table className="w-full border-collapse">
            {headerSkeleton}
            {bodySkeleton}
          </table>
        </div>
      </motion.div>
    );
  }),
);

TableLoader.displayName = 'TableLoader';

TableLoader.propTypes = {
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Animation variant: 'pulse' (opacity pulse) or 'shimmer' (sliding gradient). */
  variant: PropTypes.oneOf(['pulse', 'shimmer']),
  /** Whether to animate the skeleton. */
  animated: PropTypes.bool,
  /** Number of columns. */
  columns: PropTypes.number,
  /** Number of rows. */
  rows: PropTypes.number,
  /** Whether to show header placeholder. */
  showHeader: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Responsive overrides. */
  responsive: PropTypes.shape({
    xs: PropTypes.string,
    sm: PropTypes.string,
    md: PropTypes.string,
    lg: PropTypes.string,
    xl: PropTypes.string,
  }),
  /** Additional CSS classes. */
  className: PropTypes.string,
  /** ARIA role. */
  role: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default TableLoader;