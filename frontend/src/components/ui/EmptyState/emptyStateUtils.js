/**
 * KisanO Design System — EmptyState Package
 * EmptyState Utilities
 *
 * Production-ready utility functions for the EmptyState package.
 * Contains only pure utility functions based on the existing emptyStateVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for empty state styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/EmptyState/emptyStateUtils
 */

import {
  EMPTYSTATE_VARIANTS,
  EMPTYSTATE_SIZES,
  EMPTYSTATE_RADIUS,
  EMPTYSTATE_ALIGNMENTS,
  EMPTYSTATE_DEFAULTS,
  getEmptyStateVariant,
  getEmptyStateSize,
  getEmptyStateRadius,
  getEmptyStateAlignment,
} from './emptyStateVariants';

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
 * Resolves default props for empty state components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Empty state variant.
 * @param {string} [props.size] - Empty state size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.alignment] - Content alignment.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.loading] - Loading state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = EMPTYSTATE_DEFAULTS.variant,
  size = EMPTYSTATE_DEFAULTS.size,
  radius = EMPTYSTATE_DEFAULTS.radius,
  alignment = EMPTYSTATE_DEFAULTS.alignment,
  disabled = EMPTYSTATE_DEFAULTS.disabled,
  loading = EMPTYSTATE_DEFAULTS.loading,
}) {
  return {
    variant: EMPTYSTATE_VARIANTS[variant] ? variant : EMPTYSTATE_DEFAULTS.variant,
    size: EMPTYSTATE_SIZES[size] ? size : EMPTYSTATE_DEFAULTS.size,
    radius: EMPTYSTATE_RADIUS[radius] ? radius : EMPTYSTATE_DEFAULTS.radius,
    alignment: EMPTYSTATE_ALIGNMENTS[alignment] ? alignment : EMPTYSTATE_DEFAULTS.alignment,
    disabled,
    loading,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete empty state classes based on options.
 *
 * @param {Object} options - Empty state options.
 * @param {string} [options.variant] - Empty state variant.
 * @param {string} [options.size] - Empty state size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.alignment] - Content alignment.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged empty state classes.
 */
export function getEmptyStateClasses({
  variant = EMPTYSTATE_DEFAULTS.variant,
  size = EMPTYSTATE_DEFAULTS.size,
  radius = EMPTYSTATE_DEFAULTS.radius,
  alignment = EMPTYSTATE_DEFAULTS.alignment,
  className = '',
  disabled = false,
  loading = false,
}) {
  const variantConfig = getEmptyStateVariant(variant);
  const sizeConfig = getEmptyStateSize(size);
  const alignClass = getEmptyStateAlignment(alignment);

  return mergeClasses(
    'relative flex flex-col w-full',
    sizeConfig.padding,
    sizeConfig.gap,
    sizeConfig.maxWidth,
    alignClass,
    variantConfig.background,
    variantConfig.text,
    variantConfig.border,
    getEmptyStateRadius(radius),
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets container classes for empty state wrapper.
 *
 * @param {Object} options - Container options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged container classes.
 */
export function getEmptyStateContainerClasses({
  className = '',
  disabled = false,
  loading = false,
}) {
  return mergeClasses(
    'flex items-center justify-center w-full min-h-[200px]',
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets icon classes for empty state icon.
 *
 * @param {Object} options - Icon options.
 * @param {string} [options.variant] - Empty state variant.
 * @param {string} [options.size] - Empty state size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged icon classes.
 */
export function getEmptyStateIconClasses({
  variant = EMPTYSTATE_DEFAULTS.variant,
  size = EMPTYSTATE_DEFAULTS.size,
  className = '',
  disabled = false,
}) {
  const variantConfig = getEmptyStateVariant(variant);
  const sizeConfig = getEmptyStateSize(size);

  return mergeClasses(
    'shrink-0',
    sizeConfig.icon,
    variantConfig.icon,
    disabled && 'opacity-50',
    className,
  );
}

/**
 * Gets title classes for empty state title.
 *
 * @param {Object} options - Title options.
 * @param {string} [options.variant] - Empty state variant.
 * @param {string} [options.size] - Empty state size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged title classes.
 */
export function getEmptyStateTitleClasses({
  variant = EMPTYSTATE_DEFAULTS.variant,
  size = EMPTYSTATE_DEFAULTS.size,
  className = '',
  disabled = false,
  loading = false,
}) {
  const variantConfig = getEmptyStateVariant(variant);
  const sizeConfig = getEmptyStateSize(size);

  return mergeClasses(
    'font-semibold',
    sizeConfig.title,
    variantConfig.title,
    disabled && 'opacity-50',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets description classes for empty state description.
 *
 * @param {Object} options - Description options.
 * @param {string} [options.variant] - Empty state variant.
 * @param {string} [options.size] - Empty state size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged description classes.
 */
export function getEmptyStateDescriptionClasses({
  variant = EMPTYSTATE_DEFAULTS.variant,
  size = EMPTYSTATE_DEFAULTS.size,
  className = '',
  disabled = false,
  loading = false,
}) {
  const variantConfig = getEmptyStateVariant(variant);
  const sizeConfig = getEmptyStateSize(size);

  return mergeClasses(
    'font-normal',
    sizeConfig.description,
    variantConfig.description,
    disabled && 'opacity-50',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets action classes for empty state action.
 *
 * @param {Object} options - Action options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged action classes.
 */
export function getEmptyStateActionClasses({
  className = '',
  disabled = false,
  loading = false,
}) {
  return mergeClasses(
    'flex flex-wrap items-center gap-2 mt-2',
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
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
  return variant ? Object.keys(EMPTYSTATE_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(EMPTYSTATE_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(EMPTYSTATE_RADIUS).includes(radius) : false;
}

/**
 * Validates if an alignment is valid.
 *
 * @param {string} alignment - The alignment to check.
 * @returns {boolean} True if valid.
 */
export function isValidAlignment(alignment) {
  return alignment ? Object.keys(EMPTYSTATE_ALIGNMENTS).includes(alignment) : false;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for empty state components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.title] - Empty state title.
 * @param {string} [state.description] - Empty state description.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {boolean} [state.loading] - Loading state.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  title = '',
  description = '',
  disabled = false,
  loading = false,
}) {
  return {
    getRole: () => 'status',
    getAriaLabel: () => title || 'Empty state',
    getAriaDescription: () => description || undefined,
    getAriaDisabled: () => disabled || undefined,
    getAriaBusy: () => loading || undefined,
    getAriaLive: () => 'polite',
    getTabIndex: () => (disabled ? -1 : 0),
  };
}

/* ---------------------------------- */
/* Re-exported Utilities              */
/* ---------------------------------- */

// Re-export token utilities for convenience
export {
  getEmptyStateVariant,
  getEmptyStateSize,
  getEmptyStateRadius,
  getEmptyStateAlignment,
};