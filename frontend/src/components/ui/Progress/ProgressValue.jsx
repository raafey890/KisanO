/**
 * KisanO Design System — Progress Package
 * ProgressValue
 *
 * The value component for progress. Renders the current value,
 * percentage, or custom value display with animation support.
 *
 * Single Responsibility: Render the progress value.
 * Does not manage progress state or business logic.
 *
 * @module components/ui/Progress/ProgressValue
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
  getProgressValueClasses,
} from './progressUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for value animation. */
const VALUE_MOTION = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Format types for value display. */
const FORMAT_TYPES = {
  percentage: 'percentage',
  current: 'current',
  max: 'max',
  fraction: 'fraction',
  custom: 'custom',
};

/** Default format when not provided. */
const DEFAULT_FORMAT = 'percentage';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ProgressValue – the value display for progress bars.
 *
 * @component
 * @example
 * <ProgressValue value={75} max={100} />
 *
 * @example
 * <ProgressValue value={50} format="current" />
 *
 * @example
 * <ProgressValue value={75} format="fraction" />
 */
const ProgressValue = memo(
  forwardRef(function ProgressValue(
    {
      children,
      value = PROGRESS_DEFAULTS.value,
      max = PROGRESS_DEFAULTS.max,
      variant = PROGRESS_DEFAULTS.variant,
      size = PROGRESS_DEFAULTS.size,
      format = DEFAULT_FORMAT,
      animated = true,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'text',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Value classes.
    const valueClasses = useMemo(
      () =>
        getProgressValueClasses({
          size,
          className,
          disabled,
          variant,
        }),
      [size, className, disabled, variant],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(valueClasses, responsiveClasses),
      [valueClasses, responsiveClasses],
    );

    // Calculate percentage.
    const percentage = useMemo(() => {
      if (max <= 0) return 0;
      return Math.max(0, Math.min(100, (value / max) * 100));
    }, [value, max]);

    // Format value.
    const formattedValue = useMemo(() => {
      if (children) return children;

      switch (format) {
        case 'percentage':
          return `${Math.round(percentage)}%`;
        case 'current':
          return value;
        case 'max':
          return max;
        case 'fraction':
          return `${value} / ${max}`;
        case 'custom':
        default:
          return value;
      }
    }, [children, format, value, max, percentage]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion || !animated) {
        return { initial: false, animate: true, exit: false };
      }
      return VALUE_MOTION;
    }, [prefersReducedMotion, animated]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || `Progress value: ${formattedValue}`,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
        'data-format': format,
        'data-value': value,
        'data-max': max,
        'data-percentage': percentage,
      }),
      [role, ariaLabel, formattedValue, disabled, loading, format, value, max, percentage],
    );

    // If loading, render a loading placeholder.
    if (loading) {
      return (
        <motion.div
          ref={ref}
          className={finalClasses}
          {...motionProps}
          {...ariaProps}
          {...rest}
        >
          <span className="inline-block w-12 h-4 bg-gray-200 rounded animate-pulse" />
        </motion.div>
      );
    }

    return (
      <motion.span
        ref={ref}
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {formattedValue}
      </motion.span>
    );
  }),
);

ProgressValue.displayName = 'ProgressValue';

ProgressValue.propTypes = {
  /** Custom value content (overrides format). */
  children: PropTypes.node,
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
  /** Value format type. */
  format: PropTypes.oneOf(['percentage', 'current', 'max', 'fraction', 'custom']),
  /** Whether value is animated. */
  animated: PropTypes.bool,
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

export default ProgressValue;