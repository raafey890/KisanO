/**
 * KisanO Design System — Showcase Package
 * Showcase Utilities
 *
 * Production-ready utility functions for the Showcase package.
 * Contains only pure utility functions based on the existing showcaseVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for showcase styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Showcase/showcaseUtils
 */

import {
  SHOWCASE_VARIANTS,
  SHOWCASE_SIZES,
  SHOWCASE_LAYOUTS,
  SHOWCASE_DEFAULTS,
  getShowcaseVariant,
  getShowcaseSize,
  getShowcaseLayout,
} from './showcaseVariants';

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
 * Resolves default props for showcase components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Showcase variant.
 * @param {string} [props.size] - Showcase size.
 * @param {string} [props.layout] - Showcase layout.
 * @param {boolean} [props.animated] - Animated showcase.
 * @param {boolean} [props.responsive] - Responsive showcase.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.loading] - Loading state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = SHOWCASE_DEFAULTS.variant,
  size = SHOWCASE_DEFAULTS.size,
  layout = SHOWCASE_DEFAULTS.layout,
  animated = SHOWCASE_DEFAULTS.animated,
  responsive = SHOWCASE_DEFAULTS.responsive,
  disabled = SHOWCASE_DEFAULTS.disabled,
  loading = SHOWCASE_DEFAULTS.loading,
}) {
  return {
    variant: SHOWCASE_VARIANTS[variant] ? variant : SHOWCASE_DEFAULTS.variant,
    size: SHOWCASE_SIZES[size] ? size : SHOWCASE_DEFAULTS.size,
    layout: SHOWCASE_LAYOUTS[layout] ? layout : SHOWCASE_DEFAULTS.layout,
    animated,
    responsive,
    disabled,
    loading,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete showcase classes based on options.
 *
 * @param {Object} options - Showcase options.
 * @param {string} [options.variant] - Showcase variant.
 * @param {string} [options.size] - Showcase size.
 * @param {string} [options.layout] - Showcase layout.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged showcase classes.
 */
export function getShowcaseClasses({
  variant = SHOWCASE_DEFAULTS.variant,
  size = SHOWCASE_DEFAULTS.size,
  layout = SHOWCASE_DEFAULTS.layout,
  className = '',
  disabled = false,
  loading = false,
}) {
  const variantConfig = getShowcaseVariant(variant);
  const sizeConfig = getShowcaseSize(size);
  const layoutConfig = getShowcaseLayout(layout);

  return mergeClasses(
    'relative w-full',
    sizeConfig.padding,
    variantConfig.background,
    variantConfig.text,
    variantConfig.border,
    variantConfig.shadow,
    layoutConfig.flex || 'flex flex-col',
    layoutConfig.align || 'items-center',
    layoutConfig.gap || 'gap-4',
    layoutConfig.wrap || '',
    layoutConfig.cols || '',
    layoutConfig.overflow || '',
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets container classes for showcase wrapper.
 *
 * @param {Object} options - Container options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @param {boolean} [options.responsive] - Responsive container.
 * @returns {string} Merged container classes.
 */
export function getShowcaseContainerClasses({
  className = '',
  disabled = false,
  loading = false,
  responsive = true,
}) {
  return mergeClasses(
    'w-full max-w-7xl mx-auto',
    responsive && 'overflow-x-auto',
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets section classes for showcase sections.
 *
 * @param {Object} options - Section options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @param {string} [options.align] - Text alignment.
 * @returns {string} Merged section classes.
 */
export function getShowcaseSectionClasses({
  className = '',
  disabled = false,
  loading = false,
  align = 'center',
}) {
  const alignMap = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return mergeClasses(
    'flex flex-col w-full',
    alignMap[align] || alignMap.center,
    disabled && 'opacity-50',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets card classes for showcase cards.
 *
 * @param {Object} options - Card options.
 * @param {string} [options.variant] - Showcase variant.
 * @param {string} [options.size] - Showcase size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.interactive] - Interactive card.
 * @param {boolean} [options.selected] - Selected state.
 * @returns {string} Merged card classes.
 */
export function getShowcaseCardClasses({
  variant = SHOWCASE_DEFAULTS.variant,
  size = SHOWCASE_DEFAULTS.size,
  className = '',
  disabled = false,
  interactive = true,
  selected = false,
}) {
  const variantConfig = getShowcaseVariant(variant);
  const sizeConfig = getShowcaseSize(size);

  return mergeClasses(
    'relative overflow-hidden rounded-lg',
    'bg-white dark:bg-gray-800',
    'border border-gray-200 dark:border-gray-700',
    'transition-all duration-200 ease-in-out',
    interactive && 'cursor-pointer hover:shadow-md hover:-translate-y-1',
    selected && 'ring-2 ring-blue-500 border-blue-500',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className,
  );
}

/**
 * Gets header classes for showcase header.
 *
 * @param {Object} options - Header options.
 * @param {string} [options.variant] - Showcase variant.
 * @param {string} [options.size] - Showcase size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged header classes.
 */
export function getShowcaseHeaderClasses({
  variant = SHOWCASE_DEFAULTS.variant,
  size = SHOWCASE_DEFAULTS.size,
  className = '',
  disabled = false,
  loading = false,
}) {
  const variantConfig = getShowcaseVariant(variant);
  const sizeConfig = getShowcaseSize(size);

  return mergeClasses(
    'flex flex-col items-center',
    sizeConfig.gap,
    variantConfig.text,
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
  return variant ? Object.keys(SHOWCASE_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(SHOWCASE_SIZES).includes(size) : false;
}

/**
 * Validates if a layout is valid.
 *
 * @param {string} layout - The layout to check.
 * @returns {boolean} True if valid.
 */
export function isValidLayout(layout) {
  return layout ? Object.keys(SHOWCASE_LAYOUTS).includes(layout) : false;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for showcase components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.title] - Showcase title.
 * @param {string} [state.description] - Showcase description.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {boolean} [state.loading] - Loading state.
 * @param {number} [state.itemsCount] - Number of items.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  title = '',
  description = '',
  disabled = false,
  loading = false,
  itemsCount = 0,
}) {
  return {
    getRole: () => 'region',
    getAriaLabel: () => title || 'Showcase',
    getAriaDescription: () => description || undefined,
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
  getShowcaseVariant,
  getShowcaseSize,
  getShowcaseLayout,
};