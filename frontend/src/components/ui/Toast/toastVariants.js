/**
 * KisanO Design System — Toast Package
 * Toast Design Tokens
 *
 * Complete design token system for the KisanO Toast component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent toast styling across the KisanO application.
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Toast/toastVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Toast.
 * Each variant defines background, border, text, and icon colors.
 */
export const TOAST_VARIANTS = Object.freeze({
  success: {
    background: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: 'text-green-500',
    progress: 'bg-green-500',
  },
  error: {
    background: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-500',
    progress: 'bg-red-500',
  },
  warning: {
    background: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: 'text-yellow-500',
    progress: 'bg-yellow-500',
  },
  info: {
    background: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-500',
    progress: 'bg-blue-500',
  },
  loading: {
    background: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-800',
    icon: 'text-gray-500',
    progress: 'bg-gray-500',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Toasts.
 */
export const TOAST_SIZES = Object.freeze({
  xs: {
    padding: 'p-2',
    text: 'text-xs',
    icon: 'h-4 w-4',
    gap: 'gap-1.5',
  },
  sm: {
    padding: 'p-3',
    text: 'text-sm',
    icon: 'h-5 w-5',
    gap: 'gap-2',
  },
  md: {
    padding: 'p-4',
    text: 'text-sm',
    icon: 'h-5 w-5',
    gap: 'gap-2.5',
  },
  lg: {
    padding: 'p-5',
    text: 'text-base',
    icon: 'h-6 w-6',
    gap: 'gap-3',
  },
  xl: {
    padding: 'p-6',
    text: 'text-base',
    icon: 'h-6 w-6',
    gap: 'gap-3.5',
  },
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for Toasts.
 */
export const TOAST_RADIUS = Object.freeze({
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
 * Shadow presets for Toasts.
 */
export const TOAST_SHADOWS = Object.freeze({
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
 * Position presets for Toast containers.
 */
export const TOAST_POSITIONS = Object.freeze({
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
});

/* ---------------------------------- */
/* Transitions                        */
/* ---------------------------------- */

/**
 * Transition presets for Toast animations.
 */
export const TOAST_TRANSITIONS = Object.freeze({
  fast: 'transition-all duration-150 ease-in-out',
  normal: 'transition-all duration-300 ease-in-out',
  slow: 'transition-all duration-500 ease-in-out',
  slide: 'transition-transform duration-300 ease-in-out',
  fade: 'transition-opacity duration-300 ease-in-out',
});

/* ---------------------------------- */
/* Progress Bar                       */
/* ---------------------------------- */

/**
 * Height presets for the progress bar.
 */
export const TOAST_PROGRESS_HEIGHTS = Object.freeze({
  xs: 'h-0.5',
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
  xl: 'h-2.5',
});

/* ---------------------------------- */
/* Close Button Sizes                 */
/* ---------------------------------- */

/**
 * Size presets for the close button.
 */
export const TOAST_CLOSE_BUTTON_SIZES = Object.freeze({
  xs: 'h-5 w-5 text-xs',
  sm: 'h-6 w-6 text-sm',
  md: 'h-7 w-7 text-base',
  lg: 'h-8 w-8 text-lg',
  xl: 'h-9 w-9 text-xl',
});

/**
 * Icon sizes for the close button.
 */
export const TOAST_CLOSE_BUTTON_ICON_SIZES = Object.freeze({
  xs: 'h-2.5 w-2.5',
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
  xl: 'h-4.5 w-4.5',
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Toast dimensions.
 */
export const TOAST_DEFAULTS = Object.freeze({
  variant: 'info',
  size: 'md',
  radius: 'lg',
  shadow: 'lg',
  position: 'top-right',
  duration: 5000,
  progress: true,
  closeButton: true,
  pauseOnHover: true,
  pauseOnFocus: true,
  animation: 'slide',
  disabled: false,
  loading: false,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets variant classes for a toast.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getToastVariant(variant) {
  return TOAST_VARIANTS[variant] || TOAST_VARIANTS[TOAST_DEFAULTS.variant];
}

/**
 * Gets position classes for a toast container.
 * @param {string} position - The position key.
 * @returns {string} The position classes.
 */
export function getToastPosition(position) {
  return TOAST_POSITIONS[position] || TOAST_POSITIONS[TOAST_DEFAULTS.position];
}

/**
 * Gets size configuration for a toast.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getToastSize(size) {
  return TOAST_SIZES[size] || TOAST_SIZES[TOAST_DEFAULTS.size];
}

/**
 * Gets radius class for a toast.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getToastRadius(radius) {
  return TOAST_RADIUS[radius] || TOAST_RADIUS[TOAST_DEFAULTS.radius];
}

/**
 * Gets shadow class for a toast.
 * @param {string} shadow - The shadow key.
 * @returns {string} The shadow class.
 */
export function getToastShadow(shadow) {
  return TOAST_SHADOWS[shadow] || TOAST_SHADOWS[TOAST_DEFAULTS.shadow];
}

/**
 * Gets progress bar height class.
 * @param {string} size - The size key.
 * @returns {string} The height class.
 */
export function getToastProgressHeight(size) {
  return TOAST_PROGRESS_HEIGHTS[size] || TOAST_PROGRESS_HEIGHTS[TOAST_DEFAULTS.size];
}