/**
 * KisanO Design System — EmptyState Package
 * EmptyStateLoader
 *
 * A skeleton loader for EmptyState components. Renders placeholder content
 * with pulse or shimmer animations to indicate loading state.
 *
 * Single Responsibility: Render skeleton loading UI for empty states.
 * Does not manage empty state or business logic.
 *
 * @module components/ui/EmptyState/EmptyStateLoader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  EMPTYSTATE_DEFAULTS,
  getEmptyStateSize,
} from './emptyStateVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './emptyStateUtils';

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
};

/** Width presets for skeleton elements. */
const SKELETON_WIDTHS = {
  title: {
    xs: 'w-24',
    sm: 'w-32',
    md: 'w-40',
    lg: 'w-48',
    xl: 'w-56',
  },
  description: {
    xs: 'w-40',
    sm: 'w-48',
    md: 'w-56',
    lg: 'w-64',
    xl: 'w-72',
  },
  button: {
    xs: 'w-16',
    sm: 'w-20',
    md: 'w-24',
    lg: 'w-28',
    xl: 'w-32',
  },
};

/** Icon skeleton sizes. */
const ICON_SKELETON_SIZES = {
  xs: 'h-10 w-10',
  sm: 'h-12 w-12',
  md: 'h-16 w-16',
  lg: 'h-20 w-20',
  xl: 'h-24 w-24',
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
 * EmptyStateLoader – a skeleton loader for empty states.
 *
 * @component
 * @example
 * <EmptyStateLoader size="md" variant="shimmer" />
 */
const EmptyStateLoader = memo(
  forwardRef(function EmptyStateLoader(
    {
      size = EMPTYSTATE_DEFAULTS.size,
      variant = 'shimmer',
      animated = true,
      showAction = true,
      disabled = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading empty state',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if animations should be active.
    const isAnimated = animated && !prefersReducedMotion && !disabled;

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getEmptyStateSize(size),
      [size],
    );

    // Get skeleton dimensions for the size.
    const iconSize = useMemo(
      () => ICON_SKELETON_SIZES[size] || ICON_SKELETON_SIZES.md,
      [size],
    );

    const titleWidth = useMemo(
      () => SKELETON_WIDTHS.title[size] || SKELETON_WIDTHS.title.md,
      [size],
    );

    const descriptionWidth = useMemo(
      () => SKELETON_WIDTHS.description[size] || SKELETON_WIDTHS.description.md,
      [size],
    );

    const buttonWidth = useMemo(
      () => SKELETON_WIDTHS.button[size] || SKELETON_WIDTHS.button.md,
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
        'flex flex-col items-center w-full max-w-md mx-auto',
        sizeConfig.gap,
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [sizeConfig.gap, disabled, className, responsiveClasses]);

    // Shimmer overlay.
    const shimmerOverlay = isAnimated && variant === 'shimmer' ? (
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-inherit"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 1.8,
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

    // Icon skeleton.
    const iconSkeleton = useMemo(() => {
      return (
        <div
          className={mergeClasses(
            'relative bg-gray-200 dark:bg-gray-700 rounded-full shrink-0',
            iconSize,
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
    }, [iconSize, isAnimated, variant]);

    // Title skeleton.
    const titleSkeleton = useMemo(() => {
      return (
        <div
          className={mergeClasses(
            'relative bg-gray-200 dark:bg-gray-700 rounded-md',
            skeletonHeight,
            titleWidth,
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
    }, [skeletonHeight, titleWidth, isAnimated, variant]);

    // Description skeleton.
    const descriptionSkeleton = useMemo(() => {
      return (
        <div
          className={mergeClasses(
            'relative bg-gray-200 dark:bg-gray-700 rounded-md',
            skeletonHeight,
            descriptionWidth,
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
                delay: 0.2,
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
    }, [skeletonHeight, descriptionWidth, isAnimated, variant]);

    // Action skeleton.
    const actionSkeleton = useMemo(() => {
      if (!showAction) return null;

      return (
        <div className="flex items-center gap-3 mt-2">
          <div
            className={mergeClasses(
              'relative bg-gray-200 dark:bg-gray-700 rounded-md',
              skeletonHeight,
              buttonWidth,
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
                  delay: 0.3,
                }}
              >
                <div
                  className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  style={{ borderRadius: 'inherit' }}
                />
              </motion.div>
            )}
          </div>
        </div>
      );
    }, [showAction, skeletonHeight, buttonWidth, isAnimated, variant]);

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
        {/* Icon */}
        <div className="relative">
          {iconSkeleton}
          {shimmerOverlay}
        </div>

        {/* Title */}
        {titleSkeleton}

        {/* Description */}
        {descriptionSkeleton}

        {/* Action */}
        {actionSkeleton}
      </motion.div>
    );
  }),
);

EmptyStateLoader.displayName = 'EmptyStateLoader';

EmptyStateLoader.propTypes = {
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Animation variant: 'pulse' (opacity pulse) or 'shimmer' (sliding gradient). */
  variant: PropTypes.oneOf(['pulse', 'shimmer']),
  /** Whether to animate the skeleton. */
  animated: PropTypes.bool,
  /** Whether to show action button placeholder. */
  showAction: PropTypes.bool,
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

export default EmptyStateLoader;