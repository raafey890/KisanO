/**
 * KisanO Design System — Progress Package
 * Progress Utilities
 *
 * Production-ready utility functions for the Progress package.
 * Contains only pure utility functions based on the existing progressVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for progress styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Progress/progressUtils
 */

import {
  PROGRESS_VARIANTS,
  PROGRESS_SIZES,
  PROGRESS_RADIUS,
  PROGRESS_ANIMATIONS,
  PROGRESS_DEFAULTS,
  getProgressVariant,
  getProgressSize,
  getProgressRadius,
  getProgressAnimation,
} from './progressVariants';

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
 * Resolves default props for progress components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Progress variant.
 * @param {string} [props.size] - Progress size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.animation] - Animation type.
 * @param {number} [props.value] - Progress value.
 * @param {number} [props.max] - Maximum value.
 * @param {boolean} [props.showValue] - Show value.
 * @param {boolean} [props.showLabel] - Show label.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.loading] - Loading state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = PROGRESS_DEFAULTS.variant,
  size = PROGRESS_DEFAULTS.size,
  radius = PROGRESS_DEFAULTS.radius,
  animation = PROGRESS_DEFAULTS.animation,
  value = PROGRESS_DEFAULTS.value,
  max = PROGRESS_DEFAULTS.max,
  showValue = PROGRESS_DEFAULTS.showValue,
  showLabel = PROGRESS_DEFAULTS.showLabel,
  disabled = PROGRESS_DEFAULTS.disabled,
  loading = PROGRESS_DEFAULTS.loading,
}) {
  return {
    variant: PROGRESS_VARIANTS[variant] ? variant : PROGRESS_DEFAULTS.variant,
    size: PROGRESS_SIZES[size] ? size : PROGRESS_DEFAULTS.size,
    radius: PROGRESS_RADIUS[radius] ? radius : PROGRESS_DEFAULTS.radius,
    animation: PROGRESS_ANIMATIONS[animation] ? animation : PROGRESS_DEFAULTS.animation,
    value: Math.max(0, Math.min(max, value)),
    max,
    showValue,
    showLabel,
    disabled,
    loading,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete progress classes based on options.
 *
 * @param {Object} options - Progress options.
 * @param {string} [options.variant] - Progress variant.
 * @param {string} [options.size] - Progress size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged progress classes.
 */
export function getProgressClasses({
  variant = PROGRESS_DEFAULTS.variant,
  size = PROGRESS_DEFAULTS.size,
  radius = PROGRESS_DEFAULTS.radius,
  className = '',
  disabled = false,
  loading = false,
}) {
  const variantConfig = getProgressVariant(variant);
  const sizeConfig = getProgressSize(size);

  return mergeClasses(
    'flex flex-col w-full',
    sizeConfig.gap,
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets container classes for progress wrapper.
 *
 * @param {Object} options - Container options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged container classes.
 */
export function getProgressContainerClasses({
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
 * Gets bar classes for progress bar.
 *
 * @param {Object} options - Bar options.
 * @param {string} [options.variant] - Progress variant.
 * @param {string} [options.size] - Progress size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.animation] - Animation type.
 * @param {string} [options.className] - Additional classes.
 * @param {number} [options.value] - Progress value.
 * @param {number} [options.max] - Maximum value.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged bar classes.
 */
export function getProgressBarClasses({
  variant = PROGRESS_DEFAULTS.variant,
  size = PROGRESS_DEFAULTS.size,
  radius = PROGRESS_DEFAULTS.radius,
  animation = PROGRESS_DEFAULTS.animation,
  className = '',
  value = 0,
  max = 100,
  disabled = false,
  loading = false,
}) {
  const variantConfig = getProgressVariant(variant);
  const sizeConfig = getProgressSize(size);
  const animationConfig = getProgressAnimation(animation);
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  return mergeClasses(
    'relative overflow-hidden',
    sizeConfig.height,
    variantConfig.track,
    getProgressRadius(radius),
    animationConfig.transition,
    disabled && 'opacity-50',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets indicator classes for progress indicator.
 *
 * @param {Object} options - Indicator options.
 * @param {string} [options.variant] - Progress variant.
 * @param {string} [options.animation] - Animation type.
 * @param {string} [options.className] - Additional classes.
 * @param {number} [options.value] - Progress value.
 * @param {number} [options.max] - Maximum value.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @param {boolean} [options.indeterminate] - Indeterminate state.
 * @returns {string} Merged indicator classes.
 */
export function getProgressIndicatorClasses({
  variant = PROGRESS_DEFAULTS.variant,
  animation = PROGRESS_DEFAULTS.animation,
  className = '',
  value = 0,
  max = 100,
  disabled = false,
  loading = false,
  indeterminate = false,
}) {
  const variantConfig = getProgressVariant(variant);
  const animationConfig = getProgressAnimation(animation);
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  const widthClass = indeterminate ? 'w-1/2' : `w-[${percentage}%]`;

  return mergeClasses(
    'h-full rounded-inherit',
    variantConfig.indicator,
    animationConfig.animation,
    animationConfig.transition,
    indeterminate && 'animate-progress-indeterminate',
    disabled && 'opacity-50',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets label classes for progress label.
 *
 * @param {Object} options - Label options.
 * @param {string} [options.size] - Progress size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {string} [options.variant] - Progress variant.
 * @returns {string} Merged label classes.
 */
export function getProgressLabelClasses({
  size = PROGRESS_DEFAULTS.size,
  className = '',
  disabled = false,
  variant = PROGRESS_DEFAULTS.variant,
}) {
  const sizeConfig = getProgressSize(size);
  const variantConfig = getProgressVariant(variant);

  return mergeClasses(
    'font-medium',
    sizeConfig.label,
    variantConfig.text,
    disabled && 'opacity-50',
    className,
  );
}

/**
 * Gets value classes for progress value.
 *
 * @param {Object} options - Value options.
 * @param {string} [options.size] - Progress size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {string} [options.variant] - Progress variant.
 * @returns {string} Merged value classes.
 */
export function getProgressValueClasses({
  size = PROGRESS_DEFAULTS.size,
  className = '',
  disabled = false,
  variant = PROGRESS_DEFAULTS.variant,
}) {
  const sizeConfig = getProgressSize(size);
  const variantConfig = getProgressVariant(variant);

  return mergeClasses(
    'font-mono',
    sizeConfig.text,
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
  return variant ? Object.keys(PROGRESS_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(PROGRESS_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(PROGRESS_RADIUS).includes(radius) : false;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for progress components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.label] - Progress label.
 * @param {number} [state.value] - Progress value.
 * @param {number} [state.max] - Maximum value.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {boolean} [state.indeterminate] - Indeterminate state.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  label = '',
  value = 0,
  max = 100,
  disabled = false,
  indeterminate = false,
}) {
  return {
    getRole: () => 'progressbar',
    getAriaLabel: () => label || 'Progress',
    getAriaValuenow: () => (indeterminate ? undefined : value),
    getAriaValuemin: () => 0,
    getAriaValuemax: () => max,
    getAriaDisabled: () => disabled || undefined,
    getAriaBusy: () => indeterminate || undefined,
    getTabIndex: () => (disabled ? -1 : 0),
  };
}

/* ---------------------------------- */
/* Re-exported Utilities              */
/* ---------------------------------- */

// Re-export token utilities for convenience
export {
  getProgressVariant,
  getProgressSize,
  getProgressRadius,
  getProgressAnimation,
};