/**
 * KisanO Design System — Drawer Package
 * Drawer Design Tokens
 *
 * Complete design token system for the KisanO Drawer component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent drawer styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `DRAWER_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Drawer/drawerVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Drawer.
 * Each variant defines background, text, border, overlay, header, and footer classes.
 */
export const DRAWER_VARIANTS = Object.freeze({
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
  glass: {
    background: 'bg-white/80 backdrop-blur-md',
    text: 'text-gray-900',
    border: 'border border-white/20',
    overlay: 'bg-black/40',
    header: 'text-gray-900 border-b border-white/20',
    footer: 'border-t border-white/20 bg-white/50',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Drawers.
 * Each size defines width/height, padding, gap, title, and description classes.
 */
export const DRAWER_SIZES = Object.freeze({
  xs: {
    size: 'w-64',
    padding: 'p-4',
    gap: 'gap-2',
    title: 'text-base',
    description: 'text-sm',
  },
  sm: {
    size: 'w-80',
    padding: 'p-5',
    gap: 'gap-3',
    title: 'text-lg',
    description: 'text-sm',
  },
  md: {
    size: 'w-96',
    padding: 'p-6',
    gap: 'gap-4',
    title: 'text-xl',
    description: 'text-base',
  },
  lg: {
    size: 'w-[448px]',
    padding: 'p-7',
    gap: 'gap-5',
    title: 'text-2xl',
    description: 'text-base',
  },
  xl: {
    size: 'w-[512px]',
    padding: 'p-8',
    gap: 'gap-6',
    title: 'text-3xl',
    description: 'text-lg',
  },
  full: {
    size: 'w-screen',
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
 * Border radius presets for Drawers.
 */
export const DRAWER_RADIUS = Object.freeze({
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
 * Shadow presets for Drawers.
 */
export const DRAWER_SHADOWS = Object.freeze({
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
 * Position presets for Drawers.
 * Each position defines placement and sizing behavior.
 */
export const DRAWER_POSITIONS = Object.freeze({
  left: 'left-0 top-0 h-full',
  right: 'right-0 top-0 h-full',
  top: 'top-0 left-0 w-full',
  bottom: 'bottom-0 left-0 w-full',
});

/**
 * Position-specific animation transforms.
 */
export const DRAWER_POSITION_TRANSFORMS = Object.freeze({
  left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
  right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
  top: { initial: { y: '-100%' }, animate: { y: 0 }, exit: { y: '-100%' } },
  bottom: { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } },
});

/* ---------------------------------- */
/* Animations                         */
/* ---------------------------------- */

/**
 * Animation presets for Drawer entrance/exit.
 */
export const DRAWER_ANIMATIONS = Object.freeze({
  slide: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
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
 * Overlay presets for Drawers.
 */
export const DRAWER_OVERLAYS = Object.freeze({
  default: 'bg-black/50',
  blur: 'bg-black/40 backdrop-blur-sm',
  dark: 'bg-black/80',
  transparent: 'bg-transparent',
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Drawer dimensions.
 */
export const DRAWER_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'lg',
  shadow: 'xl',
  position: 'right',
  animation: 'slide',
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
 * Gets the variant configuration for a drawer.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getDrawerVariant(variant) {
  return DRAWER_VARIANTS[variant] || DRAWER_VARIANTS[DRAWER_DEFAULTS.variant];
}

/**
 * Gets the size configuration for a drawer.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getDrawerSize(size) {
  return DRAWER_SIZES[size] || DRAWER_SIZES[DRAWER_DEFAULTS.size];
}

/**
 * Gets the radius class for a drawer.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getDrawerRadius(radius) {
  return DRAWER_RADIUS[radius] || DRAWER_RADIUS[DRAWER_DEFAULTS.radius];
}

/**
 * Gets the shadow class for a drawer.
 * @param {string} shadow - The shadow key.
 * @returns {string} The shadow class.
 */
export function getDrawerShadow(shadow) {
  return DRAWER_SHADOWS[shadow] || DRAWER_SHADOWS[DRAWER_DEFAULTS.shadow];
}

/**
 * Gets the position class for a drawer.
 * @param {string} position - The position key.
 * @returns {string} The position class.
 */
export function getDrawerPosition(position) {
  return DRAWER_POSITIONS[position] || DRAWER_POSITIONS[DRAWER_DEFAULTS.position];
}

/**
 * Gets the position transform for a drawer.
 * @param {string} position - The position key.
 * @returns {Object} The position transform object.
 */
export function getDrawerPositionTransform(position) {
  return DRAWER_POSITION_TRANSFORMS[position] || DRAWER_POSITION_TRANSFORMS[DRAWER_DEFAULTS.position];
}

/**
 * Gets the animation configuration for a drawer.
 * @param {string} animation - The animation key.
 * @returns {Object} The animation configuration.
 */
export function getDrawerAnimation(animation) {
  return DRAWER_ANIMATIONS[animation] || DRAWER_ANIMATIONS[DRAWER_DEFAULTS.animation];
}

/**
 * Gets the overlay class for a drawer.
 * @param {string} overlay - The overlay key.
 * @returns {string} The overlay class.
 */
export function getDrawerOverlay(overlay) {
  return DRAWER_OVERLAYS[overlay] || DRAWER_OVERLAYS[DRAWER_DEFAULTS.overlay];
}