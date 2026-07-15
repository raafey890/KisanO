/**
 * KisanO Design System — EmptyState Package
 * EmptyState Design Tokens
 *
 * Complete design token system for the KisanO EmptyState component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent empty state styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `EMPTYSTATE_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/EmptyState/emptyStateVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the EmptyState.
 * Each variant defines background, text, border, and interaction states.
 */
export const EMPTYSTATE_VARIANTS = Object.freeze({
  default: {
    background: 'bg-white dark:bg-gray-900',
    text: 'text-gray-600 dark:text-gray-400',
    border: 'border border-gray-200 dark:border-gray-700',
    icon: 'text-gray-400 dark:text-gray-500',
    title: 'text-gray-900 dark:text-white',
    description: 'text-gray-600 dark:text-gray-400',
  },
  subtle: {
    background: 'bg-gray-50 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-400',
    border: 'border border-gray-100 dark:border-gray-700',
    icon: 'text-gray-300 dark:text-gray-600',
    title: 'text-gray-800 dark:text-white',
    description: 'text-gray-500 dark:text-gray-400',
  },
  glass: {
    background: 'bg-white/80 backdrop-blur-md dark:bg-gray-900/80',
    text: 'text-gray-600 dark:text-gray-400',
    border: 'border border-white/20 dark:border-gray-700/50',
    icon: 'text-gray-400 dark:text-gray-500',
    title: 'text-gray-900 dark:text-white',
    description: 'text-gray-600 dark:text-gray-400',
  },
  primary: {
    background: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border border-blue-200 dark:border-blue-800',
    icon: 'text-blue-400 dark:text-blue-500',
    title: 'text-blue-800 dark:text-blue-300',
    description: 'text-blue-600 dark:text-blue-400',
  },
  success: {
    background: 'bg-green-50 dark:bg-green-950/30',
    text: 'text-green-600 dark:text-green-400',
    border: 'border border-green-200 dark:border-green-800',
    icon: 'text-green-400 dark:text-green-500',
    title: 'text-green-800 dark:text-green-300',
    description: 'text-green-600 dark:text-green-400',
  },
  warning: {
    background: 'bg-yellow-50 dark:bg-yellow-950/30',
    text: 'text-yellow-600 dark:text-yellow-400',
    border: 'border border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-400 dark:text-yellow-500',
    title: 'text-yellow-800 dark:text-yellow-300',
    description: 'text-yellow-600 dark:text-yellow-400',
  },
  error: {
    background: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-600 dark:text-red-400',
    border: 'border border-red-200 dark:border-red-800',
    icon: 'text-red-400 dark:text-red-500',
    title: 'text-red-800 dark:text-red-300',
    description: 'text-red-600 dark:text-red-400',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for EmptyState.
 * Each size defines padding, text size, icon size, and spacing.
 */
export const EMPTYSTATE_SIZES = Object.freeze({
  xs: {
    padding: 'p-4',
    text: 'text-xs',
    title: 'text-sm',
    description: 'text-xs',
    icon: 'h-10 w-10',
    gap: 'gap-2',
    maxWidth: 'max-w-xs',
  },
  sm: {
    padding: 'p-6',
    text: 'text-sm',
    title: 'text-base',
    description: 'text-sm',
    icon: 'h-12 w-12',
    gap: 'gap-3',
    maxWidth: 'max-w-sm',
  },
  md: {
    padding: 'p-8',
    text: 'text-sm',
    title: 'text-xl',
    description: 'text-sm',
    icon: 'h-16 w-16',
    gap: 'gap-4',
    maxWidth: 'max-w-md',
  },
  lg: {
    padding: 'p-10',
    text: 'text-base',
    title: 'text-2xl',
    description: 'text-base',
    icon: 'h-20 w-20',
    gap: 'gap-5',
    maxWidth: 'max-w-lg',
  },
  xl: {
    padding: 'p-12',
    text: 'text-base',
    title: 'text-3xl',
    description: 'text-base',
    icon: 'h-24 w-24',
    gap: 'gap-6',
    maxWidth: 'max-w-xl',
  },
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for EmptyState.
 */
export const EMPTYSTATE_RADIUS = Object.freeze({
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
});

/* ---------------------------------- */
/* Alignments                         */
/* ---------------------------------- */

/**
 * Alignment presets for EmptyState content.
 */
export const EMPTYSTATE_ALIGNMENTS = Object.freeze({
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all EmptyState dimensions.
 */
export const EMPTYSTATE_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'lg',
  alignment: 'center',
  disabled: false,
  loading: false,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for an empty state.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getEmptyStateVariant(variant) {
  return EMPTYSTATE_VARIANTS[variant] || EMPTYSTATE_VARIANTS[EMPTYSTATE_DEFAULTS.variant];
}

/**
 * Gets the size configuration for an empty state.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getEmptyStateSize(size) {
  return EMPTYSTATE_SIZES[size] || EMPTYSTATE_SIZES[EMPTYSTATE_DEFAULTS.size];
}

/**
 * Gets the radius class for an empty state.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getEmptyStateRadius(radius) {
  return EMPTYSTATE_RADIUS[radius] || EMPTYSTATE_RADIUS[EMPTYSTATE_DEFAULTS.radius];
}

/**
 * Gets the alignment class for an empty state.
 * @param {string} alignment - The alignment key.
 * @returns {string} The alignment class.
 */
export function getEmptyStateAlignment(alignment) {
  return EMPTYSTATE_ALIGNMENTS[alignment] || EMPTYSTATE_ALIGNMENTS[EMPTYSTATE_DEFAULTS.alignment];
}