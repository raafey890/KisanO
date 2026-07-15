/**
 * KisanO Design System — DatePicker Package
 * DatePickerDay
 *
 * A single day cell in the calendar grid. Supports selection, range,
 * disabled, and hover states with proper accessibility.
 *
 * Single Responsibility: Render one calendar day cell.
 * Does not manage calendar state or date selection logic.
 *
 * @module components/ui/DatePicker/DatePickerDay
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
  getDatePickerDayClasses,
} from './datePickerUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Motion variants for day interaction. */
const DAY_MOTION = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
};

/** Focus ring classes for keyboard navigation. */
const FOCUS_CLASSES = 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * DatePickerDay – a single calendar day.
 *
 * @component
 * @example
 * <DatePickerDay
 *   date={date}
 *   selected={isSelected}
 *   disabled={isDisabled}
 *   onClick={handleSelect}
 * />
 */
const DatePickerDay = memo(
  forwardRef(function DatePickerDay(
    {
      date,
      day,
      month,
      year,
      selected = false,
      isToday = false,
      isOutside = false,
      isRangeStart = false,
      isRangeEnd = false,
      isRangeMiddle = false,
      disabled = false,
      onSelect,
      onHover,
      size = DATE_PICKER_DEFAULTS.size,
      responsive,
      className = '',
      role = 'gridcell',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Determine state for styling.
    const dayState = useMemo(() => {
      if (disabled) return 'disabled';
      if (isOutside) return 'outside';
      if (isRangeStart) return 'rangeStart';
      if (isRangeEnd) return 'rangeEnd';
      if (isRangeMiddle) return 'range';
      if (selected) return 'selected';
      if (isToday) return 'today';
      return 'default';
    }, [disabled, isOutside, isRangeStart, isRangeEnd, isRangeMiddle, selected, isToday]);

    // Get day classes.
    const dayClasses = useMemo(
      () =>
        getDatePickerDayClasses({
          state: dayState,
          size,
          className,
          disabled,
        }),
      [dayState, size, className, disabled],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalClasses = useMemo(
      () => mergeClasses(dayClasses, responsiveClasses, FOCUS_CLASSES),
      [dayClasses, responsiveClasses],
    );

    // Handle click.
    const handleClick = useCallback(
      (event) => {
        if (disabled) return;
        onSelect?.(date || new Date(year, month, day), event);
      },
      [disabled, onSelect, date, year, month, day],
    );

    // Handle mouse enter (for hover/range selection).
    const handleMouseEnter = useCallback(
      (event) => {
        if (disabled) return;
        onHover?.(date || new Date(year, month, day), event);
      },
      [disabled, onHover, date, year, month, day],
    );

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion || disabled) {
        return {
          whileHover: undefined,
          whileTap: undefined,
          transition: undefined,
        };
      }
      return {
        whileHover: DAY_MOTION.hover,
        whileTap: DAY_MOTION.tap,
        transition: DAY_MOTION.transition,
      };
    }, [prefersReducedMotion, disabled]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || date?.toLocaleDateString() || `${month + 1}/${day}/${year}`,
        'aria-selected': selected || isRangeStart || isRangeEnd || undefined,
        'aria-disabled': disabled || undefined,
        tabIndex: disabled ? -1 : 0,
        'data-date': date?.toISOString() || `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        'data-selected': selected || undefined,
        'data-today': isToday || undefined,
        'data-range-start': isRangeStart || undefined,
        'data-range-end': isRangeEnd || undefined,
        'data-range-middle': isRangeMiddle || undefined,
        'data-outside': isOutside || undefined,
        'data-disabled': disabled || undefined,
      }),
      [role, ariaLabel, date, month, day, year, selected, isRangeStart, isRangeEnd, isRangeMiddle, isToday, isOutside, disabled],
    );

    // Display day number.
    const displayDay = day || date?.getDate();

    return (
      <motion.button
        ref={ref}
        type="button"
        className={finalClasses}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        disabled={disabled}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {displayDay}
      </motion.button>
    );
  }),
);

DatePickerDay.displayName = 'DatePickerDay';

DatePickerDay.propTypes = {
  /** Date object (preferred). */
  date: PropTypes.instanceOf(Date),
  /** Day number (1-31). */
  day: PropTypes.number,
  /** Month (0-11). */
  month: PropTypes.number,
  /** Year. */
  year: PropTypes.number,
  /** Whether the day is selected. */
  selected: PropTypes.bool,
  /** Whether the day is today. */
  isToday: PropTypes.bool,
  /** Whether the day is outside the current month. */
  isOutside: PropTypes.bool,
  /** Whether the day is the start of a range. */
  isRangeStart: PropTypes.bool,
  /** Whether the day is the end of a range. */
  isRangeEnd: PropTypes.bool,
  /** Whether the day is in the middle of a range. */
  isRangeMiddle: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Callback when day is selected. */
  onSelect: PropTypes.func,
  /** Callback when day is hovered (for range selection). */
  onHover: PropTypes.func,
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
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

export default DatePickerDay;