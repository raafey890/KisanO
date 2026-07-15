/**
 * KisanO Design System — Radio Package
 * Radio Utilities
 *
 * Production-ready utility functions for the Radio package.
 * Contains only pure utility functions based on the existing radioVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for radio styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Radio/radioUtils
 */

import {
  RADIO_VARIANTS,
  RADIO_SIZES,
  RADIO_RADIUS,
  RADIO_SHADOWS,
  RADIO_STATES,
  RADIO_INDICATOR_SIZES,
  RADIO_DEFAULTS,
  getRadioVariant,
  getRadioSize,
  getRadioRadius,
  getRadioShadow,
  getRadioState,
  getRadioIndicatorSize,
} from './radioVariants';

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
 * Resolves default props for radio components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Radio variant.
 * @param {string} [props.size] - Radio size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.shadow] - Shadow level.
 * @param {boolean} [props.checked] - Checked state.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.required] - Required state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = RADIO_DEFAULTS.variant,
  size = RADIO_DEFAULTS.size,
  radius = RADIO_DEFAULTS.radius,
  shadow = RADIO_DEFAULTS.shadow,
  checked = RADIO_DEFAULTS.checked,
  disabled = RADIO_DEFAULTS.disabled,
  required = RADIO_DEFAULTS.required,
}) {
  return {
    variant: RADIO_VARIANTS[variant] ? variant : RADIO_DEFAULTS.variant,
    size: RADIO_SIZES[size] ? size : RADIO_DEFAULTS.size,
    radius: RADIO_RADIUS[radius] ? radius : RADIO_DEFAULTS.radius,
    shadow: RADIO_SHADOWS[shadow] ? shadow : RADIO_DEFAULTS.shadow,
    checked,
    disabled,
    required,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete radio classes based on options.
 *
 * @param {Object} options - Radio options.
 * @param {string} [options.variant] - Radio variant.
 * @param {string} [options.size] - Radio size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.shadow] - Shadow level.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.checked] - Checked state.
 * @returns {string} Merged radio classes.
 */
export function getRadioClasses({
  variant = RADIO_DEFAULTS.variant,
  size = RADIO_DEFAULTS.size,
  radius = RADIO_DEFAULTS.radius,
  shadow = RADIO_DEFAULTS.shadow,
  className = '',
  disabled = false,
  checked = false,
}) {
  const variantConfig = getRadioVariant(variant);
  const sizeConfig = getRadioSize(size);

  // Determine state for styling.
  let state = 'default';
  if (disabled) state = 'disabled';
  else if (checked) state = 'checked';

  const stateConfig = getRadioState(state);

  return mergeClasses(
    'inline-flex items-center justify-center',
    'shrink-0',
    'border-2',
    sizeConfig.radio,
    sizeConfig.padding,
    stateConfig.background,
    stateConfig.border,
    stateConfig.text,
    getRadioRadius(radius),
    getRadioShadow(shadow),
    'transition-all duration-200 ease-in-out',
    disabled && variantConfig.disabled,
    !disabled && variantConfig.hover,
    !disabled && variantConfig.focus,
    className,
  );
}

/**
 * Gets container classes for radio wrapper.
 *
 * @param {Object} options - Container options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged container classes.
 */
export function getRadioContainerClasses({
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
 * Gets label classes for radio label.
 *
 * @param {Object} options - Label options.
 * @param {string} [options.size] - Radio size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged label classes.
 */
export function getRadioLabelClasses({
  size = RADIO_DEFAULTS.size,
  className = '',
  disabled = false,
}) {
  const sizeConfig = getRadioSize(size);

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
 * Gets indicator classes for radio indicator (dot).
 *
 * @param {Object} options - Indicator options.
 * @param {string} [options.size] - Radio size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.checked] - Checked state.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged indicator classes.
 */
export function getRadioIndicatorClasses({
  size = RADIO_DEFAULTS.size,
  className = '',
  checked = false,
  disabled = false,
}) {
  const sizeConfig = getRadioSize(size);
  const indicatorSize = getRadioIndicatorSize(size);

  return mergeClasses(
    'shrink-0 rounded-full',
    indicatorSize,
    'bg-current',
    'transition-all duration-200 ease-in-out',
    !checked && 'opacity-0 scale-50',
    checked && 'opacity-100 scale-100',
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
  return variant ? Object.keys(RADIO_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(RADIO_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(RADIO_RADIUS).includes(radius) : false;
}

/**
 * Validates if a shadow is valid.
 *
 * @param {string} shadow - The shadow to check.
 * @returns {boolean} True if valid.
 */
export function isValidShadow(shadow) {
  return shadow ? Object.keys(RADIO_SHADOWS).includes(shadow) : false;
}

/* ---------------------------------- */
/* State Helpers                      */
/* ---------------------------------- */

/**
 * Determines if a radio is interactive.
 *
 * @param {Object} options - Radio options.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {boolean} True if interactive.
 */
export function isInteractiveRadio({ disabled = false }) {
  return !disabled;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for radio components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.label] - Radio label.
 * @param {boolean} [state.checked] - Checked state.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {boolean} [state.required] - Required state.
 * @param {string} [state.name] - Radio group name.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  label = '',
  checked = false,
  disabled = false,
  required = false,
  name = '',
}) {
  return {
    getRole: () => 'radio',
    getAriaLabel: () => label || 'Radio',
    getAriaChecked: () => checked,
    getAriaDisabled: () => disabled || undefined,
    getAriaRequired: () => required || undefined,
    getAriaName: () => name || undefined,
    getTabIndex: () => (disabled ? -1 : 0),
  };
}

/* ---------------------------------- */
/* Re-exported Utilities              */
/* ---------------------------------- */

// Re-export token utilities for convenience
export {
  getRadioVariant,
  getRadioSize,
  getRadioRadius,
  getRadioShadow,
  getRadioState,
  getRadioIndicatorSize,
};