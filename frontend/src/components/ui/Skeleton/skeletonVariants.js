/**
 * KisanO Design System — Skeleton Package
 * Skeleton Design Tokens
 *
 * Complete design token system for the KisanO Skeleton component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent skeleton loading styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `SKELETON_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Skeleton/skeletonVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Skeleton.
 * Each variant defines background and interaction states.
 */
export const SKELETON_VARIANTS = Object.freeze({
  default: {
    background: 'bg-gray-200 dark:bg-gray-700',
    pulse: 'dark:bg-gray-800',
    shimmer: 'dark:bg-gray-800',
  },
  light: {
    background: 'bg-gray-100 dark:bg-gray-600',
    pulse: 'dark:bg-gray-700',
    shimmer: 'dark:bg-gray-700',
  },
  dark: {
    background: 'bg-gray-700 dark:bg-gray-800',
    pulse: 'dark:bg-gray-900',
    shimmer: 'dark:bg-gray-900',
  },
  primary: {
    background: 'bg-blue-100 dark:bg-blue-900',
    pulse: 'dark:bg-blue-800',
    shimmer: 'dark:bg-blue-800',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Skeleton elements.
 * Each size defines height, width, and text size.
 */
export const SKELETON_SIZES = Object.freeze({
  xs: {
    height: 'h-3',
    width: 'w-8',
    text: 'text-xs',
    gap: 'gap-1',
    padding: 'p-1',
    borderRadius: 'rounded-sm',
  },
  sm: {
    height: 'h-3.5',
    width: 'w-10',
    text: 'text-sm',
    gap: 'gap-1.5',
    padding: 'p-1.5',
    borderRadius: 'rounded-sm',
  },
  md: {
    height: 'h-4',
    width: 'w-12',
    text: 'text-sm',
    gap: 'gap-2',
    padding: 'p-2',
    borderRadius: 'rounded-md',
  },
  lg: {
    height: 'h-5',
    width: 'w-14',
    text: 'text-base',
    gap: 'gap-2.5',
    padding: 'p-2.5',
    borderRadius: 'rounded-md',
  },
  xl: {
    height: 'h-6',
    width: 'w-16',
    text: 'text-base',
    gap: 'gap-3',
    padding: 'p-3',
    borderRadius: 'rounded-lg',
  },
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for Skeleton elements.
 */
export const SKELETON_RADIUS = Object.freeze({
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
});

/* ---------------------------------- */
/* Animations                         */
/* ---------------------------------- */

/**
 * Animation presets for Skeleton elements.
 * Defines animation styles for loading states.
 */
export const SKELETON_ANIMATIONS = Object.freeze({
  pulse: {
    animation: 'animate-pulse',
    shimmer: '',
    transition: 'transition-all duration-300 ease-in-out',
  },
  shimmer: {
    animation: '',
    shimmer: 'animate-shimmer',
    transition: 'transition-all duration-300 ease-in-out',
  },
  wave: {
    animation: '',
    shimmer: 'animate-wave',
    transition: 'transition-all duration-500 ease-in-out',
  },
  none: {
    animation: '',
    shimmer: '',
    transition: 'transition-none',
  },
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Skeleton dimensions.
 */
export const SKELETON_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'md',
  animation: 'pulse',
  disabled: false,
  loading: true,
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for a skeleton.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getSkeletonVariant(variant) {
  return SKELETON_VARIANTS[variant] || SKELETON_VARIANTS[SKELETON_DEFAULTS.variant];
}

/**
 * Gets the size configuration for a skeleton.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getSkeletonSize(size) {
  return SKELETON_SIZES[size] || SKELETON_SIZES[SKELETON_DEFAULTS.size];
}

/**
 * Gets the radius class for a skeleton.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getSkeletonRadius(radius) {
  return SKELETON_RADIUS[radius] || SKELETON_RADIUS[SKELETON_DEFAULTS.radius];
}

/**
 * Gets the animation configuration for a skeleton.
 * @param {string} animation - The animation key.
 * @returns {Object} The animation configuration.
 */
export function getSkeletonAnimation(animation) {
  return SKELETON_ANIMATIONS[animation] || SKELETON_ANIMATIONS[SKELETON_DEFAULTS.animation];
}