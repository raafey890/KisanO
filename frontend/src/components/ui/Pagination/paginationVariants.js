/**
 * KisanO Design System — Pagination Package
 * Pagination Design Tokens
 *
 * Complete design token system for the KisanO Pagination component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent pagination styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `PAGINATION_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Pagination/paginationVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Pagination.
 * Each variant defines background, text, and interaction states.
 */
export const PAGINATION_VARIANTS = Object.freeze({
  default: {
    background: 'bg-white',
    text: 'text-gray-700',
    border: 'border border-gray-300',
    active: 'bg-blue-600 text-white border-blue-600',
    hover: 'hover:bg-gray-50',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
  primary: {
    background: 'bg-white',
    text: 'text-blue-600',
    border: 'border border-blue-300',
    active: 'bg-blue-600 text-white border-blue-600',
    hover: 'hover:bg-blue-50',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
  dark: {
    background: 'bg-gray-800',
    text: 'text-gray-300',
    border: 'border border-gray-700',
    active: 'bg-gray-600 text-white border-gray-600',
    hover: 'hover:bg-gray-700',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
  },
  outline: {
    background: 'bg-transparent',
    text: 'text-gray-700',
    border: 'border border-gray-300',
    active: 'bg-blue-600 text-white border-blue-600',
    hover: 'hover:bg-gray-50',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
  ghost: {
    background: 'bg-transparent',
    text: 'text-gray-700',
    border: 'border border-transparent',
    active: 'bg-blue-600 text-white border-blue-600',
    hover: 'hover:bg-gray-50',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Pagination.
 * Each size defines padding, text size, icon size, and min height.
 */
export const PAGINATION_SIZES = Object.freeze({
  xs: {
    padding: 'px-2.5 py-1',
    text: 'text-xs',
    icon: 'h-3 w-3',
    gap: 'gap-1',
    minHeight: 'min-h-[28px]',
    minWidth: 'min-w-[28px]',
  },
  sm: {
    padding: 'px-3 py-1.5',
    text: 'text-sm',
    icon: 'h-3.5 w-3.5',
    gap: 'gap-1.5',
    minHeight: 'min-h-[34px]',
    minWidth: 'min-w-[34px]',
  },
  md: {
    padding: 'px-4 py-2',
    text: 'text-sm',
    icon: 'h-4 w-4',
    gap: 'gap-2',
    minHeight: 'min-h-[40px]',
    minWidth: 'min-w-[40px]',
  },
  lg: {
    padding: 'px-5 py-2.5',
    text: 'text-base',
    icon: 'h-4.5 w-4.5',
    gap: 'gap-2.5',
    minHeight: 'min-h-[48px]',
    minWidth: 'min-w-[48px]',
  },
  xl: {
    padding: 'px-6 py-3',
    text: 'text-base',
    icon: 'h-5 w-5',
    gap: 'gap-3',
    minHeight: 'min-h-[56px]',
    minWidth: 'min-w-[56px]',
  },
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for Pagination.
 */
export const PAGINATION_RADIUS = Object.freeze({
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
});

/* ---------------------------------- */
/* States                             */
/* ---------------------------------- */

/**
 * State presets for Pagination items.
 * Defines styling for each interaction state.
 */
export const PAGINATION_STATES = Object.freeze({
  default: {
    background: 'bg-white',
    text: 'text-gray-700',
    border: 'border border-gray-300',
  },
  active: {
    background: 'bg-blue-600',
    text: 'text-white',
    border: 'border border-blue-600',
  },
  hover: {
    background: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border border-gray-300',
  },
  disabled: {
    background: 'bg-gray-100',
    text: 'text-gray-400',
    border: 'border border-gray-200',
  },
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Pagination dimensions.
 */
export const PAGINATION_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'md',
  disabled: false,
  loading: false,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for pagination.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getPaginationVariant(variant) {
  return PAGINATION_VARIANTS[variant] || PAGINATION_VARIANTS[PAGINATION_DEFAULTS.variant];
}

/**
 * Gets the size configuration for pagination.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getPaginationSize(size) {
  return PAGINATION_SIZES[size] || PAGINATION_SIZES[PAGINATION_DEFAULTS.size];
}

/**
 * Gets the radius class for pagination.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getPaginationRadius(radius) {
  return PAGINATION_RADIUS[radius] || PAGINATION_RADIUS[PAGINATION_DEFAULTS.radius];
}

/**
 * Gets the state configuration for pagination.
 * @param {string} state - The state key.
 * @returns {Object} The state configuration.
 */
export function getPaginationState(state) {
  return PAGINATION_STATES[state] || PAGINATION_STATES.default;
}