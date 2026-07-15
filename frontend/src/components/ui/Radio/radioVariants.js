/**
 * KisanO Design System — Radio Package
 * Radio Design Tokens
 *
 * Complete design token system for the KisanO Radio component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent radio styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `RADIO_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Radio/radioVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Radio.
 * Each variant defines background, border, and text colors for different states.
 */
export const RADIO_VARIANTS = Object.freeze({
  default: {
    background: 'bg-white',
    border: 'border-gray-300',
    text: 'text-blue-600',
    checked: 'bg-blue-600 border-blue-600',
    hover: 'hover:border-blue-400',
    focus: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    disabled: 'opacity-50 cursor-not-allowed',
  },
  primary: {
    background: 'bg-white',
    border: 'border-blue-300',
    text: 'text-blue-600',
    checked: 'bg-blue-600 border-blue-600',
    hover: 'hover:border-blue-500',
    focus: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    disabled: 'opacity-50 cursor-not-allowed',
  },
  secondary: {
    background: 'bg-white',
    border: 'border-gray-400',
    text: 'text-gray-600',
    checked: 'bg-gray-600 border-gray-600',
    hover: 'hover:border-gray-500',
    focus: 'focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    disabled: 'opacity-50 cursor-not-allowed',
  },
  success: {
    background: 'bg-white',
    border: 'border-green-300',
    text: 'text-green-600',
    checked: 'bg-green-600 border-green-600',
    hover: 'hover:border-green-500',
    focus: 'focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
    disabled: 'opacity-50 cursor-not-allowed',
  },
  warning: {
    background: 'bg-white',
    border: 'border-yellow-300',
    text: 'text-yellow-600',
    checked: 'bg-yellow-500 border-yellow-500',
    hover: 'hover:border-yellow-400',
    focus: 'focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2',
    disabled: 'opacity-50 cursor-not-allowed',
  },
  error: {
    background: 'bg-white',
    border: 'border-red-300',
    text: 'text-red-600',
    checked: 'bg-red-600 border-red-600',
    hover: 'hover:border-red-500',
    focus: 'focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
    disabled: 'opacity-50 cursor-not-allowed',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Radios.
 * Each size defines the dimensions, text size, and spacing.
 */
export const RADIO_SIZES = Object.freeze({
  xs: {
    radio: 'h-3.5 w-3.5',
    indicator: 'h-1.5 w-1.5',
    text: 'text-xs',
    gap: 'gap-1.5',
    padding: 'p-0.5',
  },
  sm: {
    radio: 'h-4 w-4',
    indicator: 'h-2 w-2',
    text: 'text-sm',
    gap: 'gap-2',
    padding: 'p-0.5',
  },
  md: {
    radio: 'h-5 w-5',
    indicator: 'h-2.5 w-2.5',
    text: 'text-sm',
    gap: 'gap-2.5',
    padding: 'p-1',
  },
  lg: {
    radio: 'h-6 w-6',
    indicator: 'h-3 w-3',
    text: 'text-base',
    gap: 'gap-3',
    padding: 'p-1',
  },
  xl: {
    radio: 'h-7 w-7',
    indicator: 'h-3.5 w-3.5',
    text: 'text-base',
    gap: 'gap-3.5',
    padding: 'p-1.5',
  },
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for Radios.
 * Radios are typically circular, but we provide options for flexibility.
 */
export const RADIO_RADIUS = Object.freeze({
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded',
  lg: 'rounded-md',
  xl: 'rounded-lg',
  full: 'rounded-full',
});

/* ---------------------------------- */
/* Shadows                            */
/* ---------------------------------- */

/**
 * Shadow presets for Radios.
 */
export const RADIO_SHADOWS = Object.freeze({
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
});

/* ---------------------------------- */
/* States                             */
/* ---------------------------------- */

/**
 * State presets for Radios.
 * Defines styling for each interaction state.
 */
export const RADIO_STATES = Object.freeze({
  default: {
    background: 'bg-white',
    border: 'border-gray-300',
    text: 'text-gray-900',
  },
  checked: {
    background: 'bg-blue-600',
    border: 'border-blue-600',
    text: 'text-white',
  },
  hover: {
    background: 'bg-white',
    border: 'border-blue-400',
    text: 'text-gray-900',
  },
  focus: {
    background: 'bg-white',
    border: 'border-blue-500',
    text: 'text-gray-900',
  },
  disabled: {
    background: 'bg-gray-100',
    border: 'border-gray-200',
    text: 'text-gray-400',
  },
  error: {
    background: 'bg-red-50',
    border: 'border-red-500',
    text: 'text-red-900',
  },
  success: {
    background: 'bg-green-50',
    border: 'border-green-500',
    text: 'text-green-900',
  },
});

/* ---------------------------------- */
/* Indicator Sizes                    */
/* ---------------------------------- */

/**
 * Indicator size presets for Radio indicators.
 */
export const RADIO_INDICATOR_SIZES = Object.freeze({
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-3.5 w-3.5',
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Radio dimensions.
 */
export const RADIO_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'full',
  shadow: 'none',
  disabled: false,
  checked: false,
  required: false,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for a radio.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getRadioVariant(variant) {
  return RADIO_VARIANTS[variant] || RADIO_VARIANTS[RADIO_DEFAULTS.variant];
}

/**
 * Gets the size configuration for a radio.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getRadioSize(size) {
  return RADIO_SIZES[size] || RADIO_SIZES[RADIO_DEFAULTS.size];
}

/**
 * Gets the radius class for a radio.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getRadioRadius(radius) {
  return RADIO_RADIUS[radius] || RADIO_RADIUS[RADIO_DEFAULTS.radius];
}

/**
 * Gets the shadow class for a radio.
 * @param {string} shadow - The shadow key.
 * @returns {string} The shadow class.
 */
export function getRadioShadow(shadow) {
  return RADIO_SHADOWS[shadow] || RADIO_SHADOWS[RADIO_DEFAULTS.shadow];
}

/**
 * Gets the state configuration for a radio.
 * @param {string} state - The state key.
 * @returns {Object} The state configuration.
 */
export function getRadioState(state) {
  return RADIO_STATES[state] || RADIO_STATES.default;
}

/**
 * Gets the indicator size class for a radio.
 * @param {string} size - The size key.
 * @returns {string} The indicator size class.
 */
export function getRadioIndicatorSize(size) {
  return RADIO_INDICATOR_SIZES[size] || RADIO_INDICATOR_SIZES[RADIO_DEFAULTS.size];
}