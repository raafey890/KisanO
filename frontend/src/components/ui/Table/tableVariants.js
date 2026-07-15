/**
 * KisanO Design System — Table Package
 * Table Design Tokens
 *
 * Complete design token system for the KisanO Table component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent table styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `TABLE_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Table/tableVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Table.
 * Each variant defines background, text, border, and header styles.
 */
export const TABLE_VARIANTS = Object.freeze({
  default: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border border-gray-200',
    header: 'bg-gray-50 text-gray-700',
    hover: 'hover:bg-gray-50',
    selected: 'bg-blue-50',
  },
  primary: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border border-blue-200',
    header: 'bg-blue-50 text-blue-700',
    hover: 'hover:bg-blue-50/30',
    selected: 'bg-blue-100',
  },
  dark: {
    background: 'bg-gray-900',
    text: 'text-gray-100',
    border: 'border border-gray-700',
    header: 'bg-gray-800 text-gray-200',
    hover: 'hover:bg-gray-800',
    selected: 'bg-gray-700',
  },
  glass: {
    background: 'bg-white/80 backdrop-blur-md',
    text: 'text-gray-900',
    border: 'border border-white/20',
    header: 'bg-white/50 text-gray-700',
    hover: 'hover:bg-white/30',
    selected: 'bg-blue-50/50',
  },
  minimal: {
    background: 'bg-transparent',
    text: 'text-gray-900',
    border: 'border-b border-gray-200',
    header: 'bg-transparent text-gray-700',
    hover: 'hover:bg-gray-50',
    selected: 'bg-blue-50',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Tables.
 * Each size defines padding, text size, and gap.
 */
export const TABLE_SIZES = Object.freeze({
  xs: {
    padding: 'px-2 py-1.5',
    text: 'text-xs',
    gap: 'gap-1',
    cellPadding: 'px-2 py-1.5',
  },
  sm: {
    padding: 'px-3 py-2',
    text: 'text-sm',
    gap: 'gap-1.5',
    cellPadding: 'px-3 py-2',
  },
  md: {
    padding: 'px-4 py-3',
    text: 'text-sm',
    gap: 'gap-2',
    cellPadding: 'px-4 py-3',
  },
  lg: {
    padding: 'px-5 py-3.5',
    text: 'text-base',
    gap: 'gap-2.5',
    cellPadding: 'px-5 py-3.5',
  },
  xl: {
    padding: 'px-6 py-4',
    text: 'text-base',
    gap: 'gap-3',
    cellPadding: 'px-6 py-4',
  },
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for Tables.
 */
export const TABLE_RADIUS = Object.freeze({
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
 * Shadow presets for Tables.
 */
export const TABLE_SHADOWS = Object.freeze({
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
});

/* ---------------------------------- */
/* Stripes                            */
/* ---------------------------------- */

/**
 * Stripe presets for Tables.
 * Defines odd/even row styling.
 */
export const TABLE_STRIPES = Object.freeze({
  none: {
    odd: '',
    even: '',
  },
  default: {
    odd: 'bg-white',
    even: 'bg-gray-50',
  },
  primary: {
    odd: 'bg-white',
    even: 'bg-blue-50/30',
  },
  dark: {
    odd: 'bg-gray-900',
    even: 'bg-gray-800',
  },
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Table dimensions.
 */
export const TABLE_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'lg',
  shadow: 'none',
  stripes: 'default',
  bordered: true,
  hoverable: true,
  selectable: false,
  loading: false,
  disabled: false,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for a table.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getTableVariant(variant) {
  return TABLE_VARIANTS[variant] || TABLE_VARIANTS[TABLE_DEFAULTS.variant];
}

/**
 * Gets the size configuration for a table.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getTableSize(size) {
  return TABLE_SIZES[size] || TABLE_SIZES[TABLE_DEFAULTS.size];
}

/**
 * Gets the radius class for a table.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getTableRadius(radius) {
  return TABLE_RADIUS[radius] || TABLE_RADIUS[TABLE_DEFAULTS.radius];
}

/**
 * Gets the shadow class for a table.
 * @param {string} shadow - The shadow key.
 * @returns {string} The shadow class.
 */
export function getTableShadow(shadow) {
  return TABLE_SHADOWS[shadow] || TABLE_SHADOWS[TABLE_DEFAULTS.shadow];
}

/**
 * Gets the stripe configuration for a table.
 * @param {string} stripes - The stripe key.
 * @returns {Object} The stripe configuration.
 */
export function getTableStripe(stripes) {
  return TABLE_STRIPES[stripes] || TABLE_STRIPES[TABLE_DEFAULTS.stripes];
}