/**
 * KisanO Design System — Spinner Package
 * SpinnerDots
 *
 * The dots spinner component. Renders an animated series of dots
 * that bounce or pulse to indicate loading.
 *
 * Single Responsibility: Render a dots spinner.
 * Does not manage spinner state or business logic.
 *
 * @module components/ui/Spinner/SpinnerDots
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
  getSpinnerDotsClasses,
} from './spinnerUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Dot sizes based on spinner size. */
const DOT_SIZES = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-3.5 w-3.5',
  '2xl': 'h-4 w-4',
};

/** Dot gaps based on spinner size. */
const DOT_GAPS = {
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
  xl: 'gap-3',
  '2xl': 'gap-3.5',
};

/** Motion variants for dots animation. */
const DOTS_MOTION = {
  initial: { y: 0, opacity: 0.3 },
  animate: { y: -8, opacity: 1 },
  transition: {
    duration: 0.3,
    repeat: Infinity,
    repeatType: 'reverse',
    ease: 'easeInOut',
  },
};

/** Staggered animation variants for dots. */
const STAGGER_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: {
    staggerChildren: 0.15,
    delayChildren: 0.1,
  },
};

/** Default dot count when not provided. */
const DEFAULT_DOT_COUNT = 3;

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * SpinnerDots – an animated dots spinner.
 *
 * @component
 * @example
 * <SpinnerDots size="md" variant="primary" />
 *
 * @example
 * <SpinnerDots dotCount={5} variant="white" speed="fast" />
 */
const SpinnerDots = memo(
  forwardRef(function SpinnerDots(
    {
      dotCount = DEFAULT_DOT_COUNT,
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

    // Get dot size and gap.
    const dotSize = useMemo(
      () => DOT_SIZES[size] || DOT_SIZES.md,
      [size],
    );

    const dotGap = useMemo(
      () => DOT_GAPS[size] || DOT_GAPS.md,
      [size],
    );

    // Dots classes.
    const dotsClasses = useMemo(
      () =>
        getSpinnerDotsClasses({
          variant,
          size,
          speed,
          className,
          disabled,
          loading: isLoading,
          dotCount,
        }),
      [variant, size, speed, className, disabled, isLoading, dotCount],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(dotsClasses, responsiveClasses),
      [dotsClasses, responsiveClasses],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion || !isLoading) {
        return { initial: false, animate: true };
      }
      return STAGGER_MOTION;
    }, [prefersReducedMotion, isLoading]);

    // Dot motion props.
    const dotMotionProps = useMemo(() => {
      if (prefersReducedMotion || !isLoading) {
        return { initial: false, animate: true };
      }
      return DOTS_MOTION;
    }, [prefersReducedMotion, isLoading]);

    // Speed-based duration.
    const speedDuration = useMemo(() => {
      switch (speed) {
        case 'slow':
          return 0.5;
        case 'fast':
          return 0.2;
        case 'faster':
          return 0.15;
        case 'normal':
        default:
          return 0.3;
      }
    }, [speed]);

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
        'data-dot-count': dotCount,
      }),
      [role, ariaLabel, isLoading, disabled, size, variant, speed, dotCount],
    );

    // If not loading, render nothing.
    if (!isLoading) {
      return null;
    }

    // Generate dots.
    const dots = useMemo(
      () =>
        Array.from({ length: dotCount }, (_, index) => (
          <motion.span
            key={index}
            className={mergeClasses(
              'rounded-full',
              dotSize,
              variant === 'white' ? 'bg-white' : 'bg-current',
            )}
            animate={
              !prefersReducedMotion
                ? {
                    y: [0, -8, 0],
                    opacity: [0.3, 1, 0.3],
                  }
                : undefined
            }
            transition={{
              duration: speedDuration,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: index * 0.15,
            }}
            {...dotMotionProps}
          />
        )),
      [dotCount, dotSize, variant, prefersReducedMotion, speedDuration],
    );

    return (
      <motion.div
        ref={ref}
        className={mergeClasses(finalClasses, dotGap)}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {dots}
      </motion.div>
    );
  }),
);

SpinnerDots.displayName = 'SpinnerDots';

SpinnerDots.propTypes = {
  /** Number of dots. */
  dotCount: PropTypes.number,
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

export default SpinnerDots;