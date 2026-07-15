/**
 * KisanO Design System — Navbar Package
 * NavbarLoader
 *
 * A skeleton loader for Navbar components. Renders placeholder content
 * with pulse or shimmer animations to indicate loading state.
 *
 * Single Responsibility: Render skeleton loading UI for navbars.
 * Does not manage navbar state or content.
 *
 * @module components/ui/Navbar/NavbarLoader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  NAVBAR_DEFAULTS,
  getNavbarSize,
} from './navbarVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './navbarUtils';

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
  brand: {
    xs: 'w-16',
    sm: 'w-20',
    md: 'w-24',
    lg: 'w-28',
    xl: 'w-32',
  },
  item: {
    xs: 'w-10',
    sm: 'w-12',
    md: 'w-14',
    lg: 'w-16',
    xl: 'w-18',
  },
  search: {
    xs: 'w-20',
    sm: 'w-24',
    md: 'w-32',
    lg: 'w-40',
    xl: 'w-48',
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
const DEFAULT_ITEMS = 4;

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
 * NavbarLoader – a skeleton loader for navbars.
 *
 * @component
 * @example
 * <NavbarLoader size="md" variant="shimmer" items={4} />
 */
const NavbarLoader = memo(
  forwardRef(function NavbarLoader(
    {
      size = NAVBAR_DEFAULTS.size,
      variant = 'shimmer',
      animated = true,
      items = DEFAULT_ITEMS,
      showSearch = true,
      showAvatar = true,
      disabled = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading navigation',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if animations should be active.
    const isAnimated = animated && !prefersReducedMotion && !disabled;

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getNavbarSize(size),
      [size],
    );

    // Get skeleton dimensions for the size.
    const brandWidth = useMemo(
      () => SKELETON_WIDTHS.brand[size] || SKELETON_WIDTHS.brand.md,
      [size],
    );

    const itemWidth = useMemo(
      () => SKELETON_WIDTHS.item[size] || SKELETON_WIDTHS.item.md,
      [size],
    );

    const searchWidth = useMemo(
      () => SKELETON_WIDTHS.search[size] || SKELETON_WIDTHS.search.md,
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
        'flex items-center w-full',
        sizeConfig.height,
        sizeConfig.padding,
        sizeConfig.gap,
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [sizeConfig.height, sizeConfig.padding, sizeConfig.gap, disabled, className, responsiveClasses]);

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

    // Render brand skeleton.
    const brandSkeleton = useMemo(
      () => (
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className={mergeClasses(
              'bg-gray-200 dark:bg-gray-700 rounded-md',
              skeletonHeight,
              brandWidth,
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
      ),
      [skeletonHeight, brandWidth, isAnimated, variant],
    );

    // Render navigation items skeleton.
    const navItemsSkeleton = useMemo(() => {
      return Array.from({ length: items }).map((_, index) => (
        <motion.div
          key={index}
          className="relative"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: index * 0.05 }}
        >
          <div
            className={mergeClasses(
              'bg-gray-200 dark:bg-gray-700 rounded-md',
              skeletonHeight,
              itemWidth,
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
      ));
    }, [items, skeletonHeight, itemWidth, isAnimated, variant]);

    // Render search skeleton.
    const searchSkeleton = useMemo(
      () => (
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15, delay: 0.2 }}
        >
          <div
            className={mergeClasses(
              'bg-gray-200 dark:bg-gray-700 rounded-md',
              skeletonHeight,
              searchWidth,
              isAnimated && variant === 'pulse' && 'animate-pulse',
            )}
          />
          {isAnimated && variant === 'shimmer' && (
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-inherit"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'ease-in-out', delay: 0.2 }}
            >
              <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </motion.div>
          )}
        </motion.div>
      ),
      [skeletonHeight, searchWidth, isAnimated, variant],
    );

    // Render avatar skeleton.
    const avatarSkeleton = useMemo(
      () => (
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15, delay: 0.3 }}
        >
          <div
            className={mergeClasses(
              'bg-gray-200 dark:bg-gray-700 rounded-full',
              avatarSize,
              isAnimated && variant === 'pulse' && 'animate-pulse',
            )}
          />
          {isAnimated && variant === 'shimmer' && (
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-inherit"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'ease-in-out', delay: 0.3 }}
            >
              <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </motion.div>
          )}
        </motion.div>
      ),
      [avatarSize, isAnimated, variant],
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
        {/* Brand */}
        {brandSkeleton}

        {/* Navigation Items */}
        <div className="hidden sm:flex items-center gap-4">
          {navItemsSkeleton}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
          {showSearch && searchSkeleton}
          {showAvatar && avatarSkeleton}
        </div>

        {/* Mobile toggle skeleton */}
        <div className="flex sm:hidden items-center">
          <div
            className={mergeClasses(
              'bg-gray-200 dark:bg-gray-700 rounded-md',
              'h-6 w-6',
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
        </div>

        {/* Global shimmer overlay */}
        {shimmerOverlay}
      </motion.div>
    );
  }),
);

NavbarLoader.displayName = 'NavbarLoader';

NavbarLoader.propTypes = {
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Animation variant: 'pulse' (opacity pulse) or 'shimmer' (sliding gradient). */
  variant: PropTypes.oneOf(['pulse', 'shimmer']),
  /** Whether to animate the skeleton. */
  animated: PropTypes.bool,
  /** Number of navigation items. */
  items: PropTypes.number,
  /** Whether to show search placeholder. */
  showSearch: PropTypes.bool,
  /** Whether to show avatar placeholder. */
  showAvatar: PropTypes.bool,
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

export default NavbarLoader;