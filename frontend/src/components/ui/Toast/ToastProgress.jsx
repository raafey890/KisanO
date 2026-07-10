/**
 * KisanO Design System — Toast Package
 * ToastProgress
 *
 * The progress bar for a Toast notification. Renders an animated progress
 * bar that visually indicates the remaining time before auto-dismissal.
 *
 * Single Responsibility: Render the progress bar for a toast.
 * Does not manage toast state, timers, auto-dismiss logic, or close buttons.
 *
 * @module components/ui/Toast/ToastProgress
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  TOAST_DEFAULTS,
  getToastVariant,
  getToastProgressHeight,
} from './toastVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './toastUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for progress bar animation. */


/** Paused state - holds current width. */


/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ToastProgress – the progress bar of a toast notification.
 *
 * @component
 * @example
 * <ToastProgress
 *   variant="success"
 *   size="md"
 *   duration={5000}
 *   paused={isPaused}
 * />
 */
const ToastProgress = memo(
  forwardRef(function ToastProgress(
    {
      variant = TOAST_DEFAULTS.variant,
      size = TOAST_DEFAULTS.size,
      duration = TOAST_DEFAULTS.duration,
      paused = false,
      disabled = false,
      responsive,
      className = '',
      role = 'progressbar',
      'aria-label': ariaLabel = 'Toast progress',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Get variant configuration.
    const variantConfig = useMemo(
      () => getToastVariant(variant),
      [variant],
    );

    // Get progress height.
    const progressHeight = useMemo(
      () => getToastProgressHeight(size),
      [size],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Progress bar classes.
    const progressClasses = useMemo(() => {
      const base = mergeClasses(
        'absolute bottom-0 left-0 right-0 overflow-hidden',
        progressHeight,
        'rounded-b-inherit',
        disabled && 'opacity-50',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [progressHeight, disabled, className, responsiveClasses]);

    // Inner bar classes.
    const barClasses = useMemo(
      () =>
        mergeClasses(
          'h-full transition-all',
          variantConfig.progress,
        ),
      [variantConfig.progress],
    );

    // Determine if animation should run.
    const shouldAnimate = !prefersReducedMotion && duration > 0 && !disabled;

    // Motion props.
    const motionProps = useMemo(() => {
      if (!shouldAnimate) {
        return { initial: false, animate: true };
      }

      if (paused) {
        return {
          initial: { width: '100%' },
          animate: { width: '100%' },
          transition: { duration: 0 },
        };
      }

      return {
        initial: { width: '100%' },
        animate: { width: '0%' },
        transition: {
          duration: duration / 1000,
          ease: 'linear',
        },
      };
    }, [shouldAnimate, paused, duration]);

    // If duration is 0 or less, don't render.
    if (duration <= 0) {
      return null;
    }

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
       
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-disabled': disabled || undefined,
      }),
      [role, ariaLabel, paused, disabled],
    );

    return (
      <motion.div
        ref={ref}
        className={progressClasses}
        {...ariaProps}
        {...rest}
      >
        <motion.div
          className={barClasses}
          {...motionProps}
        />
      </motion.div>
    );
  }),
);

ToastProgress.displayName = 'ToastProgress';

ToastProgress.propTypes = {
  /** Toast variant (affects progress bar color). */
  variant: PropTypes.oneOf(['success', 'error', 'warning', 'info', 'loading']),
  /** Size preset (affects progress bar height). */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Duration in milliseconds (0 = no animation). */
  duration: PropTypes.number,
  /** Whether the progress bar is paused. */
  paused: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
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

export default ToastProgress;