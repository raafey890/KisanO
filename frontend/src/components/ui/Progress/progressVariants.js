/**
 * KisanO Design System — Progress Package
 * Progress Design Tokens
 *
 * Complete design token system for the KisanO Progress component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent progress styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `PROGRESS_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Progress/progressVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Progress.
 * Each variant defines track and indicator colors.
 */
export const PROGRESS_VARIANTS = Object.freeze({
  default: {
    track: 'bg-gray-200',
    indicator: 'bg-blue-600',
    text: 'text-blue-600',
  },
  primary: {
    track: 'bg-gray-200',
    indicator: 'bg-blue-600',
    text: 'text-blue-600',
  },
  secondary: {
    track: 'bg-gray-200',
    indicator: 'bg-gray-600',
    text: 'text-gray-600',
  },
  success: {
    track: 'bg-green-200',
    indicator: 'bg-green-600',
    text: 'text-green-600',
  },
  warning: {
    track: 'bg-yellow-200',
    indicator: 'bg-yellow-500',
    text: 'text-yellow-600',
  },
  error: {
    track: 'bg-red-200',
    indicator: 'bg-red-600',
    text: 'text-red-600',
  },
  info: {
    track: 'bg-cyan-200',
    indicator: 'bg-cyan-600',
    text: 'text-cyan-600',
  },
  gradient: {
    track: 'bg-gray-200',
    indicator: 'bg-gradient-to-r from-blue-500 to-purple-600',
    text: 'text-blue-600',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Progress bars.
 * Each size defines height and text size.
 */
export const PROGRESS_SIZES = Object.freeze({
  xs: {
    height: 'h-1',
    text: 'text-xs',
    gap: 'gap-1',
    label: 'text-xs',
  },
  sm: {
    height: 'h-1.5',
    text: 'text-sm',
    gap: 'gap-1.5',
    label: 'text-xs',
  },
  md: {
    height: 'h-2',
    text: 'text-sm',
    gap: 'gap-2',
    label: 'text-sm',
  },
  lg: {
    height: 'h-2.5',
    text: 'text-base',
    gap: 'gap-2.5',
    label: 'text-sm',
  },
  xl: {
    height: 'h-3',
    text: 'text-base',
    gap: 'gap-3',
    label: 'text-base',
  },
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for Progress bars.
 */
export const PROGRESS_RADIUS = Object.freeze({
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
});

/* ---------------------------------- */
/* Animations                         */
/* ---------------------------------- */

/**
 * Animation presets for Progress bars.
 * Defines animation styles for the indicator.
 */
export const PROGRESS_ANIMATIONS = Object.freeze({
  pulse: {
    animation: 'animate-pulse',
    transition: 'transition-all duration-500 ease-in-out',
  },
  slide: {
    animation: 'animate-slide',
    transition: 'transition-all duration-300 ease-in-out',
  },
  bounce: {
    animation: 'animate-bounce',
    transition: 'transition-all duration-400 ease-in-out',
  },
  none: {
    animation: '',
    transition: 'transition-none',
  },
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Progress dimensions.
 */
export const PROGRESS_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'full',
  animation: 'none',
  showValue: false,
  showLabel: false,
  disabled: false,
  loading: false,
  value: 0,
  max: 100,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for a progress bar.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getProgressVariant(variant) {
  return PROGRESS_VARIANTS[variant] || PROGRESS_VARIANTS[PROGRESS_DEFAULTS.variant];
}

/**
 * Gets the size configuration for a progress bar.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getProgressSize(size) {
  return PROGRESS_SIZES[size] || PROGRESS_SIZES[PROGRESS_DEFAULTS.size];
}

/**
 * Gets the radius class for a progress bar.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getProgressRadius(radius) {
  return PROGRESS_RADIUS[radius] || PROGRESS_RADIUS[PROGRESS_DEFAULTS.radius];
}

/**
 * Gets the animation configuration for a progress bar.
 * @param {string} animation - The animation key.
 * @returns {Object} The animation configuration.
 */
export function getProgressAnimation(animation) {
  return PROGRESS_ANIMATIONS[animation] || PROGRESS_ANIMATIONS[PROGRESS_DEFAULTS.animation];
}