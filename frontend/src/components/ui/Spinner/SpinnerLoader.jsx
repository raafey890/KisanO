/**
 * KisanO Design System — Spinner Package
 * SpinnerLoader
 *
 * A skeleton loader for Spinner components. Renders placeholder content
 * with pulse or shimmer animations to indicate loading state.
 *
 * Single Responsibility: Render skeleton loading UI for spinners.
 * Does not manage spinner state or business logic.
 *
 * @module components/ui/Spinner/SpinnerLoader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  SPINNER_DEFAULTS,
  getSpinnerSize,
} from './spinnerVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './spinnerUtils';

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
  '2xl': 'h-7',
};

/** Spinner skeleton sizes. */
const SPINNER_SKELETON_SIZES = {
  xs: 'h-4 w-4',
  sm: 'h-5 w-5',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-10 w-10',
  '2xl': 'h-12 w-12',
};

/** Width presets for skeleton text. */
const TEXT_WIDTHS = {
  xs: 'w-12',
  sm: 'w-16',
  md: 'w-20',
  lg: 'w-24',
  xl: 'w-28',
  '2xl': 'w-32',
};

/** Motion variants for loader animation. */
const LOADER_MOTION = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SpinnerLoader – a skeleton loader for spinners.
 *
 * @component
 * @example
 * <SpinnerLoader size="md" variant="shimmer" />
 */
const SpinnerLoader = memo(
  forwardRef(function SpinnerLoader(
    {
      size = SPINNER_DEFAULTS.size,
      variant = 'shimmer',
      animated = true,
      showLabel = true,
      disabled = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading spinner',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if animations should be active.
    const isAnimated = animated && !prefersReducedMotion && !disabled;

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getSpinnerSize(size),
      [size],
    );

    // Get skeleton dimensions for the size.
    const spinnerSize = useMemo(
      () => SPINNER_SKELETON_SIZES[size] || SPINNER_SKELETON_SIZES.md,
      [size],
    );

    const textWidth = useMemo(
      () => TEXT_WIDTHS[size] || TEXT_WIDTHS.md,
      [size],
    );

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
        'flex items-center',
        sizeConfig.gap,
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [sizeConfig.gap, disabled, className, responsiveClasses]);

    // Spinner skeleton with shimmer/pulse.
    const spinnerSkeleton = useMemo(() => {
      return (
        <div
          className={mergeClasses(
            'relative rounded-full shrink-0',
            spinnerSize,
            'bg-gray-200 dark:bg-gray-700',
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
    }, [spinnerSize, isAnimated, variant]);

    // Label skeleton.
    const labelSkeleton = useMemo(() => {
      if (!showLabel) return null;

      return (
        <div
          className={mergeClasses(
            'relative bg-gray-200 dark:bg-gray-700 rounded-md',
            skeletonHeight,
            textWidth,
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
    }, [showLabel, skeletonHeight, textWidth, isAnimated, variant]);

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
        'data-size': size,
      }),
      [role, ariaLabel, disabled, size],
    );

    return (
      <motion.div
        ref={ref}
        className={containerClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {spinnerSkeleton}
        {labelSkeleton}
      </motion.div>
    );
  }),
);

SpinnerLoader.displayName = 'SpinnerLoader';

SpinnerLoader.propTypes = {
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Animation variant: 'pulse' (opacity pulse) or 'shimmer' (sliding gradient). */
  variant: PropTypes.oneOf(['pulse', 'shimmer']),
  /** Whether to animate the skeleton. */
  animated: PropTypes.bool,
  /** Whether to show label placeholder. */
  showLabel: PropTypes.bool,
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

export default SpinnerLoader;