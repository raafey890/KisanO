/**
 * KisanO Design System — Toast Package
 * ToastCloseButton
 *
 * A dedicated close button for Toast notifications. Renders a circular
 * button with a close (X) icon. Designed to be placed in ToastHeader.
 *
 * Single Responsibility: Render a close button for toasts.
 * Does not manage toast state, timers, auto-dismiss, or progress bars.
 *
 * @module components/ui/Toast/ToastCloseButton
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  TOAST_DEFAULTS,

} from './toastVariants';
import {
  TOAST_DEFAULTS,
  TOAST_CLOSE_BUTTON_SIZES,
  TOAST_CLOSE_BUTTON_ICON_SIZES,
} from './toastVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './toastUtils';

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
 * ToastCloseButton – a dedicated close button for toasts.
 *
 * @component
 * @example
 * <ToastCloseButton onClick={onClose} size="md" />
 */
const ToastCloseButton = memo(
  forwardRef(function ToastCloseButton(
    {
      onClick,
      size = TOAST_DEFAULTS.size,
      disabled = false,
      loading = false,
      autoFocus = false,
      responsive,
      className = '',
      'aria-label': ariaLabel = 'Close notification',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Get size configuration.
    

    // Resolve button size.
    const buttonSize = useMemo(
  () =>
    TOAST_CLOSE_BUTTON_SIZES[size] ||
    TOAST_CLOSE_BUTTON_SIZES[TOAST_DEFAULTS.size],
  [size],
);

const iconSize = useMemo(
  () =>
    TOAST_CLOSE_BUTTON_ICON_SIZES[size] ||
    TOAST_CLOSE_BUTTON_ICON_SIZES[TOAST_DEFAULTS.size],
  [size],
);

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Button classes.
    const buttonClasses = useMemo(() => {
      const base = mergeClasses(
        'inline-flex items-center justify-center',
        'rounded-full',
        buttonSize,
        'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'transition-colors duration-200',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        loading && 'opacity-70 cursor-progress',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [buttonSize, disabled, loading, className, responsiveClasses]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return CLOSE_BUTTON_MOTION;
    }, [prefersReducedMotion]);

    // Handle click with safety.
    const handleClick = useCallback(
      (event) => {
        if (disabled || loading) return;
        onClick?.(event);
      },
      [disabled, loading, onClick],
    );

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
        <svg
          className={iconSize}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </motion.button>
    );
  }),
);

ToastCloseButton.displayName = 'ToastCloseButton';

ToastCloseButton.propTypes = {
  /** Click handler. */
  onClick: PropTypes.func,
  /** Size of the button. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Disables the button. */
  disabled: PropTypes.bool,
  /** Shows loading state. */
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

export default ToastCloseButton;