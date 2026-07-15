/**
 * KisanO Design System — Accordion Package
 * AccordionLoader
 *
 * A skeleton loader for Accordion components. Renders placeholder content
 * with pulse or shimmer animations to indicate loading state.
 *
 * Single Responsibility: Render skeleton loading UI for accordions.
 * Does not manage accordion state or content.
 *
 * @module components/ui/Accordion/AccordionLoader
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  ACCORDION_DEFAULTS,
  getAccordionSize,
} from './accordionVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './accordionUtils';

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

/** Width presets for skeleton content. */
const CONTENT_WIDTHS = ['w-3/4', 'w-full', 'w-5/6', 'w-2/3', 'w-1/2'];

/** Default number of items. */
const DEFAULT_ITEMS = 3;

/** Default number of content rows per item. */
const DEFAULT_ROWS = 2;

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
 * AccordionLoader – a skeleton loader for accordions.
 *
 * @component
 * @example
 * <AccordionLoader size="md" variant="shimmer" items={3} rows={2} />
 */
const AccordionLoader = memo(
  forwardRef(function AccordionLoader(
    {
      size = ACCORDION_DEFAULTS.size,
      variant = 'shimmer',
      animated = true,
      items = DEFAULT_ITEMS,
      rows = DEFAULT_ROWS,
      disabled = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading accordion',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if animations should be active.
    const isAnimated = animated && !prefersReducedMotion && !disabled;

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getAccordionSize(size),
      [size],
    );

    // Get skeleton height for the size.
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

    // Render a single accordion item skeleton.
    const renderItem = (itemIndex) => {
      return (
        <motion.div
          key={itemIndex}
          className="relative flex flex-col border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: itemIndex * 0.05 }}
        >
          {/* Header skeleton */}
          <div
            className={mergeClasses(
              'flex items-center justify-between',
              sizeConfig.padding,
              'bg-gray-50 dark:bg-gray-800',
              isAnimated && variant === 'pulse' && 'animate-pulse',
            )}
          >
            <div
              className={mergeClasses(
                'bg-gray-200 dark:bg-gray-700 rounded-md',
                skeletonHeight,
                'w-32',
              )}
            />
            <div
              className={mergeClasses(
                'bg-gray-200 dark:bg-gray-700 rounded-md',
                'h-4 w-4',
              )}
            />
          </div>

          {/* Content skeleton */}
          <div
            className={mergeClasses(
              'flex flex-col gap-2',
              sizeConfig.padding,
              'bg-white dark:bg-gray-900',
              isAnimated && variant === 'pulse' && 'animate-pulse',
            )}
          >
            {Array.from({ length: rows }).map((_, rowIndex) => {
              const widthClass = CONTENT_WIDTHS[rowIndex % CONTENT_WIDTHS.length];
              return (
                <div
                  key={rowIndex}
                  className={mergeClasses(
                    'bg-gray-200 dark:bg-gray-700 rounded-md',
                    skeletonHeight,
                    widthClass,
                  )}
                />
              );
            })}
          </div>

          {/* Shimmer overlay for the entire item */}
          {isAnimated && variant === 'shimmer' && (
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'ease-in-out',
                delay: itemIndex * 0.1,
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
    const itemsToRender = useMemo(
      () => Array.from({ length: items }, (_, i) => renderItem(i)),
      [items, size, variant, isAnimated, rows, skeletonHeight, sizeConfig.padding],
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

AccordionLoader.displayName = 'AccordionLoader';

AccordionLoader.propTypes = {
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Animation variant: 'pulse' (opacity pulse) or 'shimmer' (sliding gradient). */
  variant: PropTypes.oneOf(['pulse', 'shimmer']),
  /** Whether to animate the skeleton. */
  animated: PropTypes.bool,
  /** Number of accordion items. */
  items: PropTypes.number,
  /** Number of content rows per item. */
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

export default AccordionLoader;