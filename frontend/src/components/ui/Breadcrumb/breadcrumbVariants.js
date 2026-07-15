/**
 * KisanO Design System — Breadcrumb Package
 * Breadcrumb Design Tokens
 *
 * Complete design token system for the KisanO Breadcrumb component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent breadcrumb styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `BREADCRUMB_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Breadcrumb/breadcrumbVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Breadcrumb.
 * Each variant defines background, text, and interaction states.
 */
export const BREADCRUMB_VARIANTS = Object.freeze({
  default: {
    background: 'bg-transparent',
    text: 'text-gray-500',
    active: 'text-gray-900',
    hover: 'hover:text-gray-700',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
  primary: {
    background: 'bg-transparent',
    text: 'text-blue-600',
    active: 'text-blue-800',
    hover: 'hover:text-blue-700',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
  dark: {
    background: 'bg-transparent',
    text: 'text-gray-400',
    active: 'text-white',
    hover: 'hover:text-gray-200',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
  filled: {
    background: 'bg-gray-100',
    text: 'text-gray-500',
    active: 'text-gray-900',
    hover: 'hover:text-gray-700 hover:bg-gray-200',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
  minimal: {
    background: 'bg-transparent',
    text: 'text-gray-400',
    active: 'text-gray-900',
    hover: 'hover:text-gray-600',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Breadcrumbs.
 * Each size defines padding, text size, icon size, and gap.
 */
export const BREADCRUMB_SIZES = Object.freeze({
  xs: {
    padding: 'px-1.5 py-0.5',
    text: 'text-xs',
    icon: 'h-3 w-3',
    gap: 'gap-1',
    minHeight: 'min-h-[24px]',
  },
  sm: {
    padding: 'px-2 py-1',
    text: 'text-sm',
    icon: 'h-3.5 w-3.5',
    gap: 'gap-1.5',
    minHeight: 'min-h-[30px]',
  },
  md: {
    padding: 'px-2.5 py-1.5',
    text: 'text-sm',
    icon: 'h-4 w-4',
    gap: 'gap-2',
    minHeight: 'min-h-[36px]',
  },
  lg: {
    padding: 'px-3 py-2',
    text: 'text-base',
    icon: 'h-4.5 w-4.5',
    gap: 'gap-2.5',
    minHeight: 'min-h-[42px]',
  },
  xl: {
    padding: 'px-3.5 py-2.5',
    text: 'text-base',
    icon: 'h-5 w-5',
    gap: 'gap-3',
    minHeight: 'min-h-[48px]',
  },
});

/* ---------------------------------- */
/* Separators                         */
/* ---------------------------------- */

/**
 * Separator presets for Breadcrumbs.
 * Each separator defines the character or icon used between items.
 */
export const BREADCRUMB_SEPARATORS = Object.freeze({
  slash: '/',
  chevron: '›',
  arrow: '→',
  dot: '•',
  hyphen: '-',
  pipe: '|',
  custom: '',
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Breadcrumb dimensions.
 */
export const BREADCRUMB_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  separator: 'chevron',
  disabled: false,
  loading: false,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for breadcrumbs.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getBreadcrumbVariant(variant) {
  return BREADCRUMB_VARIANTS[variant] || BREADCRUMB_VARIANTS[BREADCRUMB_DEFAULTS.variant];
}

/**
 * Gets the size configuration for breadcrumbs.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getBreadcrumbSize(size) {
  return BREADCRUMB_SIZES[size] || BREADCRUMB_SIZES[BREADCRUMB_DEFAULTS.size];
}

/**
 * Gets the separator character for breadcrumbs.
 * @param {string} separator - The separator key.
 * @returns {string} The separator character.
 */
export function getBreadcrumbSeparator(separator) {
  return BREADCRUMB_SEPARATORS[separator] || BREADCRUMB_SEPARATORS[BREADCRUMB_DEFAULTS.separator];
}