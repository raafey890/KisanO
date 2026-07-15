/**
 * KisanO Design System — Checkbox Package
 * Checkbox Utilities
 *
 * Production-ready utility functions for the Checkbox package.
 * Contains only pure utility functions based on the existing checkboxVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for checkbox styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Checkbox/checkboxUtils
 */

import {
  CHECKBOX_VARIANTS,
  CHECKBOX_SIZES,
  CHECKBOX_RADIUS,
  CHECKBOX_SHADOWS,
  CHECKBOX_STATES,
  CHECKBOX_ICON_SIZES,
  CHECKBOX_DEFAULTS,
  getCheckboxVariant,
  getCheckboxSize,
  getCheckboxRadius,
  getCheckboxShadow,
  getCheckboxState,
  getCheckboxIconSize,
} from './checkboxVariants';

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
 * Resolves default props for checkbox components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Checkbox variant.
 * @param {string} [props.size] - Checkbox size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.shadow] - Shadow level.
 * @param {boolean} [props.checked] - Checked state.
 * @param {boolean} [props.indeterminate] - Indeterminate state.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.required] - Required state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = CHECKBOX_DEFAULTS.variant,
  size = CHECKBOX_DEFAULTS.size,
  radius = CHECKBOX_DEFAULTS.radius,
  shadow = CHECKBOX_DEFAULTS.shadow,
  checked = CHECKBOX_DEFAULTS.checked,
  indeterminate = CHECKBOX_DEFAULTS.indeterminate,
  disabled = CHECKBOX_DEFAULTS.disabled,
  required = CHECKBOX_DEFAULTS.required,
}) {
  return {
    variant: CHECKBOX_VARIANTS[variant] ? variant : CHECKBOX_DEFAULTS.variant,
    size: CHECKBOX_SIZES[size] ? size : CHECKBOX_DEFAULTS.size,
    radius: CHECKBOX_RADIUS[radius] ? radius : CHECKBOX_DEFAULTS.radius,
    shadow: CHECKBOX_SHADOWS[shadow] ? shadow : CHECKBOX_DEFAULTS.shadow,
    checked,
    indeterminate,
    disabled,
    required,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete checkbox classes based on options.
 *
 * @param {Object} options - Checkbox options.
 * @param {string} [options.variant] - Checkbox variant.
 * @param {string} [options.size] - Checkbox size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.shadow] - Shadow level.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.checked] - Checked state.
 * @param {boolean} [options.indeterminate] - Indeterminate state.
 * @returns {string} Merged checkbox classes.
 */
export function getCheckboxClasses({
  variant = CHECKBOX_DEFAULTS.variant,
  size = CHECKBOX_DEFAULTS.size,
  radius = CHECKBOX_DEFAULTS.radius,
  shadow = CHECKBOX_DEFAULTS.shadow,
  className = '',
  disabled = false,
  checked = false,
  indeterminate = false,
}) {
  const variantConfig = getCheckboxVariant(variant);
  const sizeConfig = getCheckboxSize(size);

  // Determine state for styling.
  let state = 'default';
  if (disabled) state = 'disabled';
  else if (checked) state = 'checked';
  else if (indeterminate) state = 'indeterminate';

  const stateConfig = getCheckboxState(state);

  return mergeClasses(
    'inline-flex items-center justify-center',
    'shrink-0',
    'border-2',
    sizeConfig.box,
    sizeConfig.padding,
    stateConfig.background,
    stateConfig.border,
    stateConfig.text,
    getCheckboxRadius(radius),
    getCheckboxShadow(shadow),
    'transition-all duration-200 ease-in-out',
    disabled && variantConfig.disabled,
    !disabled && variantConfig.hover,
    !disabled && variantConfig.focus,
    className,
  );
}

/**
 * Gets container classes for checkbox wrapper.
 *
 * @param {Object} options - Container options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged container classes.
 */
export function getCheckboxContainerClasses({
  className = '',
  disabled = false,
}) {
  return mergeClasses(
    'inline-flex items-start',
    disabled && 'cursor-not-allowed',
    className,
  );
}

/**
 * Gets label classes for checkbox label.
 *
 * @param {Object} options - Label options.
 * @param {string} [options.size] - Checkbox size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged label classes.
 */
export function getCheckboxLabelClasses({
  size = CHECKBOX_DEFAULTS.size,
  className = '',
  disabled = false,
}) {
  const sizeConfig = getCheckboxSize(size);

  return mergeClasses(
    'font-medium leading-tight',
    sizeConfig.text,
    sizeConfig.gap,
    disabled && 'opacity-50 cursor-not-allowed',
    'select-none',
    className,
  );
}

/**
 * Gets indicator classes for checkbox indicator (icon).
 *
 * @param {Object} options - Indicator options.
 * @param {string} [options.size] - Checkbox size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.checked] - Checked state.
 * @param {boolean} [options.indeterminate] - Indeterminate state.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged indicator classes.
 */
export function getCheckboxIndicatorClasses({
  size = CHECKBOX_DEFAULTS.size,
  className = '',
  checked = false,
  indeterminate = false,
  disabled = false,
}) {
  const sizeConfig = getCheckboxSize(size);
  const iconSize = getCheckboxIconSize(size);

  return mergeClasses(
    'shrink-0',
    iconSize,
    'text-current',
    'transition-all duration-200 ease-in-out',
    !checked && !indeterminate && 'opacity-0 scale-75',
    (checked || indeterminate) && 'opacity-100 scale-100',
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
  return variant ? Object.keys(CHECKBOX_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(CHECKBOX_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(CHECKBOX_RADIUS).includes(radius) : false;
}

/**
 * Validates if a shadow is valid.
 *
 * @param {string} shadow - The shadow to check.
 * @returns {boolean} True if valid.
 */
export function isValidShadow(shadow) {
  return shadow ? Object.keys(CHECKBOX_SHADOWS).includes(shadow) : false;
}

/* ---------------------------------- */
/* State Helpers                      */
/* ---------------------------------- */

/**
 * Determines if a checkbox is interactive.
 *
 * @param {Object} options - Checkbox options.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {boolean} True if interactive.
 */
export function isInteractiveCheckbox({ disabled = false }) {
  return !disabled;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for checkbox components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.label] - Checkbox label.
 * @param {boolean} [state.checked] - Checked state.
 * @param {boolean} [state.indeterminate] - Indeterminate state.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {boolean} [state.required] - Required state.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  label = '',
  checked = false,
  indeterminate = false,
  disabled = false,
  required = false,
}) {
  return {
    getRole: () => 'checkbox',
    getAriaLabel: () => label || 'Checkbox',
    getAriaChecked: () => (indeterminate ? 'mixed' : checked),
    getAriaDisabled: () => disabled || undefined,
    getAriaRequired: () => required || undefined,
    getTabIndex: () => (disabled ? -1 : 0),
  };
}

/* ---------------------------------- */
/* Re-exported Utilities              */
/* ---------------------------------- */

// Re-export token utilities for convenience
export {
  getCheckboxVariant,
  getCheckboxSize,
  getCheckboxRadius,
  getCheckboxShadow,
  getCheckboxState,
  getCheckboxIconSize,
};