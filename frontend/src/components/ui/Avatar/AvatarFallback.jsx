/**
 * KisanO Design System — Avatar Package
 * AvatarFallback
 *
 * The fallback component for avatars. Renders initials, default icon,
 * or custom fallback content when the avatar image is unavailable.
 *
 * Single Responsibility: Render fallback content for avatars.
 * Does not manage avatar state or business logic.
 *
 * @module components/ui/Avatar/AvatarFallback
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  AVATAR_DEFAULTS,
} from './avatarVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getAvatarFallbackClasses,
} from './avatarUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for fallback animation. */
const FALLBACK_MOTION = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * AvatarFallback – fallback content for avatars.
 *
 * @component
 * @example
 * <AvatarFallback>JD</AvatarFallback>
 *
 * @example
 * <AvatarFallback variant="primary">
 *   <UserIcon />
 * </AvatarFallback>
 */
const AvatarFallback = memo(
  forwardRef(function AvatarFallback(
    {
      children,
      variant = AVATAR_DEFAULTS.variant,
      size = AVATAR_DEFAULTS.size,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'presentation',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Fallback classes.
    const fallbackClasses = useMemo(
      () =>
        getAvatarFallbackClasses({
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
      () => mergeClasses(fallbackClasses, responsiveClasses),
      [fallbackClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return FALLBACK_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || 'Avatar fallback',
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
        </motion.span>
      );
    }

    // If no children, render default avatar icon.
    if (!children) {
      return (
        <motion.span
          ref={ref}
          className={finalClasses}
          {...motionProps}
          {...ariaProps}
          {...rest}
        >
          <svg
            className="w-1/2 h-1/2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </motion.span>
      );
    }

    // Render children (initials or custom content).
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

AvatarFallback.displayName = 'AvatarFallback';

AvatarFallback.propTypes = {
  /** Fallback content (initials, icon, etc.). */
  children: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'info',
    'gradient',
  ]),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
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

export default AvatarFallback;