/**
 * KisanO Design System — Modal Package
 * ModalLoader
 *
 * A skeleton loader for modals. Renders placeholder content with pulse
 * or shimmer animations to indicate loading state. Supports multiple
 * row types (text, heading, image, avatar) and custom row definitions.
 *
 * Single Responsibility: Render skeleton loading UI only.
 * Does not manage loading state or modal logic.
 *
 * @module components/ui/Modal/ModalLoader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';


import {
  mergeClasses,
  resolveResponsiveClasses,
} from './modalUtils';

/* ---------------------------------- */
/* Component‑specific tokens          */
/* ---------------------------------- */

/** Height presets for different skeleton types and sizes. */
const SKELETON_HEIGHTS = {
  text: {
    xs: 'h-3',
    sm: 'h-3.5',
    md: 'h-4',
    lg: 'h-5',
    xl: 'h-6',
  },
  heading: {
    xs: 'h-4',
    sm: 'h-5',
    md: 'h-6',
    lg: 'h-7',
    xl: 'h-8',
  },
  image: {
    xs: 'h-20',
    sm: 'h-28',
    md: 'h-36',
    lg: 'h-44',
    xl: 'h-52',
  },
  avatar: {
    xs: 'h-8 w-8',
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-14 w-14',
    xl: 'h-16 w-16',
  },
};

/** Width presets for text rows (random-like widths). */
const TEXT_WIDTHS = ['w-3/4', 'w-full', 'w-5/6', 'w-2/3', 'w-1/2'];

/** Default size when not provided. */
const DEFAULT_SIZE = 'md';

/** Default variant when not provided. */
const DEFAULT_VARIANT = 'text';

/** Default number of rows. */
const DEFAULT_ROWS = 3;

/** Default animation type. */
const DEFAULT_ANIMATION = 'shimmer';

/**
 * Determines the border-radius class for a skeleton row.
 * @param {string} shape - 'square', 'rounded', or 'circle'.
 * @returns {string} Tailwind rounded class.
 */
function getSkeletonRadius(shape) {
  switch (shape) {
    case 'circle':
      return 'rounded-full';
    case 'square':
      return 'rounded-none';
    case 'rounded':
    default:
      return 'rounded-md';
  }
}

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ModalLoader – a skeleton loader with pulse or shimmer animations.
 *
 * @component
 * @example
 * <ModalLoader rows={4} type="text" variant="shimmer" />
 *
 * @example
 * <ModalLoader rows={[
 *   { type: 'image', height: 'h-48' },
 *   { type: 'heading' },
 *   { type: 'text', width: 'w-3/4' },
 *   { type: 'text' },
 * ]} />
 */
const ModalLoader = memo(
  forwardRef(function ModalLoader(
    {
      rows = DEFAULT_ROWS,
      type = DEFAULT_VARIANT,
      size = DEFAULT_SIZE,
      shape = 'rounded',
      animated = true,
      variant = DEFAULT_ANIMATION,
      disabled = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading content',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if animations should be active.
    const isAnimated = animated && !prefersReducedMotion && !disabled;

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Build the row definitions.
    const rowDefs = useMemo(() => {
      if (Array.isArray(rows)) {
        return rows;
      }
      const count = typeof rows === 'number' ? rows : DEFAULT_ROWS;
      return Array.from({ length: count }, () => ({ type }));
    }, [rows, type]);

    // Render a single skeleton row.
    const renderRow = (row, index) => {
      const rowType = row.type || 'text';
      const rowShape = row.shape || shape;
      const rowSize = row.size || size;

      // Determine height/width classes.
      const heightMap = SKELETON_HEIGHTS[rowType];
      const heightClass = row.height || (heightMap ? heightMap[rowSize] : '');
      const widthClass = row.width || (rowType === 'text' ? TEXT_WIDTHS[index % TEXT_WIDTHS.length] : 'w-full');

      // For avatar, use square dimensions; for others, width is full.
      const isAvatar = rowType === 'avatar';
      const sizeClasses = isAvatar
        ? heightClass
        : mergeClasses(heightClass, widthClass);

      const radiusClass = getSkeletonRadius(rowShape);

      // Base skeleton classes.
      const skeletonBase = mergeClasses(
        'bg-gray-200',
        radiusClass,
        sizeClasses,
        isAnimated && variant === 'pulse' && 'animate-pulse',
        row.className || '',
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
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
          <div className={skeletonBase} />
          {shimmerElement}
        </motion.div>
      );
    };

    // Container classes.
    const containerClasses = useMemo(() => {
      const base = mergeClasses(
        'flex flex-col w-full gap-4',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [disabled, className, responsiveClasses]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-live': 'polite',
        'aria-busy': true,
        'aria-label': ariaLabel,
        'aria-disabled': disabled || undefined,
      }),
      [role, ariaLabel, disabled],
    );

    return (
      <motion.div
        ref={ref}
        className={containerClasses}
        {...ariaProps}
        {...rest}
      >
        {rowDefs.map((row, index) => renderRow(row, index))}
      </motion.div>
    );
  }),
);

ModalLoader.displayName = 'ModalLoader';

ModalLoader.propTypes = {
  /**
   * Number of rows or an array of row definition objects.
   * Each row object can have: `type` (text, heading, image, avatar),
   * `height` (custom Tailwind height class), `width` (custom width class),
   * `shape` (square, rounded, circle), `className`.
   */
  rows: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(['text', 'heading', 'image', 'avatar']),
        height: PropTypes.string,
        width: PropTypes.string,
        shape: PropTypes.oneOf(['square', 'rounded', 'circle']),
        className: PropTypes.string,
      }),
    ),
  ]),
  /** Default row type when `rows` is a number. */
  type: PropTypes.oneOf(['text', 'heading', 'image', 'avatar']),
  /** Size preset – controls row heights and dimensions. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Default shape for rows. */
  shape: PropTypes.oneOf(['square', 'rounded', 'circle']),
  /** Whether to animate the skeletons. */
  animated: PropTypes.bool,
  /** Animation variant: 'shimmer' (sliding gradient) or 'pulse' (opacity pulse). */
  variant: PropTypes.oneOf(['shimmer', 'pulse']),
  /** Disables the loader (dim and remove animations). */
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

export default ModalLoader;