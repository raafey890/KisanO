/**
 * KisanO Design System — DatePicker Package
 * DatePicker Utilities
 *
 * Production-ready utility functions for the DatePicker package.
 * Contains only pure utility functions based on the existing datePickerVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for date picker styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/DatePicker/datePickerUtils
 */

import {
  DATE_PICKER_VARIANTS,
  DATE_PICKER_SIZES,
  DATE_PICKER_RADIUS,
  DATE_PICKER_SHADOWS,
  DATE_PICKER_POSITIONS,
  DATE_PICKER_ANIMATIONS,
  DATE_PICKER_DAY_STATES,
  DATE_PICKER_DEFAULTS,
  getDatePickerVariant,
  getDatePickerSize,
  getDatePickerRadius,
  getDatePickerShadow,
  getDatePickerPosition,
  getDatePickerAnimation,
  getDatePickerDayState,
} from './datePickerVariants';

/* ---------------------------------- */
/* Core Utility Functions             */
/* ---------------------------------- */

/**
 * Merges an arbitrary list of class values into a single class string.
 * - Falsy values (null, undefined, false, '') are ignored.
 * - Whitespace is normalized.
 * - Duplicate class names are removed (first occurrence wins).
 *
 * @param {...(string|false|null|undefined)} classes - Class values to merge.
 * @returns {string} A single, de-duplicated class string.
 *
 * @example
 * mergeClasses('p-4', isError && 'border-red-500', undefined)
 * // => 'p-4 border-red-500'
 */
export function mergeClasses(...classes) {
  const seen = new Set();
  const tokens = classes
    .filter(Boolean)
    .join(' ')
    .split(/\s+/)
    .filter((token) => token && !seen.has(token));

  for (const token of tokens) {
    seen.add(token);
  }
  return tokens.join(' ');
}

/**
 * Resolves responsive class overrides into a single class string.
 *
 * @param {Object} responsive - Responsive class map.
 * @param {string} [responsive.xs] - Extra small classes.
 * @param {string} [responsive.sm] - Small classes.
 * @param {string} [responsive.md] - Medium classes.
 * @param {string} [responsive.lg] - Large classes.
 * @param {string} [responsive.xl] - Extra large classes.
 * @returns {string} Merged responsive classes.
 */
export function resolveResponsiveClasses(responsive = {}) {
  const { xs, sm, md, lg, xl } = responsive;
  return mergeClasses(
    xs || '',
    sm ? `sm:${sm}` : '',
    md ? `md:${md}` : '',
    lg ? `lg:${lg}` : '',
    xl ? `xl:${xl}` : '',
  );
}

/**
 * Resolves default props for date picker components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Date picker variant.
 * @param {string} [props.size] - Date picker size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.shadow] - Shadow level.
 * @param {string} [props.position] - Calendar position.
 * @param {string} [props.animation] - Animation type.
 * @param {boolean} [props.closeOnSelect] - Close on select.
 * @param {boolean} [props.closeOnOutsideClick] - Close on outside click.
 * @param {boolean} [props.closeOnEscape] - Close on escape.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.loading] - Loading state.
 * @param {number} [props.weekStartsOn] - First day of week.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = DATE_PICKER_DEFAULTS.variant,
  size = DATE_PICKER_DEFAULTS.size,
  radius = DATE_PICKER_DEFAULTS.radius,
  shadow = DATE_PICKER_DEFAULTS.shadow,
  position = DATE_PICKER_DEFAULTS.position,
  animation = DATE_PICKER_DEFAULTS.animation,
  closeOnSelect = DATE_PICKER_DEFAULTS.closeOnSelect,
  closeOnOutsideClick = DATE_PICKER_DEFAULTS.closeOnOutsideClick,
  closeOnEscape = DATE_PICKER_DEFAULTS.closeOnEscape,
  disabled = DATE_PICKER_DEFAULTS.disabled,
  loading = DATE_PICKER_DEFAULTS.loading,
  weekStartsOn = DATE_PICKER_DEFAULTS.weekStartsOn,
}) {
  return {
    variant: DATE_PICKER_VARIANTS[variant] ? variant : DATE_PICKER_DEFAULTS.variant,
    size: DATE_PICKER_SIZES[size] ? size : DATE_PICKER_DEFAULTS.size,
    radius: DATE_PICKER_RADIUS[radius] ? radius : DATE_PICKER_DEFAULTS.radius,
    shadow: DATE_PICKER_SHADOWS[shadow] ? shadow : DATE_PICKER_DEFAULTS.shadow,
    position: DATE_PICKER_POSITIONS[position] ? position : DATE_PICKER_DEFAULTS.position,
    animation: DATE_PICKER_ANIMATIONS[animation] ? animation : DATE_PICKER_DEFAULTS.animation,
    closeOnSelect,
    closeOnOutsideClick,
    closeOnEscape,
    disabled,
    loading,
    weekStartsOn,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete date picker classes based on options.
 *
 * @param {Object} options - Date picker options.
 * @param {string} [options.variant] - Date picker variant.
 * @param {string} [options.size] - Date picker size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.shadow] - Shadow level.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @param {boolean} [options.open] - Open state.
 * @returns {string} Merged date picker classes.
 */
export function getDatePickerClasses({
  variant = DATE_PICKER_DEFAULTS.variant,
  size = DATE_PICKER_DEFAULTS.size,
  radius = DATE_PICKER_DEFAULTS.radius,
  shadow = DATE_PICKER_DEFAULTS.shadow,
  className = '',
  disabled = false,
  loading = false,
  open = false,
}) {
  const variantConfig = getDatePickerVariant(variant);
  const sizeConfig = getDatePickerSize(size);

  return mergeClasses(
    'relative w-full',
    variantConfig.background,
    variantConfig.text,
    variantConfig.border,
    getDatePickerRadius(radius),
    getDatePickerShadow(shadow),
    disabled && variantConfig.disabled,
    loading && 'opacity-70 cursor-progress',
    open && 'ring-2 ring-blue-500',
    className,
  );
}

/**
 * Gets container classes for date picker wrapper.
 *
 * @param {string} [className] - Additional classes.
 * @returns {string} Merged container classes.
 */
export function getDatePickerContainerClasses(className = '') {
  return mergeClasses(
    'relative inline-block w-full',
    className,
  );
}

/**
 * Gets input classes for date picker input.
 *
 * @param {Object} options - Input options.
 * @param {string} [options.variant] - Date picker variant.
 * @param {string} [options.size] - Date picker size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @param {boolean} [options.open] - Open state.
 * @param {boolean} [options.error] - Error state.
 * @returns {string} Merged input classes.
 */
export function getDatePickerInputClasses({
  variant = DATE_PICKER_DEFAULTS.variant,
  size = DATE_PICKER_DEFAULTS.size,
  className = '',
  disabled = false,
  loading = false,
  open = false,
  error = false,
}) {
  const variantConfig = getDatePickerVariant(variant);
  const sizeConfig = getDatePickerSize(size);

  return mergeClasses(
    'flex items-center w-full',
    sizeConfig.padding,
    sizeConfig.minHeight,
    sizeConfig.text,
    sizeConfig.gap,
    variantConfig.background,
    variantConfig.text,
    variantConfig.border,
    variantConfig.hover,
    variantConfig.active,
    variantConfig.focus,
    getDatePickerRadius(DATE_PICKER_DEFAULTS.radius),
    'transition-all duration-200 ease-in-out',
    open && 'ring-2 ring-blue-500',
    disabled && variantConfig.disabled,
    loading && 'opacity-70 cursor-progress',
    error && 'border-red-500 focus:ring-red-500',
    className,
  );
}

/**
 * Gets calendar classes for date picker calendar.
 *
 * @param {Object} options - Calendar options.
 * @param {string} [options.position] - Calendar position.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.shadow] - Shadow level.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged calendar classes.
 */
export function getDatePickerCalendarClasses({
  position = DATE_PICKER_DEFAULTS.position,
  radius = DATE_PICKER_DEFAULTS.radius,
  shadow = DATE_PICKER_DEFAULTS.shadow,
  className = '',
  disabled = false,
  loading = false,
}) {
  const positionClass = getDatePickerPosition(position);

  return mergeClasses(
    'absolute z-50',
    positionClass,
    'bg-white',
    'border border-gray-200',
    getDatePickerRadius(radius),
    getDatePickerShadow(shadow),
    'p-3 min-w-[280px]',
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets day classes for date picker calendar day.
 *
 * @param {Object} options - Day options.
 * @param {string} [options.state] - Day state (default, selected, today, disabled, range, rangeStart, rangeEnd, outside, weekend).
 * @param {string} [options.size] - Date picker size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged day classes.
 */
export function getDatePickerDayClasses({
  state = 'default',
  size = DATE_PICKER_DEFAULTS.size,
  className = '',
  disabled = false,
}) {
  const sizeConfig = getDatePickerSize(size);
  const stateConfig = getDatePickerDayState(state);

  return mergeClasses(
    'inline-flex items-center justify-center',
    'rounded-full',
    sizeConfig.daySize,
    sizeConfig.dayText,
    'font-medium',
    'transition-colors duration-150 ease-in-out',
    'cursor-pointer',
    stateConfig.background,
    stateConfig.text,
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className,
  );
}

/* ---------------------------------- */
/* Validation Utilities               */
/* ---------------------------------- */

/**
 * Validates if a variant is valid.
 *
 * @param {string} variant - The variant to check.
 * @returns {boolean} True if valid.
 */
export function isValidVariant(variant) {
  return variant ? Object.keys(DATE_PICKER_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(DATE_PICKER_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(DATE_PICKER_RADIUS).includes(radius) : false;
}

/**
 * Validates if a shadow is valid.
 *
 * @param {string} shadow - The shadow to check.
 * @returns {boolean} True if valid.
 */
export function isValidShadow(shadow) {
  return shadow ? Object.keys(DATE_PICKER_SHADOWS).includes(shadow) : false;
}

/**
 * Validates if a position is valid.
 *
 * @param {string} position - The position to check.
 * @returns {boolean} True if valid.
 */
export function isValidPosition(position) {
  return position ? Object.keys(DATE_PICKER_POSITIONS).includes(position) : false;
}

/* ---------------------------------- */
/* State Helpers                      */
/* ---------------------------------- */

/**
 * Determines if a date picker is interactive.
 *
 * @param {Object} options - Date picker options.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {boolean} True if interactive.
 */
export function isInteractiveDatePicker({ disabled = false, loading = false }) {
  return !disabled && !loading;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for date picker components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.label] - Date picker label.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {boolean} [state.open] - Open state.
 * @param {string} [state.value] - Selected date value.
 * @param {string} [state.placeholder] - Placeholder text.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  label = '',
  disabled = false,
  open = false,
  value = '',
  placeholder = '',
}) {
  return {
    getRole: () => 'combobox',
    getAriaLabel: () => label || placeholder || 'Date picker',
    getAriaExpanded: () => open,
    getAriaDisabled: () => disabled || undefined,
    getAriaControls: () => 'datepicker-calendar',
    getAriaHasPopup: () => 'dialog',
    getAriaValueNow: () => value || undefined,
    getTabIndex: () => (disabled ? -1 : 0),
  };
}

/**
 * Determines whether the DatePicker should respond to the Escape key.
 *
 * @param {Object} options
 * @param {boolean} options.closeOnEscape
 * @param {boolean} options.disabled
 * @param {boolean} options.loading
 * @returns {boolean}
 */
export function shouldCloseOnEscape({
  closeOnEscape = true,
  disabled = false,
  loading = false,
} = {}) {
  return closeOnEscape && !disabled && !loading;
}

/**
 * Determines whether the DatePicker should close
 * when clicking outside.
 */
export function shouldCloseOnOutsideClick({
  closeOnOutsideClick = true,
  disabled = false,
  loading = false,
} = {}) {
  return closeOnOutsideClick && !disabled && !loading;
}

/* ---------------------------------- */
/* Re-exported Utilities              */
/* ---------------------------------- */

// Re-export token utilities for convenience
export {
  getDatePickerVariant,
  getDatePickerSize,
  getDatePickerRadius,
  getDatePickerShadow,
  getDatePickerPosition,
  getDatePickerAnimation,
  getDatePickerDayState,
};