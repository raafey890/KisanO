/**
 * KisanO Design System — Breadcrumb Package
 * Breadcrumb Utilities
 *
 * Production-ready utility functions for the Breadcrumb package.
 * Contains only pure utility functions based on the existing breadcrumbVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for breadcrumb styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Breadcrumb/breadcrumbUtils
 */

import {
  BREADCRUMB_VARIANTS,
  BREADCRUMB_SIZES,
  BREADCRUMB_SEPARATORS,
  BREADCRUMB_DEFAULTS,
  getBreadcrumbVariant,
  getBreadcrumbSize,
  getBreadcrumbSeparator,
} from './breadcrumbVariants';

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
 * Resolves default props for breadcrumb components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Breadcrumb variant.
 * @param {string} [props.size] - Breadcrumb size.
 * @param {string} [props.separator] - Separator type.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.loading] - Loading state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = BREADCRUMB_DEFAULTS.variant,
  size = BREADCRUMB_DEFAULTS.size,
  separator = BREADCRUMB_DEFAULTS.separator,
  disabled = BREADCRUMB_DEFAULTS.disabled,
  loading = BREADCRUMB_DEFAULTS.loading,
}) {
  return {
    variant: BREADCRUMB_VARIANTS[variant] ? variant : BREADCRUMB_DEFAULTS.variant,
    size: BREADCRUMB_SIZES[size] ? size : BREADCRUMB_DEFAULTS.size,
    separator: BREADCRUMB_SEPARATORS[separator] ? separator : BREADCRUMB_DEFAULTS.separator,
    disabled,
    loading,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete breadcrumb classes based on options.
 *
 * @param {Object} options - Breadcrumb options.
 * @param {string} [options.variant] - Breadcrumb variant.
 * @param {string} [options.size] - Breadcrumb size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged breadcrumb classes.
 */
export function getBreadcrumbClasses({
  variant = BREADCRUMB_DEFAULTS.variant,
  size = BREADCRUMB_DEFAULTS.size,
  className = '',
  disabled = false,
  loading = false,
}) {
  const variantConfig = getBreadcrumbVariant(variant);
  const sizeConfig = getBreadcrumbSize(size);

  return mergeClasses(
    'flex flex-wrap items-center',
    sizeConfig.gap,
    variantConfig.background,
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets container classes for breadcrumb wrapper.
 *
 * @param {Object} options - Container options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged container classes.
 */
export function getBreadcrumbContainerClasses({
  className = '',
  disabled = false,
  loading = false,
}) {
  return mergeClasses(
    'w-full',
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets item classes for breadcrumb item.
 *
 * @param {Object} options - Item options.
 * @param {string} [options.variant] - Breadcrumb variant.
 * @param {string} [options.size] - Breadcrumb size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.active] - Active state.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged item classes.
 */
export function getBreadcrumbItemClasses({
  variant = BREADCRUMB_DEFAULTS.variant,
  size = BREADCRUMB_DEFAULTS.size,
  className = '',
  active = false,
  disabled = false,
  loading = false,
}) {
  const variantConfig = getBreadcrumbVariant(variant);
  const sizeConfig = getBreadcrumbSize(size);

  return mergeClasses(
    'inline-flex items-center',
    sizeConfig.padding,
    sizeConfig.text,
    sizeConfig.gap,
    variantConfig.text,
    active ? variantConfig.active : variantConfig.hover,
    variantConfig.focus,
    disabled && variantConfig.disabled,
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets link classes for breadcrumb link.
 *
 * @param {Object} options - Link options.
 * @param {string} [options.variant] - Breadcrumb variant.
 * @param {string} [options.size] - Breadcrumb size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.active] - Active state.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged link classes.
 */
export function getBreadcrumbLinkClasses({
  variant = BREADCRUMB_DEFAULTS.variant,
  size = BREADCRUMB_DEFAULTS.size,
  className = '',
  active = false,
  disabled = false,
  loading = false,
}) {
  const variantConfig = getBreadcrumbVariant(variant);
  const sizeConfig = getBreadcrumbSize(size);

  return mergeClasses(
    'inline-flex items-center no-underline',
    sizeConfig.padding,
    sizeConfig.text,
    sizeConfig.gap,
    variantConfig.text,
    'transition-colors duration-200',
    active ? variantConfig.active : variantConfig.hover,
    variantConfig.focus,
    disabled && variantConfig.disabled,
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets separator classes for breadcrumb separator.
 *
 * @param {Object} options - Separator options.
 * @param {string} [options.size] - Breadcrumb size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged separator classes.
 */
export function getBreadcrumbSeparatorClasses({
  size = BREADCRUMB_DEFAULTS.size,
  className = '',
  disabled = false,
}) {
  const sizeConfig = getBreadcrumbSize(size);

  return mergeClasses(
    'inline-flex items-center justify-center',
    sizeConfig.text,
    'text-gray-300',
    disabled && 'opacity-50',
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
  return variant ? Object.keys(BREADCRUMB_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(BREADCRUMB_SIZES).includes(size) : false;
}

/**
 * Validates if a separator is valid.
 *
 * @param {string} separator - The separator to check.
 * @returns {boolean} True if valid.
 */
export function isValidSeparator(separator) {
  return separator ? Object.keys(BREADCRUMB_SEPARATORS).includes(separator) : false;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for breadcrumb components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.label] - Breadcrumb label.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {number} [state.itemsCount] - Number of items.
 * @param {number} [state.activeIndex] - Active item index.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  label = '',
  disabled = false,
  itemsCount = 0,
  activeIndex = -1,
}) {
  return {
    getRole: () => 'navigation',
    getAriaLabel: () => label || 'Breadcrumb',
    getAriaDisabled: () => disabled || undefined,
    getAriaCurrent: (index) => (index === activeIndex ? 'page' : undefined),
    getAriaPosInSet: (index) => index + 1,
    getAriaSetSize: () => itemsCount,
    getTabIndex: () => (disabled ? -1 : 0),
  };
}

/* ---------------------------------- */
/* Re-exported Utilities              */
/* ---------------------------------- */

// Re-export token utilities for convenience
export {
  getBreadcrumbVariant,
  getBreadcrumbSize,
  getBreadcrumbSeparator,
};