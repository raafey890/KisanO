/**
 * KisanO Design System — Avatar Package
 * Avatar Utilities
 *
 * Production-ready utility functions for the Avatar package.
 * Contains only pure utility functions based on the existing avatarVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for avatar styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Avatar/avatarUtils
 */

import {
  AVATAR_VARIANTS,
  AVATAR_SIZES,
  AVATAR_RADIUS,
  AVATAR_STATUS,
  AVATAR_GROUP,
  AVATAR_DEFAULTS,
  getAvatarVariant,
  getAvatarSize,
  getAvatarRadius,
  getAvatarStatus,
  getAvatarGroup,
} from './avatarVariants';

/* ---------------------------------- */
/* Core Utility Functions             */
/* ---------------------------------- */

/**
 * Merges an arbitrary list of class values into a single class string.
 * - Falsy values (null, undefined, false, '') are ignored.
 * - Whitespace is normalized.
 * - Duplicate class names are removed (first occurrence wins).
 *
 * @param {...(string|false|null|undefined)} classes - Class values to merge.
 * @returns {string} A single, de-duplicated class string.
 *
 * @example
 * mergeClasses('p-4', isError && 'border-red-500', undefined)
 * // => 'p-4 border-red-500'
 */
export function mergeClasses(...classes) {
  const seen = new Set();
  const tokens = classes
    .filter(Boolean)
    .join(' ')
    .split(/\s+/)
    .filter((token) => token && !seen.has(token));

  for (const token of tokens) {
    seen.add(token);
  }
  return tokens.join(' ');
}

/**
 * Resolves responsive class overrides into a single class string.
 *
 * @param {Object} responsive - Responsive class map.
 * @param {string} [responsive.xs] - Extra small classes.
 * @param {string} [responsive.sm] - Small classes.
 * @param {string} [responsive.md] - Medium classes.
 * @param {string} [responsive.lg] - Large classes.
 * @param {string} [responsive.xl] - Extra large classes.
 * @returns {string} Merged responsive classes.
 */
export function resolveResponsiveClasses(responsive = {}) {
  const { xs, sm, md, lg, xl } = responsive;
  return mergeClasses(
    xs || '',
    sm ? `sm:${sm}` : '',
    md ? `md:${md}` : '',
    lg ? `lg:${lg}` : '',
    xl ? `xl:${xl}` : '',
  );
}

/**
 * Resolves default props for avatar components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Avatar variant.
 * @param {string} [props.size] - Avatar size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.status] - Status indicator.
 * @param {string} [props.group] - Group style.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.loading] - Loading state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = AVATAR_DEFAULTS.variant,
  size = AVATAR_DEFAULTS.size,
  radius = AVATAR_DEFAULTS.radius,
  status = AVATAR_DEFAULTS.status,
  group = AVATAR_DEFAULTS.group,
  disabled = AVATAR_DEFAULTS.disabled,
  loading = AVATAR_DEFAULTS.loading,
}) {
  return {
    variant: AVATAR_VARIANTS[variant] ? variant : AVATAR_DEFAULTS.variant,
    size: AVATAR_SIZES[size] ? size : AVATAR_DEFAULTS.size,
    radius: AVATAR_RADIUS[radius] ? radius : AVATAR_DEFAULTS.radius,
    status: AVATAR_STATUS[status] ? status : AVATAR_DEFAULTS.status,
    group: AVATAR_GROUP[group] ? group : AVATAR_DEFAULTS.group,
    disabled,
    loading,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete avatar classes based on options.
 *
 * @param {Object} options - Avatar options.
 * @param {string} [options.variant] - Avatar variant.
 * @param {string} [options.size] - Avatar size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @param {boolean} [options.hasImage] - Whether avatar has an image.
 * @returns {string} Merged avatar classes.
 */
export function getAvatarClasses({
  variant = AVATAR_DEFAULTS.variant,
  size = AVATAR_DEFAULTS.size,
  radius = AVATAR_DEFAULTS.radius,
  className = '',
  disabled = false,
  loading = false,
  hasImage = false,
}) {
  const variantConfig = getAvatarVariant(variant);
  const sizeConfig = getAvatarSize(size);

  return mergeClasses(
    'relative inline-flex shrink-0 items-center justify-center overflow-hidden',
    sizeConfig.size,
    variantConfig.background,
    variantConfig.text,
    variantConfig.border,
    getAvatarRadius(radius),
    variantConfig.ring,
    sizeConfig.ringWidth,
    variantConfig.hover,
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    hasImage && 'bg-transparent',
    className,
  );
}

/**
 * Gets container classes for avatar wrapper.
 *
 * @param {Object} options - Container options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {string} [options.group] - Group style.
 * @param {number} [options.index] - Item index for z-index.
 * @returns {string} Merged container classes.
 */
export function getAvatarContainerClasses({
  className = '',
  disabled = false,
  group = AVATAR_DEFAULTS.group,
  index = 0,
}) {
  const groupConfig = getAvatarGroup(group);

  return mergeClasses(
    'inline-flex',
    groupConfig.spacing,
    disabled && 'opacity-50 cursor-not-allowed',
    index > 0 ? `z-${Math.min(index, 50)}` : '',
    className,
  );
}

/**
 * Gets image classes for avatar image.
 *
 * @param {Object} options - Image options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {string} [options.objectFit] - Object fit.
 * @returns {string} Merged image classes.
 */
export function getAvatarImageClasses({
  className = '',
  disabled = false,
  objectFit = 'cover',
}) {
  const fitMap = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };

  return mergeClasses(
    'w-full h-full',
    fitMap[objectFit] || 'object-cover',
    disabled && 'opacity-50',
    className,
  );
}

/**
 * Gets fallback classes for avatar fallback.
 *
 * @param {Object} options - Fallback options.
 * @param {string} [options.variant] - Avatar variant.
 * @param {string} [options.size] - Avatar size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged fallback classes.
 */
export function getAvatarFallbackClasses({
  variant = AVATAR_DEFAULTS.variant,
  size = AVATAR_DEFAULTS.size,
  className = '',
  disabled = false,
}) {
  const variantConfig = getAvatarVariant(variant);
  const sizeConfig = getAvatarSize(size);

  return mergeClasses(
    'flex items-center justify-center w-full h-full',
    'font-medium uppercase',
    sizeConfig.text,
    variantConfig.text,
    variantConfig.background,
    disabled && 'opacity-50',
    className,
  );
}

/**
 * Gets status classes for avatar status indicator.
 *
 * @param {Object} options - Status options.
 * @param {string} [options.status] - Status type.
 * @param {string} [options.size] - Avatar size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.animated] - Animated status.
 * @returns {string} Merged status classes.
 */
export function getAvatarStatusClasses({
  status = AVATAR_DEFAULTS.status,
  size = AVATAR_DEFAULTS.size,
  className = '',
  disabled = false,
  animated = false,
}) {
  const sizeConfig = getAvatarSize(size);
  const statusClass = getAvatarStatus(status);

  return mergeClasses(
    'absolute bottom-0 right-0 rounded-full',
    sizeConfig.status,
    statusClass,
    'ring-2 ring-white',
    disabled && 'opacity-50',
    animated && 'animate-pulse',
    className,
  );
}

/**
 * Gets group classes for avatar group container.
 *
 * @param {Object} options - Group options.
 * @param {string} [options.group] - Group style.
 * @param {string} [options.className] - Additional classes.
 * @param {string} [options.radius] - Border radius.
 * @param {number} [options.max] - Max avatars to show.
 * @param {number} [options.count] - Total avatars.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged group classes.
 */
export function getAvatarGroupClasses({
  group = AVATAR_DEFAULTS.group,
  className = '',
  radius = AVATAR_DEFAULTS.radius,
  max = 5,
  count = 0,
  disabled = false,
}) {
  const groupConfig = getAvatarGroup(group);

  return mergeClasses(
    'flex',
    groupConfig.spacing,
    'relative',
    disabled && 'opacity-50 cursor-not-allowed',
    className,
  );
}

/* ---------------------------------- */
/* Validation Utilities               */
/* ---------------------------------- */

/**
 * Validates if a variant is valid.
 *
 * @param {string} variant - The variant to check.
 * @returns {boolean} True if valid.
 */
export function isValidVariant(variant) {
  return variant ? Object.keys(AVATAR_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(AVATAR_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(AVATAR_RADIUS).includes(radius) : false;
}

/**
 * Validates if a status is valid.
 *
 * @param {string} status - The status to check.
 * @returns {boolean} True if valid.
 */
export function isValidStatus(status) {
  return status ? Object.keys(AVATAR_STATUS).includes(status) : false;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for avatar components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.name] - User name.
 * @param {string} [state.src] - Image source.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {string} [state.status] - Status indicator.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  name = '',
  src = '',
  disabled = false,
  status = AVATAR_DEFAULTS.status,
}) {
  return {
    getRole: () => (src ? 'img' : 'figure'),
    getAriaLabel: () => name ? `${name}'s avatar` : 'Avatar',
    getAriaDisabled: () => disabled || undefined,
    getAriaHidden: () => (!name && !src) || undefined,
    getAriaLabelStatus: () => (status !== 'offline' ? `Status: ${status}` : undefined),
    getTabIndex: () => (disabled ? -1 : 0),
  };
}

/* ---------------------------------- */
/* Re-exported Utilities              */
/* ---------------------------------- */

// Re-export token utilities for convenience
export {
  getAvatarVariant,
  getAvatarSize,
  getAvatarRadius,
  getAvatarStatus,
  getAvatarGroup,
};