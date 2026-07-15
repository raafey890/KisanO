/**
 * KisanO Design System — DatePicker Package
 * DatePickerFooter
 *
 * The footer component for the date picker calendar. Renders action buttons
 * like Today, Clear, Apply, and Cancel with accessibility support.
 *
 * Single Responsibility: Render the calendar footer with action buttons.
 * Does not manage date selection or calendar grid rendering.
 *
 * @module components/ui/DatePicker/DatePickerFooter
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  DATE_PICKER_DEFAULTS,
  getDatePickerSize,
} from './datePickerVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
} from './datePickerUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for footer animation. */
const FOOTER_MOTION = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Button size mapping. */
const BUTTON_SIZES = {
  xs: 'text-xs px-2 py-1',
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-2.5',
  xl: 'text-base px-6 py-3',
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * DatePickerFooter – the calendar footer with action buttons.
 *
 * @component
 * @example
 * <DatePickerFooter
 *   onToday={handleToday}
 *   onClear={handleClear}
 *   onApply={handleApply}
 *   onCancel={handleCancel}
 * />
 */
const DatePickerFooter = memo(
  forwardRef(function DatePickerFooter(
    {
      onToday,
      onClear,
      onApply,
      onCancel,
      showToday = true,
      showClear = true,
      showApply = false,
      showCancel = false,
      hasValue = false,
      size = DATE_PICKER_DEFAULTS.size,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      todayLabel = 'Today',
      clearLabel = 'Clear',
      applyLabel = 'Apply',
      cancelLabel = 'Cancel',
      role = 'footer',
      'aria-label': ariaLabel = 'Calendar actions',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getDatePickerSize(size),
      [size],
    );

    // Button size.
    const buttonSize = useMemo(
      () => BUTTON_SIZES[size] || BUTTON_SIZES.md,
      [size],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Footer classes.
    const footerClasses = useMemo(() => {
      const base = mergeClasses(
        'flex items-center justify-between gap-2 mt-4 pt-3 border-t border-gray-200',
        sizeConfig.gap,
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'opacity-70',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [sizeConfig.gap, disabled, loading, className, responsiveClasses]);

    // Button classes (primary).
    const primaryButtonClasses = useMemo(() => {
      const base = mergeClasses(
        'inline-flex items-center justify-center',
        'font-medium rounded-md',
        buttonSize,
        'bg-blue-600 text-white hover:bg-blue-700',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'transition-colors duration-200',
        disabled && 'pointer-events-none opacity-50',
        loading && 'pointer-events-none opacity-50',
      );
      return base;
    }, [buttonSize, disabled, loading]);

    // Button classes (secondary).
    const secondaryButtonClasses = useMemo(() => {
      const base = mergeClasses(
        'inline-flex items-center justify-center',
        'font-medium rounded-md',
        buttonSize,
        'text-gray-700 hover:text-gray-900 hover:bg-gray-100',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'transition-colors duration-200',
        disabled && 'pointer-events-none opacity-50',
        loading && 'pointer-events-none opacity-50',
      );
      return base;
    }, [buttonSize, disabled, loading]);

    // Button classes (text).
    const textButtonClasses = useMemo(() => {
      const base = mergeClasses(
        'inline-flex items-center justify-center',
        'font-medium',
        buttonSize,
        'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'transition-colors duration-200',
        disabled && 'pointer-events-none opacity-50',
        loading && 'pointer-events-none opacity-50',
      );
      return base;
    }, [buttonSize, disabled, loading]);

    // Handle Today click.
    const handleToday = useCallback(
      (event) => {
        if (disabled || loading) return;
        onToday?.(event);
      },
      [disabled, loading, onToday],
    );

    // Handle Clear click.
    const handleClear = useCallback(
      (event) => {
        if (disabled || loading) return;
        onClear?.(event);
      },
      [disabled, loading, onClear],
    );

    // Handle Apply click.
    const handleApply = useCallback(
      (event) => {
        if (disabled || loading) return;
        onApply?.(event);
      },
      [disabled, loading, onApply],
    );

    // Handle Cancel click.
    const handleCancel = useCallback(
      (event) => {
        if (disabled || loading) return;
        onCancel?.(event);
      },
      [disabled, loading, onCancel],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return FOOTER_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
      }),
      [role, ariaLabel, disabled, loading],
    );

    // Determine if footer has any buttons.
    const hasButtons = showToday || showClear || showApply || showCancel;

    // If no buttons, render nothing.
    if (!hasButtons) {
      return null;
    }

    return (
      <motion.footer
        ref={ref}
        className={footerClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        <div className="flex items-center gap-2">
          {showToday && (
            <button
              type="button"
              className={textButtonClasses}
              onClick={handleToday}
              disabled={disabled || loading}
            >
              {todayLabel}
            </button>
          )}
          {showClear && hasValue && (
            <button
              type="button"
              className={textButtonClasses}
              onClick={handleClear}
              disabled={disabled || loading}
            >
              {clearLabel}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showCancel && (
            <button
              type="button"
              className={secondaryButtonClasses}
              onClick={handleCancel}
              disabled={disabled || loading}
            >
              {cancelLabel}
            </button>
          )}
          {showApply && (
            <button
              type="button"
              className={primaryButtonClasses}
              onClick={handleApply}
              disabled={disabled || loading || !hasValue}
            >
              {applyLabel}
            </button>
          )}
        </div>
      </motion.footer>
    );
  }),
);

DatePickerFooter.displayName = 'DatePickerFooter';

DatePickerFooter.propTypes = {
  /** Callback when Today button is clicked. */
  onToday: PropTypes.func,
  /** Callback when Clear button is clicked. */
  onClear: PropTypes.func,
  /** Callback when Apply button is clicked. */
  onApply: PropTypes.func,
  /** Callback when Cancel button is clicked. */
  onCancel: PropTypes.func,
  /** Whether to show Today button. */
  showToday: PropTypes.bool,
  /** Whether to show Clear button. */
  showClear: PropTypes.bool,
  /** Whether to show Apply button. */
  showApply: PropTypes.bool,
  /** Whether to show Cancel button. */
  showCancel: PropTypes.bool,
  /** Whether the date picker has a value. */
  hasValue: PropTypes.bool,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
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
  /** Label for Today button. */
  todayLabel: PropTypes.string,
  /** Label for Clear button. */
  clearLabel: PropTypes.string,
  /** Label for Apply button. */
  applyLabel: PropTypes.string,
  /** Label for Cancel button. */
  cancelLabel: PropTypes.string,
  /** ARIA role. */
  role: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default DatePickerFooter;