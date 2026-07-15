/**
 * KisanO Design System — DatePicker Package
 * DatePickerLoader
 *
 * A skeleton loader for DatePicker components. Renders placeholder content
 * with pulse or shimmer animations to indicate loading state.
 *
 * Single Responsibility: Render skeleton loading UI for date pickers.
 * Does not manage date selection or calendar state.
 *
 * @module components/ui/DatePicker/DatePickerLoader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  DATE_PICKER_DEFAULTS,
  getDatePickerSize,
} from './datePickerVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './datePickerUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Height presets for skeleton rows. */
const SKELETON_HEIGHTS = {
  xs: 'h-3',
  sm: 'h-3.5',
  md: 'h-4',
  lg: 'h-5',
  xl: 'h-6',
};

/** Width presets for skeleton rows. */
const SKELETON_WIDTHS = ['w-3/4', 'w-full', 'w-5/6', 'w-2/3', 'w-1/2'];

/** Default number of rows. */
const DEFAULT_ROWS = 6;

/** Motion variants for loader animation. */
const LOADER_MOTION = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Day skeleton size mapping. */
const DAY_SKELETON_SIZES = {
  xs: 'h-7 w-7',
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-10 w-10',
  xl: 'h-11 w-11',
};

/** Header skeleton width. */
const HEADER_WIDTHS = {
  xs: 'w-24',
  sm: 'w-28',
  md: 'w-32',
  lg: 'w-36',
  xl: 'w-40',
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * DatePickerLoader – a skeleton loader for date pickers.
 *
 * @component
 * @example
 * <DatePickerLoader size="md" variant="shimmer" rows={6} />
 */
const DatePickerLoader = memo(
  forwardRef(function DatePickerLoader(
    {
      size = DATE_PICKER_DEFAULTS.size,
      variant = 'shimmer',
      animated = true,
      rows = DEFAULT_ROWS,
      disabled = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading calendar',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if animations should be active.
    const isAnimated = animated && !prefersReducedMotion && !disabled;

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getDatePickerSize(size),
      [size],
    );

    // Get day skeleton size.
    const daySize = useMemo(
      () => DAY_SKELETON_SIZES[size] || DAY_SKELETON_SIZES.md,
      [size],
    );

    // Get header width.
    const headerWidth = useMemo(
      () => HEADER_WIDTHS[size] || HEADER_WIDTHS.md,
      [size],
    );

    // Get skeleton height for the size.
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
        'flex flex-col w-full gap-3 p-3 min-w-[280px]',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [disabled, className, responsiveClasses]);

    // Header skeleton.
    const headerSkeleton = useMemo(() => {
      const classes = mergeClasses(
        'flex items-center justify-between mb-2',
        sizeConfig.gap,
      );
      return (
        <div className={classes}>
          <div className="flex items-center gap-2">
            <div className={mergeClasses(
              'bg-gray-200 rounded-md h-8 w-8',
              isAnimated && variant === 'pulse' && 'animate-pulse',
            )} />
            <div className={mergeClasses(
              'bg-gray-200 rounded-md h-5',
              headerWidth,
              isAnimated && variant === 'pulse' && 'animate-pulse',
            )} />
            <div className={mergeClasses(
              'bg-gray-200 rounded-md h-8 w-8',
              isAnimated && variant === 'pulse' && 'animate-pulse',
            )} />
          </div>
          <div className={mergeClasses(
            'bg-gray-200 rounded-md h-6 w-14',
            isAnimated && variant === 'pulse' && 'animate-pulse',
          )} />
        </div>
      );
    }, [sizeConfig.gap, headerWidth, isAnimated, variant]);

    // Weekday headers skeleton.
    const weekdaySkeleton = useMemo(() => {
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return (
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map((day) => (
            <div
              key={day}
              className={mergeClasses(
                'bg-gray-200 rounded-md h-4 w-full',
                isAnimated && variant === 'pulse' && 'animate-pulse',
              )}
            />
          ))}
        </div>
      );
    }, [isAnimated, variant]);

    // Day grid skeleton.
    const daysSkeleton = useMemo(() => {
      const dayCount = 42; // 6 rows * 7 days
      return (
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: dayCount }).map((_, index) => (
            <div
              key={index}
              className={mergeClasses(
                'bg-gray-200 rounded-full',
                daySize,
                isAnimated && variant === 'pulse' && 'animate-pulse',
              )}
            />
          ))}
        </div>
      );
    }, [daySize, isAnimated, variant]);

    // Shimmer overlays.
    const headerShimmer = isAnimated && variant === 'shimmer' ? (
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-inherit"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 1.5,
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

    const weekdaysShimmer = isAnimated && variant === 'shimmer' ? (
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-inherit"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'ease-in-out',
          delay: 0.1,
        }}
      >
        <div
          className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          style={{ borderRadius: 'inherit' }}
        />
      </motion.div>
    ) : null;

    const daysShimmer = isAnimated && variant === 'shimmer' ? (
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-inherit"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'ease-in-out',
          delay: 0.2,
        }}
      >
        <div
          className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          style={{ borderRadius: 'inherit' }}
        />
      </motion.div>
    ) : null;

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
        {/* Header Skeleton */}
        <div className="relative">
          {headerSkeleton}
          {headerShimmer}
        </div>

        {/* Weekday Headers Skeleton */}
        <div className="relative">
          {weekdaySkeleton}
          {weekdaysShimmer}
        </div>

        {/* Day Grid Skeleton */}
        <div className="relative">
          {daysSkeleton}
          {daysShimmer}
        </div>
      </motion.div>
    );
  }),
);

DatePickerLoader.displayName = 'DatePickerLoader';

DatePickerLoader.propTypes = {
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Animation variant: 'pulse' (opacity pulse) or 'shimmer' (sliding gradient). */
  variant: PropTypes.oneOf(['pulse', 'shimmer']),
  /** Whether to animate the skeleton. */
  animated: PropTypes.bool,
  /** Number of skeleton rows to render. */
  rows: PropTypes.number,
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

export default DatePickerLoader;