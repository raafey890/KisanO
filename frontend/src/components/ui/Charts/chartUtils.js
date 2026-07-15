/**
 * KisanO Design System — Chart Package
 * Chart Utilities
 *
 * Production-ready utility functions for the Chart package.
 * Contains only pure utility functions based on the existing chartVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for chart styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Chart/chartUtils
 */

import {
  CHART_VARIANTS,
  CHART_SIZES,
  CHART_COLORS,
  CHART_ANIMATIONS,
  CHART_DEFAULTS,
  getChartVariant,
  getChartSize,
  getChartColor,
  getChartAnimation,
} from './chartVariants';

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
 * Resolves default props for chart components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Chart variant.
 * @param {string} [props.size] - Chart size.
 * @param {string} [props.colors] - Color palette.
 * @param {string} [props.animation] - Animation type.
 * @param {boolean} [props.responsive] - Responsive chart.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.loading] - Loading state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = CHART_DEFAULTS.variant,
  size = CHART_DEFAULTS.size,
  colors = CHART_DEFAULTS.colors,
  animation = CHART_DEFAULTS.animation,
  responsive = CHART_DEFAULTS.responsive,
  disabled = CHART_DEFAULTS.disabled,
  loading = CHART_DEFAULTS.loading,
}) {
  return {
    variant: CHART_VARIANTS[variant] ? variant : CHART_DEFAULTS.variant,
    size: CHART_SIZES[size] ? size : CHART_DEFAULTS.size,
    colors: CHART_COLORS[colors] ? colors : CHART_DEFAULTS.colors,
    animation: CHART_ANIMATIONS[animation] ? animation : CHART_DEFAULTS.animation,
    responsive,
    disabled,
    loading,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete chart classes based on options.
 *
 * @param {Object} options - Chart options.
 * @param {string} [options.variant] - Chart variant.
 * @param {string} [options.size] - Chart size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged chart classes.
 */
export function getChartClasses({
  variant = CHART_DEFAULTS.variant,
  size = CHART_DEFAULTS.size,
  className = '',
  disabled = false,
  loading = false,
}) {
  const variantConfig = getChartVariant(variant);
  const sizeConfig = getChartSize(size);

  return mergeClasses(
    'relative w-full',
    sizeConfig.height,
    variantConfig.background,
    variantConfig.text,
    variantConfig.border,
    sizeConfig.padding,
    getChartRadius(radius),
    getChartShadow(shadow),
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets container classes for chart wrapper.
 *
 * @param {Object} options - Container options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @param {boolean} [options.responsive] - Responsive chart.
 * @returns {string} Merged container classes.
 */
export function getChartContainerClasses({
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
 * Gets legend classes for chart legend.
 *
 * @param {Object} options - Legend options.
 * @param {string} [options.variant] - Chart variant.
 * @param {string} [options.size] - Chart size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {string} [options.position] - Legend position.
 * @returns {string} Merged legend classes.
 */
export function getLegendClasses({
  variant = CHART_DEFAULTS.variant,
  size = CHART_DEFAULTS.size,
  className = '',
  disabled = false,
  position = 'bottom',
}) {
  const variantConfig = getChartVariant(variant);
  const sizeConfig = getChartSize(size);

  const positionMap = {
    top: 'flex-col-reverse',
    bottom: 'flex-col',
    left: 'flex-row',
    right: 'flex-row-reverse',
  };

  return mergeClasses(
    'flex flex-wrap items-center gap-2',
    positionMap[position] || positionMap.bottom,
    variantConfig.text,
    sizeConfig.text,
    disabled && 'opacity-50',
    className,
  );
}

/**
 * Gets tooltip classes for chart tooltip.
 *
 * @param {Object} options - Tooltip options.
 * @param {string} [options.variant] - Chart variant.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged tooltip classes.
 */
export function getTooltipClasses({
  variant = CHART_DEFAULTS.variant,
  className = '',
  disabled = false,
}) {
  const variantConfig = getChartVariant(variant);

  return mergeClasses(
    'absolute z-10 px-3 py-2 rounded-lg shadow-lg',
    'bg-white dark:bg-gray-800',
    'border border-gray-200 dark:border-gray-700',
    'text-sm',
    variantConfig.text,
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
  return variant ? Object.keys(CHART_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(CHART_SIZES).includes(size) : false;
}

/**
 * Validates if a color palette is valid.
 *
 * @param {string} colors - The color palette to check.
 * @returns {boolean} True if valid.
 */
export function isValidColor(colors) {
  return colors ? Object.keys(CHART_COLORS).includes(colors) : false;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for chart components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.title] - Chart title.
 * @param {string} [state.description] - Chart description.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {boolean} [state.loading] - Loading state.
 * @param {number} [state.seriesCount] - Number of data series.
 * @param {number} [state.dataPoints] - Number of data points.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  title = '',
  description = '',
  disabled = false,
  loading = false,
  seriesCount = 0,
  dataPoints = 0,
}) {
  return {
    getRole: () => 'img',
    getAriaLabel: () => title || 'Chart',
    getAriaDescription: () => description || 'Data visualization',
    getAriaDisabled: () => disabled || undefined,
    getAriaBusy: () => loading || undefined,
    getAriaLive: () => 'polite',
    getAriaAtomic: () => true,
    getTabIndex: () => (disabled ? -1 : 0),
  };
}

/* ---------------------------------- */
/* Re-exported Utilities              */
/* ---------------------------------- */

// Re-export token utilities for convenience
export {
  getChartVariant,
  getChartSize,
  getChartColor,
  getChartAnimation,
};