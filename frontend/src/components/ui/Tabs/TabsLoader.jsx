/**
 * KisanO Design System — Tabs Package
 * TabsLoader
 *
 * A skeleton loader for Tabs components. Renders placeholder content
 * with pulse or shimmer animations to indicate loading state.
 *
 * Single Responsibility: Render skeleton loading UI for tabs.
 * Does not manage tabs state or content.
 *
 * @module components/ui/Tabs/TabsLoader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  TABS_DEFAULTS,
  getTabsSize,
} from './tabsVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './tabsUtils';

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

/** Width presets for skeleton tabs. */
const TAB_WIDTHS = {
  xs: 'w-12',
  sm: 'w-14',
  md: 'w-16',
  lg: 'w-20',
  xl: 'w-24',
};

/** Default number of tabs. */
const DEFAULT_TABS = 4;

/** Default number of content rows. */
const DEFAULT_ROWS = 3;

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
 * TabsLoader – a skeleton loader for tabs.
 *
 * @component
 * @example
 * <TabsLoader size="md" variant="shimmer" tabs={4} rows={3} />
 */
const TabsLoader = memo(
  forwardRef(function TabsLoader(
    {
      size = TABS_DEFAULTS.size,
      variant = 'shimmer',
      animated = true,
      tabs = DEFAULT_TABS,
      rows = DEFAULT_ROWS,
      disabled = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading tabs',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if animations should be active.
    const isAnimated = animated && !prefersReducedMotion && !disabled;

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getTabsSize(size),
      [size],
    );

    // Get skeleton dimensions for the size.
    const tabWidth = useMemo(
      () => TAB_WIDTHS[size] || TAB_WIDTHS.md,
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
        'flex flex-col w-full',
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

    // Render tabs skeleton.
    const tabsSkeleton = useMemo(() => {
      return (
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
          {Array.from({ length: tabs }).map((_, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15, delay: index * 0.05 }}
            >
              <div
                className={mergeClasses(
                  'bg-gray-200 dark:bg-gray-700 rounded-md',
                  skeletonHeight,
                  tabWidth,
                  isAnimated && variant === 'pulse' && 'animate-pulse',
                )}
              />
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
                  <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      );
    }, [tabs, skeletonHeight, tabWidth, isAnimated, variant]);

    // Render content skeleton.
    const contentSkeleton = useMemo(() => {
      return (
        <div className="flex flex-col gap-3 pt-2">
          {Array.from({ length: rows }).map((_, index) => {
            const widthClass = index % 3 === 0 ? 'w-3/4' : index % 3 === 1 ? 'w-full' : 'w-5/6';
            return (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: index * 0.05 + 0.1 }}
              >
                <div
                  className={mergeClasses(
                    'bg-gray-200 dark:bg-gray-700 rounded-md',
                    skeletonHeight,
                    widthClass,
                    isAnimated && variant === 'pulse' && 'animate-pulse',
                  )}
                />
                {isAnimated && variant === 'shimmer' && (
                  <motion.div
                    className="absolute inset-0 overflow-hidden rounded-inherit"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'ease-in-out',
                      delay: index * 0.05 + 0.1,
                    }}
                  >
                    <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      );
    }, [rows, skeletonHeight, isAnimated, variant]);

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
        {/* Tabs Skeleton */}
        <div className="relative">
          {tabsSkeleton}
          {shimmerOverlay}
        </div>

        {/* Content Skeleton */}
        <div className="relative">
          {contentSkeleton}
        </div>
      </motion.div>
    );
  }),
);

TabsLoader.displayName = 'TabsLoader';

TabsLoader.propTypes = {
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Animation variant: 'pulse' (opacity pulse) or 'shimmer' (sliding gradient). */
  variant: PropTypes.oneOf(['pulse', 'shimmer']),
  /** Whether to animate the skeleton. */
  animated: PropTypes.bool,
  /** Number of tabs. */
  tabs: PropTypes.number,
  /** Number of content rows. */
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

export default TabsLoader;