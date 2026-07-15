/**
 * KisanO Design System — Progress Package
 * ProgressBar
 *
 * The bar component for progress. Renders an animated progress bar
 * with determinate and indeterminate states.
 *
 * Single Responsibility: Render the progress bar.
 * Does not manage progress state or business logic.
 *
 * @module components/ui/Progress/ProgressBar
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  PROGRESS_DEFAULTS,
} from './progressVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getProgressBarClasses,
  getProgressIndicatorClasses,
} from './progressUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for bar animation. */
const BAR_MOTION = {
  initial: { width: 0 },
  animate: { width: 'var(--progress-width)' },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
};

/** Indeterminate motion variants. */
const INDETERMINATE_MOTION = {
  initial: { x: '-100%' },
  animate: { x: '100%' },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: 'ease-in-out',
  },
};

/** Striped animation variants. */
const STRIPED_MOTION = {
  animate: {
    backgroundPosition: ['0% 0%', '100% 100%'],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'linear',
  },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ProgressBar – the progress bar component.
 *
 * @component
 * @example
 * <ProgressBar value={75} max={100} />
 *
 * @example
 * <ProgressBar indeterminate variant="success" />
 */
const ProgressBar = memo(
  forwardRef(function ProgressBar(
    {
      value = PROGRESS_DEFAULTS.value,
      max = PROGRESS_DEFAULTS.max,
      variant = PROGRESS_DEFAULTS.variant,
      size = PROGRESS_DEFAULTS.size,
      radius = PROGRESS_DEFAULTS.radius,
      animation = PROGRESS_DEFAULTS.animation,
      indeterminate = false,
      striped = false,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      indicatorClassName = '',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Calculate percentage.
    const percentage = useMemo(() => {
      if (indeterminate) return 0;
      return Math.max(0, Math.min(100, (value / max) * 100));
    }, [value, max, indeterminate]);

    // Bar classes.
    const barClasses = useMemo(
      () =>
        getProgressBarClasses({
          variant,
          size,
          radius,
          animation,
          className,
          value,
          max,
          disabled,
          loading,
        }),
      [variant, size, radius, animation, className, value, max, disabled, loading],
    );

    // Indicator classes.
    const indicatorClasses = useMemo(
      () =>
        getProgressIndicatorClasses({
          variant,
          animation,
          className: indicatorClassName,
          value,
          max,
          disabled,
          loading,
          indeterminate,
        }),
      [variant, animation, indicatorClassName, value, max, disabled, loading, indeterminate],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalBarClasses = useMemo(
      () => mergeClasses(barClasses, responsiveClasses),
      [barClasses, responsiveClasses],
    );

    // Indicator style.
    const indicatorStyle = useMemo(() => {
      if (indeterminate) return {};
      return {
        '--progress-width': `${percentage}%`,
        width: prefersReducedMotion ? `${percentage}%` : '0%',
      };
    }, [percentage, indeterminate, prefersReducedMotion]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return BAR_MOTION;
    }, [prefersReducedMotion]);

    // Indeterminate motion props.
    const indeterminateMotionProps = useMemo(() => {
      if (prefersReducedMotion || !indeterminate) {
        return { initial: false, animate: true };
      }
      return INDETERMINATE_MOTION;
    }, [prefersReducedMotion, indeterminate]);

    // Striped motion props.
    const stripedMotionProps = useMemo(() => {
      if (prefersReducedMotion || !striped || indeterminate) {
        return { initial: false, animate: true };
      }
      return STRIPED_MOTION;
    }, [prefersReducedMotion, striped, indeterminate]);

    // Striped styles.
    const stripedStyles = useMemo(() => {
      if (!striped || indeterminate) return {};
      return {
        backgroundImage:
          'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)',
        backgroundSize: '1rem 1rem',
      };
    }, [striped, indeterminate]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role: 'progressbar',
        'aria-valuenow': indeterminate ? undefined : percentage,
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-disabled': disabled || undefined,
        'aria-busy': indeterminate || loading || undefined,
        'data-indeterminate': indeterminate || undefined,
        'data-value': percentage,
        'data-striped': striped || undefined,
      }),
      [percentage, indeterminate, disabled, loading, striped],
    );

    return (
      <div
        ref={ref}
        className={finalBarClasses}
        {...ariaProps}
        {...rest}
      >
        <motion.div
          className={indicatorClasses}
          style={{ ...indicatorStyle, ...stripedStyles }}
          {...motionProps}
          {...indeterminateMotionProps}
          {...stripedMotionProps}
        />
      </div>
    );
  }),
);

ProgressBar.displayName = 'ProgressBar';

ProgressBar.propTypes = {
  /** Progress value. */
  value: PropTypes.number,
  /** Maximum value. */
  max: PropTypes.number,
  /** Visual variant. */
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'info',
    'gradient',
  ]),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Animation type. */
  animation: PropTypes.oneOf(['pulse', 'slide', 'bounce', 'none']),
  /** Indeterminate state. */
  indeterminate: PropTypes.bool,
  /** Striped style. */
  striped: PropTypes.bool,
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
  /** Additional CSS classes for the bar. */
  className: PropTypes.string,
  /** Additional CSS classes for the indicator. */
  indicatorClassName: PropTypes.string,
};

export default ProgressBar;