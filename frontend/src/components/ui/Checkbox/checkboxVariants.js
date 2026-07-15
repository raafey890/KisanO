/**
 * KisanO Design System — Checkbox Package
 * Checkbox Design Tokens
 *
 * Complete design token system for the KisanO Checkbox component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent checkbox styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `CHECKBOX_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Checkbox/checkboxVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Checkbox.
 * Each variant defines background, border, and text colors for different states.
 */
export const CHECKBOX_VARIANTS = Object.freeze({
  default: {
    background: 'bg-white',
    border: 'border-gray-300',
    text: 'text-blue-600',
    checked: 'bg-blue-600 border-blue-600',
    indeterminate: 'bg-blue-600 border-blue-600',
    hover: 'hover:border-blue-400',
    focus: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    disabled: 'opacity-50 cursor-not-allowed',
  },
  primary: {
    background: 'bg-white',
    border: 'border-blue-300',
    text: 'text-blue-600',
    checked: 'bg-blue-600 border-blue-600',
    indeterminate: 'bg-blue-600 border-blue-600',
    hover: 'hover:border-blue-500',
    focus: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    disabled: 'opacity-50 cursor-not-allowed',
  },
  secondary: {
    background: 'bg-white',
    border: 'border-gray-400',
    text: 'text-gray-600',
    checked: 'bg-gray-600 border-gray-600',
    indeterminate: 'bg-gray-600 border-gray-600',
    hover: 'hover:border-gray-500',
    focus: 'focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    disabled: 'opacity-50 cursor-not-allowed',
  },
  success: {
    background: 'bg-white',
    border: 'border-green-300',
    text: 'text-green-600',
    checked: 'bg-green-600 border-green-600',
    indeterminate: 'bg-green-600 border-green-600',
    hover: 'hover:border-green-500',
    focus: 'focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
    disabled: 'opacity-50 cursor-not-allowed',
  },
  warning: {
    background: 'bg-white',
    border: 'border-yellow-300',
    text: 'text-yellow-600',
    checked: 'bg-yellow-500 border-yellow-500',
    indeterminate: 'bg-yellow-500 border-yellow-500',
    hover: 'hover:border-yellow-400',
    focus: 'focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2',
    disabled: 'opacity-50 cursor-not-allowed',
  },
  error: {
    background: 'bg-white',
    border: 'border-red-300',
    text: 'text-red-600',
    checked: 'bg-red-600 border-red-600',
    indeterminate: 'bg-red-600 border-red-600',
    hover: 'hover:border-red-500',
    focus: 'focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
    disabled: 'opacity-50 cursor-not-allowed',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Checkboxes.
 * Each size defines the dimensions, text size, and spacing.
 */
export const CHECKBOX_SIZES = Object.freeze({
  xs: {
    box: 'h-3.5 w-3.5',
    icon: 'h-2 w-2',
    text: 'text-xs',
    gap: 'gap-1.5',
    padding: 'p-0.5',
  },
  sm: {
    box: 'h-4 w-4',
    icon: 'h-2.5 w-2.5',
    text: 'text-sm',
    gap: 'gap-2',
    padding: 'p-0.5',
  },
  md: {
    box: 'h-5 w-5',
    icon: 'h-3 w-3',
    text: 'text-sm',
    gap: 'gap-2.5',
    padding: 'p-1',
  },
  lg: {
    box: 'h-6 w-6',
    icon: 'h-3.5 w-3.5',
    text: 'text-base',
    gap: 'gap-3',
    padding: 'p-1',
  },
  xl: {
    box: 'h-7 w-7',
    icon: 'h-4 w-4',
    text: 'text-base',
    gap: 'gap-3.5',
    padding: 'p-1.5',
  },
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for Checkboxes.
 */
export const CHECKBOX_RADIUS = Object.freeze({
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
 * Shadow presets for Checkboxes.
 */
export const CHECKBOX_SHADOWS = Object.freeze({
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
 * State presets for Checkboxes.
 * Defines styling for each interaction state.
 */
export const CHECKBOX_STATES = Object.freeze({
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
  indeterminate: {
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
/* Icon Sizes                         */
/* ---------------------------------- */

/**
 * Icon size presets for Checkbox icons.
 */
export const CHECKBOX_ICON_SIZES = Object.freeze({
  xs: 'h-2 w-2',
  sm: 'h-2.5 w-2.5',
  md: 'h-3 w-3',
  lg: 'h-3.5 w-3.5',
  xl: 'h-4 w-4',
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Checkbox dimensions.
 */
export const CHECKBOX_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'md',
  shadow: 'none',
  disabled: false,
  checked: false,
  indeterminate: false,
  required: false,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for a checkbox.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getCheckboxVariant(variant) {
  return CHECKBOX_VARIANTS[variant] || CHECKBOX_VARIANTS[CHECKBOX_DEFAULTS.variant];
}

/**
 * Gets the size configuration for a checkbox.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getCheckboxSize(size) {
  return CHECKBOX_SIZES[size] || CHECKBOX_SIZES[CHECKBOX_DEFAULTS.size];
}

/**
 * Gets the radius class for a checkbox.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getCheckboxRadius(radius) {
  return CHECKBOX_RADIUS[radius] || CHECKBOX_RADIUS[CHECKBOX_DEFAULTS.radius];
}

/**
 * Gets the shadow class for a checkbox.
 * @param {string} shadow - The shadow key.
 * @returns {string} The shadow class.
 */
export function getCheckboxShadow(shadow) {
  return CHECKBOX_SHADOWS[shadow] || CHECKBOX_SHADOWS[CHECKBOX_DEFAULTS.shadow];
}

/**
 * Gets the state configuration for a checkbox.
 * @param {string} state - The state key.
 * @returns {Object} The state configuration.
 */
export function getCheckboxState(state) {
  return CHECKBOX_STATES[state] || CHECKBOX_STATES.default;
}

/**
 * Gets the icon size class for a checkbox.
 * @param {string} size - The size key.
 * @returns {string} The icon size class.
 */
export function getCheckboxIconSize(size) {
  return CHECKBOX_ICON_SIZES[size] || CHECKBOX_ICON_SIZES[CHECKBOX_DEFAULTS.size];
}