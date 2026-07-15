/**
 * KisanO Design System — Skeleton Package
 * SkeletonContainer
 *
 * The container component that wraps skeleton elements and handles layout,
 * responsiveness, and accessibility attributes.
 *
 * Single Responsibility: Render the skeleton container with layout and styling.
 * Does not manage skeleton state or business logic.
 *
 * @module components/ui/Skeleton/SkeletonContainer
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
  resolveDefaultProps,
  getSkeletonContainerClasses,
} from './skeletonUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for container animation. */
const CONTAINER_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Layout variants. */
const LAYOUT_MAP = {
  flex: 'flex',
  grid: 'grid',
  inline: 'inline-flex',
};

/** Orientation mapping. */
const ORIENTATION_MAP = {
  horizontal: 'flex-row',
  vertical: 'flex-col',
};

/** Grid columns mapping. */
const GRID_COLUMNS = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  8: 'grid-cols-8',
  12: 'grid-cols-12',
};

/** Default layout when not provided. */
const DEFAULT_LAYOUT = 'flex';

/** Default orientation when not provided. */
const DEFAULT_ORIENTATION = 'horizontal';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SkeletonContainer – the main skeleton wrapper with layout and styling.
 *
 * @component
 * @example
 * <SkeletonContainer>
 *   <SkeletonText />
 *   <SkeletonAvatar />
 * </SkeletonContainer>
 *
 * @example
 * <SkeletonContainer layout="grid" columns={3} gap="4">
 *   <SkeletonCard />
 *   <SkeletonCard />
 *   <SkeletonCard />
 * </SkeletonContainer>
 */
const SkeletonContainer = memo(
  forwardRef(function SkeletonContainer(
    {
      children,
      layout = DEFAULT_LAYOUT,
      orientation = DEFAULT_ORIENTATION,
      columns = 1,
      gap = 'gap-2',
      align = 'start',
      justify = 'start',
      wrap = false,
      disabled = false,
      loading = true,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Loading',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          disabled,
          loading,
        }),
      [disabled, loading],
    );

    // Layout classes.
    const layoutClass = useMemo(
      () => LAYOUT_MAP[layout] || LAYOUT_MAP[DEFAULT_LAYOUT],
      [layout],
    );

    // Orientation classes.
    const orientationClass = useMemo(() => {
      if (layout === 'grid') return '';
      return ORIENTATION_MAP[orientation] || ORIENTATION_MAP[DEFAULT_ORIENTATION];
    }, [layout, orientation]);

    // Grid columns class.
    const columnsClass = useMemo(() => {
      if (layout !== 'grid') return '';
      return GRID_COLUMNS[columns] || GRID_COLUMNS[1];
    }, [layout, columns]);

    // Alignment classes.
    const alignClass = useMemo(() => {
      const map = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
      };
      return map[align] || map.start;
    }, [align]);

    const justifyClass = useMemo(() => {
      const map = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      };
      return map[justify] || map.start;
    }, [justify]);

    // Wrap class.
    const wrapClass = wrap ? 'flex-wrap' : '';

    // Container classes.
    const containerClasses = useMemo(
      () =>
        getSkeletonContainerClasses({
          className,
          disabled: resolved.disabled,
          loading: resolved.loading,
          orientation,
        }),
      [className, resolved.disabled, resolved.loading, orientation],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () =>
        mergeClasses(
          containerClasses,
          layoutClass,
          orientationClass,
          columnsClass,
          gap,
          alignClass,
          justifyClass,
          wrapClass,
          responsiveClasses,
        ),
      [
        containerClasses,
        layoutClass,
        orientationClass,
        columnsClass,
        gap,
        alignClass,
        justifyClass,
        wrapClass,
        responsiveClasses,
      ],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return CONTAINER_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-busy': resolved.loading || undefined,
        'aria-disabled': resolved.disabled || undefined,
        'data-layout': layout,
        'data-orientation': orientation,
        'data-columns': columns,
      }),
      [role, ariaLabel, resolved.loading, resolved.disabled, layout, orientation, columns],
    );

    // If not loading, render nothing.
    if (!resolved.loading) {
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
        {children}
      </motion.div>
    );
  }),
);

SkeletonContainer.displayName = 'SkeletonContainer';

SkeletonContainer.propTypes = {
  /** Skeleton elements. */
  children: PropTypes.node,
  /** Layout type. */
  layout: PropTypes.oneOf(['flex', 'grid', 'inline']),
  /** Orientation for flex layouts. */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  /** Number of grid columns. */
  columns: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 8, 12]),
  /** Gap between elements. */
  gap: PropTypes.string,
  /** Alignment on cross axis. */
  align: PropTypes.oneOf(['start', 'center', 'end', 'stretch']),
  /** Alignment on main axis. */
  justify: PropTypes.oneOf(['start', 'center', 'end', 'between', 'around', 'evenly']),
  /** Whether to wrap elements. */
  wrap: PropTypes.bool,
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

export default SkeletonContainer;