/**
 * KisanO Design System — Card Package
 * CardSkeleton
 *
 * A pure UI component that renders skeleton placeholders with pulse or shimmer
 * animations. It does not manage loading state — that is the responsibility
 * of CardLoader. This component is designed to be composed inside CardLoader
 * or used independently for fine‑grained skeleton rendering.
 *
 * Single Responsibility: Render skeleton placeholders.
 * It does not control loading visibility or manage state.
 *
 * @module components/ui/Card/CardSkeleton
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';


import {
  mergeClasses,
  resolveResponsiveClasses,
  getRadiusClasses
} from './cardUtils';

/* ---------------------------------- */
/* Component‑specific tokens          */
/* ---------------------------------- */

/** Base size dimensions for different skeleton variants. */
const SKELETON_SIZES = {
  text: {
    xs: { height: 'h-3', width: 'w-full' },
    sm: { height: 'h-3.5', width: 'w-full' },
    md: { height: 'h-4', width: 'w-full' },
    lg: { height: 'h-5', width: 'w-full' },
    xl: { height: 'h-6', width: 'w-full' },
  },
  heading: {
    xs: { height: 'h-4', width: 'w-3/4' },
    sm: { height: 'h-5', width: 'w-3/4' },
    md: { height: 'h-6', width: 'w-2/3' },
    lg: { height: 'h-7', width: 'w-2/3' },
    xl: { height: 'h-8', width: 'w-1/2' },
  },
  avatar: {
    xs: { height: 'h-8 w-8', width: '' },
    sm: { height: 'h-10 w-10', width: '' },
    md: { height: 'h-12 w-12', width: '' },
    lg: { height: 'h-14 w-14', width: '' },
    xl: { height: 'h-16 w-16', width: '' },
  },
  image: {
    xs: { height: 'h-20', width: 'w-full' },
    sm: { height: 'h-28', width: 'w-full' },
    md: { height: 'h-36', width: 'w-full' },
    lg: { height: 'h-44', width: 'w-full' },
    xl: { height: 'h-52', width: 'w-full' },
  },
  custom: {
    xs: { height: 'h-6', width: 'w-full' },
    sm: { height: 'h-8', width: 'w-full' },
    md: { height: 'h-10', width: 'w-full' },
    lg: { height: 'h-12', width: 'w-full' },
    xl: { height: 'h-14', width: 'w-full' },
  },
};

/** Default size when not provided. */
const DEFAULT_SIZE = 'md';

/** Default variant. */
const DEFAULT_VARIANT = 'text';

/** Default number of lines for text variant. */
const DEFAULT_LINES = 1;

/** Predefined widths for text lines (creates a realistic paragraph look). */
const TEXT_LINE_WIDTHS = ['w-3/4', 'w-full', 'w-5/6', 'w-2/3', 'w-1/2'];

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * CardSkeleton – a flexible skeleton placeholder.
 *
 * @component
 * @example
 * // Single text line with pulse
 * <CardSkeleton variant="text" size="md" animated />
 *
 * @example
 * // Three text lines with shimmer
 * <CardSkeleton variant="text" lines={3} animationType="shimmer" />
 *
 * @example
 * // Avatar skeleton
 * <CardSkeleton variant="avatar" shape="circle" size="lg" />
 */
const CardSkeleton = memo(
  forwardRef(function CardSkeleton(
    {
      variant = DEFAULT_VARIANT,
      size = DEFAULT_SIZE,
      shape = 'rounded',
      width,
      height,
      lines = DEFAULT_LINES,
      animated = true,
      animationType = 'shimmer',
     
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if animations should be active.
    const isAnimated = animated && !prefersReducedMotion;

    // Resolve size configuration.
    const variantSizes = SKELETON_SIZES[variant] || SKELETON_SIZES[DEFAULT_VARIANT];
    const sizeConfig = variantSizes[size] || variantSizes[DEFAULT_SIZE];

    // Build the base skeleton classes.
    const skeletonBase = useMemo(() => {
      const base = mergeClasses(
        'bg-gray-200',
        shape === 'circle' ? 'rounded-full' : getRadiusClasses(shape),
        width || sizeConfig.width,
        height || sizeConfig.height,
        isAnimated && animationType === 'pulse' && 'animate-pulse',
        className,
      );
      return base;
    }, [shape, width, height, sizeConfig, isAnimated, animationType, className]);

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const skeletonClasses = useMemo(
      () => mergeClasses(skeletonBase, responsiveClasses),
      [skeletonBase, responsiveClasses],
    );

    // For text variant, generate multiple lines with varying widths.
    const renderLines = useMemo(() => {
      if (variant !== 'text') return null;

      return Array.from({ length: lines }, (_, index) => {
        const lineWidth = TEXT_LINE_WIDTHS[index % TEXT_LINE_WIDTHS.length];
        const lineClasses = mergeClasses(
            'bg-gray-200',
            getRadiusClasses(shape),
            sizeConfig.height,
            lineWidth,
            className,

          
        );
        return (
          <motion.div
            key={index}
            className={lineClasses}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          />
        );
      });
    }, [variant, lines, skeletonClasses]);

    // For other variants, render a single block.
    const renderBlock = useMemo(() => {
      if (variant === 'text') return null;

      return (
        <motion.div
          className={skeletonClasses}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      );
    }, [variant, skeletonClasses]);

    // Shimmer overlay (if enabled).
    const shimmerElement = useMemo(() => {
      if (!isAnimated || animationType !== 'shimmer') return null;

      return (
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
      );
    }, [isAnimated, animationType]);

    // Accessibility.
    const ariaProps = {
      role,
      'aria-label': ariaLabel,
      'aria-busy': true,
      'aria-hidden': false,
    };

    return (
      <div
        ref={ref}
        className="relative inline-block"
        {...ariaProps}
        {...rest}
      >
        {variant === 'text' ? renderLines : renderBlock}
        {shimmerElement}
      </div>
    );
  }),
);

CardSkeleton.displayName = 'CardSkeleton';

CardSkeleton.propTypes = {
  /** Skeleton variant (affects default dimensions). */
  variant: PropTypes.oneOf(['text', 'heading', 'avatar', 'image', 'custom']),
  /** Size preset (xs, sm, md, lg, xl). */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Shape of the skeleton (affects border‑radius). */
  shape: PropTypes.oneOf(['square', 'rounded', 'circle']),
  /** Custom width (Tailwind class, e.g. 'w-32'). Overrides default. */
  width: PropTypes.string,
  /** Custom height (Tailwind class, e.g. 'h-20'). Overrides default. */
  height: PropTypes.string,
  /** Number of lines (only for text variant). */
  lines: PropTypes.number,
  /** Whether to animate the skeleton. */
  animated: PropTypes.bool,
  /** Animation type: 'pulse' (CSS pulse), 'shimmer' (sliding gradient), or 'none'. */
  animationType: PropTypes.oneOf(['pulse', 'shimmer', 'none']),
  /** Alias for shape='circle' (legacy). Prefer shape='circle'. */
  circle: PropTypes.bool,
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

export default CardSkeleton;