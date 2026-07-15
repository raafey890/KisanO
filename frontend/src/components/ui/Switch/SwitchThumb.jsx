/**
 * KisanO Design System — Switch Package
 * SwitchThumb
 *
 * The visual thumb (toggle knob) for a switch. Renders a circular knob
 * that slides left or right based on the checked state. Supports smooth
 * animations and loading states.
 *
 * Single Responsibility: Render and animate the switch thumb.
 * Does not manage switch state or input logic.
 *
 * @module components/ui/Switch/SwitchThumb
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  SWITCH_DEFAULTS,
} from './switchVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getSwitchClasses,
  getSwitchThumbClasses,
} from './switchUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for thumb animation. */
const THUMB_MOTION = {
  initial: { scale: 0.8 },
  animate: { scale: 1 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Spring animation for thumb sliding. */
const SPRING_ANIMATION = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
  mass: 1,
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SwitchThumb – the visual thumb of a switch.
 *
 * @component
 * @example
 * <SwitchThumb checked={isChecked} size="md" />
 *
 * @example
 * <SwitchThumb checked={isChecked} disabled loading />
 */
const SwitchThumb = memo(
  forwardRef(function SwitchThumb(
    {
      checked = false,
      disabled = false,
      loading = false,
      size = SWITCH_DEFAULTS.size,
      variant = SWITCH_DEFAULTS.variant,
      radius = SWITCH_DEFAULTS.radius,
      shadow = SWITCH_DEFAULTS.shadow,
      state = 'default',
      responsive,
      className = '',
      role = 'img',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Switch track classes.
    const trackClasses = useMemo(
      () =>
        getSwitchClasses({
          variant,
          size,
          radius,
          shadow,
          className,
          disabled,
          checked,
        }),
      [variant, size, radius, shadow, className, disabled, checked],
    );

    // Thumb classes.
    const thumbClasses = useMemo(
      () =>
        getSwitchThumbClasses({
          size,
          className: '',
          checked,
          disabled,
          variant,
        }),
      [size, checked, disabled, variant],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalTrackClasses = useMemo(
      () => mergeClasses(trackClasses, responsiveClasses),
      [trackClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return {
        whileHover: { scale: disabled ? 1 : 1.05 },
        whileTap: { scale: disabled ? 1 : 0.95 },
        transition: SPRING_ANIMATION,
      };
    }, [prefersReducedMotion, disabled]);

    // Thumb motion for sliding.
    const thumbMotion = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return {
        initial: { x: 0 },
        animate: { x: checked ? '100%' : 0 },
        transition: SPRING_ANIMATION,
      };
    }, [prefersReducedMotion, checked]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || (checked ? 'On' : 'Off'),
        'aria-hidden': !ariaLabel,
        'data-state': state,
        'data-checked': checked || undefined,
      }),
      [role, ariaLabel, checked, state],
    );

    // If loading, render loading state.
    if (loading) {
      return (
        <div
          ref={ref}
          className={finalTrackClasses}
          aria-busy="true"
          {...ariaProps}
          {...rest}
        >
          <motion.div
            className={thumbClasses}
            {...thumbMotion}
            {...motionProps}
          >
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
            </svg>
          </motion.div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={finalTrackClasses}
        {...ariaProps}
        {...rest}
      >
        <motion.div
          className={thumbClasses}
          {...thumbMotion}
          {...motionProps}
        />
      </div>
    );
  }),
);

SwitchThumb.displayName = 'SwitchThumb';

SwitchThumb.propTypes = {
  /** Checked state. */
  checked: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', 'full']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  /** State for styling. */
  state: PropTypes.oneOf(['default', 'checked', 'hover', 'focus', 'disabled', 'error', 'success']),
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

export default SwitchThumb;