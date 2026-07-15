/**
 * KisanO Design System — Table Package
 * Table Utilities
 *
 * Production-ready utility functions for the Table package.
 * Contains only pure utility functions based on the existing tableVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for table styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Table/tableUtils
 */

import {
  TABLE_VARIANTS,
  TABLE_SIZES,
  TABLE_RADIUS,
  TABLE_SHADOWS,
  TABLE_STRIPES,
  TABLE_DEFAULTS,
  getTableVariant,
  getTableSize,
  getTableRadius,
  getTableShadow,
  getTableStripe,
} from './tableVariants';

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
 * Resolves default props for table components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Table variant.
 * @param {string} [props.size] - Table size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.shadow] - Shadow level.
 * @param {string} [props.stripes] - Stripe style.
 * @param {boolean} [props.bordered] - Bordered table.
 * @param {boolean} [props.hoverable] - Hoverable rows.
 * @param {boolean} [props.selectable] - Selectable rows.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.loading] - Loading state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = TABLE_DEFAULTS.variant,
  size = TABLE_DEFAULTS.size,
  radius = TABLE_DEFAULTS.radius,
  shadow = TABLE_DEFAULTS.shadow,
  stripes = TABLE_DEFAULTS.stripes,
  bordered = TABLE_DEFAULTS.bordered,
  hoverable = TABLE_DEFAULTS.hoverable,
  selectable = TABLE_DEFAULTS.selectable,
  disabled = TABLE_DEFAULTS.disabled,
  loading = TABLE_DEFAULTS.loading,
}) {
  return {
    variant: TABLE_VARIANTS[variant] ? variant : TABLE_DEFAULTS.variant,
    size: TABLE_SIZES[size] ? size : TABLE_DEFAULTS.size,
    radius: TABLE_RADIUS[radius] ? radius : TABLE_DEFAULTS.radius,
    shadow: TABLE_SHADOWS[shadow] ? shadow : TABLE_DEFAULTS.shadow,
    stripes: TABLE_STRIPES[stripes] ? stripes : TABLE_DEFAULTS.stripes,
    bordered,
    hoverable,
    selectable,
    disabled,
    loading,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete table classes based on options.
 *
 * @param {Object} options - Table options.
 * @param {string} [options.variant] - Table variant.
 * @param {string} [options.size] - Table size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.shadow] - Shadow level.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @param {boolean} [options.bordered] - Bordered table.
 * @returns {string} Merged table classes.
 */
export function getTableClasses({
  variant = TABLE_DEFAULTS.variant,
  size = TABLE_DEFAULTS.size,
  radius = TABLE_DEFAULTS.radius,
  shadow = TABLE_DEFAULTS.shadow,
  className = '',
  disabled = false,
  loading = false,
  bordered = true,
}) {
  const variantConfig = getTableVariant(variant);
  const sizeConfig = getTableSize(size);

  return mergeClasses(
    'w-full',
    variantConfig.background,
    variantConfig.text,
    bordered && variantConfig.border,
    getTableRadius(radius),
    getTableShadow(shadow),
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets container classes for table wrapper.
 *
 * @param {Object} options - Container options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @param {boolean} [options.responsive] - Responsive table.
 * @returns {string} Merged container classes.
 */
export function getTableContainerClasses({
  className = '',
  disabled = false,
  loading = false,
  responsive = true,
}) {
  return mergeClasses(
    'w-full',
    responsive && 'overflow-x-auto',
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets header classes for table header.
 *
 * @param {Object} options - Header options.
 * @param {string} [options.variant] - Table variant.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged header classes.
 */
export function getTableHeaderClasses({
  variant = TABLE_DEFAULTS.variant,
  className = '',
  disabled = false,
  loading = false,
}) {
  const variantConfig = getTableVariant(variant);

  return mergeClasses(
    'border-b',
    variantConfig.header,
    disabled && 'opacity-50',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets body classes for table body.
 *
 * @param {Object} options - Body options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged body classes.
 */
export function getTableBodyClasses({
  className = '',
  disabled = false,
  loading = false,
}) {
  return mergeClasses(
    'divide-y divide-gray-200',
    disabled && 'opacity-50',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets row classes for table row.
 *
 * @param {Object} options - Row options.
 * @param {string} [options.variant] - Table variant.
 * @param {string} [options.stripes] - Stripe style.
 * @param {string} [options.className] - Additional classes.
 * @param {number} [options.index] - Row index (for stripes).
 * @param {boolean} [options.hoverable] - Hoverable row.
 * @param {boolean} [options.selectable] - Selectable row.
 * @param {boolean} [options.selected] - Selected state.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged row classes.
 */
export function getTableRowClasses({
  variant = TABLE_DEFAULTS.variant,
  stripes = TABLE_DEFAULTS.stripes,
  className = '',
  index = 0,
  hoverable = true,
  selectable = false,
  selected = false,
  disabled = false,
  loading = false,
}) {
  const variantConfig = getTableVariant(variant);
  const stripeConfig = getTableStripe(stripes);

  const isEven = index % 2 === 0;
  const stripeClass = isEven ? stripeConfig.even : stripeConfig.odd;

  return mergeClasses(
    'transition-colors duration-150',
    stripeClass,
    hoverable && variantConfig.hover,
    selected && variantConfig.selected,
    selectable && 'cursor-pointer',
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets cell classes for table cell.
 *
 * @param {Object} options - Cell options.
 * @param {string} [options.size] - Table size.
 * @param {string} [options.className] - Additional classes.
 * @param {string} [options.align] - Text alignment.
 * @param {boolean} [options.isHeader] - Header cell.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged cell classes.
 */
export function getTableCellClasses({
  size = TABLE_DEFAULTS.size,
  className = '',
  align = 'left',
  isHeader = false,
  disabled = false,
  loading = false,
}) {
  const sizeConfig = getTableSize(size);

  const alignMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return mergeClasses(
    sizeConfig.cellPadding,
    sizeConfig.text,
    alignMap[align] || 'text-left',
    isHeader ? 'font-semibold' : 'font-normal',
    disabled && 'opacity-50',
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
  return variant ? Object.keys(TABLE_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(TABLE_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(TABLE_RADIUS).includes(radius) : false;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for table components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.caption] - Table caption.
 * @param {string} [state.summary] - Table summary.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {number} [state.columns] - Number of columns.
 * @param {number} [state.rows] - Number of rows.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  caption = '',
  summary = '',
  disabled = false,
  columns = 0,
  rows = 0,
}) {
  return {
    getRole: () => 'table',
    getAriaLabel: () => caption || 'Table',
    getAriaDescription: () => summary || undefined,
    getAriaDisabled: () => disabled || undefined,
    getAriaColCount: () => columns || undefined,
    getAriaRowCount: () => rows || undefined,
    getTabIndex: () => (disabled ? -1 : 0),
  };
}

/* ---------------------------------- */
/* Re-exported Utilities              */
/* ---------------------------------- */

// Re-export token utilities for convenience
export {
  getTableVariant,
  getTableSize,
  getTableRadius,
  getTableShadow,
  getTableStripe,
};