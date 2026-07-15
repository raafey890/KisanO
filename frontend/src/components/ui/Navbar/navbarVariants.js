/**
 * KisanO Design System — Navbar Package
 * Navbar Design Tokens
 *
 * Complete design token system for the KisanO Navbar component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent navbar styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `NAVBAR_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Navbar/navbarVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Navbar.
 * Each variant defines background, text, border, and shadow classes.
 */
export const NAVBAR_VARIANTS = Object.freeze({
  default: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border-b border-gray-200',
    shadow: 'shadow-sm',
  },
  dark: {
    background: 'bg-gray-900',
    text: 'text-white',
    border: 'border-b border-gray-800',
    shadow: 'shadow-lg',
  },
  primary: {
    background: 'bg-blue-600',
    text: 'text-white',
    border: 'border-b border-blue-700',
    shadow: 'shadow-md',
  },
  transparent: {
    background: 'bg-transparent',
    text: 'text-gray-900',
    border: 'border-b border-transparent',
    shadow: 'shadow-none',
  },
  glass: {
    background: 'bg-white/80 backdrop-blur-md',
    text: 'text-gray-900',
    border: 'border-b border-white/20',
    shadow: 'shadow-lg',
  },
  gradient: {
    background: 'bg-gradient-to-r from-blue-600 to-blue-800',
    text: 'text-white',
    border: 'border-b border-blue-900/20',
    shadow: 'shadow-md',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Navbars.
 * Each size defines padding, height, and typography.
 */
export const NAVBAR_SIZES = Object.freeze({
  xs: {
    padding: 'px-3 py-2',
    height: 'h-12',
    text: 'text-sm',
    gap: 'gap-2',
    logo: 'text-base',
  },
  sm: {
    padding: 'px-4 py-2.5',
    height: 'h-14',
    text: 'text-sm',
    gap: 'gap-3',
    logo: 'text-lg',
  },
  md: {
    padding: 'px-6 py-3',
    height: 'h-16',
    text: 'text-base',
    gap: 'gap-4',
    logo: 'text-xl',
  },
  lg: {
    padding: 'px-8 py-3.5',
    height: 'h-18',
    text: 'text-base',
    gap: 'gap-5',
    logo: 'text-2xl',
  },
  xl: {
    padding: 'px-10 py-4',
    height: 'h-20',
    text: 'text-lg',
    gap: 'gap-6',
    logo: 'text-3xl',
  },
});

/* ---------------------------------- */
/* Shadows                            */
/* ---------------------------------- */

/**
 * Shadow presets for Navbars.
 */
export const NAVBAR_SHADOWS = Object.freeze({
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
 * Position presets for Navbars.
 */
export const NAVBAR_POSITIONS = Object.freeze({
  static: 'relative',
  fixed: 'fixed top-0 left-0 right-0 z-50',
  sticky: 'sticky top-0 z-50',
  absolute: 'absolute top-0 left-0 right-0 z-50',
});

/* ---------------------------------- */
/* Backdrops                          */
/* ---------------------------------- */

/**
 * Backdrop presets for Navbars.
 * Used when navbar has a backdrop filter.
 */
export const NAVBAR_BACKDROPS = Object.freeze({
  none: 'backdrop-none',
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Navbar dimensions.
 */
export const NAVBAR_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  shadow: 'sm',
  position: 'static',
  backdrop: 'none',
  sticky: false,
  fixed: false,
  transparent: false,
  collapsed: false,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for a navbar.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getNavbarVariant(variant) {
  return NAVBAR_VARIANTS[variant] || NAVBAR_VARIANTS[NAVBAR_DEFAULTS.variant];
}

/**
 * Gets the size configuration for a navbar.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getNavbarSize(size) {
  return NAVBAR_SIZES[size] || NAVBAR_SIZES[NAVBAR_DEFAULTS.size];
}

/**
 * Gets the shadow class for a navbar.
 * @param {string} shadow - The shadow key.
 * @returns {string} The shadow class.
 */
export function getNavbarShadow(shadow) {
  return NAVBAR_SHADOWS[shadow] || NAVBAR_SHADOWS[NAVBAR_DEFAULTS.shadow];
}

/**
 * Gets the position class for a navbar.
 * @param {string} position - The position key.
 * @returns {string} The position class.
 */
export function getNavbarPosition(position) {
  return NAVBAR_POSITIONS[position] || NAVBAR_POSITIONS[NAVBAR_DEFAULTS.position];
}

/**
 * Gets the backdrop class for a navbar.
 * @param {string} backdrop - The backdrop key.
 * @returns {string} The backdrop class.
 */
export function getNavbarBackdrop(backdrop) {
  return NAVBAR_BACKDROPS[backdrop] || NAVBAR_BACKDROPS[NAVBAR_DEFAULTS.backdrop];
}