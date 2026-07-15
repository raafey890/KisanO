/**
 * KisanO Design System — Breadcrumb Package
 * BreadcrumbLoader
 *
 * A skeleton loader for Breadcrumb components. Renders placeholder content
 * with pulse or shimmer animations to indicate loading state.
 *
 * Single Responsibility: Render skeleton loading UI for breadcrumbs.
 * Does not manage breadcrumb state or content.
 *
 * @module components/ui/Breadcrumb/BreadcrumbLoader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  BREADCRUMB_DEFAULTS,
  getBreadcrumbSize,
} from './breadcrumbVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './breadcrumbUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Height presets for skeleton items. */
const SKELETON_HEIGHTS = {
  xs: 'h-3',
  sm: 'h-3.5',
  md: 'h-4',
  lg: 'h-5',
  xl: 'h-6',
};

/** Width presets for skeleton items. */
const ITEM_WIDTHS = {
  xs: 'w-8',
  sm: 'w-10',
  md: 'w-12',
  lg: 'w-14',
  xl: 'w-16',
};

/** Default number of items. */
const DEFAULT_ITEMS = 3;

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
 * BreadcrumbLoader – a skeleton loader for breadcrumbs.
 *
 * @component
 * @example
 * <BreadcrumbLoader size="md" variant="shimmer" items={4} />
 */
const BreadcrumbLoader = memo(
  forwardRef(function BreadcrumbLoader(
    {
      size = BREADCRUMB_DEFAULTS.size,
      variant = 'shimmer',
      animated = true,
      items = DEFAULT_ITEMS,
      disabled = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading breadcrumb',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if animations should be active.
    const isAnimated = animated && !prefersReducedMotion && !disabled;

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getBreadcrumbSize(size),
      [size],
    );

    // Get skeleton dimensions for the size.
    const itemWidth = useMemo(
      () => ITEM_WIDTHS[size] || ITEM_WIDTHS.md,
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
        'flex flex-wrap items-center',
        sizeConfig.gap,
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [sizeConfig.gap, disabled, className, responsiveClasses]);

    // Render a single breadcrumb skeleton item.
    const renderItem = (index) => {
      const isLast = index === items - 1;

      return (
        <motion.div
          key={index}
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15, delay: index * 0.05 }}
        >
          {/* Breadcrumb item skeleton */}
          <div
            className={mergeClasses(
              'relative bg-gray-200 dark:bg-gray-700 rounded-md',
              skeletonHeight,
              itemWidth,
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

          {/* Separator skeleton (except for last item) */}
          {!isLast && (
            <div
              className={mergeClasses(
                'relative bg-gray-200 dark:bg-gray-700 rounded-full',
                'h-1 w-1',
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
                    delay: index * 0.05 + 0.1,
                  }}
                >
                  <div
                    className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    style={{ borderRadius: 'inherit' }}
                  />
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      );
    };

    // Generate items.
    const itemsToRender = useMemo(
      () => Array.from({ length: items }, (_, i) => renderItem(i)),
      [items, size, variant, isAnimated, itemWidth, skeletonHeight],
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
        {itemsToRender}
      </motion.div>
    );
  }),
);

BreadcrumbLoader.displayName = 'BreadcrumbLoader';

BreadcrumbLoader.propTypes = {
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Animation variant: 'pulse' (opacity pulse) or 'shimmer' (sliding gradient). */
  variant: PropTypes.oneOf(['pulse', 'shimmer']),
  /** Whether to animate the skeleton. */
  animated: PropTypes.bool,
  /** Number of breadcrumb items. */
  items: PropTypes.number,
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

export default BreadcrumbLoader;