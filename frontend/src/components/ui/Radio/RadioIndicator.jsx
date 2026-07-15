/**
 * KisanO Design System — Radio Package
 * RadioIndicator
 *
 * The visual indicator for a radio. Renders a circular radio button
 * with a filled dot when checked. Supports custom indicators
 * and animations.
 *
 * Single Responsibility: Render the radio visual indicator.
 * Does not manage radio state or input logic.
 *
 * @module components/ui/Radio/RadioIndicator
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  RADIO_DEFAULTS,
} from './radioVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getRadioClasses,
  getRadioIndicatorClasses,
} from './radioUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for indicator animation. */
const INDICATOR_MOTION = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Default indicator (filled dot). */
const DEFAULT_INDICATOR = (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="8" />
  </svg>
);

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * RadioIndicator – the visual indicator for a radio.
 *
 * @component
 * @example
 * <RadioIndicator checked={isChecked} size="md" />
 *
 * @example
 * <RadioIndicator
 *   checked={isChecked}
 *   disabled
 *   customIndicator={<CustomIcon />}
 * />
 */
const RadioIndicator = memo(
  forwardRef(function RadioIndicator(
    {
      checked = false,
      disabled = false,
      loading = false,
      size = RADIO_DEFAULTS.size,
      variant = RADIO_DEFAULTS.variant,
      radius = RADIO_DEFAULTS.radius,
      shadow = RADIO_DEFAULTS.shadow,
      state = 'default',
      customIndicator,
      responsive,
      className = '',
      role = 'img',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Radio classes.
    const radioClasses = useMemo(
      () =>
        getRadioClasses({
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

    // Indicator classes.
    const indicatorClasses = useMemo(
      () =>
        getRadioIndicatorClasses({
          size,
          className: '',
          checked,
          disabled,
        }),
      [size, checked, disabled],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(radioClasses, responsiveClasses),
      [radioClasses, responsiveClasses],
    );

    // Determine which indicator to show.
    const indicatorContent = useMemo(() => {
      if (customIndicator) return customIndicator;
      if (checked) return DEFAULT_INDICATOR;
      return null;
    }, [customIndicator, checked]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return INDICATOR_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || (checked ? 'Checked' : 'Unchecked'),
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
          className={finalClasses}
          aria-busy="true"
          {...ariaProps}
          {...rest}
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
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {indicatorContent && (
          <span className={indicatorClasses}>
            {indicatorContent}
          </span>
        )}
      </motion.div>
    );
  }),
);

RadioIndicator.displayName = 'RadioIndicator';

RadioIndicator.propTypes = {
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
  /** Custom indicator. */
  customIndicator: PropTypes.node,
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

export default RadioIndicator;