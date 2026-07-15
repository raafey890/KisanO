/**
 * KisanO Design System — DatePicker Package
 * DatePickerCalendar
 *
 * The calendar component for the date picker. Renders a monthly calendar
 * with navigation, date selection, and accessibility support.
 *
 * Single Responsibility: Render the calendar grid and handle date selection.
 * Does not manage input state or portal rendering.
 *
 * @module components/ui/DatePicker/DatePickerCalendar
 */

import { forwardRef, memo, useMemo, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  DATE_PICKER_DEFAULTS,
  getDatePickerSize,
} from './datePickerVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getDatePickerCalendarClasses,
  getDatePickerDayClasses,
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

/** Day names. */
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Short day names. */
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Motion variants for calendar animation. */
const CALENDAR_MOTION = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Checks if a date is the same day.
 * @param {Date} date1 - First date.
 * @param {Date} date2 - Second date.
 * @returns {boolean} True if same day.
 */
function isSameDay(date1, date2) {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Checks if a date is between two dates.
 * @param {Date} date - Date to check.
 * @param {Date} start - Start date.
 * @param {Date} end - End date.
 * @returns {boolean} True if between.
 */
function isDateBetween(date, start, end) {
  if (!date || !start || !end) return false;
  const time = date.getTime();
  return time >= start.getTime() && time <= end.getTime();
}

/**
 * Checks if a date is in a list of disabled dates.
 * @param {Date} date - Date to check.
 * @param {Date[]} disabledDates - List of disabled dates.
 * @returns {boolean} True if disabled.
 */
function isDateDisabled(date, disabledDates) {
  return disabledDates.some((d) => isSameDay(date, d));
}

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * DatePickerCalendar – the calendar grid for date selection.
 *
 * @component
 * @example
 * <DatePickerCalendar
 *   selectedDates={[selectedDate]}
 *   onSelect={handleDateSelect}
 * />
 */
const DatePickerCalendar = memo(
  forwardRef(function DatePickerCalendar(
    {
      selectedDates = [],
      onSelect,
      minDate,
      maxDate,
      disabledDates = [],
      weekStartsOn = DATE_PICKER_DEFAULTS.weekStartsOn,
      size = DATE_PICKER_DEFAULTS.size,
      variant = DATE_PICKER_DEFAULTS.variant,
      radius = DATE_PICKER_DEFAULTS.radius,
      shadow = DATE_PICKER_DEFAULTS.shadow,
      position = DATE_PICKER_DEFAULTS.position,
      animation = DATE_PICKER_DEFAULTS.animation,
      disabled = false,
      loading = false,
      open = false,
      onOpenChange,
      showToday = true,
      todayLabel = 'Today',
      responsive,
      className = '',
      role = 'grid',
      'aria-label': ariaLabel = 'Calendar',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
    const [viewDate, setViewDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(viewDate.getMonth());
    const [currentYear, setCurrentYear] = useState(viewDate.getFullYear());

    // Reset view when selected date changes.
    useEffect(() => {
      if (selectedDates.length > 0 && selectedDates[0]) {
        const date = selectedDates[0];
        setCurrentMonth(date.getMonth());
        setCurrentYear(date.getFullYear());
      }
    }, [selectedDates]);

    // Get calendar classes.
    const calendarClasses = useMemo(
      () =>
        getDatePickerCalendarClasses({
          position,
          radius,
          shadow,
          className,
          disabled,
          loading,
        }),
      [position, radius, shadow, className, disabled, loading],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(calendarClasses, responsiveClasses),
      [calendarClasses, responsiveClasses],
    );

    // Get size configuration.
    const sizeConfig = useMemo(
      () => getDatePickerSize(size),
      [size],
    );

    // Generate days for the current month.
    const generateDays = useCallback(() => {
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
      const daysInMonth = lastDayOfMonth.getDate();

      // Get the day of the week for the first day (adjusted for weekStartsOn).
      let firstDayOfWeek = firstDayOfMonth.getDay();
      firstDayOfWeek = (firstDayOfWeek - weekStartsOn + 7) % 7;

      const days = [];

      // Previous month days.
      const prevMonthDays = firstDayOfWeek;
      const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
      for (let i = prevMonthDays - 1; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - 1, prevMonthLastDay - i);
        days.push({ date, isOutside: true });
      }

      // Current month days.
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(currentYear, currentMonth, i);
        days.push({ date, isOutside: false });
      }

      // Next month days.
      const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(currentYear, currentMonth + 1, i);
        days.push({ date, isOutside: true });
      }

      return days;
    }, [currentYear, currentMonth, weekStartsOn]);

    // Check if date is selected.
    const isSelected = useCallback(
      (date) => {
        return selectedDates.some((d) => isSameDay(date, d));
      },
      [selectedDates],
    );

    // Check if date is in range.
    const isInRange = useCallback(
      (date) => {
        if (selectedDates.length !== 2) return false;
        const [start, end] = selectedDates;
        if (!start || !end) return false;
        return isDateBetween(date, start, end);
      },
      [selectedDates],
    );

    // Check if date is disabled.
    const isDisabled = useCallback(
      (date) => {
        if (disabled) return true;
        if (isDateDisabled(date, disabledDates)) return true;
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;
        return false;
      },
      [disabled, disabledDates, minDate, maxDate],
    );

    // Get day state.
    const getDayState = useCallback(
      (date, isOutside) => {
        if (isOutside) return 'outside';
        if (isDisabled(date)) return 'disabled';

        const isSelectedDay = isSelected(date);
        const isInRangeDay = isInRange(date);
        const today = new Date();
        const isToday = isSameDay(date, today);

        if (isSelectedDay) {
          if (selectedDates.length === 2) {
            const [start, end] = selectedDates;
            if (start && end && isSameDay(date, start)) return 'rangeStart';
            if (start && end && isSameDay(date, end)) return 'rangeEnd';
            return 'range';
          }
          return 'selected';
        }

        if (isInRangeDay) return 'range';
        if (isToday) return 'today';

        return 'default';
      },
      [isDisabled, isSelected, isInRange, selectedDates],
    );

    // Handle date selection.
    const handleDateSelect = useCallback(
      (date) => {
        if (isDisabled(date)) return;
        onSelect?.(date);
      },
      [isDisabled, onSelect],
    );

    // Navigation handlers.
    const handlePrevMonth = useCallback(() => {
      if (currentMonth === 0) {
        setCurrentYear(currentYear - 1);
        setCurrentMonth(11);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }, [currentMonth, currentYear]);

    const handleNextMonth = useCallback(() => {
      if (currentMonth === 11) {
        setCurrentYear(currentYear + 1);
        setCurrentMonth(0);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }, [currentMonth, currentYear]);

    const handleToday = useCallback(() => {
      const today = new Date();
      setCurrentMonth(today.getMonth());
      setCurrentYear(today.getFullYear());
      if (!isDisabled(today)) {
        onSelect?.(today);
      }
    }, [onSelect, isDisabled]);

    // Keyboard navigation for days.
    const handleKeyDown = useCallback(
      (event) => {
        // Navigation handled by parent component.
        if (event.key === 'Escape' && onOpenChange) {
          onOpenChange(false);
        }
      },
      [onOpenChange],
    );

    // Generate days.
    const days = useMemo(() => generateDays(), [generateDays]);

    // Weekday headers.
    const weekdayHeaders = useMemo(() => {
      const headers = [];
      for (let i = 0; i < 7; i++) {
        const dayIndex = (i + weekStartsOn) % 7;
        headers.push(DAYS_SHORT[dayIndex]);
      }
      return headers;
    }, [weekStartsOn]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return CALENDAR_MOTION;
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
        className={finalClasses}
        {...motionProps}
        {...ariaProps}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              onClick={handlePrevMonth}
              aria-label="Previous month"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className="font-medium text-sm">
              {MONTHS[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              onClick={handleNextMonth}
              aria-label="Next month"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          {showToday && (
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              onClick={handleToday}
            >
              {todayLabel}
            </button>
          )}
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdayHeaders.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 py-1"
              aria-label={day}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1" role="grid">
          {days.map(({ date, isOutside }, index) => {
            const dayState = getDayState(date, isOutside);
            const isDisabledDay = isDisabled(date);
            const dayClasses = getDatePickerDayClasses({
              state: dayState,
              size,
              disabled: isDisabledDay,
            });

            return (
              <button
                key={index}
                type="button"
                className={dayClasses}
                onClick={() => handleDateSelect(date)}
                disabled={isDisabledDay}
                aria-label={date.toLocaleDateString()}
                role="gridcell"
                aria-selected={isSelected(date)}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  }),
);

DatePickerCalendar.displayName = 'DatePickerCalendar';

DatePickerCalendar.propTypes = {
  /** Selected date(s). */
  selectedDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  /** Callback when a date is selected. */
  onSelect: PropTypes.func,
  /** Minimum selectable date. */
  minDate: PropTypes.instanceOf(Date),
  /** Maximum selectable date. */
  maxDate: PropTypes.instanceOf(Date),
  /** Array of disabled dates. */
  disabledDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  /** First day of week (0 = Sunday, 1 = Monday, etc.). */
  weekStartsOn: PropTypes.number,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'filled', 'outlined', 'ghost']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Calendar position. */
  position: PropTypes.oneOf(['bottom', 'bottom-start', 'bottom-end', 'top', 'top-start', 'top-end']),
  /** Animation type. */
  animation: PropTypes.oneOf(['fade', 'slide', 'scale', 'slideScale', 'none']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Whether the calendar is open. */
  open: PropTypes.bool,
  /** Callback when open state changes. */
  onOpenChange: PropTypes.func,
  /** Whether to show today button. */
  showToday: PropTypes.bool,
  /** Label for today button. */
  todayLabel: PropTypes.string,
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

export default DatePickerCalendar;