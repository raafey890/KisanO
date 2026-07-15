/**
 * KisanO Design System — Checkbox Package
 * CheckboxIndicator
 *
 * The visual indicator for a checkbox. Renders a box with checkmark or
 * indeterminate icon based on the checkbox state. Supports custom icons
 * and animations.
 *
 * Single Responsibility: Render the checkbox visual indicator.
 * Does not manage checkbox state or input logic.
 *
 * @module components/ui/Checkbox/CheckboxIndicator
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  CHECKBOX_DEFAULTS,
} from './checkboxVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getCheckboxClasses,
  getCheckboxIndicatorClasses,
  getCheckboxIconSize,
} from './checkboxUtils';

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

/** Motion variants for indeterminate state. */
const INDETERMINATE_MOTION = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Default check icon. */
const DEFAULT_CHECK_ICON = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

/** Default indeterminate icon. */
const DEFAULT_INDETERMINATE_ICON = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
  </svg>
);

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * CheckboxIndicator – the visual indicator for a checkbox.
 *
 * @component
 * @example
 * <CheckboxIndicator checked={isChecked} size="md" />
 *
 * @example
 * <CheckboxIndicator
 *   checked={isChecked}
 *   indeterminate={isIndeterminate}
 *   disabled
 * />
 */
const CheckboxIndicator = memo(
  forwardRef(function CheckboxIndicator(
    {
      checked = false,
      indeterminate = false,
      disabled = false,
      loading = false,
      size = CHECKBOX_DEFAULTS.size,
      variant = CHECKBOX_DEFAULTS.variant,
      radius = CHECKBOX_DEFAULTS.radius,
      shadow = CHECKBOX_DEFAULTS.shadow,
      state = 'default',
      checkIcon,
      indeterminateIcon,
      responsive,
      className = '',
      role = 'img',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Get size configuration.
    const iconSize = useMemo(
      () => getCheckboxIconSize(size),
      [size],
    );

    // Checkbox classes.
    const checkboxClasses = useMemo(
      () =>
        getCheckboxClasses({
          variant,
          size,
          radius,
          shadow,
          className,
          disabled,
          checked,
          indeterminate,
        }),
      [variant, size, radius, shadow, className, disabled, checked, indeterminate],
    );

    // Indicator classes.
    const indicatorClasses = useMemo(
      () =>
        getCheckboxIndicatorClasses({
          size,
          className: '',
          checked,
          indeterminate,
          disabled,
        }),
      [size, checked, indeterminate, disabled],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(checkboxClasses, responsiveClasses),
      [checkboxClasses, responsiveClasses],
    );

    // Determine which icon to show.
    const iconContent = useMemo(() => {
      if (checkIcon && checked) return checkIcon;
      if (indeterminateIcon && indeterminate) return indeterminateIcon;
      if (checked) return DEFAULT_CHECK_ICON;
      if (indeterminate) return DEFAULT_INDETERMINATE_ICON;
      return null;
    }, [checked, indeterminate, checkIcon, indeterminateIcon]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      if (indeterminate) {
        return INDETERMINATE_MOTION;
      }
      return INDICATOR_MOTION;
    }, [prefersReducedMotion, indeterminate]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || (checked ? 'Checked' : indeterminate ? 'Indeterminate' : 'Unchecked'),
        'aria-hidden': !ariaLabel,
        'data-state': state,
        'data-checked': checked || undefined,
        'data-indeterminate': indeterminate || undefined,
      }),
      [role, ariaLabel, checked, indeterminate, state],
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
            className={mergeClasses(iconSize, 'animate-spin')}
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
        {iconContent && (
          <span className={indicatorClasses}>
            {iconContent}
          </span>
        )}
      </motion.div>
    );
  }),
);

CheckboxIndicator.displayName = 'CheckboxIndicator';

CheckboxIndicator.propTypes = {
  /** Checked state. */
  checked: PropTypes.bool,
  /** Indeterminate state. */
  indeterminate: PropTypes.bool,
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
  state: PropTypes.oneOf(['default', 'checked', 'indeterminate', 'hover', 'focus', 'disabled', 'error', 'success']),
  /** Custom check icon. */
  checkIcon: PropTypes.node,
  /** Custom indeterminate icon. */
  indeterminateIcon: PropTypes.node,
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

export default CheckboxIndicator;