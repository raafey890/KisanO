/**
 * KisanO Design System — DatePicker Package
 * DatePickerInput
 *
 * The input component for the date picker. Renders a text input with
 * calendar icon, clear button, and accessibility support.
 *
 * Single Responsibility: Render the date picker input with icons.
 * Does not manage date selection or calendar state.
 *
 * @module components/ui/DatePicker/DatePickerInput
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  DATE_PICKER_DEFAULTS,
} from './datePickerVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getDatePickerInputClasses,
} from './datePickerUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for input interaction. */
const INPUT_MOTION = {
  initial: { scale: 1 },
  hover: { scale: 1.01 },
  tap: { scale: 0.99 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * DatePickerInput – the input field for the date picker.
 *
 * @component
 * @example
 * <DatePickerInput
 *   value="2024-01-15"
 *   placeholder="Select date"
 *   onClear={handleClear}
 * />
 */
const DatePickerInput = memo(
  forwardRef(function DatePickerInput(
    {
      value = '',
      placeholder = DATE_PICKER_DEFAULTS.placeholder,
      size = DATE_PICKER_DEFAULTS.size,
      variant = DATE_PICKER_DEFAULTS.variant,
      disabled = false,
      loading = false,
      readOnly = false,
      open = false,
      error = false,
      success = false,
      showClear = false,
      onClear,
      onClick,
      responsive,
      className = '',
      role = 'combobox',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Input classes.
    const inputClasses = useMemo(
      () =>
        getDatePickerInputClasses({
          variant,
          size,
          className,
          disabled,
          loading,
          open,
          error,
        }),
      [variant, size, className, disabled, loading, open, error],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(inputClasses, responsiveClasses),
      [inputClasses, responsiveClasses],
    );

    // Handle clear click.
    const handleClear = useCallback(
      (event) => {
        event.stopPropagation();
        if (disabled || loading) return;
        onClear?.();
      },
      [disabled, loading, onClear],
    );

    // Handle click.
    const handleClick = useCallback(
      (event) => {
        if (disabled || loading) return;
        onClick?.(event);
      },
      [disabled, loading, onClick],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion || disabled || loading) {
        return {
          whileHover: undefined,
          whileTap: undefined,
          transition: undefined,
        };
      }
      return {
        whileHover: INPUT_MOTION.hover,
        whileTap: INPUT_MOTION.tap,
        transition: INPUT_MOTION.transition,
      };
    }, [prefersReducedMotion, disabled, loading]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || placeholder,
        'aria-expanded': open,
        'aria-haspopup': 'dialog',
        'aria-disabled': disabled || undefined,
        'aria-readonly': readOnly || undefined,
        'aria-invalid': error || undefined,
        tabIndex: disabled ? -1 : 0,
      }),
      [role, ariaLabel, placeholder, open, disabled, readOnly, error],
    );

    return (
      <motion.div
        ref={ref}
        className={finalClasses}
        onClick={handleClick}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {/* Calendar Icon */}
        <svg
          className="h-4 w-4 shrink-0 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>

        {/* Input Value */}
        <span className="flex-1 truncate">
          {value || placeholder}
        </span>

        {/* Loading Spinner */}
        {loading && (
          <svg
            className="animate-spin h-4 w-4 shrink-0 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
          </svg>
        )}

        {/* Clear Button */}
        {showClear && !disabled && !loading && (
          <button
            type="button"
            className="p-0.5 rounded-full hover:bg-gray-200 transition-colors shrink-0"
            onClick={handleClear}
            aria-label="Clear date"
          >
            <svg
              className="h-4 w-4 text-gray-400 hover:text-gray-600"
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

        {/* Dropdown Arrow */}
        {!loading && (
          <svg
            className={mergeClasses(
              'h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200',
              open && 'rotate-180',
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        )}
      </motion.div>
    );
  }),
);

DatePickerInput.displayName = 'DatePickerInput';

DatePickerInput.propTypes = {
  /** Display value. */
  value: PropTypes.string,
  /** Placeholder text. */
  placeholder: PropTypes.string,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'filled', 'outlined', 'ghost']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Read-only state. */
  readOnly: PropTypes.bool,
  /** Whether the calendar is open. */
  open: PropTypes.bool,
  /** Error state. */
  error: PropTypes.bool,
  /** Success state. */
  success: PropTypes.bool,
  /** Whether to show the clear button. */
  showClear: PropTypes.bool,
  /** Callback when clear button is clicked. */
  onClear: PropTypes.func,
  /** Callback when input is clicked. */
  onClick: PropTypes.func,
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

export default DatePickerInput;