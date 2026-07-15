/**
 * KisanO Design System — Accordion Package
 * Accordion Utilities
 *
 * Production-ready utility functions for the Accordion package.
 * Contains only pure utility functions based on the existing accordionVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for accordion styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Accordion/accordionUtils
 */

import {
  ACCORDION_VARIANTS,
  ACCORDION_SIZES,
  ACCORDION_RADIUS,
  ACCORDION_SHADOWS,
  ACCORDION_ANIMATIONS,
  ACCORDION_DEFAULTS,
  getAccordionVariant,
  getAccordionSize,
  getAccordionRadius,
  getAccordionShadow,
  getAccordionAnimation,
} from './accordionVariants';

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
 * Resolves default props for accordion components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Accordion variant.
 * @param {string} [props.size] - Accordion size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.shadow] - Shadow level.
 * @param {string} [props.animation] - Animation type.
 * @param {boolean} [props.multiple] - Multiple open items.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.loading] - Loading state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = ACCORDION_DEFAULTS.variant,
  size = ACCORDION_DEFAULTS.size,
  radius = ACCORDION_DEFAULTS.radius,
  shadow = ACCORDION_DEFAULTS.shadow,
  animation = ACCORDION_DEFAULTS.animation,
  multiple = ACCORDION_DEFAULTS.multiple,
  disabled = ACCORDION_DEFAULTS.disabled,
  loading = ACCORDION_DEFAULTS.loading,
}) {
  return {
    variant: ACCORDION_VARIANTS[variant] ? variant : ACCORDION_DEFAULTS.variant,
    size: ACCORDION_SIZES[size] ? size : ACCORDION_DEFAULTS.size,
    radius: ACCORDION_RADIUS[radius] ? radius : ACCORDION_DEFAULTS.radius,
    shadow: ACCORDION_SHADOWS[shadow] ? shadow : ACCORDION_DEFAULTS.shadow,
    animation: ACCORDION_ANIMATIONS[animation] ? animation : ACCORDION_DEFAULTS.animation,
    multiple,
    disabled,
    loading,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete accordion classes based on options.
 *
 * @param {Object} options - Accordion options.
 * @param {string} [options.variant] - Accordion variant.
 * @param {string} [options.size] - Accordion size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.shadow] - Shadow level.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged accordion classes.
 */
export function getAccordionClasses({
  variant = ACCORDION_DEFAULTS.variant,
  size = ACCORDION_DEFAULTS.size,
  radius = ACCORDION_DEFAULTS.radius,
  shadow = ACCORDION_DEFAULTS.shadow,
  className = '',
  disabled = false,
  loading = false,
}) {
  const variantConfig = getAccordionVariant(variant);
  const sizeConfig = getAccordionSize(size);

  return mergeClasses(
    'flex flex-col w-full',
    sizeConfig.gap,
    variantConfig.background,
    variantConfig.border,
    getAccordionRadius(radius),
    getAccordionShadow(shadow),
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets container classes for accordion wrapper.
 *
 * @param {Object} options - Container options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged container classes.
 */
export function getAccordionContainerClasses({
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
 * Gets item classes for accordion item.
 *
 * @param {Object} options - Item options.
 * @param {string} [options.variant] - Accordion variant.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.open] - Open state.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged item classes.
 */
export function getAccordionItemClasses({
  variant = ACCORDION_DEFAULTS.variant,
  className = '',
  open = false,
  disabled = false,
  loading = false,
}) {
  const variantConfig = getAccordionVariant(variant);

  return mergeClasses(
    'overflow-hidden',
    variantConfig.border,
    open && variantConfig.active,
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets header classes for accordion header.
 *
 * @param {Object} options - Header options.
 * @param {string} [options.variant] - Accordion variant.
 * @param {string} [options.size] - Accordion size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.open] - Open state.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged header classes.
 */
export function getAccordionHeaderClasses({
  variant = ACCORDION_DEFAULTS.variant,
  size = ACCORDION_DEFAULTS.size,
  className = '',
  open = false,
  disabled = false,
  loading = false,
}) {
  const variantConfig = getAccordionVariant(variant);
  const sizeConfig = getAccordionSize(size);

  return mergeClasses(
    'flex items-center w-full',
    'font-medium',
    sizeConfig.padding,
    sizeConfig.text,
    sizeConfig.gap,
    sizeConfig.minHeight,
    variantConfig.background,
    variantConfig.text,
    variantConfig.header,
    variantConfig.focus,
    open && variantConfig.active,
    disabled && variantConfig.disabled,
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets content classes for accordion content.
 *
 * @param {Object} options - Content options.
 * @param {string} [options.size] - Accordion size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged content classes.
 */
export function getAccordionContentClasses({
  size = ACCORDION_DEFAULTS.size,
  className = '',
  disabled = false,
  loading = false,
}) {
  const sizeConfig = getAccordionSize(size);

  return mergeClasses(
    'overflow-hidden',
    sizeConfig.padding,
    sizeConfig.gap,
    disabled && 'opacity-50',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets icon classes for accordion icon.
 *
 * @param {Object} options - Icon options.
 * @param {string} [options.size] - Accordion size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.open] - Open state.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged icon classes.
 */
export function getAccordionIconClasses({
  size = ACCORDION_DEFAULTS.size,
  className = '',
  open = false,
  disabled = false,
}) {
  const sizeConfig = getAccordionSize(size);

  return mergeClasses(
    'shrink-0 transition-transform duration-200 ease-in-out',
    sizeConfig.icon,
    open && 'rotate-180',
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
  return variant ? Object.keys(ACCORDION_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(ACCORDION_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(ACCORDION_RADIUS).includes(radius) : false;
}

/**
 * Validates if a shadow is valid.
 *
 * @param {string} shadow - The shadow to check.
 * @returns {boolean} True if valid.
 */
export function isValidShadow(shadow) {
  return shadow ? Object.keys(ACCORDION_SHADOWS).includes(shadow) : false;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for accordion components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.label] - Accordion label.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {number} [state.openIndex] - Open item index.
 * @param {number} [state.itemsCount] - Total number of items.
 * @param {string} [state.id] - Accordion ID.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  label = '',
  disabled = false,
  openIndex = -1,
  itemsCount = 0,
  id = '',
}) {
  return {
    getRole: () => 'list',
    getAriaLabel: () => label || 'Accordion',
    getAriaDisabled: () => disabled || undefined,
    getAriaExpanded: (index) => index === openIndex,
    getAriaControls: (index) => `accordion-content-${id}-${index}`,
    getAriaLabelledBy: (index) => `accordion-header-${id}-${index}`,
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
  getAccordionVariant,
  getAccordionSize,
  getAccordionRadius,
  getAccordionShadow,
  getAccordionAnimation,
};