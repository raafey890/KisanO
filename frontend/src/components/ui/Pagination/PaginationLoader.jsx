/**
 * KisanO Design System — Pagination Package
 * PaginationLoader
 *
 * A skeleton loader for Pagination components. Renders placeholder content
 * with pulse or shimmer animations to indicate loading state.
 *
 * Single Responsibility: Render skeleton loading UI for pagination.
 * Does not manage pagination state or content.
 *
 * @module components/ui/Pagination/PaginationLoader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  PAGINATION_DEFAULTS,
  getPaginationSize,
} from './paginationVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './paginationUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Height presets for skeleton items. */
const SKELETON_HEIGHTS = {
  xs: 'h-6',
  sm: 'h-7',
  md: 'h-8',
  lg: 'h-9',
  xl: 'h-10',
};

/** Width presets for skeleton items. */
const ITEM_WIDTHS = {
  xs: 'w-6',
  sm: 'w-7',
  md: 'w-8',
  lg: 'w-9',
  xl: 'w-10',
};

/** Width presets for navigation buttons. */
const NAV_WIDTHS = {
  xs: 'w-12',
  sm: 'w-14',
  md: 'w-16',
  lg: 'w-18',
  xl: 'w-20',
};

/** Default number of items. */
const DEFAULT_ITEMS = 5;

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
 * PaginationLoader – a skeleton loader for pagination.
 *
 * @component
 * @example
 * <PaginationLoader size="md" variant="shimmer" items={5} />
 */
const PaginationLoader = memo(
  forwardRef(function PaginationLoader(
    {
      size = PAGINATION_DEFAULTS.size,
      variant = 'shimmer',
      animated = true,
      items = DEFAULT_ITEMS,
      showPrevNext = true,
      showFirstLast = true,
      disabled = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading pagination',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if animations should be active.
    const isAnimated = animated && !prefersReducedMotion && !disabled;

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getPaginationSize(size),
      [size],
    );

    // Get skeleton dimensions for the size.
    const itemWidth = useMemo(
      () => ITEM_WIDTHS[size] || ITEM_WIDTHS.md,
      [size],
    );

    const navWidth = useMemo(
      () => NAV_WIDTHS[size] || NAV_WIDTHS.md,
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

    // Render a single skeleton item.
    const renderItem = (index, width) => {
      const isNav = index === 0 || index === items + 1 || index === items + 2 || index === items + 3;

      return (
        <motion.div
          key={index}
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15, delay: index * 0.05 }}
        >
          <div
            className={mergeClasses(
              'bg-gray-200 dark:bg-gray-700 rounded-md',
              skeletonHeight,
              isNav ? navWidth : itemWidth,
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
              <div
                className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                style={{ borderRadius: 'inherit' }}
              />
            </motion.div>
          )}
        </motion.div>
      );
    };

    // Generate items.
    const itemsToRender = useMemo(() => {
      const result = [];

      // First page button.
      if (showFirstLast) {
        result.push(renderItem(result.length, navWidth));
      }

      // Previous button.
      if (showPrevNext) {
        result.push(renderItem(result.length, navWidth));
      }

      // Page numbers.
      const pageCount = Math.min(items, 7);
      for (let i = 0; i < pageCount; i++) {
        const width = i === Math.floor(pageCount / 2) ? itemWidth : itemWidth;
        result.push(renderItem(result.length, width));
      }

      // Next button.
      if (showPrevNext) {
        result.push(renderItem(result.length, navWidth));
      }

      // Last page button.
      if (showFirstLast) {
        result.push(renderItem(result.length, navWidth));
      }

      return result;
    }, [items, showPrevNext, showFirstLast, renderItem]);

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

PaginationLoader.displayName = 'PaginationLoader';

PaginationLoader.propTypes = {
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Animation variant: 'pulse' (opacity pulse) or 'shimmer' (sliding gradient). */
  variant: PropTypes.oneOf(['pulse', 'shimmer']),
  /** Whether to animate the skeleton. */
  animated: PropTypes.bool,
  /** Number of page items to show. */
  items: PropTypes.number,
  /** Whether to show previous/next buttons. */
  showPrevNext: PropTypes.bool,
  /** Whether to show first/last buttons. */
  showFirstLast: PropTypes.bool,
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

export default PaginationLoader;