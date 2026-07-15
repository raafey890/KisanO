/**
 * KisanO Design System — Select Package
 * SelectLoader
 *
 * A skeleton loader for Select menus. Renders placeholder content with
 * pulse or shimmer animations to indicate loading state.
 *
 * Single Responsibility: Render skeleton loading UI for selects.
 * Does not manage select state, options, or menu rendering.
 *
 * @module components/ui/Select/SelectLoader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  SELECT_DEFAULTS,
} from './selectVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './selectUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Height presets for skeleton rows. */
const SKELETON_HEIGHTS = {
  xs: 'h-6',
  sm: 'h-7',
  md: 'h-8',
  lg: 'h-9',
  xl: 'h-10',
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

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SelectLoader – a skeleton loader for selects.
 *
 * @component
 * @example
 * <SelectLoader size="md" variant="shimmer" rows={5} />
 */
const SelectLoader = memo(
  forwardRef(function SelectLoader(
    {
      size = SELECT_DEFAULTS.size,
      variant = 'shimmer',
      animated = true,
      rows = DEFAULT_ROWS,
      disabled = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading options',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if animations should be active.
    const isAnimated = animated && !prefersReducedMotion && !disabled;

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
        'flex flex-col w-full gap-1 py-1',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [disabled, className, responsiveClasses]);

    // Render a single skeleton row.
    const renderRow = (index) => {
      // Use varying widths.
      const widthClass = SKELETON_WIDTHS[index % SKELETON_WIDTHS.length];

      // Build row classes.
      const rowClasses = mergeClasses(
        'bg-gray-200 rounded-md',
        skeletonHeight,
        widthClass,
        isAnimated && variant === 'pulse' && 'animate-pulse',
      );

      // Shimmer overlay.
      const shimmerElement = isAnimated && variant === 'shimmer' ? (
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

      return (
        <motion.div
          key={index}
          className="relative mx-2"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: index * 0.05 }}
        >
          <div className={rowClasses} />
          {shimmerElement}
        </motion.div>
      );
    };

    // Generate rows.
    const rowsToRender = useMemo(
      () => Array.from({ length: rows }, (_, i) => renderRow(i)),
      [rows, size, variant, isAnimated, skeletonHeight],
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
        {rowsToRender}
      </motion.div>
    );
  }),
);

SelectLoader.displayName = 'SelectLoader';

SelectLoader.propTypes = {
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

export default SelectLoader;