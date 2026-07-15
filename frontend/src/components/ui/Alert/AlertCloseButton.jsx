/**
 * KisanO Design System — Alert Package
 * AlertCloseButton
 *
 * A dedicated close button for alerts. Renders a circular button with
 * a close (X) icon. Designed to be placed in AlertContainer.
 *
 * Single Responsibility: Render a close button for alerts.
 * Does not manage alert state or business logic.
 *
 * @module components/ui/Alert/AlertCloseButton
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  ALERT_DEFAULTS,
  getAlertSize,
} from './alertVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getAlertCloseButtonClasses,
} from './alertUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Size presets for the close button. */
const BUTTON_SIZES = {
  xs: 'h-5 w-5',
  sm: 'h-6 w-6',
  md: 'h-7 w-7',
  lg: 'h-8 w-8',
  xl: 'h-9 w-9',
};

/** Icon size presets. */
const ICON_SIZES = {
  xs: 'h-2.5 w-2.5',
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
  xl: 'h-4.5 w-4.5',
};

/** Motion variants. */
const CLOSE_BUTTON_MOTION = {
  initial: { opacity: 0, scale: 0.8, rotate: -90 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  exit: { opacity: 0, scale: 0.8, rotate: 90 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * AlertCloseButton – a dedicated close button for alerts.
 *
 * @component
 * @example
 * <AlertCloseButton onClick={onClose} size="md" />
 *
 * @example
 * <AlertCloseButton
 *   onClick={onClose}
 *   icon={<CustomIcon />}
 *   aria-label="Close alert"
 * />
 */
const AlertCloseButton = memo(
  forwardRef(function AlertCloseButton(
    {
      onClick,
      icon,
      size = ALERT_DEFAULTS.size,
      variant = ALERT_DEFAULTS.variant,
      disabled = false,
      loading = false,
      autoFocus = false,
      responsive,
      className = '',
      'aria-label': ariaLabel = 'Close alert',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Resolve button size.
    const buttonSize = useMemo(
      () => BUTTON_SIZES[size] || BUTTON_SIZES.md,
      [size],
    );

    // Resolve icon size.
    const iconSize = useMemo(
      () => ICON_SIZES[size] || ICON_SIZES.md,
      [size],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Close button classes.
    const buttonClasses = useMemo(() => {
      const base = getAlertCloseButtonClasses({
        size,
        className,
        disabled,
      });
      return mergeClasses(base, responsiveClasses);
    }, [size, className, disabled, responsiveClasses]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return {
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
        ...CLOSE_BUTTON_MOTION,
      };
    }, [prefersReducedMotion]);

    // Handle click with safety.
    const handleClick = useCallback(
      (event) => {
        if (disabled || loading) return;
        onClick?.(event);
      },
      [disabled, loading, onClick],
    );

    // Default close icon (X).
    const defaultIcon = (
      <svg
        className={iconSize}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>
    );

    const buttonIcon = icon || defaultIcon;

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        type: 'button',
        'aria-label': ariaLabel,
        'aria-disabled': disabled || undefined,
        disabled,
        tabIndex: disabled ? -1 : 0,
      }),
      [ariaLabel, disabled],
    );

    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        onClick={handleClick}
        autoFocus={autoFocus}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {buttonIcon}
      </motion.button>
    );
  }),
);

AlertCloseButton.displayName = 'AlertCloseButton';

AlertCloseButton.propTypes = {
  /** Click handler. */
  onClick: PropTypes.func,
  /** Custom icon (defaults to close X). */
  icon: PropTypes.node,
  /** Size of the button. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Auto-focus the button on mount. */
  autoFocus: PropTypes.bool,
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
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default AlertCloseButton;