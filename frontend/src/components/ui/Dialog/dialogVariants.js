/**
 * KisanO Design System — Dialog Package
 * Dialog Design Tokens
 *
 * Complete design token system for the KisanO Dialog component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent dialog styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `DIALOG_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Dialog/dialogVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Dialog.
 * Each variant defines background, text, border, overlay, header, and footer classes.
 */
export const DIALOG_VARIANTS = Object.freeze({
  default: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border border-gray-200',
    overlay: 'bg-black/50',
    header: 'text-gray-900 border-b border-gray-200',
    footer: 'border-t border-gray-200 bg-gray-50/50',
  },
  primary: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border border-blue-200',
    overlay: 'bg-black/50',
    header: 'text-blue-700 border-b border-blue-100',
    footer: 'border-t border-blue-100 bg-blue-50/50',
  },
  secondary: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border border-gray-300',
    overlay: 'bg-black/50',
    header: 'text-gray-700 border-b border-gray-200',
    footer: 'border-t border-gray-200 bg-gray-50/50',
  },
  success: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border border-green-200',
    overlay: 'bg-black/50',
    header: 'text-green-700 border-b border-green-100',
    footer: 'border-t border-green-100 bg-green-50/50',
  },
  warning: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border border-yellow-200',
    overlay: 'bg-black/50',
    header: 'text-yellow-700 border-b border-yellow-100',
    footer: 'border-t border-yellow-100 bg-yellow-50/50',
  },
  error: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border border-red-200',
    overlay: 'bg-black/50',
    header: 'text-red-700 border-b border-red-100',
    footer: 'border-t border-red-100 bg-red-50/50',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Dialogs.
 * Each size defines width, padding, gap, title, and description classes.
 */
export const DIALOG_SIZES = Object.freeze({
  xs: {
    width: 'max-w-xs',
    padding: 'p-4',
    gap: 'gap-2',
    title: 'text-base',
    description: 'text-sm',
  },
  sm: {
    width: 'max-w-sm',
    padding: 'p-5',
    gap: 'gap-3',
    title: 'text-lg',
    description: 'text-sm',
  },
  md: {
    width: 'max-w-md',
    padding: 'p-6',
    gap: 'gap-4',
    title: 'text-xl',
    description: 'text-base',
  },
  lg: {
    width: 'max-w-lg',
    padding: 'p-7',
    gap: 'gap-5',
    title: 'text-2xl',
    description: 'text-base',
  },
  xl: {
    width: 'max-w-xl',
    padding: 'p-8',
    gap: 'gap-6',
    title: 'text-3xl',
    description: 'text-lg',
  },
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for Dialogs.
 */
export const DIALOG_RADIUS = Object.freeze({
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
 * Shadow presets for Dialogs.
 */
export const DIALOG_SHADOWS = Object.freeze({
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
 * Animation presets for Dialog entrance/exit.
 */
export const DIALOG_ANIMATIONS = Object.freeze({
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  slide: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
  slideScale: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.95 },
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
/* Overlays                           */
/* ---------------------------------- */

/**
 * Overlay presets for Dialogs.
 */
export const DIALOG_OVERLAYS = Object.freeze({
  default: 'bg-black/50',
  blur: 'bg-black/40 backdrop-blur-sm',
  dark: 'bg-black/80',
  transparent: 'bg-transparent',
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Dialog dimensions.
 */
export const DIALOG_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'lg',
  shadow: 'xl',
  animation: 'scale',
  overlay: 'default',
  closeOnEscape: true,
  closeOnOutsideClick: true,
  showCloseButton: true,
  loading: false,
  disabled: false,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for a dialog.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getDialogVariant(variant) {
  return DIALOG_VARIANTS[variant] || DIALOG_VARIANTS[DIALOG_DEFAULTS.variant];
}

/**
 * Gets the size configuration for a dialog.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getDialogSize(size) {
  return DIALOG_SIZES[size] || DIALOG_SIZES[DIALOG_DEFAULTS.size];
}

/**
 * Gets the radius class for a dialog.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getDialogRadius(radius) {
  return DIALOG_RADIUS[radius] || DIALOG_RADIUS[DIALOG_DEFAULTS.radius];
}

/**
 * Gets the shadow class for a dialog.
 * @param {string} shadow - The shadow key.
 * @returns {string} The shadow class.
 */
export function getDialogShadow(shadow) {
  return DIALOG_SHADOWS[shadow] || DIALOG_SHADOWS[DIALOG_DEFAULTS.shadow];
}

/**
 * Gets the animation configuration for a dialog.
 * @param {string} animation - The animation key.
 * @returns {Object} The animation configuration.
 */
export function getDialogAnimation(animation) {
  return DIALOG_ANIMATIONS[animation] || DIALOG_ANIMATIONS[DIALOG_DEFAULTS.animation];
}

/**
 * Gets the overlay class for a dialog.
 * @param {string} overlay - The overlay key.
 * @returns {string} The overlay class.
 */
export function getDialogOverlay(overlay) {
  return DIALOG_OVERLAYS[overlay] || DIALOG_OVERLAYS[DIALOG_DEFAULTS.overlay];
}