/**
 * KisanO Design System — Textarea Package
 * TextareaLoader
 *
 * A skeleton loader for Textarea components. Renders placeholder content
 * with pulse or shimmer animations to indicate loading state.
 *
 * Single Responsibility: Render skeleton loading UI for textareas.
 * Does not manage textarea state or input logic.
 *
 * @module components/ui/Textarea/TextareaLoader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  TEXTAREA_DEFAULTS,
  getTextareaSize,
} from './textareaVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './textareaUtils';

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
const DEFAULT_ROWS = 4;

/** Motion variants for loader animation. */
const LOADER_MOTION = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Textarea skeleton size mapping. */
const TEXTAREA_SKELETON_SIZES = {
  xs: 'min-h-[60px]',
  sm: 'min-h-[80px]',
  md: 'min-h-[100px]',
  lg: 'min-h-[120px]',
  xl: 'min-h-[140px]',
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * TextareaLoader – a skeleton loader for textareas.
 *
 * @component
 * @example
 * <TextareaLoader size="md" variant="shimmer" rows={4} />
 */
const TextareaLoader = memo(
  forwardRef(function TextareaLoader(
    {
      size = TEXTAREA_DEFAULTS.size,
      variant = 'shimmer',
      animated = true,
      rows = DEFAULT_ROWS,
      disabled = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading textarea',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if animations should be active.
    const isAnimated = animated && !prefersReducedMotion && !disabled;

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getTextareaSize(size),
      [size],
    );

    // Get textarea skeleton size.
    const textareaSize = useMemo(
      () => TEXTAREA_SKELETON_SIZES[size] || TEXTAREA_SKELETON_SIZES.md,
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
        'flex flex-col w-full gap-2',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [disabled, className, responsiveClasses]);

    // Textarea skeleton classes.
    const textareaSkeletonClasses = useMemo(() => {
      const base = mergeClasses(
        'w-full bg-gray-200 rounded-md',
        textareaSize,
        isAnimated && variant === 'pulse' && 'animate-pulse',
      );
      return base;
    }, [textareaSize, isAnimated, variant]);

    // Render a single skeleton row.
    const renderRow = (index) => {
      // Use varying widths for text rows.
      const widthClass = SKELETON_WIDTHS[index % SKELETON_WIDTHS.length];

      // Build text skeleton.
      const textClasses = mergeClasses(
        'bg-gray-200 rounded-md',
        skeletonHeight,
        widthClass,
        isAnimated && variant === 'pulse' && 'animate-pulse',
      );

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
            delay: index * 0.05,
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
          className="relative w-full"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: index * 0.05 }}
        >
          <div className={textClasses} />
          {textShimmer}
        </motion.div>
      );
    };

    // Generate rows.
    const rowsToRender = useMemo(
      () => Array.from({ length: rows }, (_, i) => renderRow(i)),
      [rows, size, variant, isAnimated, skeletonHeight],
    );

    // Shimmer overlay for the entire textarea skeleton.
    const textareaShimmer = isAnimated && variant === 'shimmer' ? (
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
        <div className="relative w-full">
          <div className={textareaSkeletonClasses} />
          {textareaShimmer}
        </div>
        <div className="flex flex-col gap-2 w-full">
          {rowsToRender}
        </div>
      </motion.div>
    );
  }),
);

TextareaLoader.displayName = 'TextareaLoader';

TextareaLoader.propTypes = {
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

export default TextareaLoader;