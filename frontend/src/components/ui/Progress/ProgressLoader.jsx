/**
 * KisanO Design System — Progress Package
 * ProgressLoader
 *
 * A skeleton loader for Progress components. Renders placeholder content
 * with pulse or shimmer animations to indicate loading state.
 *
 * Single Responsibility: Render skeleton loading UI for progress bars.
 * Does not manage progress state or content.
 *
 * @module components/ui/Progress/ProgressLoader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  PROGRESS_DEFAULTS,
  getProgressSize,
} from './progressVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './progressUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Height presets for skeleton progress bars. */
const SKELETON_HEIGHTS = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-2.5',
  xl: 'h-3',
};

/** Width presets for skeleton label. */
const LABEL_WIDTHS = {
  xs: 'w-12',
  sm: 'w-16',
  md: 'w-20',
  lg: 'w-24',
  xl: 'w-28',
};

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
 * ProgressLoader – a skeleton loader for progress bars.
 *
 * @component
 * @example
 * <ProgressLoader size="md" variant="shimmer" showLabel />
 */
const ProgressLoader = memo(
  forwardRef(function ProgressLoader(
    {
      size = PROGRESS_DEFAULTS.size,
      variant = 'shimmer',
      animated = true,
      showLabel = false,
      showValue = false,
      disabled = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading progress',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if animations should be active.
    const isAnimated = animated && !prefersReducedMotion && !disabled;

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getProgressSize(size),
      [size],
    );

    // Get skeleton dimensions for the size.
    const barHeight = useMemo(
      () => SKELETON_HEIGHTS[size] || SKELETON_HEIGHTS.md,
      [size],
    );

    const labelWidth = useMemo(
      () => LABEL_WIDTHS[size] || LABEL_WIDTHS.md,
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

    // Label skeleton.
    const labelSkeleton = useMemo(() => {
      if (!showLabel) return null;

      return (
        <div
          className={mergeClasses(
            'relative bg-gray-200 dark:bg-gray-700 rounded-md',
            'h-4',
            labelWidth,
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
    }, [showLabel, labelWidth, isAnimated, variant]);

    // Value skeleton.
    const valueSkeleton = useMemo(() => {
      if (!showValue) return null;

      return (
        <div
          className={mergeClasses(
            'relative bg-gray-200 dark:bg-gray-700 rounded-md',
            'h-4',
            'w-12',
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
                delay: 0.1,
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
    }, [showValue, isAnimated, variant]);

    // Bar skeleton.
    const barSkeleton = useMemo(() => {
      return (
        <div
          className={mergeClasses(
            'relative overflow-hidden rounded-full',
            barHeight,
            'bg-gray-200 dark:bg-gray-700',
            isAnimated && variant === 'pulse' && 'animate-pulse',
          )}
        >
          {isAnimated && variant === 'shimmer' && (
            <motion.div
              className="absolute inset-0"
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
          )}
        </div>
      );
    }, [barHeight, isAnimated, variant]);

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
        {/* Label and Value */}
        {(showLabel || showValue) && (
          <div className="flex items-center justify-between">
            {labelSkeleton}
            {valueSkeleton}
          </div>
        )}

        {/* Progress Bar */}
        {barSkeleton}
      </motion.div>
    );
  }),
);

ProgressLoader.displayName = 'ProgressLoader';

ProgressLoader.propTypes = {
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Animation variant: 'pulse' (opacity pulse) or 'shimmer' (sliding gradient). */
  variant: PropTypes.oneOf(['pulse', 'shimmer']),
  /** Whether to animate the skeleton. */
  animated: PropTypes.bool,
  /** Whether to show label placeholder. */
  showLabel: PropTypes.bool,
  /** Whether to show value placeholder. */
  showValue: PropTypes.bool,
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

export default ProgressLoader;