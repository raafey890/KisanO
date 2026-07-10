/**
 * KisanO Design System — Toast Package
 * Toast
 *
 * The main Toast component that renders a single notification with
 * support for titles, messages, icons, actions, and loading states.
 * Handles auto-dismissal with pause on hover/focus.
 *
 * Single Responsibility: Render a single toast notification.
 * Does not manage multiple toasts or container positioning.
 *
 * @module components/ui/Toast/Toast
 */

import { forwardRef, memo, useMemo, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion,  } from 'framer-motion';

import {
  TOAST_DEFAULTS,
  getToastVariant,
  getToastSize,
  
 
  getToastProgressHeight,
} from './toastVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getToastClasses,
  isInteractiveToast,
  getAccessibilityHelpers,
} from './toastUtils';

import ToastIcon from './ToastIcon';
import ToastBody from './ToastBody';
import ToastActions from './ToastActions';
import ToastLoader from './ToastLoader';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for toast entrance/exit. */
const TOAST_MOTION = {
  initial: { opacity: 0, y: -20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.95 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
};

/** Slide motion for different positions. */


/** Progress bar animation. */


/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Toast – a single notification toast.
 *
 * @component
 * @example
 * <Toast
 *   variant="success"
 *   title="Success!"
 *   message="Your changes have been saved."
 *   duration={3000}
 *   onClose={handleClose}
 * />
 */
const Toast = memo(
  forwardRef(function Toast(
    {
      variant = TOAST_DEFAULTS.variant,
      size = TOAST_DEFAULTS.size,
      radius = TOAST_DEFAULTS.radius,
      shadow = TOAST_DEFAULTS.shadow,
      title,
      message,
      icon,
      actions,
      duration = TOAST_DEFAULTS.duration,
      progress = TOAST_DEFAULTS.progress,
      closeButton = TOAST_DEFAULTS.closeButton,
      pauseOnHover = TOAST_DEFAULTS.pauseOnHover,
      pauseOnFocus = TOAST_DEFAULTS.pauseOnFocus,
      loading = false,
      disabled = false,
      onClose,
      className = '',
      responsive,
      role = 'alert',
      'aria-label': ariaLabel,
      children,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
        const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const timerRef = useRef(null);
    const progressRef = useRef(null);

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          radius,
          shadow,
          duration,
          progress,
          closeButton,
          pauseOnHover,
          pauseOnFocus,
          disabled,
          loading,
        }),
      [
        variant,
        size,
        radius,
        shadow,
        duration,
        progress,
        closeButton,
        pauseOnHover,
        pauseOnFocus,
        disabled,
        loading,
      ],
    );

    // Get variant configuration.
    const variantConfig = useMemo(
      () => getToastVariant(resolved.variant),
      [resolved.variant],
    );

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getToastSize(resolved.size),
      [resolved.size],
    );

    // Get progress height.
    const progressHeight = useMemo(
      () => getToastProgressHeight(resolved.size),
      [resolved.size],
    );

    // Determine if interactive.
    const interactive = useMemo(
      () => isInteractiveToast({ disabled: resolved.disabled, loading: resolved.loading }),
      [resolved.disabled, resolved.loading],
    );

    // Get accessibility helpers.
    const accessibility = useMemo(
      () =>
        getAccessibilityHelpers({
          variant: resolved.variant,
          disabled: resolved.disabled,
          loading: resolved.loading,
          open: true,
        }),
      [resolved.variant, resolved.disabled, resolved.loading],
    );

    // Build toast classes.
    const toastClasses = useMemo(
      () =>
        getToastClasses({
          variant: resolved.variant,
          size: resolved.size,
          radius: resolved.radius,
          shadow: resolved.shadow,
          className,
          disabled: resolved.disabled,
          loading: resolved.loading,
        }),
      [resolved.variant, resolved.size, resolved.radius, resolved.shadow, className, resolved.disabled, resolved.loading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(toastClasses, responsiveClasses),
      [toastClasses, responsiveClasses],
    );

    // Determine if paused (for timer).
    const shouldPause = useMemo(() => {
      if (!pauseOnHover && !pauseOnFocus) return false;
      if (pauseOnHover && isHovered) return true;
      if (pauseOnFocus && isFocused) return true;
      return false;
    }, [pauseOnHover, pauseOnFocus, isHovered, isFocused]);

    // Handle auto-dismiss timer.
    useEffect(() => {
      if (loading || disabled || !onClose || resolved.duration === 0) {
        return;
      }

      const startTimer = () => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          onClose?.();
        }, resolved.duration);
      };

      if (shouldPause) {
        clearTimeout(timerRef.current);
      } else {
        startTimer();
      }

      return () => clearTimeout(timerRef.current);
    }, [loading, disabled, onClose, resolved.duration, shouldPause]);

    // Handle progress bar animation.
    useEffect(() => {
      if (!progress || loading || disabled || resolved.duration === 0 || !progressRef.current) {
        return;
      }

      const progressBar = progressRef.current;
      const startTime = Date.now();

      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 1 - elapsed / resolved.duration);
        progressBar.style.width = `${remaining * 100}%`;
      };

      const interval = setInterval(updateProgress, 16);

      return () => clearInterval(interval);
    }, [progress, loading, disabled, resolved.duration]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return TOAST_MOTION;
    }, [prefersReducedMotion]);

    // Event handlers.
    const handleMouseEnter = useCallback(() => {
      if (!interactive) return;
      setIsHovered(true);
    }, [interactive]);

    const handleMouseLeave = useCallback(() => {
      setIsHovered(false);
    }, []);

    const handleFocus = useCallback(() => {
      if (!interactive) return;
      setIsFocused(true);
    }, [interactive]);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
    }, []);

    const handleClose = useCallback(() => {
      if (resolved.disabled || resolved.loading) return;
      onClose?.();
    }, [resolved.disabled, resolved.loading, onClose]);

    // Determine if we should show loader.
    const showLoader = resolved.loading;

    // Determine close button visibility.
    const showCloseButton = resolved.closeButton && !resolved.loading;

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role: accessibility.getRole(),
        'aria-live': accessibility.getAriaLive(),
        'aria-atomic': accessibility.getAriaAtomic(),
        'aria-label': ariaLabel || title || 'Notification',
        'aria-disabled': accessibility.getAriaDisabled(),
        'aria-busy': accessibility.getAriaBusy(),
      }),
      [accessibility, ariaLabel, title],
    );

    return (
      <motion.div
        ref={ref}
        className={finalClasses}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {/* Icon */}
        {icon && !showLoader && (
          <ToastIcon
            variant={resolved.variant}
            size={resolved.size}
            disabled={resolved.disabled}
          >
            {icon}
          </ToastIcon>
        )}

        {/* Loader */}
        {showLoader && (
          <ToastLoader size={resolved.size} variant="pulse" />
        )}

        {/* Content */}
        <ToastBody
          title={title}
          message={message}
          size={resolved.size}
          disabled={resolved.disabled}
          loading={resolved.loading}
        >
          {children}
        </ToastBody>

        {/* Actions */}
        {actions && !showLoader && (
          <ToastActions
            size={resolved.size}
            disabled={resolved.disabled}
          >
            {actions}
          </ToastActions>
        )}

        {/* Close button */}
        {showCloseButton && (
          <button
            type="button"
            className={mergeClasses(
              'absolute top-2 right-2 p-1 rounded-full',
              'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              'transition-colors duration-200',
              'shrink-0',
            )}
            onClick={handleClose}
            aria-label="Close notification"
            disabled={resolved.disabled}
          >
            <svg
              className={mergeClasses(
                sizeConfig.icon,
                'shrink-0',
              )}
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
          </button>
        )}

        {/* Progress bar */}
        {resolved.progress && !resolved.loading && !resolved.disabled && resolved.duration > 0 && (
          <div
            className={mergeClasses(
              'absolute bottom-0 left-0 right-0 overflow-hidden',
              progressHeight,
              'rounded-b-inherit',
            )}
          >
            <motion.div
              ref={progressRef}
              className={mergeClasses(
                'h-full',
                variantConfig.progress,
              )}
              initial={{ width: '100%' }}
              
              transition={{
                duration: resolved.duration / 1000,
                ease: 'linear',
              }}
              style={{
                width: '100%',
              }}
            />
          </div>
        )}
      </motion.div>
    );
  }),
);

Toast.displayName = 'Toast';

Toast.propTypes = {
  /** Visual variant of the toast. */
  variant: PropTypes.oneOf(['success', 'error', 'warning', 'info', 'loading']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', 'full']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Toast title. */
  title: PropTypes.node,
  /** Toast message. */
  message: PropTypes.node,
  /** Custom icon. */
  icon: PropTypes.node,
  /** Action buttons. */
  actions: PropTypes.node,
  /** Auto-dismiss duration in milliseconds (0 = no auto-dismiss). */
  duration: PropTypes.number,
  /** Whether to show the progress bar. */
  progress: PropTypes.bool,
  /** Whether to show the close button. */
  closeButton: PropTypes.bool,
  /** Pause timer on hover. */
  pauseOnHover: PropTypes.bool,
  /** Pause timer on focus. */
  pauseOnFocus: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Called when toast should close. */
  onClose: PropTypes.func,
  /** Additional CSS classes. */
  className: PropTypes.string,
  /** Responsive overrides. */
  responsive: PropTypes.shape({
    xs: PropTypes.string,
    sm: PropTypes.string,
    md: PropTypes.string,
    lg: PropTypes.string,
    xl: PropTypes.string,
  }),
  /** ARIA role. */
  role: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
  /** Additional content. */
  children: PropTypes.node,
};

export default Toast;