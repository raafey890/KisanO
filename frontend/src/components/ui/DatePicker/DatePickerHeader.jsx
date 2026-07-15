/**
 * KisanO Design System — DatePicker Package
 * DatePickerHeader
 *
 * The header component for the date picker calendar. Renders month/year
 * navigation with previous/next buttons and current month/year display.
 *
 * Single Responsibility: Render the calendar header with navigation controls.
 * Does not manage date selection or calendar grid rendering.
 *
 * @module components/ui/DatePicker/DatePickerHeader
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

/** Month names. */
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Short month names. */
const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Motion variants for header animation. */
const HEADER_MOTION = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/** Button size mapping. */
const BUTTON_SIZES = {
  xs: 'h-6 w-6',
  sm: 'h-7 w-7',
  md: 'h-8 w-8',
  lg: 'h-9 w-9',
  xl: 'h-10 w-10',
};

/** Icon size mapping. */
const ICON_SIZES = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-4.5 w-4.5',
  xl: 'h-5 w-5',
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * DatePickerHeader – the calendar header with navigation.
 *
 * @component
 * @example
 * <DatePickerHeader
 *   month={0}
 *   year={2024}
 *   onPrevMonth={handlePrevMonth}
 *   onNextMonth={handleNextMonth}
 * />
 */
const DatePickerHeader = memo(
  forwardRef(function DatePickerHeader(
    {
      month,
      year,
      onPrevMonth,
      onNextMonth,
      onMonthSelect,
      onYearSelect,
      size = DATE_PICKER_DEFAULTS.size,
      disabled = false,
      loading = false,
      showMonthPicker = false,
      showYearPicker = false,
      responsive,
      className = '',
      prevLabel = 'Previous month',
      nextLabel = 'Next month',
      monthFormat = 'long', // 'long', 'short', 'numeric'
      role = 'header',
      'aria-label': ariaLabel = 'Calendar navigation',
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

    // Icon size.
    const iconSize = useMemo(
      () => ICON_SIZES[size] || ICON_SIZES.md,
      [size],
    );

    // Month display.
    const monthDisplay = useMemo(() => {
      if (monthFormat === 'short') return MONTHS_SHORT[month];
      if (monthFormat === 'numeric') return String(month + 1).padStart(2, '0');
      return MONTHS[month];
    }, [month, monthFormat]);

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Header classes.
    const headerClasses = useMemo(() => {
      const base = mergeClasses(
        'flex items-center justify-between',
        sizeConfig.gap,
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'opacity-70',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [sizeConfig.gap, disabled, loading, className, responsiveClasses]);

    // Button classes.
    const buttonClasses = useMemo(() => {
      const base = mergeClasses(
        'flex items-center justify-center rounded-full',
        buttonSize,
        'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
        'focus:outline-none focus:ring-2 focus:ring-blue-500',
        'transition-colors duration-200',
        disabled && 'pointer-events-none opacity-50',
        loading && 'pointer-events-none opacity-50',
      );
      return base;
    }, [buttonSize, disabled, loading]);

    // Month/year display classes.
    const displayClasses = useMemo(() => {
      const base = mergeClasses(
        'font-medium',
        sizeConfig.text,
        'text-gray-900',
        disabled && 'text-gray-400',
        loading && 'text-gray-400',
      );
      return base;
    }, [sizeConfig.text, disabled, loading]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true };
      }
      return HEADER_MOTION;
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

    return (
      <motion.div
        ref={ref}
        className={headerClasses}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {/* Previous Month Button */}
        <button
          type="button"
          className={buttonClasses}
          onClick={onPrevMonth}
          disabled={disabled || loading}
          aria-label={prevLabel}
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
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Month/Year Display */}
        <div className="flex items-center gap-2">
          {showMonthPicker ? (
            <select
              value={month}
              onChange={(e) => onMonthSelect?.(Number(e.target.value))}
              className={mergeClasses(
                displayClasses,
                'bg-transparent border-none focus:ring-2 focus:ring-blue-500 rounded-md',
              )}
              disabled={disabled || loading}
            >
              {MONTHS.map((monthName, index) => (
                <option key={index} value={index}>
                  {monthName}
                </option>
              ))}
            </select>
          ) : (
            <span className={displayClasses}>
              {monthDisplay}
            </span>
          )}

          {showYearPicker ? (
            <select
              value={year}
              onChange={(e) => onYearSelect?.(Number(e.target.value))}
              className={mergeClasses(
                displayClasses,
                'bg-transparent border-none focus:ring-2 focus:ring-blue-500 rounded-md',
              )}
              disabled={disabled || loading}
            >
              {Array.from({ length: 100 }, (_, i) => {
                const yearValue = year - 50 + i;
                return (
                  <option key={yearValue} value={yearValue}>
                    {yearValue}
                  </option>
                );
              })}
            </select>
          ) : (
            <span className={displayClasses}>
              {year}
            </span>
          )}
        </div>

        {/* Next Month Button */}
        <button
          type="button"
          className={buttonClasses}
          onClick={onNextMonth}
          disabled={disabled || loading}
          aria-label={nextLabel}
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
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </motion.div>
    );
  }),
);

DatePickerHeader.displayName = 'DatePickerHeader';

DatePickerHeader.propTypes = {
  /** Current month (0-11). */
  month: PropTypes.number.isRequired,
  /** Current year. */
  year: PropTypes.number.isRequired,
  /** Callback when previous month is clicked. */
  onPrevMonth: PropTypes.func,
  /** Callback when next month is clicked. */
  onNextMonth: PropTypes.func,
  /** Callback when month is selected from picker. */
  onMonthSelect: PropTypes.func,
  /** Callback when year is selected from picker. */
  onYearSelect: PropTypes.func,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Whether to show month picker dropdown. */
  showMonthPicker: PropTypes.bool,
  /** Whether to show year picker dropdown. */
  showYearPicker: PropTypes.bool,
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
  /** Label for previous month button. */
  prevLabel: PropTypes.string,
  /** Label for next month button. */
  nextLabel: PropTypes.string,
  /** Month display format. */
  monthFormat: PropTypes.oneOf(['long', 'short', 'numeric']),
  /** ARIA role. */
  role: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default DatePickerHeader;