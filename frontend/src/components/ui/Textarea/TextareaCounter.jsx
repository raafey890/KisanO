/**
 * KisanO Design System — Textarea Package
 * TextareaCounter
 *
 * A character counter component for Textarea fields. Displays the current
 * character count relative to the maximum, with warning and error states.
 *
 * Single Responsibility: Render the character counter.
 * Does not manage textarea state or input logic.
 *
 * @module components/ui/Textarea/TextareaCounter
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  TEXTAREA_DEFAULTS,
} from './textareaVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getTextareaCounterClasses,
} from './textareaUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Size mapping for counter typography. */
const COUNTER_SIZES = {
  xs: 'text-xs',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-sm',
  xl: 'text-sm',
};

/** Default size when not provided. */
const DEFAULT_SIZE = 'md';

/** Warning threshold (percentage of max length). */
const WARNING_THRESHOLD = 0.8;

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * TextareaCounter – a character counter for textarea fields.
 *
 * @component
 * @example
 * <TextareaCounter current={50} max={200} />
 *
 * @example
 * <TextareaCounter current={180} max={200} warning />
 *
 * @example
 * <TextareaCounter current={210} max={200} error />
 */
const TextareaCounter = memo(
  forwardRef(function TextareaCounter(
    {
      current = 0,
      max,
      size = DEFAULT_SIZE,
      disabled = false,
      error = false,
      warning = false,
      showFraction = true,
      responsive,
      className = '',
      role = 'status',
      'aria-label': ariaLabel = 'Character count',
      ...rest
    },
    ref,
  ) {
    // Resolve size class.
    const sizeClass = useMemo(
      () => COUNTER_SIZES[size] || COUNTER_SIZES[DEFAULT_SIZE],
      [size],
    );

    // Determine if error or warning states should be applied.
    const isError = useMemo(() => {
      if (error) return true;
      if (max && current > max) return true;
      return false;
    }, [error, current, max]);

    const isWarning = useMemo(() => {
      if (warning) return true;
      if (!isError && max && current >= max * WARNING_THRESHOLD) return true;
      return false;
    }, [warning, isError, current, max]);

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Counter classes.
    const counterClasses = useMemo(() => {
      const base = getTextareaCounterClasses({
        size,
        className,
        error: isError,
        warning: isWarning,
      });
      return mergeClasses(base, responsiveClasses);
    }, [size, className, isError, isWarning, responsiveClasses]);

    // Determine text for the counter.
    const counterText = useMemo(() => {
      if (showFraction && max) {
        return `${current} / ${max}`;
      }
      return `${current}`;
    }, [current, max, showFraction]);

    // Determine accessibility label.
    const accessibleLabel = useMemo(() => {
      if (max) {
        return `Character count: ${current} of ${max}`;
      }
      return `Character count: ${current}`;
    }, [current, max]);

    // If max is not provided, render nothing.
    if (!max) {
      return null;
    }

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || accessibleLabel,
        'aria-disabled': disabled || undefined,
        'aria-valuenow': current,
        'aria-valuemin': 0,
        'aria-valuemax': max,
      }),
      [role, ariaLabel, accessibleLabel, disabled, current, max],
    );

    return (
      <span
        ref={ref}
        className={counterClasses}
        {...ariaProps}
        {...rest}
      >
        {counterText}
      </span>
    );
  }),
);

TextareaCounter.displayName = 'TextareaCounter';

TextareaCounter.propTypes = {
  /** Current character count. */
  current: PropTypes.number,
  /** Maximum character count. */
  max: PropTypes.number,
  /** Size preset (affects typography). */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Error state (also triggered when current > max). */
  error: PropTypes.bool,
  /** Warning state (also triggered when current >= 80% of max). */
  warning: PropTypes.bool,
  /** Whether to show fraction (current / max) or just current. */
  showFraction: PropTypes.bool,
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

export default TextareaCounter;