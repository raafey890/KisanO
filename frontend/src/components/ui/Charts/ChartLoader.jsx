/**
 * KisanO Design System — Chart Package
 * ChartLoader
 *
 * A skeleton loader for Chart components. Renders placeholder content
 * with pulse or shimmer animations to indicate loading state.
 *
 * Single Responsibility: Render skeleton loading UI for charts.
 * Does not manage chart state or business logic.
 *
 * @module components/ui/Chart/ChartLoader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  CHART_DEFAULTS,
  getChartSize,
} from './chartVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './chartUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Height presets for skeleton elements. */
const SKELETON_HEIGHTS = {
  xs: 'h-3',
  sm: 'h-3.5',
  md: 'h-4',
  lg: 'h-5',
  xl: 'h-6',
};

/** Width presets for skeleton elements. */
const SKELETON_WIDTHS = {
  legend: {
    xs: 'w-12',
    sm: 'w-16',
    md: 'w-20',
    lg: 'w-24',
    xl: 'w-28',
  },
  bar: {
    xs: 'w-6',
    sm: 'w-8',
    md: 'w-10',
    lg: 'w-12',
    xl: 'w-14',
  },
};

/** Chart types and their skeleton configurations. */
const CHART_SKELETONS = {
  line: {
    bars: 6,
    points: 4,
  },
  bar: {
    bars: 6,
    points: 0,
  },
  pie: {
    bars: 4,
    points: 0,
  },
  area: {
    bars: 6,
    points: 4,
  },
};

/** Default chart type for skeleton. */
const DEFAULT_CHART_TYPE = 'line';

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
 * ChartLoader – a skeleton loader for charts.
 *
 * @component
 * @example
 * <ChartLoader size="md" variant="shimmer" type="line" />
 */
const ChartLoader = memo(
  forwardRef(function ChartLoader(
    {
      type = DEFAULT_CHART_TYPE,
      size = CHART_DEFAULTS.size,
      variant = 'shimmer',
      animated = true,
      showLegend = true,
      disabled = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading chart',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if animations should be active.
    const isAnimated = animated && !prefersReducedMotion && !disabled;

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getChartSize(size),
      [size],
    );

    // Get skeleton configuration for chart type.
    const chartConfig = useMemo(
      () => CHART_SKELETONS[type] || CHART_SKELETONS[DEFAULT_CHART_TYPE],
      [type],
    );

    // Get skeleton dimensions for the size.
    const skeletonHeight = useMemo(
      () => SKELETON_HEIGHTS[size] || SKELETON_HEIGHTS.md,
      [size],
    );

    const legendWidth = useMemo(
      () => SKELETON_WIDTHS.legend[size] || SKELETON_WIDTHS.legend.md,
      [size],
    );

    const barWidth = useMemo(
      () => SKELETON_WIDTHS.bar[size] || SKELETON_WIDTHS.bar.md,
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
        'flex flex-col w-full',
        sizeConfig.gap,
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [sizeConfig.gap, disabled, className, responsiveClasses]);

    // Shimmer overlay.
    const shimmerOverlay = isAnimated && variant === 'shimmer' ? (
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-inherit"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: 'ease-in-out',
        }}
      >
        <div
          className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          style={{ borderRadius: 'inherit' }}
        />
      </motion.div>
    ) : null;

    // Grid skeleton.
    const gridSkeleton = useMemo(() => {
      const gridLines = 4;
      return (
        <div className="flex flex-col gap-2 h-full">
          {Array.from({ length: gridLines }).map((_, index) => (
            <div
              key={index}
              className={mergeClasses(
                'relative bg-gray-200 dark:bg-gray-700 rounded',
                'h-0.5 w-full',
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
          ))}
        </div>
      );
    }, [isAnimated, variant]);

    // Chart content skeleton.
    const chartContentSkeleton = useMemo(() => {
      const isPie = type === 'pie';
      const bars = chartConfig.bars;

      if (isPie) {
        // Pie chart skeleton (segments)
        const segments = 4;
        return (
          <div className="flex items-center justify-center h-full">
            <div className="relative w-32 h-32">
              {Array.from({ length: segments }).map((_, index) => {
                const size = 32 - index * 6;
                const rotation = index * 45;
                return (
                  <div
                    key={index}
                    className={mergeClasses(
                      'absolute rounded-full',
                      `h-${size} w-${size}`,
                      'bg-gray-200 dark:bg-gray-700',
                      isAnimated && variant === 'pulse' && 'animate-pulse',
                    )}
                    style={{
                      top: `calc(50% - ${size / 2}px)`,
                      left: `calc(50% - ${size / 2}px)`,
                      transform: `rotate(${rotation}deg)`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      }

      // Bar/Line/Area chart skeleton
      return (
        <div className="flex items-end justify-between h-full gap-1 pb-6">
          {Array.from({ length: bars }).map((_, index) => {
            const height = 20 + Math.random() * 60;
            return (
              <div
                key={index}
                className={mergeClasses(
                  'relative bg-gray-200 dark:bg-gray-700 rounded-t',
                  barWidth,
                  `h-[${height}%]`,
                  isAnimated && variant === 'pulse' && 'animate-pulse',
                )}
                style={{ height: `${height}%` }}
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
            );
          })}
        </div>
      );
    }, [type, chartConfig.bars, barWidth, isAnimated, variant]);

    // Legend skeleton.
    const legendSkeleton = useMemo(() => {
      if (!showLegend) return null;

      const items = 3;
      return (
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {Array.from({ length: items }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-2"
            >
              <div
                className={mergeClasses(
                  'relative bg-gray-200 dark:bg-gray-700 rounded-full',
                  'h-2.5 w-2.5',
                  isAnimated && variant === 'pulse' && 'animate-pulse',
                )}
              />
              <div
                className={mergeClasses(
                  'relative bg-gray-200 dark:bg-gray-700 rounded',
                  skeletonHeight,
                  legendWidth,
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
                      delay: 0.1 + index * 0.05,
                    }}
                  >
                    <div
                      className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      style={{ borderRadius: 'inherit' }}
                    />
                  </motion.div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }, [showLegend, skeletonHeight, legendWidth, isAnimated, variant]);

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
        'data-type': type,
        'data-size': size,
      }),
      [role, ariaLabel, disabled, type, size],
    );

    return (
      <motion.div
        ref={ref}
        className={containerClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {/* Chart Container */}
        <div
          className={mergeClasses(
            'relative w-full',
            sizeConfig.height,
            'bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4',
          )}
        >
          {/* Grid Lines */}
          {gridSkeleton}

          {/* Chart Content */}
          <div className="absolute inset-0 flex items-end px-4 pb-4">
            {chartContentSkeleton}
          </div>

          {/* Shimmer Overlay */}
          {shimmerOverlay}
        </div>

        {/* Legend */}
        {legendSkeleton}
      </motion.div>
    );
  }),
);

ChartLoader.displayName = 'ChartLoader';

ChartLoader.propTypes = {
  /** Chart type. */
  type: PropTypes.oneOf(['line', 'bar', 'pie', 'area']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Animation variant: 'pulse' (opacity pulse) or 'shimmer' (sliding gradient). */
  variant: PropTypes.oneOf(['pulse', 'shimmer']),
  /** Whether to animate the skeleton. */
  animated: PropTypes.bool,
  /** Whether to show legend placeholder. */
  showLegend: PropTypes.bool,
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

export default ChartLoader;