/**
 * KisanO Design System — Showcase Package
 * Showcase Design Tokens
 *
 * Complete design token system for the KisanO Showcase component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent showcase styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `SHOWCASE_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Showcase/showcaseVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Showcase.
 * Each variant defines background, text, and border styles.
 */
export const SHOWCASE_VARIANTS = Object.freeze({
  default: {
    background: 'bg-white dark:bg-gray-900',
    text: 'text-gray-900 dark:text-gray-100',
    border: 'border border-gray-200 dark:border-gray-700',
    shadow: 'shadow-lg',
  },
  dark: {
    background: 'bg-gray-900 dark:bg-gray-950',
    text: 'text-white dark:text-gray-100',
    border: 'border border-gray-800 dark:border-gray-800',
    shadow: 'shadow-xl',
  },
  glass: {
    background: 'bg-white/80 backdrop-blur-md dark:bg-gray-900/80',
    text: 'text-gray-900 dark:text-gray-100',
    border: 'border border-white/20 dark:border-gray-700/50',
    shadow: 'shadow-xl',
  },
  minimal: {
    background: 'bg-transparent',
    text: 'text-gray-900 dark:text-gray-100',
    border: 'border border-transparent',
    shadow: 'shadow-none',
  },
  gradient: {
    background: 'bg-gradient-to-br from-blue-600 to-purple-700 dark:from-blue-800 dark:to-purple-900',
    text: 'text-white',
    border: 'border border-blue-500/20 dark:border-blue-400/20',
    shadow: 'shadow-xl',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Showcase.
 * Each size defines dimensions and spacing.
 */
export const SHOWCASE_SIZES = Object.freeze({
  xs: {
    padding: 'p-4',
    gap: 'gap-2',
    text: 'text-sm',
    maxWidth: 'max-w-xs',
  },
  sm: {
    padding: 'p-6',
    gap: 'gap-3',
    text: 'text-sm',
    maxWidth: 'max-w-sm',
  },
  md: {
    padding: 'p-8',
    gap: 'gap-4',
    text: 'text-base',
    maxWidth: 'max-w-md',
  },
  lg: {
    padding: 'p-10',
    gap: 'gap-5',
    text: 'text-lg',
    maxWidth: 'max-w-lg',
  },
  xl: {
    padding: 'p-12',
    gap: 'gap-6',
    text: 'text-xl',
    maxWidth: 'max-w-xl',
  },
  full: {
    padding: 'p-8',
    gap: 'gap-6',
    text: 'text-base',
    maxWidth: 'max-w-full',
  },
});

/* ---------------------------------- */
/* Layouts                            */
/* ---------------------------------- */

/**
 * Layout presets for Showcase.
 * Defines content arrangement and alignment.
 */
export const SHOWCASE_LAYOUTS = Object.freeze({
  row: {
    flex: 'flex-row',
    align: 'items-center',
    wrap: 'flex-wrap',
    gap: 'gap-4',
  },
  column: {
    flex: 'flex-col',
    align: 'items-center',
    wrap: '',
    gap: 'gap-6',
  },
  grid: {
    flex: 'grid',
    align: '',
    wrap: '',
    gap: 'gap-4',
    cols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  },
  carousel: {
    flex: 'flex',
    align: 'items-center',
    wrap: 'flex-nowrap',
    gap: 'gap-4',
    overflow: 'overflow-x-auto',
  },
  masonry: {
    flex: 'grid',
    align: '',
    wrap: '',
    gap: 'gap-4',
    cols: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  },
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Showcase dimensions.
 */
export const SHOWCASE_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  layout: 'column',
  animated: true,
  responsive: true,
  disabled: false,
  loading: false,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for a showcase.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getShowcaseVariant(variant) {
  return SHOWCASE_VARIANTS[variant] || SHOWCASE_VARIANTS[SHOWCASE_DEFAULTS.variant];
}

/**
 * Gets the size configuration for a showcase.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getShowcaseSize(size) {
  return SHOWCASE_SIZES[size] || SHOWCASE_SIZES[SHOWCASE_DEFAULTS.size];
}

/**
 * Gets the layout configuration for a showcase.
 * @param {string} layout - The layout key.
 * @returns {Object} The layout configuration.
 */
export function getShowcaseLayout(layout) {
  return SHOWCASE_LAYOUTS[layout] || SHOWCASE_LAYOUTS[SHOWCASE_DEFAULTS.layout];
}