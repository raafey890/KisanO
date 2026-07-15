/**
 * KisanO Design System — Switch Package
 * Switch Utilities
 *
 * Production-ready utility functions for the Switch package.
 * Contains only pure utility functions based on the existing switchVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for switch styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Switch/switchUtils
 */

import {
  SWITCH_VARIANTS,
  SWITCH_SIZES,
  SWITCH_RADIUS,
  SWITCH_SHADOWS,
  SWITCH_STATES,
  SWITCH_THUMB_SIZES,
  SWITCH_DEFAULTS,
  getSwitchVariant,
  getSwitchSize,
  getSwitchRadius,
  getSwitchShadow,
  getSwitchState,
  getSwitchThumbSize,
} from './switchVariants';

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
 * Resolves default props for switch components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Switch variant.
 * @param {string} [props.size] - Switch size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.shadow] - Shadow level.
 * @param {boolean} [props.checked] - Checked state.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.required] - Required state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = SWITCH_DEFAULTS.variant,
  size = SWITCH_DEFAULTS.size,
  radius = SWITCH_DEFAULTS.radius,
  shadow = SWITCH_DEFAULTS.shadow,
  checked = SWITCH_DEFAULTS.checked,
  disabled = SWITCH_DEFAULTS.disabled,
  required = SWITCH_DEFAULTS.required,
}) {
  return {
    variant: SWITCH_VARIANTS[variant] ? variant : SWITCH_DEFAULTS.variant,
    size: SWITCH_SIZES[size] ? size : SWITCH_DEFAULTS.size,
    radius: SWITCH_RADIUS[radius] ? radius : SWITCH_DEFAULTS.radius,
    shadow: SWITCH_SHADOWS[shadow] ? shadow : SWITCH_DEFAULTS.shadow,
    checked,
    disabled,
    required,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete switch classes based on options.
 *
 * @param {Object} options - Switch options.
 * @param {string} [options.variant] - Switch variant.
 * @param {string} [options.size] - Switch size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.shadow] - Shadow level.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.checked] - Checked state.
 * @returns {string} Merged switch classes.
 */
export function getSwitchClasses({
  variant = SWITCH_DEFAULTS.variant,
  size = SWITCH_DEFAULTS.size,
  radius = SWITCH_DEFAULTS.radius,
  shadow = SWITCH_DEFAULTS.shadow,
  className = '',
  disabled = false,
  checked = false,
}) {
  const variantConfig = getSwitchVariant(variant);
  const sizeConfig = getSwitchSize(size);

  // Determine state for styling.
  let state = 'default';
  if (disabled) state = 'disabled';
  else if (checked) state = 'checked';

  const stateConfig = getSwitchState(state);

  return mergeClasses(
    'relative inline-flex shrink-0 items-center',
    'border-2 border-transparent',
    'cursor-pointer',
    sizeConfig.switch,
    getSwitchRadius(radius),
    getSwitchShadow(shadow),
    'transition-colors duration-200 ease-in-out',
    stateConfig.track,
    disabled && 'cursor-not-allowed opacity-50',
    !disabled && variantConfig.track.hover,
    !disabled && variantConfig.track.focus,
    className,
  );
}

/**
 * Gets container classes for switch wrapper.
 *
 * @param {Object} options - Container options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged container classes.
 */
export function getSwitchContainerClasses({
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
 * Gets thumb classes for switch thumb.
 *
 * @param {Object} options - Thumb options.
 * @param {string} [options.size] - Switch size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.checked] - Checked state.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {string} [options.variant] - Switch variant.
 * @returns {string} Merged thumb classes.
 */
export function getSwitchThumbClasses({
  size = SWITCH_DEFAULTS.size,
  className = '',
  checked = false,
  disabled = false,
  variant = SWITCH_DEFAULTS.variant,
}) {
  const sizeConfig = getSwitchSize(size);
  const variantConfig = getSwitchVariant(variant);

  return mergeClasses(
    'inline-block',
    'rounded-full',
    sizeConfig.thumb,
    getSwitchThumbSize(size),
    checked ? sizeConfig.translate : 'translate-x-0',
    'transition-transform duration-200 ease-in-out',
    'shadow-sm',
    variantConfig.thumb.background,
    checked && variantConfig.thumb.checked,
    disabled && variantConfig.thumb.disabled,
    className,
  );
}

/**
 * Gets label classes for switch label.
 *
 * @param {Object} options - Label options.
 * @param {string} [options.size] - Switch size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged label classes.
 */
export function getSwitchLabelClasses({
  size = SWITCH_DEFAULTS.size,
  className = '',
  disabled = false,
}) {
  const sizeConfig = getSwitchSize(size);

  return mergeClasses(
    'font-medium leading-tight',
    sizeConfig.text,
    sizeConfig.gap,
    disabled && 'opacity-50 cursor-not-allowed',
    'select-none',
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
  return variant ? Object.keys(SWITCH_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(SWITCH_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(SWITCH_RADIUS).includes(radius) : false;
}

/**
 * Validates if a shadow is valid.
 *
 * @param {string} shadow - The shadow to check.
 * @returns {boolean} True if valid.
 */
export function isValidShadow(shadow) {
  return shadow ? Object.keys(SWITCH_SHADOWS).includes(shadow) : false;
}

/* ---------------------------------- */
/* State Helpers                      */
/* ---------------------------------- */

/**
 * Determines if a switch is interactive.
 *
 * @param {Object} options - Switch options.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {boolean} True if interactive.
 */
export function isInteractiveSwitch({ disabled = false }) {
  return !disabled;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for switch components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.label] - Switch label.
 * @param {boolean} [state.checked] - Checked state.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {boolean} [state.required] - Required state.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  label = '',
  checked = false,
  disabled = false,
  required = false,
}) {
  return {
    getRole: () => 'switch',
    getAriaLabel: () => label || 'Switch',
    getAriaChecked: () => checked,
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
  getSwitchVariant,
  getSwitchSize,
  getSwitchRadius,
  getSwitchShadow,
  getSwitchState,
  getSwitchThumbSize,
};