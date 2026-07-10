/**
 * KisanO Design System — Modal Package
 * Modal Design Tokens
 *
 * Complete design token system for the KisanO Modal component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent modal styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `MODAL_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Modal/modalVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Modal.
 * Each variant defines background, border, shadow, and text classes.
 */
export const MODAL_VARIANTS = Object.freeze({
  default: {
    background: 'bg-white',
    border: 'border border-gray-200',
    shadow: 'shadow-lg',
    text: 'text-gray-900',
  },
  elevated: {
    background: 'bg-white',
    border: 'border border-gray-200',
    shadow: 'shadow-2xl',
    text: 'text-gray-900',
  },
  glass: {
    background: 'bg-white/80 backdrop-blur-md',
    border: 'border border-white/20',
    shadow: 'shadow-2xl',
    text: 'text-gray-900',
  },
  outlined: {
    background: 'bg-white',
    border: 'border-2 border-gray-300',
    shadow: 'shadow-md',
    text: 'text-gray-900',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for modals.
 * Keys correspond to standard sizing scales (xs → full).
 * Values define max-width and width classes.
 */
export const MODAL_SIZES = Object.freeze({
  xs: 'max-w-xs w-full',
  sm: 'max-w-sm w-full',
  md: 'max-w-md w-full',
  lg: 'max-w-lg w-full',
  xl: 'max-w-xl w-full',
  full: 'max-w-full w-full h-full',
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for modals.
 */
export const MODAL_RADIUS = Object.freeze({
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
 * Shadow presets for modals.
 */
export const MODAL_SHADOWS = Object.freeze({
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
});

/* ---------------------------------- */
/* Padding                            */
/* ---------------------------------- */

/**
 * Padding presets for modal sections (header, body, footer).
 */
export const MODAL_PADDING = Object.freeze({
  none: 'p-0',
  xs: 'p-3',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
});

/* ---------------------------------- */
/* Spacing                            */
/* ---------------------------------- */

/**
 * Gap/spacing presets for modal layouts.
 */
export const MODAL_SPACING = Object.freeze({
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
});

/* ---------------------------------- */
/* Typography                         */
/* ---------------------------------- */

/**
 * Typography presets for modal text elements.
 */
export const MODAL_TYPOGRAPHY = Object.freeze({
  title: 'font-semibold leading-tight',
  subtitle: 'font-normal leading-relaxed',
  body: 'font-normal leading-relaxed',
  caption: 'font-normal text-sm leading-relaxed',
});

/* ---------------------------------- */
/* Overlay Variants                   */
/* ---------------------------------- */

/**
 * Visual variants for the modal overlay.
 */
export const MODAL_OVERLAY_VARIANTS = Object.freeze({
  default: 'bg-black/50',
  dark: 'bg-black/80',
  transparent: 'bg-transparent',
  blur: 'bg-black/40 backdrop-blur-sm',
});

/* ---------------------------------- */
/* Transitions                        */
/* ---------------------------------- */

/**
 * Transition presets for modal animations.
 */
export const MODAL_TRANSITIONS = Object.freeze({
  fast: 'transition-all duration-150 ease-in-out',
  normal: 'transition-all duration-300 ease-in-out',
  slow: 'transition-all duration-400 ease-in-out',
  colorsOnly: 'transition-colors duration-200 ease-in-out',
  transformOnly: 'transition-transform duration-200 ease-in-out',
});

/* ---------------------------------- */
/* Close Button Sizes                 */
/* ---------------------------------- */

/**
 * Size presets for the modal close button.
 */
export const MODAL_CLOSE_BUTTON_SIZES = Object.freeze({
  xs: 'h-6 w-6 text-xs',
  sm: 'h-7 w-7 text-sm',
  md: 'h-8 w-8 text-base',
  lg: 'h-9 w-9 text-lg',
  xl: 'h-10 w-10 text-xl',
});

/**
 * Icon sizes for the close button.
 */
export const MODAL_CLOSE_BUTTON_ICON_SIZES = Object.freeze({
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
});

/**
 * Close button variant classes.
 */
export const MODAL_CLOSE_BUTTON_VARIANTS = Object.freeze({
  ghost: 'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
  filled: 'text-white bg-gray-500 hover:bg-gray-600',
  outlined: 'text-gray-500 border border-gray-300 hover:bg-gray-50',
  subtle: 'text-gray-400 hover:text-gray-600 hover:bg-gray-50',
});

/* ---------------------------------- */
/* Modal Skeleton Heights             */
/* ---------------------------------- */

/**
 * Height presets for loader skeletons.
 */
export const MODAL_SKELETON_HEIGHTS = Object.freeze({
  text: {
    xs: 'h-3',
    sm: 'h-3.5',
    md: 'h-4',
    lg: 'h-5',
    xl: 'h-6',
  },
  heading: {
    xs: 'h-4',
    sm: 'h-5',
    md: 'h-6',
    lg: 'h-7',
    xl: 'h-8',
  },
  image: {
    xs: 'h-20',
    sm: 'h-28',
    md: 'h-36',
    lg: 'h-44',
    xl: 'h-52',
  },
  avatar: {
    xs: 'h-8 w-8',
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-14 w-14',
    xl: 'h-16 w-16',
  },
});

/**
 * Width presets for text skeleton rows.
 */
export const MODAL_SKELETON_TEXT_WIDTHS = Object.freeze([
  'w-3/4',
  'w-full',
  'w-5/6',
  'w-2/3',
  'w-1/2',
]);

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all modal dimensions.
 * These should be used by the Modal components as fallbacks.
 */
export const MODAL_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'xl',
  shadow: 'lg',
  padding: 'md',
  spacing: 'md',
  centered: true,
  fullscreen: false,
  scrollable: false,
  closeOnOverlayClick: true,
  closeOnEscape: true,
  disabled: false,
  loading: false,
  animation: true,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the size classes for a modal based on the size key.
 * @param {string} size - The size key (xs, sm, md, lg, xl, full).
 * @returns {string} The Tailwind size classes.
 */


/**
 * Gets the variant classes for a modal based on the variant key.
 * @param {string} variant - The variant key (default, elevated, glass, outlined).
 * @returns {string} The Tailwind variant classes.
 */


/**
 * Gets the radius classes for a modal based on the radius key.
 * @param {string} radius - The radius key (none, sm, md, lg, xl, 2xl, full).
 * @returns {string} The Tailwind radius classes.
 */


/**
 * Gets the shadow classes for a modal based on the shadow key.
 * @param {string} shadow - The shadow key (none, sm, md, lg, xl, 2xl).
 * @returns {string} The Tailwind shadow classes.
 */


/**
 * Gets the overlay variant classes based on the overlay key.
 * @param {string} variant - The overlay variant (default, dark, transparent, blur).
 * @returns {string} The Tailwind overlay classes.
 */
