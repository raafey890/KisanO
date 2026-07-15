/**
 * KisanO Design System — Showcase Package
 * ShowcaseLoader
 *
 * A skeleton loader for the Component Showcase. Renders placeholder content
 * with pulse or shimmer animations to indicate loading state.
 *
 * Single Responsibility: Render skeleton loading UI for the showcase.
 * Does not manage showcase state or business logic.
 *
 * @module components/ui/Showcase/ShowcaseLoader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  SHOWCASE_DEFAULTS,
  getShowcaseSize,
} from './showcaseVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './showcaseUtils';

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
  full: 'h-6',
};

/** Card skeleton dimensions. */
const CARD_SKELETON_DIMENSIONS = {
  xs: 'h-24',
  sm: 'h-28',
  md: 'h-32',
  lg: 'h-36',
  xl: 'h-40',
  full: 'h-40',
};

/** Number of skeleton cards per row. */
const CARDS_PER_ROW = 8;

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
 * ShowcaseLoader – a skeleton loader for the component showcase.
 *
 * @component
 * @example
 * <ShowcaseLoader size="md" variant="shimmer" />
 */
const ShowcaseLoader = memo(
  forwardRef(function ShowcaseLoader(
    {
      size = SHOWCASE_DEFAULTS.size,
      variant = 'shimmer',
      animated = true,
      showSidebar = true,
      cards = CARDS_PER_ROW,
      disabled = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading showcase',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if animations should be active.
    const isAnimated = animated && !prefersReducedMotion && !disabled;

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getShowcaseSize(size),
      [size],
    );

    // Get skeleton dimensions for the size.
    const skeletonHeight = useMemo(
      () => SKELETON_HEIGHTS[size] || SKELETON_HEIGHTS.md,
      [size],
    );

    const cardHeight = useMemo(
      () => CARD_SKELETON_DIMENSIONS[size] || CARD_SKELETON_DIMENSIONS.md,
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
        'flex flex-col w-full',
        sizeConfig.gap,
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [sizeConfig.gap, disabled, className, responsiveClasses]);

    // Header skeleton.
    const headerSkeleton = useMemo(() => {
      return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div
              className={mergeClasses(
                'relative bg-gray-200 dark:bg-gray-700 rounded-md',
                skeletonHeight,
                'w-48 sm:w-64',
                isAnimated && variant === 'pulse' && 'animate-pulse',
              )}
            >
              {isAnimated && variant === 'shimmer' && (
                <motion.div
                  className="absolute inset-0 overflow-hidden rounded-inherit"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'ease-in-out' }}
                >
                  <div
                    className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    style={{ borderRadius: 'inherit' }}
                  />
                </motion.div>
              )}
            </div>
            <div
              className={mergeClasses(
                'relative bg-gray-200 dark:bg-gray-700 rounded-md mt-2',
                skeletonHeight,
                'w-32 sm:w-48',
                isAnimated && variant === 'pulse' && 'animate-pulse',
              )}
            >
              {isAnimated && variant === 'shimmer' && (
                <motion.div
                  className="absolute inset-0 overflow-hidden rounded-inherit"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'ease-in-out', delay: 0.1 }}
                >
                  <div
                    className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    style={{ borderRadius: 'inherit' }}
                  />
                </motion.div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={mergeClasses(
                'relative bg-gray-200 dark:bg-gray-700 rounded-lg',
                'h-10 w-10',
                isAnimated && variant === 'pulse' && 'animate-pulse',
              )}
            />
            <div
              className={mergeClasses(
                'relative bg-gray-200 dark:bg-gray-700 rounded-lg',
                'h-10 w-10',
                isAnimated && variant === 'pulse' && 'animate-pulse',
              )}
            />
          </div>
        </div>
      );
    }, [skeletonHeight, isAnimated, variant]);

    // Sidebar skeleton.
    const sidebarSkeleton = useMemo(() => {
      if (!showSidebar) return null;

      const items = 5;
      return (
        <div className="w-full lg:w-48 shrink-0">
          <div className="flex flex-col gap-2">
            {Array.from({ length: items }).map((_, index) => (
              <div
                key={index}
                className={mergeClasses(
                  'relative bg-gray-200 dark:bg-gray-700 rounded-lg',
                  'h-10 w-full',
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
                      delay: index * 0.05,
                    }}
                  >
                    <div
                      className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      style={{ borderRadius: 'inherit' }}
                    />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }, [showSidebar, isAnimated, variant]);

    // Cards skeleton.
    const cardsSkeleton = useMemo(() => {
      const cardsToRender = cards > 0 ? cards : CARDS_PER_ROW;
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: cardsToRender }).map((_, index) => (
            <div
              key={index}
              className={mergeClasses(
                'relative bg-gray-200 dark:bg-gray-700 rounded-lg',
                cardHeight,
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
                    delay: index * 0.03,
                  }}
                >
                  <div
                    className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    style={{ borderRadius: 'inherit' }}
                  />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      );
    }, [cards, cardHeight, isAnimated, variant]);

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
        {/* Header */}
        {headerSkeleton}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          {sidebarSkeleton}

          {/* Cards */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-6">
              {/* Section Title */}
              <div
                className={mergeClasses(
                  'relative bg-gray-200 dark:bg-gray-700 rounded-md',
                  skeletonHeight,
                  'w-32',
                  isAnimated && variant === 'pulse' && 'animate-pulse',
                )}
              />

              {/* Cards Grid */}
              {cardsSkeleton}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }),
);

ShowcaseLoader.displayName = 'ShowcaseLoader';

ShowcaseLoader.propTypes = {
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full']),
  /** Animation variant: 'pulse' (opacity pulse) or 'shimmer' (sliding gradient). */
  variant: PropTypes.oneOf(['pulse', 'shimmer']),
  /** Whether to animate the skeleton. */
  animated: PropTypes.bool,
  /** Whether to show sidebar placeholder. */
  showSidebar: PropTypes.bool,
  /** Number of skeleton cards to show. */
  cards: PropTypes.number,
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

export default ShowcaseLoader;