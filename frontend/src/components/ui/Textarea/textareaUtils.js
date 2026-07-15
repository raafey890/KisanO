/**
 * KisanO Design System — Textarea Package
 * Textarea Utilities
 *
 * Production-ready utility functions for the Textarea package.
 * Contains only pure utility functions based on the existing textareaVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for textarea styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Textarea/textareaUtils
 */

import {
  TEXTAREA_VARIANTS,
  TEXTAREA_SIZES,
  TEXTAREA_RADIUS,
  TEXTAREA_SHADOWS,
  TEXTAREA_STATES,
  TEXTAREA_RESIZE_OPTIONS,
  TEXTAREA_DEFAULTS,
  getTextareaVariant,
  getTextareaSize,
  getTextareaRadius,
  getTextareaShadow,
  getTextareaState,
  getTextareaResize,
} from './textareaVariants';

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
 * Resolves default props for textarea components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Textarea variant.
 * @param {string} [props.size] - Textarea size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.shadow] - Shadow level.
 * @param {string} [props.resize] - Resize behavior.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.required] - Required state.
 * @param {number} [props.rows] - Number of rows.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = TEXTAREA_DEFAULTS.variant,
  size = TEXTAREA_DEFAULTS.size,
  radius = TEXTAREA_DEFAULTS.radius,
  shadow = TEXTAREA_DEFAULTS.shadow,
  resize = TEXTAREA_DEFAULTS.resize,
  disabled = TEXTAREA_DEFAULTS.disabled,
  required = TEXTAREA_DEFAULTS.required,
  rows = TEXTAREA_DEFAULTS.rows,
}) {
  return {
    variant: TEXTAREA_VARIANTS[variant] ? variant : TEXTAREA_DEFAULTS.variant,
    size: TEXTAREA_SIZES[size] ? size : TEXTAREA_DEFAULTS.size,
    radius: TEXTAREA_RADIUS[radius] ? radius : TEXTAREA_DEFAULTS.radius,
    shadow: TEXTAREA_SHADOWS[shadow] ? shadow : TEXTAREA_DEFAULTS.shadow,
    resize: TEXTAREA_RESIZE_OPTIONS[resize] ? resize : TEXTAREA_DEFAULTS.resize,
    disabled,
    required,
    rows,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete textarea classes based on options.
 *
 * @param {Object} options - Textarea options.
 * @param {string} [options.variant] - Textarea variant.
 * @param {string} [options.size] - Textarea size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.shadow] - Shadow level.
 * @param {string} [options.resize] - Resize behavior.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.readOnly] - Read-only state.
 * @param {string} [options.state] - State for styling.
 * @returns {string} Merged textarea classes.
 */
export function getTextareaClasses({
  variant = TEXTAREA_DEFAULTS.variant,
  size = TEXTAREA_DEFAULTS.size,
  radius = TEXTAREA_DEFAULTS.radius,
  shadow = TEXTAREA_DEFAULTS.shadow,
  resize = TEXTAREA_DEFAULTS.resize,
  className = '',
  disabled = false,
  readOnly = false,
  state = 'default',
}) {
  const variantConfig = getTextareaVariant(variant);
  const sizeConfig = getTextareaSize(size);
  const stateConfig = getTextareaState(state);

  return mergeClasses(
    'w-full',
    sizeConfig.padding,
    sizeConfig.text,
    sizeConfig.minHeight,
    variantConfig.background,
    variantConfig.text,
    variantConfig.border,
    variantConfig.placeholder,
    getTextareaRadius(radius),
    getTextareaShadow(shadow),
    getTextareaResize(resize),
    stateConfig.background,
    stateConfig.border,
    stateConfig.text,
    'transition-all duration-200 ease-in-out',
    'focus:outline-none',
    disabled && variantConfig.disabled,
    readOnly && 'cursor-default',
    className,
  );
}

/**
 * Gets container classes for textarea wrapper.
 *
 * @param {Object} options - Container options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged container classes.
 */
export function getTextareaContainerClasses({
  className = '',
  disabled = false,
  loading = false,
}) {
  return mergeClasses(
    'flex flex-col w-full',
    disabled && 'cursor-not-allowed',
    loading && 'opacity-70 cursor-progress',
    className,
  );
}

/**
 * Gets label classes for textarea label.
 *
 * @param {Object} options - Label options.
 * @param {string} [options.size] - Textarea size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.error] - Error state.
 * @param {boolean} [options.success] - Success state.
 * @param {boolean} [options.warning] - Warning state.
 * @param {boolean} [options.required] - Required state.
 * @returns {string} Merged label classes.
 */
export function getTextareaLabelClasses({
  size = TEXTAREA_DEFAULTS.size,
  className = '',
  disabled = false,
  error = false,
  success = false,
  warning = false,
  required = false,
}) {
  const sizeConfig = getTextareaSize(size);

  // Determine text color based on state.
  let textColor = 'text-gray-700';
  if (error) textColor = 'text-red-600';
  else if (success) textColor = 'text-green-600';
  else if (warning) textColor = 'text-yellow-600';
  else if (disabled) textColor = 'text-gray-400';

  return mergeClasses(
    'block font-medium',
    sizeConfig.text,
    textColor,
    'mb-1.5',
    disabled && 'cursor-not-allowed',
    className,
  );
}

/**
 * Gets counter classes for textarea character counter.
 *
 * @param {Object} options - Counter options.
 * @param {string} [options.size] - Textarea size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.error] - Error state.
 * @param {boolean} [options.warning] - Warning state.
 * @returns {string} Merged counter classes.
 */
export function getTextareaCounterClasses({
  size = TEXTAREA_DEFAULTS.size,
  className = '',
  error = false,
  warning = false,
}) {
  const sizeConfig = getTextareaSize(size);

  // Determine text color based on state.
  let textColor = 'text-gray-500';
  if (error) textColor = 'text-red-600';
  else if (warning) textColor = 'text-yellow-600';

  return mergeClasses(
    'shrink-0 font-mono',
    sizeConfig.text,
    textColor,
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
  return variant ? Object.keys(TEXTAREA_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(TEXTAREA_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(TEXTAREA_RADIUS).includes(radius) : false;
}

/**
 * Validates if a shadow is valid.
 *
 * @param {string} shadow - The shadow to check.
 * @returns {boolean} True if valid.
 */
export function isValidShadow(shadow) {
  return shadow ? Object.keys(TEXTAREA_SHADOWS).includes(shadow) : false;
}

/**
 * Validates if a resize option is valid.
 *
 * @param {string} resize - The resize option to check.
 * @returns {boolean} True if valid.
 */
export function isValidResize(resize) {
  return resize ? Object.keys(TEXTAREA_RESIZE_OPTIONS).includes(resize) : false;
}

/* ---------------------------------- */
/* State Helpers                      */
/* ---------------------------------- */

/**
 * Determines if a textarea is interactive.
 *
 * @param {Object} options - Textarea options.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.readOnly] - Read-only state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {boolean} True if interactive.
 */
export function isInteractiveTextarea({ disabled = false, readOnly = false, loading = false }) {
  return !disabled && !readOnly && !loading;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for textarea components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.label] - Textarea label.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {boolean} [state.readOnly] - Read-only state.
 * @param {boolean} [state.required] - Required state.
 * @param {boolean} [state.error] - Error state.
 * @param {string} [state.helperId] - Helper text ID.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  label = '',
  disabled = false,
  readOnly = false,
  required = false,
  error = false,
  helperId = '',
}) {
  return {
    getRole: () => 'textbox',
    getAriaLabel: () => label || 'Textarea',
    getAriaDisabled: () => disabled || undefined,
    getAriaReadOnly: () => readOnly || undefined,
    getAriaRequired: () => required || undefined,
    getAriaInvalid: () => error || undefined,
    getAriaDescribedBy: () => helperId || undefined,
    getTabIndex: () => (disabled ? -1 : 0),
  };
}

/* ---------------------------------- */
/* Re-exported Utilities              */
/* ---------------------------------- */

// Re-export token utilities for convenience
export {
  getTextareaVariant,
  getTextareaSize,
  getTextareaRadius,
  getTextareaShadow,
  getTextareaState,
  getTextareaResize,
};