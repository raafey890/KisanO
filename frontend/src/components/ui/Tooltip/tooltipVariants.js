/**
 * KisanO Design System — Tooltip Package
 * Tooltip Design Tokens
 *
 * Complete design token system for the KisanO Tooltip component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent tooltip styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `TOOLTIP_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Tooltip/tooltipVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Tooltip.
 * Each variant defines background, text, and border classes.
 */
export const TOOLTIP_VARIANTS = Object.freeze({
  default: {
    background: 'bg-gray-900',
    text: 'text-white',
    border: 'border border-gray-700',
    shadow: 'shadow-lg',
  },
  light: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border border-gray-200',
    shadow: 'shadow-lg',
  },
  primary: {
    background: 'bg-blue-600',
    text: 'text-white',
    border: 'border border-blue-700',
    shadow: 'shadow-lg',
  },
  success: {
    background: 'bg-green-600',
    text: 'text-white',
    border: 'border border-green-700',
    shadow: 'shadow-lg',
  },
  warning: {
    background: 'bg-yellow-500',
    text: 'text-white',
    border: 'border border-yellow-600',
    shadow: 'shadow-lg',
  },
  error: {
    background: 'bg-red-600',
    text: 'text-white',
    border: 'border border-red-700',
    shadow: 'shadow-lg',
  },
  info: {
    background: 'bg-cyan-600',
    text: 'text-white',
    border: 'border border-cyan-700',
    shadow: 'shadow-lg',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Tooltips.
 * Each size defines padding, font size, and max width.
 */
export const TOOLTIP_SIZES = Object.freeze({
  xs: {
    padding: 'px-2 py-1',
    fontSize: 'text-xs',
    maxWidth: 'max-w-xs',
    gap: 'gap-1',
  },
  sm: {
    padding: 'px-2.5 py-1.5',
    fontSize: 'text-sm',
    maxWidth: 'max-w-sm',
    gap: 'gap-1.5',
  },
  md: {
    padding: 'px-3 py-2',
    fontSize: 'text-sm',
    maxWidth: 'max-w-md',
    gap: 'gap-2',
  },
  lg: {
    padding: 'px-4 py-2.5',
    fontSize: 'text-base',
    maxWidth: 'max-w-lg',
    gap: 'gap-2.5',
  },
  xl: {
    padding: 'px-5 py-3',
    fontSize: 'text-base',
    maxWidth: 'max-w-xl',
    gap: 'gap-3',
  },
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for Tooltips.
 */
export const TOOLTIP_RADIUS = Object.freeze({
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
});

/* ---------------------------------- */
/* Shadows                            */
/* ---------------------------------- */

/**
 * Shadow presets for Tooltips.
 */
export const TOOLTIP_SHADOWS = Object.freeze({
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
 * Position presets for Tooltips.
 * Each position defines placement relative to the trigger element.
 */
export const TOOLTIP_POSITIONS = Object.freeze({
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  'top-start': 'bottom-full left-0 mb-2',
  'top-end': 'bottom-full right-0 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  'bottom-start': 'top-full left-0 mt-2',
  'bottom-end': 'top-full right-0 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  'left-start': 'right-full top-0 mr-2',
  'left-end': 'right-full bottom-0 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  'right-start': 'left-full top-0 ml-2',
  'right-end': 'left-full bottom-0 ml-2',
});

/* ---------------------------------- */
/* Arrow Sizes                        */
/* ---------------------------------- */

/**
 * Arrow size presets for Tooltips.
 * Defines the width and height of the tooltip arrow.
 */
export const TOOLTIP_ARROW_SIZES = Object.freeze({
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-3.5 w-3.5',
});

/**
 * Arrow position offsets for each placement.
 */
export const TOOLTIP_ARROW_OFFSETS = Object.freeze({
  top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45',
  'top-start': 'bottom-0 left-3 translate-y-1/2 rotate-45',
  'top-end': 'bottom-0 right-3 translate-y-1/2 rotate-45',
  bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45',
  'bottom-start': 'top-0 left-3 -translate-y-1/2 rotate-45',
  'bottom-end': 'top-0 right-3 -translate-y-1/2 rotate-45',
  left: 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45',
  'left-start': 'right-0 top-3 translate-x-1/2 rotate-45',
  'left-end': 'right-0 bottom-3 translate-x-1/2 rotate-45',
  right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45',
  'right-start': 'left-0 top-3 -translate-x-1/2 rotate-45',
  'right-end': 'left-0 bottom-3 -translate-x-1/2 rotate-45',
});

/* ---------------------------------- */
/* Transitions                        */
/* ---------------------------------- */

/**
 * Transition presets for Tooltip animations.
 */
export const TOOLTIP_TRANSITIONS = Object.freeze({
  fast: 'transition-all duration-150 ease-in-out',
  normal: 'transition-all duration-200 ease-in-out',
  slow: 'transition-all duration-300 ease-in-out',
  fade: 'transition-opacity duration-200 ease-in-out',
  transform: 'transition-transform duration-200 ease-in-out',
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Tooltip dimensions.
 */
export const TOOLTIP_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'md',
  shadow: 'lg',
  position: 'top',
  arrow: true,
  arrowSize: 'md',
  delay: 300,
  closeDelay: 100,
  disabled: false,
  animation: 'fade',
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for a tooltip.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getTooltipVariant(variant) {
  return TOOLTIP_VARIANTS[variant] || TOOLTIP_VARIANTS[TOOLTIP_DEFAULTS.variant];
}

/**
 * Gets the size configuration for a tooltip.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getTooltipSize(size) {
  return TOOLTIP_SIZES[size] || TOOLTIP_SIZES[TOOLTIP_DEFAULTS.size];
}

/**
 * Gets the radius class for a tooltip.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getTooltipRadius(radius) {
  return TOOLTIP_RADIUS[radius] || TOOLTIP_RADIUS[TOOLTIP_DEFAULTS.radius];
}

/**
 * Gets the shadow class for a tooltip.
 * @param {string} shadow - The shadow key.
 * @returns {string} The shadow class.
 */
export function getTooltipShadow(shadow) {
  return TOOLTIP_SHADOWS[shadow] || TOOLTIP_SHADOWS[TOOLTIP_DEFAULTS.shadow];
}

/**
 * Gets the position class for a tooltip.
 * @param {string} position - The position key.
 * @returns {string} The position class.
 */
export function getTooltipPosition(position) {
  return TOOLTIP_POSITIONS[position] || TOOLTIP_POSITIONS[TOOLTIP_DEFAULTS.position];
}

/**
 * Gets the arrow size class for a tooltip.
 * @param {string} arrowSize - The arrow size key.
 * @returns {string} The arrow size class.
 */
export function getTooltipArrowSize(arrowSize) {
  return TOOLTIP_ARROW_SIZES[arrowSize] || TOOLTIP_ARROW_SIZES[TOOLTIP_DEFAULTS.arrowSize];
}

/**
 * Gets the arrow offset class for a tooltip position.
 * @param {string} position - The position key.
 * @returns {string} The arrow offset class.
 */
export function getTooltipArrowOffset(position) {
  return TOOLTIP_ARROW_OFFSETS[position] || TOOLTIP_ARROW_OFFSETS[TOOLTIP_DEFAULTS.position];
}