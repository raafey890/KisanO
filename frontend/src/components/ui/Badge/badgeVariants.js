/**
 * KisanO Design System — Badge Package
 * Badge Design Tokens
 *
 * Complete design token system for the KisanO Badge component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent badge styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `BADGE_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Badge/badgeVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Badge.
 * Each variant defines background, text, border, and interaction states.
 */
export const BADGE_VARIANTS = Object.freeze({
  default: {
    background: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border border-gray-200',
    hover: 'hover:bg-gray-200',
  },
  primary: {
    background: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border border-blue-200',
    hover: 'hover:bg-blue-200',
  },
  secondary: {
    background: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border border-gray-200',
    hover: 'hover:bg-gray-200',
  },
  success: {
    background: 'bg-green-100',
    text: 'text-green-700',
    border: 'border border-green-200',
    hover: 'hover:bg-green-200',
  },
  warning: {
    background: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border border-yellow-200',
    hover: 'hover:bg-yellow-200',
  },
  error: {
    background: 'bg-red-100',
    text: 'text-red-700',
    border: 'border border-red-200',
    hover: 'hover:bg-red-200',
  },
  info: {
    background: 'bg-cyan-100',
    text: 'text-cyan-700',
    border: 'border border-cyan-200',
    hover: 'hover:bg-cyan-200',
  },
  outline: {
    background: 'bg-transparent',
    text: 'text-gray-700',
    border: 'border border-gray-300',
    hover: 'hover:bg-gray-50',
  },
  ghost: {
    background: 'bg-transparent',
    text: 'text-gray-600',
    border: 'border border-transparent',
    hover: 'hover:bg-gray-50',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Badges.
 * Each size defines padding, text size, icon size, and min dimensions.
 */
export const BADGE_SIZES = Object.freeze({
  xs: {
    padding: 'px-1.5 py-0.5',
    text: 'text-[10px]',
    icon: 'h-2.5 w-2.5',
    gap: 'gap-1',
    minHeight: 'min-h-[16px]',
    minWidth: 'min-w-[16px]',
  },
  sm: {
    padding: 'px-2 py-0.5',
    text: 'text-xs',
    icon: 'h-3 w-3',
    gap: 'gap-1.5',
    minHeight: 'min-h-[20px]',
    minWidth: 'min-w-[20px]',
  },
  md: {
    padding: 'px-2.5 py-1',
    text: 'text-xs',
    icon: 'h-3.5 w-3.5',
    gap: 'gap-1.5',
    minHeight: 'min-h-[24px]',
    minWidth: 'min-w-[24px]',
  },
  lg: {
    padding: 'px-3 py-1.5',
    text: 'text-sm',
    icon: 'h-4 w-4',
    gap: 'gap-2',
    minHeight: 'min-h-[28px]',
    minWidth: 'min-w-[28px]',
  },
  xl: {
    padding: 'px-4 py-2',
    text: 'text-sm',
    icon: 'h-4.5 w-4.5',
    gap: 'gap-2.5',
    minHeight: 'min-h-[32px]',
    minWidth: 'min-w-[32px]',
  },
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for Badges.
 */
export const BADGE_RADIUS = Object.freeze({
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
});

/* ---------------------------------- */
/* Positions                          */
/* ---------------------------------- */

/**
 * Position presets for Badges.
 * Used for dot badges and floating badges.
 */
export const BADGE_POSITIONS = Object.freeze({
  'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
  'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
  'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
  'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
  'top-center': 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Badge dimensions.
 */
export const BADGE_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'full',
  position: 'top-right',
  disabled: false,
  loading: false,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for a badge.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getBadgeVariant(variant) {
  return BADGE_VARIANTS[variant] || BADGE_VARIANTS[BADGE_DEFAULTS.variant];
}

/**
 * Gets the size configuration for a badge.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getBadgeSize(size) {
  return BADGE_SIZES[size] || BADGE_SIZES[BADGE_DEFAULTS.size];
}

/**
 * Gets the radius class for a badge.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getBadgeRadius(radius) {
  return BADGE_RADIUS[radius] || BADGE_RADIUS[BADGE_DEFAULTS.radius];
}

/**
 * Gets the position class for a badge.
 * @param {string} position - The position key.
 * @returns {string} The position class.
 */
export function getBadgePosition(position) {
  return BADGE_POSITIONS[position] || BADGE_POSITIONS[BADGE_DEFAULTS.position];
}