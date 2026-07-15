/**
 * KisanO Design System — Spinner Package
 * Spinner Utilities
 *
 * Production-ready utility functions for the Spinner package.
 * Contains only pure utility functions based on the existing spinnerVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for spinner styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Spinner/spinnerUtils
 */

import {
  SPINNER_VARIANTS,
  SPINNER_SIZES,
  SPINNER_SPEEDS,
  SPINNER_ANIMATIONS,
  SPINNER_DEFAULTS,
  getSpinnerVariant,
  getSpinnerSize,
  getSpinnerSpeed,
  getSpinnerAnimation,
} from './spinnerVariants';

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
 * Resolves default props for spinner components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Spinner variant.
 * @param {string} [props.size] - Spinner size.
 * @param {string} [props.speed] - Spinner speed.
 * @param {string} [props.animation] - Animation type.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.loading] - Loading state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = SPINNER_DEFAULTS.variant,
  size = SPINNER_DEFAULTS.size,
  speed = SPINNER_DEFAULTS.speed,
  animation = SPINNER_DEFAULTS.animation,
  disabled = SPINNER_DEFAULTS.disabled,
  loading = SPINNER_DEFAULTS.loading,
}) {
  return {
    variant: SPINNER_VARIANTS[variant] ? variant : SPINNER_DEFAULTS.variant,
    size: SPINNER_SIZES[size] ? size : SPINNER_DEFAULTS.size,
    speed: SPINNER_SPEEDS[speed] ? speed : SPINNER_DEFAULTS.speed,
    animation: SPINNER_ANIMATIONS[animation] ? animation : SPINNER_DEFAULTS.animation,
    disabled,
    loading,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete spinner classes based on options.
 *
 * @param {Object} options - Spinner options.
 * @param {string} [options.variant] - Spinner variant.
 * @param {string} [options.size] - Spinner size.
 * @param {string} [options.speed] - Spinner speed.
 * @param {string} [options.animation] - Animation type.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged spinner classes.
 */
export function getSpinnerClasses({
  variant = SPINNER_DEFAULTS.variant,
  size = SPINNER_DEFAULTS.size,
  speed = SPINNER_DEFAULTS.speed,
  animation = SPINNER_DEFAULTS.animation,
  className = '',
  disabled = false,
  loading = true,
}) {
  const variantConfig = getSpinnerVariant(variant);
  const sizeConfig = getSpinnerSize(size);
  const speedClass = getSpinnerSpeed(speed);
  const animationConfig = getSpinnerAnimation(animation);

  return mergeClasses(
    'inline-block',
    sizeConfig.size,
    variantConfig.color,
    animationConfig.animation,
    speedClass,
    animationConfig.easing,
    disabled && 'opacity-50 cursor-not-allowed',
    !loading && 'hidden',
    className,
  );
}

/**
 * Gets container classes for spinner wrapper.
 *
 * @param {Object} options - Container options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @param {string} [options.orientation] - Orientation.
 * @returns {string} Merged container classes.
 */
export function getSpinnerContainerClasses({
  className = '',
  disabled = false,
  loading = true,
  orientation = 'horizontal',
}) {
  const orientationMap = {
    horizontal: 'flex flex-row',
    vertical: 'flex flex-col',
  };

  return mergeClasses(
    'inline-flex items-center justify-center gap-2',
    orientationMap[orientation] || orientationMap.horizontal,
    disabled && 'opacity-50 cursor-not-allowed',
    !loading && 'hidden',
    className,
  );
}

/**
 * Gets ring spinner classes.
 *
 * @param {Object} options - Ring options.
 * @param {string} [options.variant] - Spinner variant.
 * @param {string} [options.size] - Spinner size.
 * @param {string} [options.speed] - Spinner speed.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @param {number} [options.strokeWidth] - Stroke width.
 * @returns {string} Merged ring spinner classes.
 */
export function getSpinnerRingClasses({
  variant = SPINNER_DEFAULTS.variant,
  size = SPINNER_DEFAULTS.size,
  speed = SPINNER_DEFAULTS.speed,
  className = '',
  disabled = false,
  loading = true,
  strokeWidth = 'stroke-2',
}) {
  const variantConfig = getSpinnerVariant(variant);
  const sizeConfig = getSpinnerSize(size);
  const speedClass = getSpinnerSpeed(speed);

  return mergeClasses(
    'inline-block',
    sizeConfig.size,
    variantConfig.color,
    'animate-spin',
    speedClass,
    'ease-linear',
    disabled && 'opacity-50 cursor-not-allowed',
    !loading && 'hidden',
    className,
  );
}

/**
 * Gets dots spinner classes (for dot-based spinners).
 *
 * @param {Object} options - Dots options.
 * @param {string} [options.variant] - Spinner variant.
 * @param {string} [options.size] - Spinner size.
 * @param {string} [options.speed] - Spinner speed.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @param {number} [options.dotCount] - Number of dots.
 * @returns {string} Merged dots spinner classes.
 */
export function getSpinnerDotsClasses({
  variant = SPINNER_DEFAULTS.variant,
  size = SPINNER_DEFAULTS.size,
  speed = SPINNER_DEFAULTS.speed,
  className = '',
  disabled = false,
  loading = true,
  dotCount = 3,
}) {
  const variantConfig = getSpinnerVariant(variant);
  const sizeConfig = getSpinnerSize(size);
  const speedClass = getSpinnerSpeed(speed);

  const dotSize = sizeConfig.size.replace('h-', '').replace('w-', '');
  const dotClass = `h-${parseInt(dotSize) / 3} w-${parseInt(dotSize) / 3}`;

  return mergeClasses(
    'flex items-center justify-center gap-1',
    disabled && 'opacity-50 cursor-not-allowed',
    !loading && 'hidden',
    className,
  );
}

/**
 * Gets pulse spinner classes (for pulse-based spinners).
 *
 * @param {Object} options - Pulse options.
 * @param {string} [options.variant] - Spinner variant.
 * @param {string} [options.size] - Spinner size.
 * @param {string} [options.speed] - Spinner speed.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @param {number} [options.pulseCount] - Number of pulse rings.
 * @returns {string} Merged pulse spinner classes.
 */
export function getSpinnerPulseClasses({
  variant = SPINNER_DEFAULTS.variant,
  size = SPINNER_DEFAULTS.size,
  speed = SPINNER_DEFAULTS.speed,
  className = '',
  disabled = false,
  loading = true,
  pulseCount = 2,
}) {
  const variantConfig = getSpinnerVariant(variant);
  const sizeConfig = getSpinnerSize(size);
  const speedClass = getSpinnerSpeed(speed);

  const sizeClass = sizeConfig.size;

  return mergeClasses(
    'relative',
    disabled && 'opacity-50 cursor-not-allowed',
    !loading && 'hidden',
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
  return variant ? Object.keys(SPINNER_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(SPINNER_SIZES).includes(size) : false;
}

/**
 * Validates if a speed is valid.
 *
 * @param {string} speed - The speed to check.
 * @returns {boolean} True if valid.
 */
export function isValidSpeed(speed) {
  return speed ? Object.keys(SPINNER_SPEEDS).includes(speed) : false;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for spinner components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.label] - Spinner label.
 * @param {string} [state.role] - ARIA role.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {boolean} [state.loading] - Loading state.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  label = '',
  role = 'status',
  disabled = false,
  loading = true,
}) {
  return {
    getRole: () => role,
    getAriaLabel: () => label || 'Loading',
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
  getSpinnerVariant,
  getSpinnerSize,
  getSpinnerSpeed,
  getSpinnerAnimation,
};