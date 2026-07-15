/**
 * KisanO Design System — Skeleton Package
 * SkeletonLoader
 *
 * A generic skeleton loader component that can be used as a fallback
 * for any loading state. Renders a placeholder with pulse or shimmer
 * animations.
 *
 * Single Responsibility: Render a generic skeleton loader.
 * Does not manage skeleton state or business logic.
 *
 * @module components/ui/Skeleton/SkeletonLoader
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
  getSkeletonClasses,
} from './skeletonUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for loader animation. */
const LOADER_MOTION = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Default width when not provided. */
const DEFAULT_WIDTH = 'w-full';

/** Default height when not provided. */
const DEFAULT_HEIGHT = 'h-10';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SkeletonLoader – a generic skeleton loader.
 *
 * @component
 * @example
 * <SkeletonLoader />
 *
 * @example
 * <SkeletonLoader width="w-48" height="h-12" variant="primary" animation="shimmer" />
 */
const SkeletonLoader = memo(
  forwardRef(function SkeletonLoader(
    {
      width = DEFAULT_WIDTH,
      height = DEFAULT_HEIGHT,
      size = SKELETON_DEFAULTS.size,
      variant = SKELETON_DEFAULTS.variant,
      radius = SKELETON_DEFAULTS.radius,
      animation = SKELETON_DEFAULTS.animation,
      circular = false,
      disabled = false,
      loading = true,
      responsive,
      className = '',
      role = 'progressbar',
      'aria-label': ariaLabel = 'Loading',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if loading.
    const isLoading = loading && !disabled;

    // Skeleton classes.
    const skeletonClasses = useMemo(
      () =>
        getSkeletonClasses({
          variant,
          size,
          radius,
          animation,
          className,
          disabled,
          loading: isLoading,
          circular,
        }),
      [variant, size, radius, animation, className, disabled, isLoading, circular],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Combine width and height with skeleton classes.
    const finalClasses = useMemo(
      () => mergeClasses(skeletonClasses, width, height, responsiveClasses, circular ? 'aspect-square' : ''),
      [skeletonClasses, width, height, responsiveClasses, circular],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return LOADER_MOTION;
    }, [prefersReducedMotion]);

    // Shimmer overlay.
    const shimmerOverlay = isLoading && animation === 'shimmer' ? (
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

    // Pulse overlay.
    const pulseOverlay = isLoading && animation === 'pulse' ? (
      <motion.div
        className="absolute inset-0 rounded-inherit"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'ease-in-out',
        }}
      />
    ) : null;

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-busy': isLoading || undefined,
        'aria-disabled': disabled || undefined,
        'aria-valuenow': undefined,
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'data-size': size,
        'data-variant': variant,
        'data-animation': animation,
        'data-circular': circular || undefined,
      }),
      [role, ariaLabel, isLoading, disabled, size, variant, animation, circular],
    );

    // If not loading, render nothing.
    if (!isLoading) {
      return null;
    }

    return (
      <motion.div
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {pulseOverlay}
        {shimmerOverlay}
      </motion.div>
    );
  }),
);

SkeletonLoader.displayName = 'SkeletonLoader';

SkeletonLoader.propTypes = {
  /** Custom width class. */
  width: PropTypes.string,
  /** Custom height class. */
  height: PropTypes.string,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'light', 'dark', 'primary']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Animation type. */
  animation: PropTypes.oneOf(['pulse', 'shimmer', 'wave', 'none']),
  /** Whether skeleton is circular. */
  circular: PropTypes.bool,
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
  /** ARIA role. */
  role: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default SkeletonLoader;