/**
 * KisanO Design System — Sidebar Package
 * Sidebar Design Tokens
 *
 * Complete design token system for the KisanO Sidebar component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent sidebar styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `SIDEBAR_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Sidebar/sidebarVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Sidebar.
 * Each variant defines background, text, border, and shadow classes.
 */
export const SIDEBAR_VARIANTS = Object.freeze({
  default: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border-r border-gray-200',
    shadow: 'shadow-lg',
  },
  dark: {
    background: 'bg-gray-900',
    text: 'text-white',
    border: 'border-r border-gray-800',
    shadow: 'shadow-lg',
  },
  primary: {
    background: 'bg-blue-600',
    text: 'text-white',
    border: 'border-r border-blue-700',
    shadow: 'shadow-lg',
  },
  transparent: {
    background: 'bg-transparent',
    text: 'text-gray-900',
    border: 'border-r border-transparent',
    shadow: 'shadow-none',
  },
  glass: {
    background: 'bg-white/80 backdrop-blur-md',
    text: 'text-gray-900',
    border: 'border-r border-white/20',
    shadow: 'shadow-xl',
  },
  gradient: {
    background: 'bg-gradient-to-b from-blue-600 to-blue-800',
    text: 'text-white',
    border: 'border-r border-blue-900/20',
    shadow: 'shadow-lg',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Sidebars.
 * Each size defines padding, font size, icon size, and spacing.
 */
export const SIDEBAR_SIZES = Object.freeze({
  xs: {
    padding: 'px-2 py-2',
    text: 'text-xs',
    icon: 'h-4 w-4',
    gap: 'gap-1',
    itemPadding: 'px-2 py-1.5',
    itemText: 'text-xs',
    itemIcon: 'h-4 w-4',
    groupGap: 'gap-1',
  },
  sm: {
    padding: 'px-3 py-3',
    text: 'text-sm',
    icon: 'h-5 w-5',
    gap: 'gap-1.5',
    itemPadding: 'px-3 py-2',
    itemText: 'text-sm',
    itemIcon: 'h-5 w-5',
    groupGap: 'gap-1.5',
  },
  md: {
    padding: 'px-4 py-4',
    text: 'text-sm',
    icon: 'h-5 w-5',
    gap: 'gap-2',
    itemPadding: 'px-4 py-2.5',
    itemText: 'text-sm',
    itemIcon: 'h-5 w-5',
    groupGap: 'gap-2',
  },
  lg: {
    padding: 'px-5 py-5',
    text: 'text-base',
    icon: 'h-6 w-6',
    gap: 'gap-2.5',
    itemPadding: 'px-5 py-3',
    itemText: 'text-base',
    itemIcon: 'h-6 w-6',
    groupGap: 'gap-2.5',
  },
  xl: {
    padding: 'px-6 py-6',
    text: 'text-base',
    icon: 'h-6 w-6',
    gap: 'gap-3',
    itemPadding: 'px-6 py-3.5',
    itemText: 'text-base',
    itemIcon: 'h-6 w-6',
    groupGap: 'gap-3',
  },
});

/* ---------------------------------- */
/* Widths                             */
/* ---------------------------------- */

/**
 * Width presets for Sidebars.
 */
export const SIDEBAR_WIDTHS = Object.freeze({
  xs: 'w-48',
  sm: 'w-56',
  md: 'w-64',
  lg: 'w-72',
  xl: 'w-80',
  full: 'w-full',
  collapsed: 'w-16',
});

/* ---------------------------------- */
/* Shadows                            */
/* ---------------------------------- */

/**
 * Shadow presets for Sidebars.
 */
export const SIDEBAR_SHADOWS = Object.freeze({
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
});

/* ---------------------------------- */
/* Positions                          */
/* ---------------------------------- */

/**
 * Position presets for Sidebars.
 */
export const SIDEBAR_POSITIONS = Object.freeze({
  left: 'left-0 top-0 bottom-0',
  right: 'right-0 top-0 bottom-0',
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Sidebar dimensions.
 */
export const SIDEBAR_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  width: 'md',
  shadow: 'lg',
  position: 'left',
  collapsed: false,
  open: true,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for a sidebar.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getSidebarVariant(variant) {
  return SIDEBAR_VARIANTS[variant] || SIDEBAR_VARIANTS[SIDEBAR_DEFAULTS.variant];
}

/**
 * Gets the size configuration for a sidebar.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getSidebarSize(size) {
  return SIDEBAR_SIZES[size] || SIDEBAR_SIZES[SIDEBAR_DEFAULTS.size];
}

/**
 * Gets the width class for a sidebar.
 * @param {string} width - The width key.
 * @returns {string} The width class.
 */
export function getSidebarWidth(width) {
  return SIDEBAR_WIDTHS[width] || SIDEBAR_WIDTHS[SIDEBAR_DEFAULTS.width];
}

/**
 * Gets the shadow class for a sidebar.
 * @param {string} shadow - The shadow key.
 * @returns {string} The shadow class.
 */
export function getSidebarShadow(shadow) {
  return SIDEBAR_SHADOWS[shadow] || SIDEBAR_SHADOWS[SIDEBAR_DEFAULTS.shadow];
}

/**
 * Gets the position class for a sidebar.
 * @param {string} position - The position key.
 * @returns {string} The position class.
 */
export function getSidebarPosition(position) {
  return SIDEBAR_POSITIONS[position] || SIDEBAR_POSITIONS[SIDEBAR_DEFAULTS.position];
}