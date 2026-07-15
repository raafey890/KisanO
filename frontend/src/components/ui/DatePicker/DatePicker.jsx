/**
 * KisanO Design System — DatePicker Package
 * DatePicker
 *
 * The main DatePicker component that orchestrates all date picker subcomponents.
 * Provides a convenient API for selecting dates with calendar navigation,
 * range selection, and validation.
 *
 * Single Responsibility: Orchestrate DatePicker subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/DatePicker/DatePicker
 */

import { forwardRef, memo, useMemo, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  DATE_PICKER_DEFAULTS,
} from './datePickerVariants';
import {
  resolveDefaultProps,
} from './datePickerUtils';

import DatePickerContainer from './DatePickerContainer';
import DatePickerInput from './DatePickerInput';
import DatePickerCalendar from './DatePickerCalendar';
import DatePickerPortal from './DatePickerPortal';
import DatePickerLoader from './DatePickerLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * DatePicker – the main date picker component with calendar and input.
 *
 * @component
 * @example
 * <DatePicker
 *   value={selectedDate}
 *   onChange={setSelectedDate}
 *   placeholder="Select date"
 * />
 *
 * @example
 * <DatePicker
 *   value={dateRange}
 *   onChange={setDateRange}
 *   range
 *   minDate={new Date()}
 *   maxDate={new Date(2025, 11, 31)}
 * />
 */
const DatePicker = memo(
  forwardRef(function DatePicker(
    {
      children,
      value: controlledValue,
      defaultValue = null,
      onChange,
      onOpenChange,
      placeholder = DATE_PICKER_DEFAULTS.placeholder,
      format = DATE_PICKER_DEFAULTS.format,
      variant = DATE_PICKER_DEFAULTS.variant,
      size = DATE_PICKER_DEFAULTS.size,
      radius = DATE_PICKER_DEFAULTS.radius,
      shadow = DATE_PICKER_DEFAULTS.shadow,
      position = DATE_PICKER_DEFAULTS.position,
      animation = DATE_PICKER_DEFAULTS.animation,
      closeOnSelect = DATE_PICKER_DEFAULTS.closeOnSelect,
      closeOnOutsideClick = DATE_PICKER_DEFAULTS.closeOnOutsideClick,
      closeOnEscape = DATE_PICKER_DEFAULTS.closeOnEscape,
      disabled = false,
      loading = false,
      range = false,
      minDate,
      maxDate,
      disabledDates = [],
      weekStartsOn = DATE_PICKER_DEFAULTS.weekStartsOn,
      showToday = true,
      showClear = true,
      portal = true,
      portalContainerId = 'datepicker-portal',
      responsive,
      className = '',
      inputClassName = '',
      calendarClassName = '',
      triggerProps,
      inputProps,
      calendarProps,
      loaderProps,
      containerProps,
      ...rest
    },
    ref,
  ) {
    // Internal state for uncontrolled mode.
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [internalOpen, setInternalOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());

    // Determine if controlled.
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    // Handle value change.
    const handleValueChange = useCallback(
      (newValue) => {
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
      },
      [isControlled, onChange],
    );

    // Handle open change.
    const handleOpenChange = useCallback(
      (newOpen) => {
        setInternalOpen(newOpen);
        onOpenChange?.(newOpen);
      },
      [onOpenChange],
    );

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          radius,
          shadow,
          position,
          animation,
          closeOnSelect,
          closeOnOutsideClick,
          closeOnEscape,
          disabled,
          loading,
          weekStartsOn,
        }),
      [
        variant,
        size,
        radius,
        shadow,
        position,
        animation,
        closeOnSelect,
        closeOnOutsideClick,
        closeOnEscape,
        disabled,
        loading,
        weekStartsOn,
      ],
    );

    // Determine if interactive.
    const isInteractive = !resolved.disabled && !resolved.loading;

    // Format date for display.
    const formatDate = useCallback(
      (date) => {
        if (!date) return '';
        if (Array.isArray(date)) {
          if (date.length === 2) {
            const start = date[0] ? date[0].toLocaleDateString() : '';
            const end = date[1] ? date[1].toLocaleDateString() : '';
            return start && end ? `${start} - ${end}` : start || end;
          }
          return '';
        }
        return date.toLocaleDateString();
      },
      [],
    );

    // Get display value.
    const displayValue = useMemo(() => {
      if (range) {
        if (Array.isArray(value) && value.length === 2) {
          return formatDate(value);
        }
        return '';
      }
      return value ? formatDate(value) : '';
    }, [value, range, formatDate]);

    // Get selected dates for calendar.
    const selectedDates = useMemo(() => {
      if (range) {
        return Array.isArray(value) ? value : [];
      }
      return value ? [value] : [];
    }, [value, range]);

    // Handle date select.
    const handleDateSelect = useCallback(
      (date) => {
        if (!isInteractive) return;

        if (range) {
          let newRange = Array.isArray(value) ? [...value] : [];
          if (newRange.length === 0) {
            newRange = [date, null];
          } else if (newRange.length === 1) {
            if (newRange[0] && date < newRange[0]) {
              newRange = [date, newRange[0]];
            } else {
              newRange = [newRange[0], date];
            }
          } else {
            newRange = [date, null];
          }
          handleValueChange(newRange);
          if (newRange.length === 2 && newRange[0] && newRange[1] && resolved.closeOnSelect) {
            handleOpenChange(false);
          }
        } else {
          handleValueChange(date);
          if (resolved.closeOnSelect) {
            handleOpenChange(false);
          }
        }
      },
      [isInteractive, range, value, resolved.closeOnSelect, handleValueChange, handleOpenChange],
    );

    // Handle clear.
    const handleClear = useCallback(() => {
      if (!isInteractive) return;
      handleValueChange(range ? [] : null);
    }, [isInteractive, range, handleValueChange]);

    // Handle today.
    const handleToday = useCallback(() => {
      if (!isInteractive) return;
      const today = new Date();
      handleValueChange(range ? [today, null] : today);
      setViewDate(today);
    }, [isInteractive, range, handleValueChange]);

    // Update view date when value changes.
    useEffect(() => {
      if (value) {
        if (Array.isArray(value)) {
          const firstDate = value[0] || value[1];
          if (firstDate) setViewDate(firstDate);
        } else {
          setViewDate(value);
        }
      }
    }, [value]);

    // Input props.
    const inputPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        loading: resolved.loading,
        placeholder,
        value: displayValue,
        open: internalOpen,
        onOpenChange: handleOpenChange,
        onClear: handleClear,
        showClear: showClear && !!value,
        responsive,
        className: inputClassName,
        ...inputProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.disabled,
        resolved.loading,
        placeholder,
        displayValue,
        internalOpen,
        handleOpenChange,
        handleClear,
        showClear,
        value,
        responsive,
        inputClassName,
        inputProps,
      ],
    );

    // Calendar props.
    const calendarPropsMerged = useMemo(
      () => ({
        selectedDates,
        onSelect: handleDateSelect,
        minDate,
        maxDate,
        disabledDates,
        weekStartsOn: resolved.weekStartsOn,
        showToday,
        todayLabel: 'Today',
        size: resolved.size,
        variant: resolved.variant,
        radius: resolved.radius,
        shadow: resolved.shadow,
        position: resolved.position,
        animation: resolved.animation,
        disabled: resolved.disabled,
        loading: resolved.loading,
        open: internalOpen,
        onOpenChange: handleOpenChange,
        responsive,
        className: calendarClassName,
        ...calendarProps,
      }),
      [
        selectedDates,
        handleDateSelect,
        minDate,
        maxDate,
        disabledDates,
        resolved.weekStartsOn,
        showToday,
        resolved.size,
        resolved.variant,
        resolved.radius,
        resolved.shadow,
        resolved.position,
        resolved.animation,
        resolved.disabled,
        resolved.loading,
        internalOpen,
        handleOpenChange,
        responsive,
        calendarClassName,
        calendarProps,
      ],
    );

    // Loader props.
    const loaderPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        variant: 'shimmer',
        rows: 6,
        disabled: resolved.disabled,
        responsive,
        ...loaderProps,
      }),
      [resolved.size, resolved.disabled, responsive, loaderProps],
    );

    // Container props.
    const containerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        loading: resolved.loading,
        className,
        ...containerProps,
        ...rest,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.disabled,
        resolved.loading,
        className,
        containerProps,
        rest,
      ],
    );

    // Combine ref.
    const combinedRef = useCallback(
      (node) => {
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    // Determine if we should use portal.
    const CalendarWrapper = portal ? DatePickerPortal : DatePickerCalendar;

    // Portal props.
    const portalProps = portal
      ? {
          open: internalOpen,
          containerId: portalContainerId,
          disabled: resolved.disabled,
        }
      : {};

    // Render calendar content.
    const renderCalendarContent = () => {
      if (resolved.loading) {
        return <DatePickerLoader {...loaderPropsMerged} />;
      }
      return <DatePickerCalendar {...calendarPropsMerged} />;
    };

    // If using portal, wrap calendar inside portal.
    if (portal) {
      return (
        <DatePickerContainer ref={combinedRef} {...containerPropsMerged}>
          <DatePickerInput {...inputPropsMerged} />
          <DatePickerPortal {...portalProps}>
            {renderCalendarContent()}
          </DatePickerPortal>
        </DatePickerContainer>
      );
    }

    // Without portal, use calendar directly.
    return (
      <DatePickerContainer ref={combinedRef} {...containerPropsMerged}>
        <DatePickerInput {...inputPropsMerged} />
        {renderCalendarContent()}
      </DatePickerContainer>
    );
  }),
);

DatePicker.displayName = 'DatePicker';

DatePicker.propTypes = {
  /** Controlled value (Date or array of Dates for range). */
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  ]),
  /** Default value for uncontrolled mode. */
  defaultValue: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  ]),
  /** Callback when date changes. */
  onChange: PropTypes.func,
  /** Callback when open state changes. */
  onOpenChange: PropTypes.func,
  /** Placeholder text. */
  placeholder: PropTypes.string,
  /** Date format for display. */
  format: PropTypes.string,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'filled', 'outlined', 'ghost']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Calendar position. */
  position: PropTypes.oneOf(['bottom', 'bottom-start', 'bottom-end', 'top', 'top-start', 'top-end']),
  /** Animation type. */
  animation: PropTypes.oneOf(['fade', 'slide', 'scale', 'slideScale', 'none']),
  /** Close calendar when a date is selected. */
  closeOnSelect: PropTypes.bool,
  /** Close calendar when clicking outside. */
  closeOnOutsideClick: PropTypes.bool,
  /** Close calendar when pressing Escape. */
  closeOnEscape: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Whether to enable date range selection. */
  range: PropTypes.bool,
  /** Minimum selectable date. */
  minDate: PropTypes.instanceOf(Date),
  /** Maximum selectable date. */
  maxDate: PropTypes.instanceOf(Date),
  /** Array of disabled dates. */
  disabledDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  /** First day of week (0 = Sunday, 1 = Monday, etc.). */
  weekStartsOn: PropTypes.number,
  /** Whether to show today button. */
  showToday: PropTypes.bool,
  /** Whether to show clear button. */
  showClear: PropTypes.bool,
  /** Whether to render calendar in a portal. */
  portal: PropTypes.bool,
  /** Portal container ID. */
  portalContainerId: PropTypes.string,
  /** Responsive overrides. */
  responsive: PropTypes.shape({
    xs: PropTypes.string,
    sm: PropTypes.string,
    md: PropTypes.string,
    lg: PropTypes.string,
    xl: PropTypes.string,
  }),
  /** Additional CSS classes for the container. */
  className: PropTypes.string,
  /** Additional CSS classes for the input. */
  inputClassName: PropTypes.string,
  /** Additional CSS classes for the calendar. */
  calendarClassName: PropTypes.string,
  /** Additional props for DatePickerInput. */
  inputProps: PropTypes.object,
  /** Additional props for DatePickerCalendar. */
  calendarProps: PropTypes.object,
  /** Additional props for DatePickerLoader. */
  loaderProps: PropTypes.object,
  /** Additional props for DatePickerContainer. */
  containerProps: PropTypes.object,
  /** Additional props for the trigger. */
  triggerProps: PropTypes.object,
  /** Additional content. */
  children: PropTypes.node,
};

export default DatePicker;