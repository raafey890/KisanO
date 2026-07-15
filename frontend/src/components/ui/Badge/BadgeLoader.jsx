/**
 * KisanO Design System — Badge Package
 * BadgeLoader
 *
 * A skeleton loader for Badge components. Renders placeholder content
 * with pulse or shimmer animations to indicate loading state.
 *
 * Single Responsibility: Render skeleton loading UI for badges.
 * Does not manage badge state or content.
 *
 * @module components/ui/Badge/BadgeLoader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  BADGE_DEFAULTS,
  getBadgeSize,
} from './badgeVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './badgeUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Height presets for skeleton badges. */
const SKELETON_HEIGHTS = {
  xs: 'h-4',
  sm: 'h-5',
  md: 'h-6',
  lg: 'h-7',
  xl: 'h-8',
};

/** Width presets for skeleton badges. */
const SKELETON_WIDTHS = {
  xs: 'w-8',
  sm: 'w-10',
  md: 'w-12',
  lg: 'w-14',
  xl: 'w-16',
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
 * BadgeLoader – a skeleton loader for badges.
 *
 * @component
 * @example
 * <BadgeLoader size="md" variant="shimmer" />
 */
const BadgeLoader = memo(
  forwardRef(function BadgeLoader(
    {
      size = BADGE_DEFAULTS.size,
      variant = 'shimmer',
      animated = true,
      showIcon = false,
      disabled = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading badge',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if animations should be active.
    const isAnimated = animated && !prefersReducedMotion && !disabled;

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getBadgeSize(size),
      [size],
    );

    // Get skeleton dimensions for the size.
    const badgeHeight = useMemo(
      () => SKELETON_HEIGHTS[size] || SKELETON_HEIGHTS.md,
      [size],
    );

    const badgeWidth = useMemo(
      () => SKELETON_WIDTHS[size] || SKELETON_WIDTHS.md,
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
        'inline-flex items-center',
        sizeConfig.gap,
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [sizeConfig.gap, disabled, className, responsiveClasses]);

    // Icon skeleton.
    const iconSkeleton = useMemo(() => {
      if (!showIcon) return null;

      return (
        <div
          className={mergeClasses(
            'relative bg-gray-200 dark:bg-gray-700 rounded-full',
            sizeConfig.icon,
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
    }, [showIcon, sizeConfig.icon, isAnimated, variant]);

    // Badge skeleton.
    const badgeSkeleton = useMemo(() => {
      return (
        <div
          className={mergeClasses(
            'relative bg-gray-200 dark:bg-gray-700 rounded-md',
            badgeHeight,
            badgeWidth,
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
    }, [badgeHeight, badgeWidth, isAnimated, variant]);

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
      <motion.span
        ref={ref}
        className={containerClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {iconSkeleton}
        {badgeSkeleton}
      </motion.span>
    );
  }),
);

BadgeLoader.displayName = 'BadgeLoader';

BadgeLoader.propTypes = {
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Animation variant: 'pulse' (opacity pulse) or 'shimmer' (sliding gradient). */
  variant: PropTypes.oneOf(['pulse', 'shimmer']),
  /** Whether to animate the skeleton. */
  animated: PropTypes.bool,
  /** Whether to show icon placeholder. */
  showIcon: PropTypes.bool,
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

export default BadgeLoader;