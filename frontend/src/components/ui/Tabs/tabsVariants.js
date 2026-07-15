/**
 * KisanO Design System — Tabs Package
 * Tabs Design Tokens
 *
 * Complete design token system for the KisanO Tabs component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent tabs styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `TABS_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Tabs/tabsVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Tabs.
 * Each variant defines background, text, border, and interaction states.
 */
export const TABS_VARIANTS = Object.freeze({
  default: {
    background: 'bg-transparent',
    text: 'text-gray-500',
    border: 'border-b border-gray-200',
    active: 'text-blue-600 border-b-2 border-blue-600',
    hover: 'hover:text-gray-700 hover:border-gray-300',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
  primary: {
    background: 'bg-transparent',
    text: 'text-gray-500',
    border: 'border-b border-gray-200',
    active: 'text-blue-600 border-b-2 border-blue-600',
    hover: 'hover:text-blue-600 hover:border-blue-400',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
  filled: {
    background: 'bg-gray-100',
    text: 'text-gray-500',
    border: 'border border-transparent',
    active: 'bg-white text-blue-600 border-blue-600',
    hover: 'hover:bg-gray-200 hover:text-gray-700',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
  pill: {
    background: 'bg-gray-100',
    text: 'text-gray-500',
    border: 'border border-transparent',
    active: 'bg-blue-600 text-white',
    hover: 'hover:bg-gray-200 hover:text-gray-700',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
  underline: {
    background: 'bg-transparent',
    text: 'text-gray-500',
    border: 'border-b-2 border-transparent',
    active: 'text-blue-600 border-b-2 border-blue-600',
    hover: 'hover:text-gray-700 hover:border-gray-300',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
  minimal: {
    background: 'bg-transparent',
    text: 'text-gray-500',
    border: 'border border-transparent',
    active: 'text-blue-600',
    hover: 'hover:text-gray-700',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Tabs.
 * Each size defines padding, text size, and gap.
 */
export const TABS_SIZES = Object.freeze({
  xs: {
    padding: 'px-3 py-1.5',
    text: 'text-xs',
    gap: 'gap-1',
    minHeight: 'min-h-[32px]',
    icon: 'h-3 w-3',
  },
  sm: {
    padding: 'px-4 py-2',
    text: 'text-sm',
    gap: 'gap-1.5',
    minHeight: 'min-h-[38px]',
    icon: 'h-4 w-4',
  },
  md: {
    padding: 'px-5 py-2.5',
    text: 'text-sm',
    gap: 'gap-2',
    minHeight: 'min-h-[44px]',
    icon: 'h-4 w-4',
  },
  lg: {
    padding: 'px-6 py-3',
    text: 'text-base',
    gap: 'gap-2.5',
    minHeight: 'min-h-[50px]',
    icon: 'h-5 w-5',
  },
  xl: {
    padding: 'px-7 py-3.5',
    text: 'text-base',
    gap: 'gap-3',
    minHeight: 'min-h-[56px]',
    icon: 'h-5 w-5',
  },
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for Tabs.
 */
export const TABS_RADIUS = Object.freeze({
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
});

/* ---------------------------------- */
/* Indicators                         */
/* ---------------------------------- */

/**
 * Indicator presets for Tabs.
 * Defines the visual indicator for active tabs.
 */
export const TABS_INDICATORS = Object.freeze({
  underline: 'border-b-2 border-blue-600',
  background: 'bg-blue-600 text-white',
  pill: 'bg-blue-600 text-white rounded-full',
  dot: 'after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-blue-600 after:rounded-full',
  none: '',
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Tabs dimensions.
 */
export const TABS_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'md',
  indicator: 'underline',
  orientation: 'horizontal',
  disabled: false,
  loading: false,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for tabs.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getTabsVariant(variant) {
  return TABS_VARIANTS[variant] || TABS_VARIANTS[TABS_DEFAULTS.variant];
}

/**
 * Gets the size configuration for tabs.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getTabsSize(size) {
  return TABS_SIZES[size] || TABS_SIZES[TABS_DEFAULTS.size];
}

/**
 * Gets the radius class for tabs.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getTabsRadius(radius) {
  return TABS_RADIUS[radius] || TABS_RADIUS[TABS_DEFAULTS.radius];
}

/**
 * Gets the indicator class for tabs.
 * @param {string} indicator - The indicator key.
 * @returns {string} The indicator class.
 */
export function getTabsIndicator(indicator) {
  return TABS_INDICATORS[indicator] || TABS_INDICATORS[TABS_DEFAULTS.indicator];
}