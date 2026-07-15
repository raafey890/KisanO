/**
 * KisanO Design System — Badge Package
 * Badge Utilities
 *
 * Production-ready utility functions for the Badge package.
 * Contains only pure utility functions based on the existing badgeVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for badge styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Badge/badgeUtils
 */

import {
  BADGE_VARIANTS,
  BADGE_SIZES,
  BADGE_RADIUS,
  BADGE_POSITIONS,
  BADGE_DEFAULTS,
  getBadgeVariant,
  getBadgeSize,
  getBadgeRadius,
  getBadgePosition,
} from './badgeVariants';

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
 * Resolves default props for badge components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Badge variant.
 * @param {string} [props.size] - Badge size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.position] - Badge position.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.loading] - Loading state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = BADGE_DEFAULTS.variant,
  size = BADGE_DEFAULTS.size,
  radius = BADGE_DEFAULTS.radius,
  position = BADGE_DEFAULTS.position,
  disabled = BADGE_DEFAULTS.disabled,
  loading = BADGE_DEFAULTS.loading,
}) {
  return {
    variant: BADGE_VARIANTS[variant] ? variant : BADGE_DEFAULTS.variant,
    size: BADGE_SIZES[size] ? size : BADGE_DEFAULTS.size,
    radius: BADGE_RADIUS[radius] ? radius : BADGE_DEFAULTS.radius,
    position: BADGE_POSITIONS[position] ? position : BADGE_DEFAULTS.position,
    disabled,
    loading,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete badge classes based on options.
 *
 * @param {Object} options - Badge options.
 * @param {string} [options.variant] - Badge variant.
 * @param {string} [options.size] - Badge size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @param {boolean} [options.dot] - Dot badge.
 * @returns {string} Merged badge classes.
 */
export function getBadgeClasses({
  variant = BADGE_DEFAULTS.variant,
  size = BADGE_DEFAULTS.size,
  radius = BADGE_DEFAULTS.radius,
  className = '',
  disabled = false,
  loading = false,
  dot = false,
}) {
  const variantConfig = getBadgeVariant(variant);
  const sizeConfig = getBadgeSize(size);

  return mergeClasses(
    'inline-flex items-center justify-center',
    'font-medium',
    sizeConfig.padding,
    sizeConfig.text,
    sizeConfig.gap,
    sizeConfig.minHeight,
    !dot && sizeConfig.minWidth,
    variantConfig.background,
    variantConfig.text,
    variantConfig.border,
    getBadgeRadius(radius),
    variantConfig.hover,
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    dot && 'rounded-full !p-0 !min-h-0 !min-w-0',
    className,
  );
}

/**
 * Gets container classes for badge wrapper.
 *
 * @param {Object} options - Container options.
 * @param {string} [options.className] - Additional classes.
 * @param {string} [options.position] - Badge position.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged container classes.
 */
export function getBadgeContainerClasses({
  className = '',
  position = BADGE_DEFAULTS.position,
  disabled = false,
}) {
  return mergeClasses(
    'inline-flex relative',
    disabled && 'opacity-50 cursor-not-allowed',
    className,
  );
}

/**
 * Gets icon classes for badge icon.
 *
 * @param {Object} options - Icon options.
 * @param {string} [options.size] - Badge size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged icon classes.
 */
export function getBadgeIconClasses({
  size = BADGE_DEFAULTS.size,
  className = '',
  disabled = false,
}) {
  const sizeConfig = getBadgeSize(size);

  return mergeClasses(
    'shrink-0',
    sizeConfig.icon,
    disabled && 'opacity-50',
    className,
  );
}

/**
 * Gets dot classes for badge dot.
 *
 * @param {Object} options - Dot options.
 * @param {string} [options.size] - Badge size.
 * @param {string} [options.variant] - Badge variant.
 * @param {string} [options.className] - Additional classes.
 * @param {string} [options.position] - Badge position.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.animated] - Animated dot.
 * @returns {string} Merged dot classes.
 */
export function getBadgeDotClasses({
  size = BADGE_DEFAULTS.size,
  variant = BADGE_DEFAULTS.variant,
  className = '',
  position = BADGE_DEFAULTS.position,
  disabled = false,
  animated = false,
}) {
  const variantConfig = getBadgeVariant(variant);
  const sizeConfig = getBadgeSize(size);

  return mergeClasses(
    'absolute rounded-full',
    getBadgePosition(position),
    sizeConfig.minHeight,
    sizeConfig.minWidth,
    variantConfig.background,
    variantConfig.border,
    disabled && 'opacity-50',
    animated && 'animate-pulse',
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
  return variant ? Object.keys(BADGE_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(BADGE_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(BADGE_RADIUS).includes(radius) : false;
}

/**
 * Validates if a position is valid.
 *
 * @param {string} position - The position to check.
 * @returns {boolean} True if valid.
 */
export function isValidPosition(position) {
  return position ? Object.keys(BADGE_POSITIONS).includes(position) : false;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for badge components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.label] - Badge label.
 * @param {string} [state.variant] - Badge variant.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {number} [state.count] - Badge count.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  label = '',
  variant = BADGE_DEFAULTS.variant,
  disabled = false,
  count = 0,
}) {
  return {
    getRole: () => 'status',
    getAriaLabel: () => label || `${variant} badge`,
    getAriaDisabled: () => disabled || undefined,
    getAriaAtomic: () => true,
    getAriaLive: () => 'polite',
    getAriaLabelCount: () => (count > 0 ? `${count} items` : undefined),
    getTabIndex: () => (disabled ? -1 : 0),
  };
}

/* ---------------------------------- */
/* Re-exported Utilities              */
/* ---------------------------------- */

// Re-export token utilities for convenience
export {
  getBadgeVariant,
  getBadgeSize,
  getBadgeRadius,
  getBadgePosition,
};