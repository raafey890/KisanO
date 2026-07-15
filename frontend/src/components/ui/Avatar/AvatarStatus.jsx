/**
 * KisanO Design System — Avatar Package
 * AvatarStatus
 *
 * The status indicator component for avatars. Renders a small dot
 * with colors for online, offline, busy, away, and other statuses.
 *
 * Single Responsibility: Render the avatar status indicator.
 * Does not manage avatar state or business logic.
 *
 * @module components/ui/Avatar/AvatarStatus
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
  getAvatarStatusClasses,
} from './avatarUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for status animation. */
const STATUS_MOTION = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Pulse animation for active status. */
const PULSE_MOTION = {
  initial: { opacity: 0.5, scale: 1 },
  animate: { opacity: 1, scale: 1.1 },
  transition: { duration: 1, repeat: Infinity, repeatType: 'reverse' },
};

/** Status label mapping. */
const STATUS_LABELS = {
  online: 'Online',
  offline: 'Offline',
  away: 'Away',
  busy: 'Busy',
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * AvatarStatus – status indicator for avatars.
 *
 * @component
 * @example
 * <AvatarStatus status="online" />
 *
 * @example
 * <AvatarStatus status="busy" animated size="lg" />
 */
const AvatarStatus = memo(
  forwardRef(function AvatarStatus(
    {
      status = AVATAR_DEFAULTS.status,
      size = AVATAR_DEFAULTS.size,
      animated = false,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Status classes.
    const statusClasses = useMemo(
      () =>
        getAvatarStatusClasses({
          status,
          size,
          className,
          disabled,
          animated: animated && !prefersReducedMotion,
        }),
      [status, size, className, disabled, animated, prefersReducedMotion],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(statusClasses, responsiveClasses),
      [statusClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return STATUS_MOTION;
    }, [prefersReducedMotion]);

    // Pulse motion props.
    const pulseMotionProps = useMemo(() => {
      if (prefersReducedMotion || !animated) {
        return {};
      }
      return PULSE_MOTION;
    }, [prefersReducedMotion, animated]);

    // Accessibility label.
    const statusLabel = useMemo(
      () => ariaLabel || STATUS_LABELS[status] || status,
      [ariaLabel, status],
    );

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': statusLabel,
        'aria-hidden': !ariaLabel,
        'data-status': status,
        'data-size': size,
        'data-animated': animated || undefined,
        'data-disabled': disabled || undefined,
      }),
      [role, statusLabel, ariaLabel, status, size, animated, disabled],
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
            className="animate-spin w-2/3 h-2/3"
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

    return (
      <motion.span
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...pulseMotionProps}
        {...ariaProps}
        {...rest}
      />
    );
  }),
);

AvatarStatus.displayName = 'AvatarStatus';

AvatarStatus.propTypes = {
  /** Status type. */
  status: PropTypes.oneOf(['online', 'offline', 'away', 'busy']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Whether status indicator is animated. */
  animated: PropTypes.bool,
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

export default AvatarStatus;