/**
 * KisanO Design System — Badge Package
 * BadgeDot
 *
 * The dot indicator component for badges. Renders a circular dot with
 * status colors for online/offline, notifications, and other indicators.
 *
 * Single Responsibility: Render a badge dot indicator.
 * Does not manage badge state or business logic.
 *
 * @module components/ui/Badge/BadgeDot
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
  getBadgeDotClasses,
} from './badgeUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for dot animation. */
const DOT_MOTION = {
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

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * BadgeDot – a dot indicator for badges.
 *
 * @component
 * @example
 * <BadgeDot variant="success" />
 *
 * @example
 * <BadgeDot variant="error" animated position="top-right" />
 */
const BadgeDot = memo(
  forwardRef(function BadgeDot(
    {
      size = BADGE_DEFAULTS.size,
      variant = BADGE_DEFAULTS.variant,
      position = BADGE_DEFAULTS.position,
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

    // Dot classes.
    const dotClasses = useMemo(
      () =>
        getBadgeDotClasses({
          size,
          variant,
          className,
          position,
          disabled,
          animated: animated && !prefersReducedMotion,
        }),
      [size, variant, className, position, disabled, animated, prefersReducedMotion],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(dotClasses, responsiveClasses),
      [dotClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return DOT_MOTION;
    }, [prefersReducedMotion]);

    // Pulse motion props.
    const pulseMotionProps = useMemo(() => {
      if (prefersReducedMotion || !animated) {
        return {};
      }
      return PULSE_MOTION;
    }, [prefersReducedMotion, animated]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || `${variant} indicator`,
        'aria-hidden': !ariaLabel,
        'data-variant': variant,
        'data-size': size,
        'data-position': position,
        'data-animated': animated || undefined,
        'data-disabled': disabled || undefined,
      }),
      [role, ariaLabel, variant, size, position, animated, disabled],
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

BadgeDot.displayName = 'BadgeDot';

BadgeDot.propTypes = {
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Visual variant (affects dot color). */
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'info',
    'outline',
    'ghost',
  ]),
  /** Position for floating dot. */
  position: PropTypes.oneOf([
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
    'top-center',
    'bottom-center',
  ]),
  /** Whether dot is animated (pulse). */
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

export default BadgeDot;