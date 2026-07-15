/**
 * KisanO Design System — DatePicker Package
 * DatePicker Design Tokens
 *
 * Complete design token system for the KisanO DatePicker component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent date picker styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `DATE_PICKER_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/DatePicker/datePickerVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the DatePicker.
 * Each variant defines background, text, border, and interaction states.
 */
export const DATE_PICKER_VARIANTS = Object.freeze({
  default: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border border-gray-300',
    icon: 'text-gray-400',
    hover: 'hover:border-gray-400',
    active: 'active:border-gray-500',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  },
  filled: {
    background: 'bg-gray-50',
    text: 'text-gray-900',
    border: 'border border-transparent',
    icon: 'text-gray-400',
    hover: 'hover:bg-gray-100',
    active: 'active:bg-gray-200',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500',
  },
  outlined: {
    background: 'bg-transparent',
    text: 'text-gray-900',
    border: 'border-2 border-gray-300',
    icon: 'text-gray-500',
    hover: 'hover:border-gray-400',
    active: 'active:border-gray-500',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  },
  ghost: {
    background: 'bg-transparent',
    text: 'text-gray-700',
    border: 'border border-transparent',
    icon: 'text-gray-400',
    hover: 'hover:bg-gray-50',
    active: 'active:bg-gray-100',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for DatePickers.
 * Each size defines padding, text size, icon size, and min height.
 */
export const DATE_PICKER_SIZES = Object.freeze({
  xs: {
    padding: 'px-2 py-1',
    text: 'text-xs',
    icon: 'h-3 w-3',
    gap: 'gap-1',
    minHeight: 'min-h-[28px]',
    daySize: 'h-7 w-7',
    dayText: 'text-xs',
  },
  sm: {
    padding: 'px-3 py-1.5',
    text: 'text-sm',
    icon: 'h-4 w-4',
    gap: 'gap-1.5',
    minHeight: 'min-h-[34px]',
    daySize: 'h-8 w-8',
    dayText: 'text-sm',
  },
  md: {
    padding: 'px-4 py-2',
    text: 'text-sm',
    icon: 'h-4 w-4',
    gap: 'gap-2',
    minHeight: 'min-h-[40px]',
    daySize: 'h-9 w-9',
    dayText: 'text-sm',
  },
  lg: {
    padding: 'px-5 py-2.5',
    text: 'text-base',
    icon: 'h-5 w-5',
    gap: 'gap-2.5',
    minHeight: 'min-h-[48px]',
    daySize: 'h-10 w-10',
    dayText: 'text-base',
  },
  xl: {
    padding: 'px-6 py-3',
    text: 'text-base',
    icon: 'h-5 w-5',
    gap: 'gap-3',
    minHeight: 'min-h-[56px]',
    daySize: 'h-11 w-11',
    dayText: 'text-base',
  },
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for DatePickers.
 */
export const DATE_PICKER_RADIUS = Object.freeze({
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
});

/* ---------------------------------- */
/* Shadows                            */
/* ---------------------------------- */

/**
 * Shadow presets for DatePickers.
 */
export const DATE_PICKER_SHADOWS = Object.freeze({
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
});

/* ---------------------------------- */
/* Positions                          */
/* ---------------------------------- */

/**
 * Position presets for DatePicker calendars.
 */
export const DATE_PICKER_POSITIONS = Object.freeze({
  bottom: 'top-full left-0 mt-1',
  'bottom-start': 'top-full left-0 mt-1',
  'bottom-end': 'top-full right-0 mt-1',
  top: 'bottom-full left-0 mb-1',
  'top-start': 'bottom-full left-0 mb-1',
  'top-end': 'bottom-full right-0 mb-1',
});

/* ---------------------------------- */
/* Animations                         */
/* ---------------------------------- */

/**
 * Animation presets for DatePicker calendar entrance/exit.
 */
export const DATE_PICKER_ANIMATIONS = Object.freeze({
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.15, ease: 'easeOut' },
  },
  slide: {
    initial: { opacity: 0, y: -8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
  },
  slideScale: {
    initial: { opacity: 0, y: -8, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -8, scale: 0.95 },
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
    transition: { duration: 0 },
  },
});

/* ---------------------------------- */
/* Day States                         */
/* ---------------------------------- */

/**
 * State presets for DatePicker calendar days.
 */
export const DATE_PICKER_DAY_STATES = Object.freeze({
  default: {
    background: 'hover:bg-gray-100',
    text: 'text-gray-700',
  },
  selected: {
    background: 'bg-blue-600',
    text: 'text-white',
    hover: 'hover:bg-blue-700',
  },
  today: {
    background: 'bg-blue-50',
    text: 'text-blue-600',
    hover: 'hover:bg-blue-100',
  },
  disabled: {
    background: 'hover:bg-transparent',
    text: 'text-gray-300',
    hover: 'hover:bg-transparent',
  },
  range: {
    background: 'bg-blue-100',
    text: 'text-blue-700',
    hover: 'hover:bg-blue-200',
  },
  rangeStart: {
    background: 'bg-blue-600',
    text: 'text-white',
    hover: 'hover:bg-blue-700',
  },
  rangeEnd: {
    background: 'bg-blue-600',
    text: 'text-white',
    hover: 'hover:bg-blue-700',
  },
  outside: {
    background: 'hover:bg-transparent',
    text: 'text-gray-300',
    hover: 'hover:bg-transparent',
  },
  weekend: {
    background: 'hover:bg-gray-50',
    text: 'text-red-500',
    hover: 'hover:bg-gray-100',
  },
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all DatePicker dimensions.
 */
export const DATE_PICKER_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'md',
  shadow: 'lg',
  position: 'bottom',
  animation: 'slideScale',
  placeholder: 'Select date',
  format: 'MM/dd/yyyy',
  closeOnSelect: true,
  closeOnOutsideClick: true,
  closeOnEscape: true,
  disabled: false,
  loading: false,
  weekStartsOn: 0, // Sunday
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for a date picker.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getDatePickerVariant(variant) {
  return DATE_PICKER_VARIANTS[variant] || DATE_PICKER_VARIANTS[DATE_PICKER_DEFAULTS.variant];
}

/**
 * Gets the size configuration for a date picker.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getDatePickerSize(size) {
  return DATE_PICKER_SIZES[size] || DATE_PICKER_SIZES[DATE_PICKER_DEFAULTS.size];
}

/**
 * Gets the radius class for a date picker.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getDatePickerRadius(radius) {
  return DATE_PICKER_RADIUS[radius] || DATE_PICKER_RADIUS[DATE_PICKER_DEFAULTS.radius];
}

/**
 * Gets the shadow class for a date picker.
 * @param {string} shadow - The shadow key.
 * @returns {string} The shadow class.
 */
export function getDatePickerShadow(shadow) {
  return DATE_PICKER_SHADOWS[shadow] || DATE_PICKER_SHADOWS[DATE_PICKER_DEFAULTS.shadow];
}

/**
 * Gets the position class for a date picker calendar.
 * @param {string} position - The position key.
 * @returns {string} The position class.
 */
export function getDatePickerPosition(position) {
  return DATE_PICKER_POSITIONS[position] || DATE_PICKER_POSITIONS[DATE_PICKER_DEFAULTS.position];
}

/**
 * Gets the animation configuration for a date picker.
 * @param {string} animation - The animation key.
 * @returns {Object} The animation configuration.
 */
export function getDatePickerAnimation(animation) {
  return DATE_PICKER_ANIMATIONS[animation] || DATE_PICKER_ANIMATIONS[DATE_PICKER_DEFAULTS.animation];
}

/**
 * Gets the day state classes for a calendar day.
 * @param {string} state - The state key.
 * @returns {Object} The state configuration.
 */
export function getDatePickerDayState(state) {
  return DATE_PICKER_DAY_STATES[state] || DATE_PICKER_DAY_STATES.default;
}