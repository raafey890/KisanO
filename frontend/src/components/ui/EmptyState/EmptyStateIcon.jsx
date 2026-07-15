/**
 * KisanO Design System — EmptyState Package
 * EmptyStateIcon
 *
 * The icon component for empty states. Renders SVG icons or custom
 * icon elements with proper sizing and accessibility support.
 *
 * Single Responsibility: Render the empty state icon.
 * Does not manage empty state or business logic.
 *
 * @module components/ui/EmptyState/EmptyStateIcon
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
  getEmptyStateIconClasses,
} from './emptyStateUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for icon animation. */
const ICON_MOTION = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * EmptyStateIcon – an icon for empty states.
 *
 * @component
 * @example
 * <EmptyStateIcon>
 *   <CustomIcon />
 * </EmptyStateIcon>
 *
 * @example
 * <EmptyStateIcon variant="primary" size="lg">
 *   <svg>...</svg>
 * </EmptyStateIcon>
 */
const EmptyStateIcon = memo(
  forwardRef(function EmptyStateIcon(
    {
      children,
      variant = EMPTYSTATE_DEFAULTS.variant,
      size = EMPTYSTATE_DEFAULTS.size,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'img',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Icon classes.
    const iconClasses = useMemo(
      () =>
        getEmptyStateIconClasses({
          variant,
          size,
          className,
          disabled,
        }),
      [variant, size, className, disabled],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(iconClasses, responsiveClasses),
      [iconClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return ICON_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || 'Empty state icon',
        'aria-hidden': !ariaLabel,
        'data-disabled': disabled || undefined,
      }),
      [role, ariaLabel, disabled],
    );

    // If loading, render a spinner.
    if (loading) {
      return (
        <motion.div
          ref={ref}
          className={finalClasses}
          {...motionProps}
          {...ariaProps}
          {...rest}
        >
          <svg
            className="animate-spin w-1/2 h-1/2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
          </svg>
        </motion.div>
      );
    }

    // If no children, render default empty state icon.
    if (!children) {
      return (
        <motion.div
          ref={ref}
          className={finalClasses}
          {...motionProps}
          {...ariaProps}
          {...rest}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="15" />
          </svg>
        </motion.div>
      );
    }

    // Render children.
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

EmptyStateIcon.displayName = 'EmptyStateIcon';

EmptyStateIcon.propTypes = {
  /** Icon element (SVG or custom). */
  children: PropTypes.node,
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

export default EmptyStateIcon;