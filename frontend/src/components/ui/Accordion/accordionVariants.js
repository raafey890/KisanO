/**
 * KisanO Design System — Accordion Package
 * Accordion Design Tokens
 *
 * Complete design token system for the KisanO Accordion component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent accordion styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `ACCORDION_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Accordion/accordionVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Accordion.
 * Each variant defines background, text, border, and interaction states.
 */
export const ACCORDION_VARIANTS = Object.freeze({
  default: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border border-gray-200',
    header: 'hover:bg-gray-50',
    active: 'bg-blue-50 border-blue-200',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
  outlined: {
    background: 'bg-transparent',
    text: 'text-gray-900',
    border: 'border-2 border-gray-300',
    header: 'hover:bg-gray-50',
    active: 'bg-blue-50 border-blue-300',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
  filled: {
    background: 'bg-gray-50',
    text: 'text-gray-900',
    border: 'border border-gray-200',
    header: 'hover:bg-gray-100',
    active: 'bg-blue-50 border-blue-200',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
  ghost: {
    background: 'bg-transparent',
    text: 'text-gray-700',
    border: 'border border-transparent',
    header: 'hover:bg-gray-50',
    active: 'bg-blue-50 border-blue-100',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
  minimal: {
    background: 'bg-transparent',
    text: 'text-gray-900',
    border: 'border-b border-gray-200',
    header: 'hover:text-blue-600',
    active: 'text-blue-600 border-blue-600',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
    focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Accordions.
 * Each size defines padding, text size, icon size, and gap.
 */
export const ACCORDION_SIZES = Object.freeze({
  xs: {
    padding: 'px-3 py-2',
    text: 'text-xs',
    icon: 'h-3 w-3',
    gap: 'gap-1.5',
    minHeight: 'min-h-[32px]',
  },
  sm: {
    padding: 'px-4 py-2.5',
    text: 'text-sm',
    icon: 'h-4 w-4',
    gap: 'gap-2',
    minHeight: 'min-h-[38px]',
  },
  md: {
    padding: 'px-5 py-3',
    text: 'text-sm',
    icon: 'h-4 w-4',
    gap: 'gap-2.5',
    minHeight: 'min-h-[44px]',
  },
  lg: {
    padding: 'px-6 py-3.5',
    text: 'text-base',
    icon: 'h-5 w-5',
    gap: 'gap-3',
    minHeight: 'min-h-[50px]',
  },
  xl: {
    padding: 'px-7 py-4',
    text: 'text-base',
    icon: 'h-5 w-5',
    gap: 'gap-3.5',
    minHeight: 'min-h-[56px]',
  },
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for Accordions.
 */
export const ACCORDION_RADIUS = Object.freeze({
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
 * Shadow presets for Accordions.
 */
export const ACCORDION_SHADOWS = Object.freeze({
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
});

/* ---------------------------------- */
/* Animations                         */
/* ---------------------------------- */

/**
 * Animation presets for Accordion content entrance/exit.
 */
export const ACCORDION_ANIMATIONS = Object.freeze({
  slide: {
    initial: { height: 0, opacity: 0 },
    animate: { height: 'auto', opacity: 1 },
    exit: { height: 0, opacity: 0 },
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  scale: {
    initial: { height: 0, opacity: 0, scale: 0.95 },
    animate: { height: 'auto', opacity: 1, scale: 1 },
    exit: { height: 0, opacity: 0, scale: 0.95 },
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
    transition: { duration: 0 },
  },
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Accordion dimensions.
 */
export const ACCORDION_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'md',
  shadow: 'none',
  animation: 'slide',
  multiple: false,
  disabled: false,
  loading: false,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for an accordion.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getAccordionVariant(variant) {
  return ACCORDION_VARIANTS[variant] || ACCORDION_VARIANTS[ACCORDION_DEFAULTS.variant];
}

/**
 * Gets the size configuration for an accordion.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getAccordionSize(size) {
  return ACCORDION_SIZES[size] || ACCORDION_SIZES[ACCORDION_DEFAULTS.size];
}

/**
 * Gets the radius class for an accordion.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getAccordionRadius(radius) {
  return ACCORDION_RADIUS[radius] || ACCORDION_RADIUS[ACCORDION_DEFAULTS.radius];
}

/**
 * Gets the shadow class for an accordion.
 * @param {string} shadow - The shadow key.
 * @returns {string} The shadow class.
 */
export function getAccordionShadow(shadow) {
  return ACCORDION_SHADOWS[shadow] || ACCORDION_SHADOWS[ACCORDION_DEFAULTS.shadow];
}

/**
 * Gets the animation configuration for an accordion.
 * @param {string} animation - The animation key.
 * @returns {Object} The animation configuration.
 */
export function getAccordionAnimation(animation) {
  return ACCORDION_ANIMATIONS[animation] || ACCORDION_ANIMATIONS[ACCORDION_DEFAULTS.animation];
}