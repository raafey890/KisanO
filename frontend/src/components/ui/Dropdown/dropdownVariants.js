/**
 * KisanO Design System — Dropdown Package
 * Dropdown Design Tokens
 *
 * Complete design token system for the KisanO Dropdown component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent dropdown styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `DROPDOWN_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Dropdown/dropdownVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Dropdown.
 * Each variant defines background, text, border, and interaction states.
 */
export const DROPDOWN_VARIANTS = Object.freeze({
  default: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border border-gray-200',
    hover: 'hover:bg-gray-50 hover:text-gray-900',
    active: 'active:bg-gray-100 active:text-gray-900',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
  primary: {
    background: 'bg-blue-600',
    text: 'text-white',
    border: 'border border-blue-700',
    hover: 'hover:bg-blue-700 hover:text-white',
    active: 'active:bg-blue-800 active:text-white',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
  secondary: {
    background: 'bg-gray-600',
    text: 'text-white',
    border: 'border border-gray-700',
    hover: 'hover:bg-gray-700 hover:text-white',
    active: 'active:bg-gray-800 active:text-white',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
  },
  success: {
    background: 'bg-green-600',
    text: 'text-white',
    border: 'border border-green-700',
    hover: 'hover:bg-green-700 hover:text-white',
    active: 'active:bg-green-800 active:text-white',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
  },
  warning: {
    background: 'bg-yellow-500',
    text: 'text-white',
    border: 'border border-yellow-600',
    hover: 'hover:bg-yellow-600 hover:text-white',
    active: 'active:bg-yellow-700 active:text-white',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2',
  },
  error: {
    background: 'bg-red-600',
    text: 'text-white',
    border: 'border border-red-700',
    hover: 'hover:bg-red-700 hover:text-white',
    active: 'active:bg-red-800 active:text-white',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
  },
  ghost: {
    background: 'bg-transparent',
    text: 'text-gray-700',
    border: 'border border-transparent',
    hover: 'hover:bg-gray-100 hover:text-gray-900',
    active: 'active:bg-gray-200 active:text-gray-900',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Dropdowns.
 * Each size defines padding, text size, icon size, gap, and min height.
 */
export const DROPDOWN_SIZES = Object.freeze({
  xs: {
    padding: 'px-2 py-1',
    text: 'text-xs',
    icon: 'h-3 w-3',
    gap: 'gap-1',
    minHeight: 'min-h-7',
  },
  sm: {
    padding: 'px-3 py-1.5',
    text: 'text-sm',
    icon: 'h-4 w-4',
    gap: 'gap-1.5',
    minHeight: 'min-h-8',
  },
  md: {
    padding: 'px-4 py-2',
    text: 'text-sm',
    icon: 'h-4 w-4',
    gap: 'gap-2',
    minHeight: 'min-h-10',
  },
  lg: {
    padding: 'px-5 py-2.5',
    text: 'text-base',
    icon: 'h-5 w-5',
    gap: 'gap-2.5',
    minHeight: 'min-h-12',
  },
  xl: {
    padding: 'px-6 py-3',
    text: 'text-base',
    icon: 'h-5 w-5',
    gap: 'gap-3',
    minHeight: 'min-h-14',
  },
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for Dropdowns.
 */
export const DROPDOWN_RADIUS = Object.freeze({
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
 * Shadow presets for Dropdowns.
 */
export const DROPDOWN_SHADOWS = Object.freeze({
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
 * Position presets for Dropdown menus.
 * Each position defines placement relative to the trigger.
 */
export const DROPDOWN_POSITIONS = Object.freeze({
  bottom: 'top-full left-0 mt-1',
  'bottom-start': 'top-full left-0 mt-1',
  'bottom-end': 'top-full right-0 mt-1',
  top: 'bottom-full left-0 mb-1',
  'top-start': 'bottom-full left-0 mb-1',
  'top-end': 'bottom-full right-0 mb-1',
  left: 'right-full top-0 mr-1',
  'left-start': 'right-full top-0 mr-1',
  'left-end': 'right-full bottom-0 mr-1',
  right: 'left-full top-0 ml-1',
  'right-start': 'left-full top-0 ml-1',
  'right-end': 'left-full bottom-0 ml-1',
});

/* ---------------------------------- */
/* Animations                         */
/* ---------------------------------- */

/**
 * Animation presets for Dropdown menu entrance/exit.
 */
export const DROPDOWN_ANIMATIONS = Object.freeze({
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.15, ease:[0.4,0,0.2,1] },
  },
  slide: {
    initial: { opacity: 0, y: -8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
  },
  slideScale: {
    initial: { opacity: 0, y: -8, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -8, scale: 0.95 },
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
    transition: { duration: 0 },
  },
});

/* ---------------------------------- */
/* Item States                        */
/* ---------------------------------- */

/**
 * State presets for Dropdown items.
 */
export const DROPDOWN_ITEM_STATES = Object.freeze({
  default: 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
  selected: 'bg-blue-50 text-blue-700',
  active: 'bg-gray-100 text-gray-900',
  disabled: 'opacity-50 cursor-not-allowed pointer-events-none text-gray-400',
  danger: 'text-red-600 hover:bg-red-50 hover:text-red-700',
  success: 'text-green-600 hover:bg-green-50 hover:text-green-700',
  warning: 'text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700',
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Dropdown dimensions.
 */
export const DROPDOWN_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'md',
  shadow: 'lg',
  position: 'bottom',
  animation: 'slideScale',
  closeOnSelect: true,
  closeOnOutsideClick: true,
  closeOnEscape: true,
  disabled: false,
  loading: false,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for a dropdown.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getDropdownVariant(variant) {
  return DROPDOWN_VARIANTS[variant] || DROPDOWN_VARIANTS[DROPDOWN_DEFAULTS.variant];
}

/**
 * Gets the size configuration for a dropdown.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getDropdownSize(size) {
  return DROPDOWN_SIZES[size] || DROPDOWN_SIZES[DROPDOWN_DEFAULTS.size];
}

/**
 * Gets the radius class for a dropdown.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getDropdownRadius(radius) {
  return DROPDOWN_RADIUS[radius] || DROPDOWN_RADIUS[DROPDOWN_DEFAULTS.radius];
}

/**
 * Gets the shadow class for a dropdown.
 * @param {string} shadow - The shadow key.
 * @returns {string} The shadow class.
 */
export function getDropdownShadow(shadow) {
  return DROPDOWN_SHADOWS[shadow] || DROPDOWN_SHADOWS[DROPDOWN_DEFAULTS.shadow];
}

/**
 * Gets the position class for a dropdown.
 * @param {string} position - The position key.
 * @returns {string} The position class.
 */
export function getDropdownPosition(position) {
  return DROPDOWN_POSITIONS[position] || DROPDOWN_POSITIONS[DROPDOWN_DEFAULTS.position];
}

/**
 * Gets the animation configuration for a dropdown.
 * @param {string} animation - The animation key.
 * @returns {Object} The animation configuration.
 */
export function getDropdownAnimation(animation) {
  return DROPDOWN_ANIMATIONS[animation] || DROPDOWN_ANIMATIONS[DROPDOWN_DEFAULTS.animation];
}