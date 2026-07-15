/**
 * KisanO Design System — Badge Package
 * BadgeIcon
 *
 * The icon component for badges. Renders an icon with proper sizing
 * and accessibility support.
 *
 * Single Responsibility: Render an icon inside a badge.
 * Does not manage badge state or business logic.
 *
 * @module components/ui/Badge/BadgeIcon
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  BADGE_DEFAULTS,
} from './badgeVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getBadgeIconClasses,
} from './badgeUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for icon animation. */
const ICON_MOTION = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * BadgeIcon – an icon for badges.
 *
 * @component
 * @example
 * <BadgeIcon>
 *   <CheckIcon />
 * </BadgeIcon>
 */
const BadgeIcon = memo(
  forwardRef(function BadgeIcon(
    {
      children,
      size = BADGE_DEFAULTS.size,
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
        getBadgeIconClasses({
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
        'aria-label': ariaLabel || 'Badge icon',
        'aria-hidden': !ariaLabel,
        'data-disabled': disabled || undefined,
      }),
      [role, ariaLabel, disabled],
    );

    // If loading, render a spinner.
    if (loading) {
      return (
        <motion.span
          ref={ref}
          className={finalClasses}
          {...motionProps}
          {...ariaProps}
          {...rest}
        >
          <svg
            className="animate-spin"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
          </svg>
        </motion.span>
      );
    }

    // If no children, render nothing.
    if (!children) {
      return null;
    }

    return (
      <motion.span
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {children}
      </motion.span>
    );
  }),
);

BadgeIcon.displayName = 'BadgeIcon';

BadgeIcon.propTypes = {
  /** Icon element. */
  children: PropTypes.node,
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

export default BadgeIcon;