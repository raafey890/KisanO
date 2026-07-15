/**
 * KisanO Design System — DatePicker Package
 * Public API entry point.
 *
 * Exports all components, utilities, and design tokens for the DatePicker package.
 * Supports tree shaking and named imports.
 *
 * @module components/ui/DatePicker
 */

/* ---------------------------------- */
/* Re-export all design tokens        */
/* ---------------------------------- */

export {
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
/* Re-export utilities                */
/* ---------------------------------- */

export {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getDatePickerClasses,
  getDatePickerContainerClasses,
  getDatePickerInputClasses,
  getDatePickerCalendarClasses,
  getDatePickerDayClasses,
  isValidVariant,
  isValidSize,
  isValidRadius,
  isValidShadow,
  isValidPosition,
  isInteractiveDatePicker,
  getAccessibilityHelpers,
} from './datePickerUtils';

/* ---------------------------------- */
/* Re-export components               */
/* ---------------------------------- */

export { default as DatePicker } from './DatePicker';
export { default as DatePickerContainer } from './DatePickerContainer';
export { default as DatePickerInput } from './DatePickerInput';
export { default as DatePickerCalendar } from './DatePickerCalendar';
export { default as DatePickerHeader } from './DatePickerHeader';
export { default as DatePickerDay } from './DatePickerDay';
export { default as DatePickerFooter } from './DatePickerFooter';
export { default as DatePickerLoader } from './DatePickerLoader';
export { default as DatePickerPortal } from './DatePickerPortal';

/* ---------------------------------- */
/* Default export                     */
/* ---------------------------------- */

export { default } from './DatePicker';