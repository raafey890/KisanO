/**
 * KisanO Design System — Switch Package
 * Switch Design Tokens
 *
 * Complete design token system for the KisanO Switch component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent switch styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `SWITCH_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Switch/switchVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Switch.
 * Each variant defines track and thumb colors for different states.
 */
export const SWITCH_VARIANTS = Object.freeze({
  default: {
    track: {
      background: 'bg-gray-200',
      checked: 'bg-blue-600',
      hover: 'hover:bg-gray-300',
      disabled: 'bg-gray-100',
      focus: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    },
    thumb: {
      background: 'bg-white',
      checked: 'bg-white',
      disabled: 'bg-gray-300',
      hover: 'hover:bg-white',
    },
  },
  primary: {
    track: {
      background: 'bg-gray-200',
      checked: 'bg-blue-600',
      hover: 'hover:bg-blue-500',
      disabled: 'bg-gray-100',
      focus: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    },
    thumb: {
      background: 'bg-white',
      checked: 'bg-white',
      disabled: 'bg-gray-300',
      hover: 'hover:bg-white',
    },
  },
  secondary: {
    track: {
      background: 'bg-gray-200',
      checked: 'bg-gray-600',
      hover: 'hover:bg-gray-500',
      disabled: 'bg-gray-100',
      focus: 'focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    },
    thumb: {
      background: 'bg-white',
      checked: 'bg-white',
      disabled: 'bg-gray-300',
      hover: 'hover:bg-white',
    },
  },
  success: {
    track: {
      background: 'bg-gray-200',
      checked: 'bg-green-600',
      hover: 'hover:bg-green-500',
      disabled: 'bg-gray-100',
      focus: 'focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
    },
    thumb: {
      background: 'bg-white',
      checked: 'bg-white',
      disabled: 'bg-gray-300',
      hover: 'hover:bg-white',
    },
  },
  warning: {
    track: {
      background: 'bg-gray-200',
      checked: 'bg-yellow-500',
      hover: 'hover:bg-yellow-400',
      disabled: 'bg-gray-100',
      focus: 'focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2',
    },
    thumb: {
      background: 'bg-white',
      checked: 'bg-white',
      disabled: 'bg-gray-300',
      hover: 'hover:bg-white',
    },
  },
  error: {
    track: {
      background: 'bg-gray-200',
      checked: 'bg-red-600',
      hover: 'hover:bg-red-500',
      disabled: 'bg-gray-100',
      focus: 'focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
    },
    thumb: {
      background: 'bg-white',
      checked: 'bg-white',
      disabled: 'bg-gray-300',
      hover: 'hover:bg-white',
    },
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Switches.
 * Each size defines the switch dimensions, thumb size, and spacing.
 */
export const SWITCH_SIZES = Object.freeze({
  xs: {
    switch: 'h-4 w-7',
    thumb: 'h-3 w-3',
    translate: 'translate-x-3',
    text: 'text-xs',
    gap: 'gap-1.5',
    padding: 'p-0.5',
  },
  sm: {
    switch: 'h-5 w-9',
    thumb: 'h-3.5 w-3.5',
    translate: 'translate-x-4',
    text: 'text-sm',
    gap: 'gap-2',
    padding: 'p-0.5',
  },
  md: {
    switch: 'h-6 w-11',
    thumb: 'h-4.5 w-4.5',
    translate: 'translate-x-5',
    text: 'text-sm',
    gap: 'gap-2.5',
    padding: 'p-1',
  },
  lg: {
    switch: 'h-7 w-13',
    thumb: 'h-5.5 w-5.5',
    translate: 'translate-x-6',
    text: 'text-base',
    gap: 'gap-3',
    padding: 'p-1',
  },
  xl: {
    switch: 'h-8 w-15',
    thumb: 'h-6.5 w-6.5',
    translate: 'translate-x-7',
    text: 'text-base',
    gap: 'gap-3.5',
    padding: 'p-1.5',
  },
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for Switches.
 * Switches are typically rounded-full, but we provide options for flexibility.
 */
export const SWITCH_RADIUS = Object.freeze({
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
 * Shadow presets for Switches.
 */
export const SWITCH_SHADOWS = Object.freeze({
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
 * State presets for Switches.
 * Defines styling for each interaction state.
 */
export const SWITCH_STATES = Object.freeze({
  default: {
    track: 'bg-gray-200',
    thumb: 'bg-white',
    text: 'text-gray-900',
  },
  checked: {
    track: 'bg-blue-600',
    thumb: 'bg-white',
    text: 'text-gray-900',
  },
  hover: {
    track: 'bg-gray-300',
    thumb: 'bg-white',
    text: 'text-gray-900',
  },
  focus: {
    track: 'bg-gray-200',
    thumb: 'bg-white',
    text: 'text-gray-900',
    ring: 'ring-2 ring-blue-500 ring-offset-2',
  },
  disabled: {
    track: 'bg-gray-100',
    thumb: 'bg-gray-300',
    text: 'text-gray-400',
  },
  error: {
    track: 'bg-red-200',
    thumb: 'bg-white',
    text: 'text-red-900',
  },
  success: {
    track: 'bg-green-200',
    thumb: 'bg-white',
    text: 'text-green-900',
  },
});

/* ---------------------------------- */
/* Thumb Sizes                        */
/* ---------------------------------- */

/**
 * Thumb size presets for Switch thumbs.
 */
export const SWITCH_THUMB_SIZES = Object.freeze({
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4.5 w-4.5',
  lg: 'h-5.5 w-5.5',
  xl: 'h-6.5 w-6.5',
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Switch dimensions.
 */
export const SWITCH_DEFAULTS = Object.freeze({
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
 * Gets the variant configuration for a switch.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getSwitchVariant(variant) {
  return SWITCH_VARIANTS[variant] || SWITCH_VARIANTS[SWITCH_DEFAULTS.variant];
}

/**
 * Gets the size configuration for a switch.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getSwitchSize(size) {
  return SWITCH_SIZES[size] || SWITCH_SIZES[SWITCH_DEFAULTS.size];
}

/**
 * Gets the radius class for a switch.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getSwitchRadius(radius) {
  return SWITCH_RADIUS[radius] || SWITCH_RADIUS[SWITCH_DEFAULTS.radius];
}

/**
 * Gets the shadow class for a switch.
 * @param {string} shadow - The shadow key.
 * @returns {string} The shadow class.
 */
export function getSwitchShadow(shadow) {
  return SWITCH_SHADOWS[shadow] || SWITCH_SHADOWS[SWITCH_DEFAULTS.shadow];
}

/**
 * Gets the state configuration for a switch.
 * @param {string} state - The state key.
 * @returns {Object} The state configuration.
 */
export function getSwitchState(state) {
  return SWITCH_STATES[state] || SWITCH_STATES.default;
}

/**
 * Gets the thumb size class for a switch.
 * @param {string} size - The size key.
 * @returns {string} The thumb size class.
 */
export function getSwitchThumbSize(size) {
  return SWITCH_THUMB_SIZES[size] || SWITCH_THUMB_SIZES[SWITCH_DEFAULTS.size];
}