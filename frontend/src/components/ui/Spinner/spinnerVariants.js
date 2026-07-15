/**
 * KisanO Design System — Spinner Package
 * Spinner Design Tokens
 *
 * Complete design token system for the KisanO Spinner component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent spinner styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `SPINNER_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Spinner/spinnerVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Spinner.
 * Each variant defines color and interaction states.
 */
export const SPINNER_VARIANTS = Object.freeze({
  default: {
    color: 'text-blue-600',
    track: 'text-gray-200',
    hover: 'hover:text-blue-700',
  },
  primary: {
    color: 'text-blue-600',
    track: 'text-blue-200',
    hover: 'hover:text-blue-700',
  },
  secondary: {
    color: 'text-gray-600',
    track: 'text-gray-200',
    hover: 'hover:text-gray-700',
  },
  success: {
    color: 'text-green-600',
    track: 'text-green-200',
    hover: 'hover:text-green-700',
  },
  warning: {
    color: 'text-yellow-600',
    track: 'text-yellow-200',
    hover: 'hover:text-yellow-700',
  },
  error: {
    color: 'text-red-600',
    track: 'text-red-200',
    hover: 'hover:text-red-700',
  },
  info: {
    color: 'text-cyan-600',
    track: 'text-cyan-200',
    hover: 'hover:text-cyan-700',
  },
  white: {
    color: 'text-white',
    track: 'text-white/30',
    hover: 'hover:text-white/90',
  },
  dark: {
    color: 'text-gray-900',
    track: 'text-gray-300',
    hover: 'hover:text-gray-700',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Spinners.
 * Each size defines dimensions and stroke width.
 */
export const SPINNER_SIZES = Object.freeze({
  xs: {
    size: 'h-4 w-4',
    strokeWidth: 'stroke-2',
    text: 'text-xs',
    gap: 'gap-1.5',
  },
  sm: {
    size: 'h-5 w-5',
    strokeWidth: 'stroke-2',
    text: 'text-sm',
    gap: 'gap-2',
  },
  md: {
    size: 'h-6 w-6',
    strokeWidth: 'stroke-[2.5]',
    text: 'text-sm',
    gap: 'gap-2.5',
  },
  lg: {
    size: 'h-8 w-8',
    strokeWidth: 'stroke-[3]',
    text: 'text-base',
    gap: 'gap-3',
  },
  xl: {
    size: 'h-10 w-10',
    strokeWidth: 'stroke-[3.5]',
    text: 'text-base',
    gap: 'gap-3.5',
  },
  '2xl': {
    size: 'h-12 w-12',
    strokeWidth: 'stroke-[4]',
    text: 'text-lg',
    gap: 'gap-4',
  },
});

/* ---------------------------------- */
/* Speeds                             */
/* ---------------------------------- */

/**
 * Speed presets for Spinners.
 * Defines animation duration.
 */
export const SPINNER_SPEEDS = Object.freeze({
  slow: 'duration-1000',
  normal: 'duration-700',
  fast: 'duration-400',
  faster: 'duration-200',
});

/* ---------------------------------- */
/* Animations                         */
/* ---------------------------------- */

/**
 * Animation presets for Spinners.
 * Defines animation types and easing.
 */
export const SPINNER_ANIMATIONS = Object.freeze({
  spin: {
    animation: 'animate-spin',
    easing: 'ease-linear',
  },
  pulse: {
    animation: 'animate-spin pulse',
    easing: 'ease-in-out',
  },
  bounce: {
    animation: 'animate-bounce',
    easing: 'ease-in-out',
  },
  fade: {
    animation: 'animate-pulse',
    easing: 'ease-in-out',
  },
  none: {
    animation: '',
    easing: '',
  },
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Spinner dimensions.
 */
export const SPINNER_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  speed: 'normal',
  animation: 'spin',
  disabled: false,
  loading: true,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for a spinner.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getSpinnerVariant(variant) {
  return SPINNER_VARIANTS[variant] || SPINNER_VARIANTS[SPINNER_DEFAULTS.variant];
}

/**
 * Gets the size configuration for a spinner.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getSpinnerSize(size) {
  return SPINNER_SIZES[size] || SPINNER_SIZES[SPINNER_DEFAULTS.size];
}

/**
 * Gets the speed class for a spinner.
 * @param {string} speed - The speed key.
 * @returns {string} The speed class.
 */
export function getSpinnerSpeed(speed) {
  return SPINNER_SPEEDS[speed] || SPINNER_SPEEDS[SPINNER_DEFAULTS.speed];
}

/**
 * Gets the animation configuration for a spinner.
 * @param {string} animation - The animation key.
 * @returns {Object} The animation configuration.
 */
export function getSpinnerAnimation(animation) {
  return SPINNER_ANIMATIONS[animation] || SPINNER_ANIMATIONS[SPINNER_DEFAULTS.animation];
}