/**
 * KisanO Design System — Radio Package
 * RadioLoader
 *
 * A skeleton loader for Radio components. Renders placeholder content
 * with pulse or shimmer animations to indicate loading state.
 *
 * Single Responsibility: Render skeleton loading UI for radios.
 * Does not manage radio state or input logic.
 *
 * @module components/ui/Radio/RadioLoader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  RADIO_DEFAULTS,
  getRadioSize,
} from './radioVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './radioUtils';

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
const DEFAULT_ROWS = 2;

/** Motion variants for loader animation. */
const LOADER_MOTION = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Radio skeleton size mapping. */
const RADIO_SKELETON_SIZES = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-7 w-7',
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * RadioLoader – a skeleton loader for radios.
 *
 * @component
 * @example
 * <RadioLoader size="md" variant="shimmer" rows={2} />
 */
const RadioLoader = memo(
  forwardRef(function RadioLoader(
    {
      size = RADIO_DEFAULTS.size,
      variant = 'shimmer',
      animated = true,
      rows = DEFAULT_ROWS,
      disabled = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading radio',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if animations should be active.
    const isAnimated = animated && !prefersReducedMotion && !disabled;

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getRadioSize(size),
      [size],
    );

    // Get radio skeleton size.
    const radioSize = useMemo(
      () => RADIO_SKELETON_SIZES[size] || RADIO_SKELETON_SIZES.md,
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
        'flex items-start gap-2',
        sizeConfig.gap,
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [sizeConfig.gap, disabled, className, responsiveClasses]);

    // Render a single radio skeleton row.
    const renderRow = (index) => {
      // Use varying widths for text rows.
      const widthClass = SKELETON_WIDTHS[index % SKELETON_WIDTHS.length];

      // Build radio circle skeleton.
      const circleClasses = mergeClasses(
        'bg-gray-200 rounded-full shrink-0',
        radioSize,
        isAnimated && variant === 'pulse' && 'animate-pulse',
      );

      // Build text skeleton.
      const textClasses = mergeClasses(
        'bg-gray-200 rounded-md',
        skeletonHeight,
        widthClass,
        isAnimated && variant === 'pulse' && 'animate-pulse',
      );

      // Shimmer overlay for radio circle.
      const circleShimmer = isAnimated && variant === 'shimmer' ? (
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

      // Shimmer overlay for text.
      const textShimmer = isAnimated && variant === 'shimmer' ? (
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

      return (
        <motion.div
          key={index}
          className="flex items-start gap-2 w-full"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: index * 0.05 }}
        >
          <div className="relative shrink-0">
            <div className={circleClasses} />
            {circleShimmer}
          </div>
          <div className="relative flex-1 min-w-0">
            <div className={textClasses} />
            {textShimmer}
          </div>
        </motion.div>
      );
    };

    // Generate rows.
    const rowsToRender = useMemo(
      () => Array.from({ length: rows }, (_, i) => renderRow(i)),
      [rows, size, variant, isAnimated, radioSize, skeletonHeight],
    );

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
        <div className="flex flex-col gap-2 w-full">
          {rowsToRender}
        </div>
      </motion.div>
    );
  }),
);

RadioLoader.displayName = 'RadioLoader';

RadioLoader.propTypes = {
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

export default RadioLoader;