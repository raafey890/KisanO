/**
 * KisanO Design System — Select Package
 * Select Design Tokens
 *
 * Complete design token system for the KisanO Select component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent select styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `SELECT_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Select/selectVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Select.
 * Each variant defines background, text, border, and interaction states.
 */
export const SELECT_VARIANTS = Object.freeze({
  default: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border border-gray-300',
    hover: 'hover:border-gray-400',
    active: 'active:border-gray-500',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  },
  primary: {
    background: 'bg-blue-50',
    text: 'text-blue-900',
    border: 'border border-blue-300',
    hover: 'hover:border-blue-400',
    active: 'active:border-blue-500',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  },
  secondary: {
    background: 'bg-gray-50',
    text: 'text-gray-900',
    border: 'border border-gray-300',
    hover: 'hover:border-gray-400',
    active: 'active:border-gray-500',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500',
  },
  ghost: {
    background: 'bg-transparent',
    text: 'text-gray-700',
    border: 'border border-transparent',
    hover: 'hover:border-gray-300',
    active: 'active:border-gray-400',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Selects.
 * Each size defines padding, text size, icon size, and min height.
 */
export const SELECT_SIZES = Object.freeze({
  xs: {
    padding: 'px-2 py-1',
    text: 'text-xs',
    icon: 'h-3 w-3',
    gap: 'gap-1',
    minHeight: 'min-h-[28px]',
    triggerPadding: 'px-2 py-1',
    optionPadding: 'px-2 py-1.5',
    optionText: 'text-xs',
  },
  sm: {
    padding: 'px-3 py-1.5',
    text: 'text-sm',
    icon: 'h-4 w-4',
    gap: 'gap-1.5',
    minHeight: 'min-h-[34px]',
    triggerPadding: 'px-3 py-1.5',
    optionPadding: 'px-3 py-2',
    optionText: 'text-sm',
  },
  md: {
    padding: 'px-4 py-2',
    text: 'text-sm',
    icon: 'h-4 w-4',
    gap: 'gap-2',
    minHeight: 'min-h-[40px]',
    triggerPadding: 'px-4 py-2',
    optionPadding: 'px-4 py-2.5',
    optionText: 'text-sm',
  },
  lg: {
    padding: 'px-5 py-2.5',
    text: 'text-base',
    icon: 'h-5 w-5',
    gap: 'gap-2.5',
    minHeight: 'min-h-[48px]',
    triggerPadding: 'px-5 py-2.5',
    optionPadding: 'px-5 py-3',
    optionText: 'text-base',
  },
  xl: {
    padding: 'px-6 py-3',
    text: 'text-base',
    icon: 'h-5 w-5',
    gap: 'gap-3',
    minHeight: 'min-h-[56px]',
    triggerPadding: 'px-6 py-3',
    optionPadding: 'px-6 py-3.5',
    optionText: 'text-base',
  },
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for Selects.
 */
export const SELECT_RADIUS = Object.freeze({
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
 * Shadow presets for Selects.
 */
export const SELECT_SHADOWS = Object.freeze({
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
 * Position presets for Select menus.
 * Each position defines placement relative to the trigger.
 */
export const SELECT_POSITIONS = Object.freeze({
  bottom: 'top-full left-0 mt-1',
  'bottom-start': 'top-full left-0 mt-1',
  'bottom-end': 'top-full right-0 mt-1',
  top: 'bottom-full left-0 mb-1',
  'top-start': 'bottom-full left-0 mb-1',
  'top-end': 'bottom-full right-0 mb-1',
});

/* ---------------------------------- */
/* Animations                         */
/* ---------------------------------- */

/**
 * Animation presets for Select menu entrance/exit.
 */
export const SELECT_ANIMATIONS = Object.freeze({
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.15, ease: 'easeOut' },
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
/* Option States                      */
/* ---------------------------------- */

/**
 * State presets for Select options.
 */
export const SELECT_OPTION_STATES = Object.freeze({
  default: 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
  selected: 'bg-blue-50 text-blue-700',
  active: 'bg-gray-100 text-gray-900',
  disabled: 'opacity-50 cursor-not-allowed pointer-events-none text-gray-400',
  highlighted: 'bg-gray-50 text-gray-900',
});

/* ---------------------------------- */
/* Icon Sizes                         */
/* ---------------------------------- */

/**
 * Icon size presets for Select.
 */
export const SELECT_ICON_SIZES = Object.freeze({
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Select dimensions.
 */
export const SELECT_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'md',
  shadow: 'lg',
  position: 'bottom',
  animation: 'slideScale',
  placeholder: 'Select an option',
  closeOnSelect: true,
  closeOnOutsideClick: true,
  closeOnEscape: true,
  disabled: false,
  loading: false,
  multiple: false,
  searchable: false,
  clearable: false,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for a select.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getSelectVariant(variant) {
  return SELECT_VARIANTS[variant] || SELECT_VARIANTS[SELECT_DEFAULTS.variant];
}

/**
 * Gets the size configuration for a select.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getSelectSize(size) {
  return SELECT_SIZES[size] || SELECT_SIZES[SELECT_DEFAULTS.size];
}

/**
 * Gets the radius class for a select.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getSelectRadius(radius) {
  return SELECT_RADIUS[radius] || SELECT_RADIUS[SELECT_DEFAULTS.radius];
}

/**
 * Gets the shadow class for a select.
 * @param {string} shadow - The shadow key.
 * @returns {string} The shadow class.
 */
export function getSelectShadow(shadow) {
  return SELECT_SHADOWS[shadow] || SELECT_SHADOWS[SELECT_DEFAULTS.shadow];
}

/**
 * Gets the position class for a select menu.
 * @param {string} position - The position key.
 * @returns {string} The position class.
 */
export function getSelectPosition(position) {
  return SELECT_POSITIONS[position] || SELECT_POSITIONS[SELECT_DEFAULTS.position];
}

/**
 * Gets the animation configuration for a select.
 * @param {string} animation - The animation key.
 * @returns {Object} The animation configuration.
 */
export function getSelectAnimation(animation) {
  return SELECT_ANIMATIONS[animation] || SELECT_ANIMATIONS[SELECT_DEFAULTS.animation];
}

/**
 * Gets the option state classes for a select option.
 * @param {string} state - The state key.
 * @returns {string} The state classes.
 */
export function getSelectOptionState(state) {
  return SELECT_OPTION_STATES[state] || SELECT_OPTION_STATES.default;
}

/**
 * Gets the icon size class for a select.
 * @param {string} size - The size key.
 * @returns {string} The icon size class.
 */
export function getSelectIconSize(size) {
  return SELECT_ICON_SIZES[size] || SELECT_ICON_SIZES[SELECT_DEFAULTS.size];
}