/**
 * KisanO Design System — Pagination Package
 * PaginationEllipsis
 *
 * The ellipsis component for pagination. Renders a visual indicator
 * that there are more pages between the current range.
 *
 * Single Responsibility: Render a pagination ellipsis indicator.
 * Does not manage pagination state or business logic.
 *
 * @module components/ui/Pagination/PaginationEllipsis
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  PAGINATION_DEFAULTS,
} from './paginationVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getPaginationEllipsisClasses,
} from './paginationUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for ellipsis animation. */
const ELLIPSIS_MOTION = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Dot animation variants. */
const DOT_MOTION = {
  initial: { opacity: 0.3 },
  animate: { opacity: 1 },
  transition: { duration: 0.3, repeat: Infinity, repeatType: 'reverse' },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * PaginationEllipsis – an ellipsis indicator for pagination.
 *
 * @component
 * @example
 * <PaginationEllipsis />
 *
 * @example
 * <PaginationEllipsis size="sm" />
 */
const PaginationEllipsis = memo(
  forwardRef(function PaginationEllipsis(
    {
      size = PAGINATION_DEFAULTS.size,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'presentation',
      'aria-label': ariaLabel = 'More pages',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Ellipsis classes.
    const ellipsisClasses = useMemo(
      () =>
        getPaginationEllipsisClasses({
          size,
          className,
          disabled,
        }),
      [size, className, disabled],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(ellipsisClasses, responsiveClasses),
      [ellipsisClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return ELLIPSIS_MOTION;
    }, [prefersReducedMotion]);

    // Dot motion props.
    const dotMotionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return DOT_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-hidden': true,
        'data-disabled': disabled || undefined,
      }),
      [role, ariaLabel, disabled],
    );

    return (
      <motion.span
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        <span className="flex items-center gap-1">
          <motion.span className="h-1.5 w-1.5 rounded-full bg-current" {...dotMotionProps} />
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-current"
            {...dotMotionProps}
            transition={{ delay: 0.1 }}
          />
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-current"
            {...dotMotionProps}
            transition={{ delay: 0.2 }}
          />
        </span>
      </motion.span>
    );
  }),
);

PaginationEllipsis.displayName = 'PaginationEllipsis';

PaginationEllipsis.propTypes = {
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

export default PaginationEllipsis;