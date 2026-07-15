/**
 * KisanO Design System — Skeleton Package
 * SkeletonText
 *
 * A text skeleton loader component. Renders placeholder text lines
 * with variable widths, pulse or shimmer animations, and responsive support.
 *
 * Single Responsibility: Render text skeleton placeholders.
 * Does not manage skeleton state or business logic.
 *
 * @module components/ui/Skeleton/SkeletonText
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  SKELETON_DEFAULTS,
} from './skeletonVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getSkeletonTextClasses,
} from './skeletonUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for text animation. */
const TEXT_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Staggered animation variants for multiple lines. */
const STAGGER_MOTION = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.15, staggerChildren: 0.05 },
};

/** Width presets for text lines. */
const WIDTH_PRESETS = {
  full: 'w-full',
  '3/4': 'w-3/4',
  '2/3': 'w-2/3',
  '1/2': 'w-1/2',
  '1/3': 'w-1/3',
  '1/4': 'w-1/4',
  auto: 'w-auto',
};

/** Default lines when not provided. */
const DEFAULT_LINES = 1;

/** Default width when not provided. */
const DEFAULT_WIDTH = 'full';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SkeletonText – a text skeleton loader.
 *
 * @component
 * @example
 * <SkeletonText lines={3} />
 *
 * @example
 * <SkeletonText lines={2} width="3/4" variant="primary" animation="shimmer" />
 */
const SkeletonText = memo(
  forwardRef(function SkeletonText(
    {
      children,
      lines = DEFAULT_LINES,
      width = DEFAULT_WIDTH,
      size = SKELETON_DEFAULTS.size,
      variant = SKELETON_DEFAULTS.variant,
      radius = SKELETON_DEFAULTS.radius,
      animation = SKELETON_DEFAULTS.animation,
      spacing = 'gap-2',
      lastLineWidth = '3/4',
      disabled = false,
      loading = true,
      responsive,
      className = '',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if loading.
    const isLoading = loading && !disabled;

    // Get width class.
    const widthClass = useMemo(
      () => WIDTH_PRESETS[width] || WIDTH_PRESETS[DEFAULT_WIDTH],
      [width],
    );

    // Get last line width.
    const lastWidthClass = useMemo(
      () => WIDTH_PRESETS[lastLineWidth] || WIDTH_PRESETS['3/4'],
      [lastLineWidth],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Container classes.
    const containerClasses = useMemo(() => {
      const base = mergeClasses(
        'flex flex-col',
        spacing,
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [spacing, disabled, className, responsiveClasses]);

    // Generate line classes.
    const lineClasses = useMemo(() => {
      const base = getSkeletonTextClasses({
        size,
        variant,
        radius,
        animation,
        className: '',
        disabled,
        loading: isLoading,
      });

      const linesArray = [];
      for (let i = 0; i < lines; i++) {
        const isLast = i === lines - 1;
        const lineWidth = isLast ? lastWidthClass : widthClass;
        linesArray.push(
          mergeClasses(
            base,
            lineWidth,
            isLast && lastLineWidth !== width ? 'w-[var(--last-width)]' : '',
          ),
        );
      }
      return linesArray;
    }, [size, variant, radius, animation, disabled, isLoading, lines, widthClass, lastWidthClass]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return lines > 1 ? STAGGER_MOTION : TEXT_MOTION;
    }, [prefersReducedMotion, lines]);

    // If not loading, render nothing.
    if (!isLoading) {
      return null;
    }

    // Render children if provided.
    if (children) {
      return <span ref={ref} className={containerClasses}>{children}</span>;
    }

    // Render text lines.
    return (
      <div ref={ref} className={containerClasses} {...rest}>
        {lineClasses.map((lineClass, index) => (
          <motion.div
            key={index}
            className={lineClass}
            {...motionProps}
          />
        ))}
      </div>
    );
  }),
);

SkeletonText.displayName = 'SkeletonText';

SkeletonText.propTypes = {
  /** Custom children (overrides default rendering). */
  children: PropTypes.node,
  /** Number of text lines. */
  lines: PropTypes.number,
  /** Width of text lines. */
  width: PropTypes.oneOf(['full', '3/4', '2/3', '1/2', '1/3', '1/4', 'auto']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'light', 'dark', 'primary']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Animation type. */
  animation: PropTypes.oneOf(['pulse', 'shimmer', 'wave', 'none']),
  /** Spacing between lines. */
  spacing: PropTypes.string,
  /** Width of the last line. */
  lastLineWidth: PropTypes.oneOf(['full', '3/4', '2/3', '1/2', '1/3', '1/4', 'auto']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
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
};

export default SkeletonText;