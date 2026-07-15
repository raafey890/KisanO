/**
 * KisanO Design System — EmptyState Package
 * EmptyStateTitle
 *
 * The title component for empty states. Renders a heading with
 * proper typography, heading levels, and accessibility support.
 *
 * Single Responsibility: Render the empty state title.
 * Does not manage empty state or business logic.
 *
 * @module components/ui/EmptyState/EmptyStateTitle
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  EMPTYSTATE_DEFAULTS,
} from './emptyStateVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getEmptyStateTitleClasses,
} from './emptyStateUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for title animation. */
const TITLE_MOTION = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Heading level mapping. */
const HEADING_LEVELS = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

/** Default heading level when not provided. */
const DEFAULT_LEVEL = 2;

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * EmptyStateTitle – the title for empty states.
 *
 * @component
 * @example
 * <EmptyStateTitle>No Data Available</EmptyStateTitle>
 *
 * @example
 * <EmptyStateTitle level={1} variant="primary" size="lg">
 *   Empty Folder
 * </EmptyStateTitle>
 */
const EmptyStateTitle = memo(
  forwardRef(function EmptyStateTitle(
    {
      children,
      level = DEFAULT_LEVEL,
      variant = EMPTYSTATE_DEFAULTS.variant,
      size = EMPTYSTATE_DEFAULTS.size,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'heading',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Title classes.
    const titleClasses = useMemo(
      () =>
        getEmptyStateTitleClasses({
          variant,
          size,
          className,
          disabled,
          loading,
        }),
      [variant, size, className, disabled, loading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(titleClasses, responsiveClasses),
      [titleClasses, responsiveClasses],
    );

    // Heading element.
    const HeadingElement = useMemo(
      () => HEADING_LEVELS[level] || HEADING_LEVELS[DEFAULT_LEVEL],
      [level],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return TITLE_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || (typeof children === 'string' ? children : 'Empty state title'),
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
        'data-level': level,
      }),
      [role, ariaLabel, children, disabled, loading, level],
    );

    // If loading, render a loading placeholder.
    if (loading) {
      return (
        <motion.div
          ref={ref}
          className={finalClasses}
          {...motionProps}
          {...ariaProps}
          {...rest}
        >
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </motion.div>
      );
    }

    // If no children, render nothing.
    if (!children) {
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
        <HeadingElement className="m-0">{children}</HeadingElement>
      </motion.div>
    );
  }),
);

EmptyStateTitle.displayName = 'EmptyStateTitle';

EmptyStateTitle.propTypes = {
  /** Title content. */
  children: PropTypes.node,
  /** Heading level (1-6). */
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  /** Visual variant. */
  variant: PropTypes.oneOf([
    'default',
    'subtle',
    'glass',
    'primary',
    'success',
    'warning',
    'error',
  ]),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
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

export default EmptyStateTitle;