/**
 * KisanO Design System — Textarea Package
 * Textarea Design Tokens
 *
 * Complete design token system for the KisanO Textarea component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent textarea styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `TEXTAREA_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Textarea/textareaVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Textarea.
 * Each variant defines background, text, border, and interaction states.
 */
export const TEXTAREA_VARIANTS = Object.freeze({
  default: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border border-gray-300',
    placeholder: 'placeholder:text-gray-400',
    hover: 'hover:border-gray-400',
    active: 'active:border-gray-500',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  },
  filled: {
    background: 'bg-gray-50',
    text: 'text-gray-900',
    border: 'border border-transparent',
    placeholder: 'placeholder:text-gray-400',
    hover: 'hover:bg-gray-100',
    active: 'active:bg-gray-200',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500',
  },
  outlined: {
    background: 'bg-transparent',
    text: 'text-gray-900',
    border: 'border-2 border-gray-300',
    placeholder: 'placeholder:text-gray-400',
    hover: 'hover:border-gray-400',
    active: 'active:border-gray-500',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  },
  ghost: {
    background: 'bg-transparent',
    text: 'text-gray-700',
    border: 'border border-transparent',
    placeholder: 'placeholder:text-gray-400',
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
 * Size presets for Textareas.
 * Each size defines padding, text size, and min height.
 */
export const TEXTAREA_SIZES = Object.freeze({
  xs: {
    padding: 'px-2 py-1.5',
    text: 'text-xs',
    minHeight: 'min-h-[60px]',
    gap: 'gap-1',
  },
  sm: {
    padding: 'px-3 py-2',
    text: 'text-sm',
    minHeight: 'min-h-[80px]',
    gap: 'gap-1.5',
  },
  md: {
    padding: 'px-4 py-2.5',
    text: 'text-sm',
    minHeight: 'min-h-[100px]',
    gap: 'gap-2',
  },
  lg: {
    padding: 'px-5 py-3',
    text: 'text-base',
    minHeight: 'min-h-[120px]',
    gap: 'gap-2.5',
  },
  xl: {
    padding: 'px-6 py-3.5',
    text: 'text-base',
    minHeight: 'min-h-[140px]',
    gap: 'gap-3',
  },
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for Textareas.
 */
export const TEXTAREA_RADIUS = Object.freeze({
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
 * Shadow presets for Textareas.
 */
export const TEXTAREA_SHADOWS = Object.freeze({
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
});

/* ---------------------------------- */
/* States                             */
/* ---------------------------------- */

/**
 * State presets for Textareas.
 * Defines styling for each interaction state.
 */
export const TEXTAREA_STATES = Object.freeze({
  default: {
    background: 'bg-white',
    border: 'border-gray-300',
    text: 'text-gray-900',
  },
  hover: {
    background: 'bg-white',
    border: 'border-gray-400',
    text: 'text-gray-900',
  },
  focus: {
    background: 'bg-white',
    border: 'border-blue-500',
    text: 'text-gray-900',
    ring: 'ring-2 ring-blue-500',
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
  warning: {
    background: 'bg-yellow-50',
    border: 'border-yellow-500',
    text: 'text-yellow-900',
  },
});

/* ---------------------------------- */
/* Resize Options                     */
/* ---------------------------------- */

/**
 * Resize presets for Textareas.
 * Defines the resize behavior of the textarea.
 */
export const TEXTAREA_RESIZE_OPTIONS = Object.freeze({
  none: 'resize-none',
  both: 'resize',
  horizontal: 'resize-x',
  vertical: 'resize-y',
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Textarea dimensions.
 */
export const TEXTAREA_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'md',
  shadow: 'none',
  resize: 'vertical',
  disabled: false,
  required: false,
  rows: 4,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for a textarea.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getTextareaVariant(variant) {
  return TEXTAREA_VARIANTS[variant] || TEXTAREA_VARIANTS[TEXTAREA_DEFAULTS.variant];
}

/**
 * Gets the size configuration for a textarea.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getTextareaSize(size) {
  return TEXTAREA_SIZES[size] || TEXTAREA_SIZES[TEXTAREA_DEFAULTS.size];
}

/**
 * Gets the radius class for a textarea.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getTextareaRadius(radius) {
  return TEXTAREA_RADIUS[radius] || TEXTAREA_RADIUS[TEXTAREA_DEFAULTS.radius];
}

/**
 * Gets the shadow class for a textarea.
 * @param {string} shadow - The shadow key.
 * @returns {string} The shadow class.
 */
export function getTextareaShadow(shadow) {
  return TEXTAREA_SHADOWS[shadow] || TEXTAREA_SHADOWS[TEXTAREA_DEFAULTS.shadow];
}

/**
 * Gets the state configuration for a textarea.
 * @param {string} state - The state key.
 * @returns {Object} The state configuration.
 */
export function getTextareaState(state) {
  return TEXTAREA_STATES[state] || TEXTAREA_STATES.default;
}

/**
 * Gets the resize class for a textarea.
 * @param {string} resize - The resize key.
 * @returns {string} The resize class.
 */
export function getTextareaResize(resize) {
  return TEXTAREA_RESIZE_OPTIONS[resize] || TEXTAREA_RESIZE_OPTIONS[TEXTAREA_DEFAULTS.resize];
}