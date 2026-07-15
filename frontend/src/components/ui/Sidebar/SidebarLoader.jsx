/**
 * KisanO Design System — Sidebar Package
 * SidebarLoader
 *
 * A skeleton loader for Sidebar components. Renders placeholder content
 * with pulse or shimmer animations to indicate loading state.
 *
 * Single Responsibility: Render skeleton loading UI for sidebars.
 * Does not manage sidebar state or content.
 *
 * @module components/ui/Sidebar/SidebarLoader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  SIDEBAR_DEFAULTS,
  getSidebarSize,
} from './sidebarVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './sidebarUtils';

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
const SKELETON_WIDTHS = {
  header: {
    xs: 'w-20',
    sm: 'w-24',
    md: 'w-28',
    lg: 'w-32',
    xl: 'w-36',
  },
  item: {
    xs: 'w-24',
    sm: 'w-28',
    md: 'w-32',
    lg: 'w-36',
    xl: 'w-40',
  },
  icon: {
    xs: 'h-4 w-4',
    sm: 'h-5 w-5',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-6 w-6',
  },
  avatar: {
    xs: 'h-6 w-6',
    sm: 'h-7 w-7',
    md: 'h-8 w-8',
    lg: 'h-9 w-9',
    xl: 'h-10 w-10',
  },
};

/** Default number of navigation items. */
const DEFAULT_ITEMS = 6;

/** Default number of groups. */
const DEFAULT_GROUPS = 2;

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
 * SidebarLoader – a skeleton loader for sidebars.
 *
 * @component
 * @example
 * <SidebarLoader size="md" variant="shimmer" items={6} />
 */
const SidebarLoader = memo(
  forwardRef(function SidebarLoader(
    {
      size = SIDEBAR_DEFAULTS.size,
      variant = 'shimmer',
      animated = true,
      items = DEFAULT_ITEMS,
      groups = DEFAULT_GROUPS,
      showHeader = true,
      showFooter = true,
      disabled = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading sidebar',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if animations should be active.
    const isAnimated = animated && !prefersReducedMotion && !disabled;

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getSidebarSize(size),
      [size],
    );

    // Get skeleton dimensions for the size.
    const headerWidth = useMemo(
      () => SKELETON_WIDTHS.header[size] || SKELETON_WIDTHS.header.md,
      [size],
    );

    const itemWidth = useMemo(
      () => SKELETON_WIDTHS.item[size] || SKELETON_WIDTHS.item.md,
      [size],
    );

    const iconSize = useMemo(
      () => SKELETON_WIDTHS.icon[size] || SKELETON_WIDTHS.icon.md,
      [size],
    );

    const avatarSize = useMemo(
      () => SKELETON_WIDTHS.avatar[size] || SKELETON_WIDTHS.avatar.md,
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
        'flex flex-col h-full',
        sizeConfig.padding,
        sizeConfig.gap,
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [sizeConfig.padding, sizeConfig.gap, disabled, className, responsiveClasses]);

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

    // Render header skeleton.
    const headerSkeleton = useMemo(() => {
      if (!showHeader) return null;
      return (
        <motion.div
          className="relative flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="flex items-center gap-2">
            <div
              className={mergeClasses(
                'bg-gray-200 dark:bg-gray-700 rounded-md',
                iconSize,
                isAnimated && variant === 'pulse' && 'animate-pulse',
              )}
            />
            <div
              className={mergeClasses(
                'bg-gray-200 dark:bg-gray-700 rounded-md',
                skeletonHeight,
                headerWidth,
                isAnimated && variant === 'pulse' && 'animate-pulse',
              )}
            />
          </div>
          <div
            className={mergeClasses(
              'bg-gray-200 dark:bg-gray-700 rounded-md',
              'h-4 w-4',
              isAnimated && variant === 'pulse' && 'animate-pulse',
            )}
          />
          {isAnimated && variant === 'shimmer' && (
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-inherit"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'ease-in-out' }}
            >
              <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </motion.div>
          )}
        </motion.div>
      );
    }, [showHeader, iconSize, skeletonHeight, headerWidth, isAnimated, variant]);

    // Render navigation items skeleton.
    const navItemsSkeleton = useMemo(() => {
      const totalItems = items + groups * 2; // Each group has 2 items
      const itemsToRender = Math.min(totalItems, 10);

      return Array.from({ length: itemsToRender }).map((_, index) => {
        const isGroup = index > 0 && index % 3 === 0;
        const isIcon = index % 2 === 0;

        return (
          <motion.div
            key={index}
            className="relative flex items-center gap-3"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15, delay: index * 0.03 }}
          >
            {isGroup && (
              <div
                className={mergeClasses(
                  'bg-gray-200 dark:bg-gray-700 rounded-md',
                  'h-3 w-16 ml-8',
                  isAnimated && variant === 'pulse' && 'animate-pulse',
                )}
              />
            )}
            <div
              className={mergeClasses(
                'bg-gray-200 dark:bg-gray-700 rounded-md',
                isIcon ? iconSize : skeletonHeight,
                isIcon ? 'rounded-full' : 'rounded-md',
                isIcon ? 'w-auto' : itemWidth,
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
                  delay: index * 0.03,
                }}
              >
                <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </motion.div>
            )}
          </motion.div>
        );
      });
    }, [items, groups, iconSize, skeletonHeight, itemWidth, isAnimated, variant]);

    // Render footer skeleton.
    const footerSkeleton = useMemo(() => {
      if (!showFooter) return null;
      return (
        <motion.div
          className="relative flex items-center justify-between pt-4 mt-auto border-t border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <div
              className={mergeClasses(
                'bg-gray-200 dark:bg-gray-700 rounded-full',
                avatarSize,
                isAnimated && variant === 'pulse' && 'animate-pulse',
              )}
            />
            <div className="flex flex-col gap-1">
              <div
                className={mergeClasses(
                  'bg-gray-200 dark:bg-gray-700 rounded-md',
                  skeletonHeight,
                  'w-16',
                  isAnimated && variant === 'pulse' && 'animate-pulse',
                )}
              />
              <div
                className={mergeClasses(
                  'bg-gray-200 dark:bg-gray-700 rounded-md',
                  'h-2',
                  'w-12',
                  isAnimated && variant === 'pulse' && 'animate-pulse',
                )}
              />
            </div>
          </div>
          <div
            className={mergeClasses(
              'bg-gray-200 dark:bg-gray-700 rounded-md',
              'h-4 w-4',
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
                delay: 0.2,
              }}
            >
              <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </motion.div>
          )}
        </motion.div>
      );
    }, [showFooter, avatarSize, skeletonHeight, isAnimated, variant]);

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

        {/* Navigation Items */}
        <div className="flex-1 flex flex-col gap-3 py-2 overflow-hidden">
          {navItemsSkeleton}
        </div>

        {/* Footer */}
        {footerSkeleton}

        {/* Global shimmer overlay */}
        {shimmerOverlay}
      </motion.div>
    );
  }),
);

SidebarLoader.displayName = 'SidebarLoader';

SidebarLoader.propTypes = {
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Animation variant: 'pulse' (opacity pulse) or 'shimmer' (sliding gradient). */
  variant: PropTypes.oneOf(['pulse', 'shimmer']),
  /** Whether to animate the skeleton. */
  animated: PropTypes.bool,
  /** Number of navigation items. */
  items: PropTypes.number,
  /** Number of groups. */
  groups: PropTypes.number,
  /** Whether to show header placeholder. */
  showHeader: PropTypes.bool,
  /** Whether to show footer placeholder. */
  showFooter: PropTypes.bool,
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

export default SidebarLoader;