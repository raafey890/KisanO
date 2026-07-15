/**
 * KisanO Design System — Spinner Package
 * SpinnerPulse
 *
 * The pulse spinner component. Renders an expanding and contracting
 * circle animation to indicate loading.
 *
 * Single Responsibility: Render a pulse spinner.
 * Does not manage spinner state or business logic.
 *
 * @module components/ui/Spinner/SpinnerPulse
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  SPINNER_DEFAULTS,
} from './spinnerVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getSpinnerPulseClasses,
} from './spinnerUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Pulse sizes based on spinner size. */
const PULSE_SIZES = {
  xs: 'h-4 w-4',
  sm: 'h-5 w-5',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-10 w-10',
  '2xl': 'h-12 w-12',
};

/** Default pulse count when not provided. */
const DEFAULT_PULSE_COUNT = 2;

/** Motion variants for pulse animation. */
const PULSE_MOTION = {
  initial: { scale: 0.5, opacity: 0.5 },
  animate: { scale: 1, opacity: 1 },
  transition: {
    duration: 0.5,
    repeat: Infinity,
    repeatType: 'reverse',
    ease: 'easeInOut',
  },
};

/** Ripple motion variants. */
const RIPPLE_MOTION = {
  initial: { scale: 0, opacity: 0.8 },
  animate: { scale: 1.2, opacity: 0 },
  transition: {
    duration: 0.8,
    repeat: Infinity,
    ease: 'easeOut',
  },
};

/** Staggered animation variants for multiple pulses. */
const STAGGER_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: {
    staggerChildren: 0.2,
    delayChildren: 0.1,
  },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SpinnerPulse – a pulse spinner.
 *
 * @component
 * @example
 * <SpinnerPulse size="md" variant="primary" />
 *
 * @example
 * <SpinnerPulse pulseCount={3} variant="white" speed="fast" />
 */
const SpinnerPulse = memo(
  forwardRef(function SpinnerPulse(
    {
      pulseCount = DEFAULT_PULSE_COUNT,
      size = SPINNER_DEFAULTS.size,
      variant = SPINNER_DEFAULTS.variant,
      speed = SPINNER_DEFAULTS.speed,
      disabled = false,
      loading = true,
      responsive,
      className = '',
      role = 'img',
      'aria-label': ariaLabel = 'Loading',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine if loading.
    const isLoading = loading && !disabled;

    // Get pulse size.
    const pulseSize = useMemo(
      () => PULSE_SIZES[size] || PULSE_SIZES.md,
      [size],
    );

    // Pulse classes.
    const pulseClasses = useMemo(
      () =>
        getSpinnerPulseClasses({
          variant,
          size,
          speed,
          className,
          disabled,
          loading: isLoading,
          pulseCount,
        }),
      [variant, size, speed, className, disabled, isLoading, pulseCount],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(pulseClasses, responsiveClasses),
      [pulseClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion || !isLoading) {
        return { initial: false, animate: true };
      }
      return STAGGER_MOTION;
    }, [prefersReducedMotion, isLoading]);

    // Pulse motion props.
    const pulseMotionProps = useMemo(() => {
      if (prefersReducedMotion || !isLoading) {
        return { initial: false, animate: true };
      }
      return PULSE_MOTION;
    }, [prefersReducedMotion, isLoading]);

    // Speed-based duration.
    const speedDuration = useMemo(() => {
      switch (speed) {
        case 'slow':
          return 0.7;
        case 'fast':
          return 0.3;
        case 'faster':
          return 0.2;
        case 'normal':
        default:
          return 0.5;
      }
    }, [speed]);

    // Ripple motion props.
    const rippleMotionProps = useMemo(() => {
      if (prefersReducedMotion || !isLoading) {
        return { initial: false, animate: true };
      }
      return RIPPLE_MOTION;
    }, [prefersReducedMotion, isLoading]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-busy': isLoading || undefined,
        'aria-disabled': disabled || undefined,
        'data-size': size,
        'data-variant': variant,
        'data-speed': speed,
        'data-pulse-count': pulseCount,
      }),
      [role, ariaLabel, isLoading, disabled, size, variant, speed, pulseCount],
    );

    // If not loading, render nothing.
    if (!isLoading) {
      return null;
    }

    // Generate pulses.
    const pulses = useMemo(
      () =>
        Array.from({ length: pulseCount }, (_, index) => {
          const delay = index * (pulseCount > 1 ? 0.2 : 0);
          const duration = speedDuration;

          return (
            <motion.span
              key={index}
              className={mergeClasses(
                'absolute inset-0 rounded-full',
                variant === 'white' ? 'bg-white' : 'bg-current',
                'opacity-75',
              )}
              animate={
                !prefersReducedMotion
                  ? {
                      scale: [0.5, 1.2],
                      opacity: [0.8, 0],
                    }
                  : undefined
              }
              transition={{
                duration: duration * 1.5,
                repeat: Infinity,
                ease: 'easeOut',
                delay,
              }}
              {...rippleMotionProps}
            />
          );
        }),
      [pulseCount, variant, prefersReducedMotion, speedDuration],
    );

    return (
      <motion.div
        ref={ref}
        className={mergeClasses(
          finalClasses,
          pulseSize,
          'relative inline-flex items-center justify-center',
        )}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {/* Main pulse */}
        <motion.span
          className={mergeClasses(
            'absolute inset-0 rounded-full',
            variant === 'white' ? 'bg-white' : 'bg-current',
          )}
          animate={
            !prefersReducedMotion
              ? {
                  scale: [0.5, 1],
                  opacity: [0.5, 1],
                }
              : undefined
          }
          transition={{
            duration: speedDuration,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          {...pulseMotionProps}
        />

        {/* Ripple pulses */}
        {pulses}

        {/* Inner dot (optional) */}
        <span
          className={mergeClasses(
            'relative z-10 rounded-full',
            'h-1/2 w-1/2',
            variant === 'white' ? 'bg-white' : 'bg-current',
            'opacity-80',
          )}
        />
      </motion.div>
    );
  }),
);

SpinnerPulse.displayName = 'SpinnerPulse';

SpinnerPulse.propTypes = {
  /** Number of pulse rings. */
  pulseCount: PropTypes.number,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Visual variant. */
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'info',
    'white',
    'dark',
  ]),
  /** Speed preset. */
  speed: PropTypes.oneOf(['slow', 'normal', 'fast', 'faster']),
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

export default SpinnerPulse;