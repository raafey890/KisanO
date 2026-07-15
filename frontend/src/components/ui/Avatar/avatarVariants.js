/**
 * KisanO Design System — Avatar Package
 * Avatar Design Tokens
 *
 * Complete design token system for the KisanO Avatar component family.
 * This file defines all visual states, sizes, variants, and design tokens
 * required for consistent avatar styling across the KisanO application.
 *
 * Architecture principles:
 * - All exports are plain objects with string values or nested objects
 * - Objects are intended to be merged with clsx/tailwind-merge for class composition
 * - Each export covers a single dimension (size, variant, state, etc.)
 * - The `AVATAR_DEFAULTS` object provides sensible defaults for all dimensions
 *
 * @version 1.0.0
 * @author KisanO Team
 * @see {@link https://kisan-o.design} for full documentation.
 * @module components/ui/Avatar/avatarVariants
 */

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

/**
 * Core visual variants of the Avatar.
 * Each variant defines background, text, border, and interaction states.
 */
export const AVATAR_VARIANTS = Object.freeze({
  default: {
    background: 'bg-gray-200',
    text: 'text-gray-600',
    border: 'border border-gray-300',
    ring: 'ring-2 ring-white',
    hover: 'hover:ring-gray-300',
  },
  primary: {
    background: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border border-blue-200',
    ring: 'ring-2 ring-white',
    hover: 'hover:ring-blue-200',
  },
  secondary: {
    background: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border border-gray-200',
    ring: 'ring-2 ring-white',
    hover: 'hover:ring-gray-200',
  },
  success: {
    background: 'bg-green-100',
    text: 'text-green-700',
    border: 'border border-green-200',
    ring: 'ring-2 ring-white',
    hover: 'hover:ring-green-200',
  },
  warning: {
    background: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border border-yellow-200',
    ring: 'ring-2 ring-white',
    hover: 'hover:ring-yellow-200',
  },
  error: {
    background: 'bg-red-100',
    text: 'text-red-700',
    border: 'border border-red-200',
    ring: 'ring-2 ring-white',
    hover: 'hover:ring-red-200',
  },
  info: {
    background: 'bg-cyan-100',
    text: 'text-cyan-700',
    border: 'border border-cyan-200',
    ring: 'ring-2 ring-white',
    hover: 'hover:ring-cyan-200',
  },
  gradient: {
    background: 'bg-gradient-to-br from-blue-500 to-purple-600',
    text: 'text-white',
    border: 'border border-transparent',
    ring: 'ring-2 ring-white',
    hover: 'hover:ring-gray-300',
  },
});

/* ---------------------------------- */
/* Sizes                              */
/* ---------------------------------- */

/**
 * Size presets for Avatars.
 * Each size defines dimensions, text size, icon size, and status size.
 */
export const AVATAR_SIZES = Object.freeze({
  xs: {
    size: 'h-6 w-6',
    text: 'text-[10px]',
    icon: 'h-3 w-3',
    status: 'h-1.5 w-1.5',
    gap: 'gap-0.5',
    ringWidth: 'ring-1',
  },
  sm: {
    size: 'h-8 w-8',
    text: 'text-xs',
    icon: 'h-4 w-4',
    status: 'h-2 w-2',
    gap: 'gap-1',
    ringWidth: 'ring-1.5',
  },
  md: {
    size: 'h-10 w-10',
    text: 'text-sm',
    icon: 'h-5 w-5',
    status: 'h-2.5 w-2.5',
    gap: 'gap-1.5',
    ringWidth: 'ring-2',
  },
  lg: {
    size: 'h-12 w-12',
    text: 'text-base',
    icon: 'h-6 w-6',
    status: 'h-3 w-3',
    gap: 'gap-2',
    ringWidth: 'ring-2',
  },
  xl: {
    size: 'h-14 w-14',
    text: 'text-lg',
    icon: 'h-7 w-7',
    status: 'h-3.5 w-3.5',
    gap: 'gap-2.5',
    ringWidth: 'ring-2',
  },
  '2xl': {
    size: 'h-16 w-16',
    text: 'text-xl',
    icon: 'h-8 w-8',
    status: 'h-4 w-4',
    gap: 'gap-3',
    ringWidth: 'ring-2.5',
  },
});

/* ---------------------------------- */
/* Radius                             */
/* ---------------------------------- */

/**
 * Border radius presets for Avatars.
 */
export const AVATAR_RADIUS = Object.freeze({
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
});

/* ---------------------------------- */
/* Status                             */
/* ---------------------------------- */

/**
 * Status presets for Avatars.
 * Defines colors for online/offline/away/busy status indicators.
 */
export const AVATAR_STATUS = Object.freeze({
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
});

/* ---------------------------------- */
/* Group                              */
/* ---------------------------------- */

/**
 * Group presets for Avatar groups.
 * Defines spacing and overlap styles.
 */
export const AVATAR_GROUP = Object.freeze({
  default: {
    spacing: '-space-x-2',
    border: 'ring-2 ring-white',
    hover: 'hover:z-10',
  },
  compact: {
    spacing: '-space-x-1.5',
    border: 'ring-2 ring-white',
    hover: 'hover:z-10',
  },
  loose: {
    spacing: '-space-x-4',
    border: 'ring-2 ring-white',
    hover: 'hover:z-10',
  },
});

/* ---------------------------------- */
/* Defaults                           */
/* ---------------------------------- */

/**
 * Default values for all Avatar dimensions.
 */
export const AVATAR_DEFAULTS = Object.freeze({
  variant: 'default',
  size: 'md',
  radius: 'full',
  status: 'offline',
  disabled: false,
  loading: false,
  group: 'default',
});

/* ---------------------------------- */
/* Helper Functions                   */
/* ---------------------------------- */

/**
 * Gets the variant configuration for an avatar.
 * @param {string} variant - The variant key.
 * @returns {Object} The variant configuration.
 */
export function getAvatarVariant(variant) {
  return AVATAR_VARIANTS[variant] || AVATAR_VARIANTS[AVATAR_DEFAULTS.variant];
}

/**
 * Gets the size configuration for an avatar.
 * @param {string} size - The size key.
 * @returns {Object} The size configuration.
 */
export function getAvatarSize(size) {
  return AVATAR_SIZES[size] || AVATAR_SIZES[AVATAR_DEFAULTS.size];
}

/**
 * Gets the radius class for an avatar.
 * @param {string} radius - The radius key.
 * @returns {string} The radius class.
 */
export function getAvatarRadius(radius) {
  return AVATAR_RADIUS[radius] || AVATAR_RADIUS[AVATAR_DEFAULTS.radius];
}

/**
 * Gets the status class for an avatar.
 * @param {string} status - The status key.
 * @returns {string} The status class.
 */
export function getAvatarStatus(status) {
  return AVATAR_STATUS[status] || AVATAR_STATUS[AVATAR_DEFAULTS.status];
}

/**
 * Gets the group configuration for an avatar.
 * @param {string} group - The group key.
 * @returns {Object} The group configuration.
 */
export function getAvatarGroup(group) {
  return AVATAR_GROUP[group] || AVATAR_GROUP[AVATAR_DEFAULTS.group];
}