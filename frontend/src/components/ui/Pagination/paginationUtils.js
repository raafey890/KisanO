/**
 * KisanO Design System — Pagination Package
 * Pagination Utilities
 *
 * Production-ready utility functions for the Pagination package.
 * Contains only pure utility functions based on the existing paginationVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for pagination styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Pagination/paginationUtils
 */

import {
  PAGINATION_VARIANTS,
  PAGINATION_SIZES,
  PAGINATION_RADIUS,
  PAGINATION_STATES,
  PAGINATION_DEFAULTS,
  getPaginationVariant,
  getPaginationSize,
  getPaginationRadius,
  getPaginationState,
} from './paginationVariants';

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
 * Resolves default props for pagination components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Pagination variant.
 * @param {string} [props.size] - Pagination size.
 * @param {string} [props.radius] - Border radius.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.loading] - Loading state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = PAGINATION_DEFAULTS.variant,
  size = PAGINATION_DEFAULTS.size,
  radius = PAGINATION_DEFAULTS.radius,
  disabled = PAGINATION_DEFAULTS.disabled,
  loading = PAGINATION_DEFAULTS.loading,
}) {
  return {
    variant: PAGINATION_VARIANTS[variant] ? variant : PAGINATION_DEFAULTS.variant,
    size: PAGINATION_SIZES[size] ? size : PAGINATION_DEFAULTS.size,
    radius: PAGINATION_RADIUS[radius] ? radius : PAGINATION_DEFAULTS.radius,
    disabled,
    loading,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete pagination classes based on options.
 *
 * @param {Object} options - Pagination options.
 * @param {string} [options.variant] - Pagination variant.
 * @param {string} [options.size] - Pagination size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged pagination classes.
 */
export function getPaginationClasses({
  variant = PAGINATION_DEFAULTS.variant,
  size = PAGINATION_DEFAULTS.size,
  className = '',
  disabled = false,
  loading = false,
}) {
  const variantConfig = getPaginationVariant(variant);
  const sizeConfig = getPaginationSize(size);

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
 * Gets container classes for pagination wrapper.
 *
 * @param {Object} options - Container options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged container classes.
 */
export function getPaginationContainerClasses({
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
 * Gets item classes for pagination item.
 *
 * @param {Object} options - Item options.
 * @param {string} [options.variant] - Pagination variant.
 * @param {string} [options.size] - Pagination size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.className] - Additional classes.
 * @param {string} [options.state] - Item state (default, active, hover, disabled).
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged item classes.
 */
export function getPaginationItemClasses({
  variant = PAGINATION_DEFAULTS.variant,
  size = PAGINATION_DEFAULTS.size,
  radius = PAGINATION_DEFAULTS.radius,
  className = '',
  state = 'default',
  disabled = false,
  loading = false,
}) {
  const variantConfig = getPaginationVariant(variant);
  const sizeConfig = getPaginationSize(size);
  const stateConfig = getPaginationState(state);

  return mergeClasses(
    'inline-flex items-center justify-center',
    'font-medium',
    sizeConfig.padding,
    sizeConfig.text,
    sizeConfig.minHeight,
    sizeConfig.minWidth,
    stateConfig.background,
    stateConfig.text,
    stateConfig.border,
    getPaginationRadius(radius),
    'transition-colors duration-200 ease-in-out',
    variantConfig.focus,
    disabled && variantConfig.disabled,
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets button classes for pagination button.
 *
 * @param {Object} options - Button options.
 * @param {string} [options.variant] - Pagination variant.
 * @param {string} [options.size] - Pagination size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.active] - Active state.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged button classes.
 */
export function getPaginationButtonClasses({
  variant = PAGINATION_DEFAULTS.variant,
  size = PAGINATION_DEFAULTS.size,
  radius = PAGINATION_DEFAULTS.radius,
  className = '',
  active = false,
  disabled = false,
  loading = false,
}) {
  const state = active ? 'active' : disabled ? 'disabled' : 'default';
  const variantConfig = getPaginationVariant(variant);
  const sizeConfig = getPaginationSize(size);
  const stateConfig = getPaginationState(state);

  return mergeClasses(
    'inline-flex items-center justify-center',
    'font-medium',
    'cursor-pointer',
    sizeConfig.padding,
    sizeConfig.text,
    sizeConfig.minHeight,
    sizeConfig.minWidth,
    stateConfig.background,
    stateConfig.text,
    stateConfig.border,
    getPaginationRadius(radius),
    'transition-colors duration-200 ease-in-out',
    !active && !disabled && variantConfig.hover,
    variantConfig.focus,
    disabled && variantConfig.disabled,
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets ellipsis classes for pagination ellipsis.
 *
 * @param {Object} options - Ellipsis options.
 * @param {string} [options.size] - Pagination size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged ellipsis classes.
 */
export function getPaginationEllipsisClasses({
  size = PAGINATION_DEFAULTS.size,
  className = '',
  disabled = false,
}) {
  const sizeConfig = getPaginationSize(size);

  return mergeClasses(
    'inline-flex items-center justify-center',
    sizeConfig.minHeight,
    sizeConfig.minWidth,
    'text-gray-400',
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
  return variant ? Object.keys(PAGINATION_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(PAGINATION_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(PAGINATION_RADIUS).includes(radius) : false;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for pagination components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.label] - Pagination label.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {number} [state.currentPage] - Current page number.
 * @param {number} [state.totalPages] - Total number of pages.
 * @param {string} [state.nextLabel] - Next button label.
 * @param {string} [state.previousLabel] - Previous button label.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  label = '',
  disabled = false,
  currentPage = 1,
  totalPages = 1,
  nextLabel = 'Next page',
  previousLabel = 'Previous page',
}) {
  return {
    getRole: () => 'navigation',
    getAriaLabel: () => label || 'Pagination',
    getAriaDisabled: () => disabled || undefined,
    getAriaCurrent: (page) => (page === currentPage ? 'page' : undefined),
    getAriaLabelNext: () => nextLabel,
    getAriaLabelPrevious: () => previousLabel,
    getAriaLabelPage: (page) => `Page ${page}`,
    getTabIndex: () => (disabled ? -1 : 0),
  };
}

/* ---------------------------------- */
/* Re-exported Utilities              */
/* ---------------------------------- */

// Re-export token utilities for convenience
export {
  getPaginationVariant,
  getPaginationSize,
  getPaginationRadius,
  getPaginationState,
};