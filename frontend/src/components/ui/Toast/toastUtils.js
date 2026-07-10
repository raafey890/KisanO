/**
 * KisanO Design System — Toast Package
 * Toast Utilities
 *
 * Production-ready utility functions for the Toast package.
 * Contains only pure utility functions based on the existing toastVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for toast styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Toast/toastUtils
 */

import {
  TOAST_VARIANTS,
  TOAST_SIZES,
  TOAST_RADIUS,
  TOAST_SHADOWS,
  TOAST_POSITIONS,
  TOAST_DEFAULTS,
  getToastVariant,
  getToastSize,
  getToastRadius,
  getToastShadow,
  getToastPosition,
  getToastProgressHeight,
} from './toastVariants';

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
 * Resolves default props for toast components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Toast variant.
 * @param {string} [props.size] - Toast size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.shadow] - Shadow level.
 * @param {string} [props.position] - Toast position.
 * @param {number} [props.duration] - Auto-close duration.
 * @param {boolean} [props.progress] - Show progress bar.
 * @param {boolean} [props.closeButton] - Show close button.
 * @param {boolean} [props.pauseOnHover] - Pause on hover.
 * @param {boolean} [props.pauseOnFocus] - Pause on focus.
 * @param {string} [props.animation] - Animation type.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.loading] - Loading state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = TOAST_DEFAULTS.variant,
  size = TOAST_DEFAULTS.size,
  radius = TOAST_DEFAULTS.radius,
  shadow = TOAST_DEFAULTS.shadow,
  position = TOAST_DEFAULTS.position,
  duration = TOAST_DEFAULTS.duration,
  progress = TOAST_DEFAULTS.progress,
  closeButton = TOAST_DEFAULTS.closeButton,
  pauseOnHover = TOAST_DEFAULTS.pauseOnHover,
  pauseOnFocus = TOAST_DEFAULTS.pauseOnFocus,
  animation = TOAST_DEFAULTS.animation,
  disabled = TOAST_DEFAULTS.disabled,
  loading = TOAST_DEFAULTS.loading,
}) {
  return {
    variant: TOAST_VARIANTS[variant] ? variant : TOAST_DEFAULTS.variant,
    size: TOAST_SIZES[size] ? size : TOAST_DEFAULTS.size,
    radius: TOAST_RADIUS[radius] ? radius : TOAST_DEFAULTS.radius,
    shadow: TOAST_SHADOWS[shadow] ? shadow : TOAST_DEFAULTS.shadow,
    position: TOAST_POSITIONS[position] ? position : TOAST_DEFAULTS.position,
    duration,
    progress,
    closeButton,
    pauseOnHover,
    pauseOnFocus,
    animation,
    disabled,
    loading,
  };
}

/**
 * Gets complete toast classes based on props.
 *
 * @param {Object} options - Toast options.
 * @param {string} [options.variant] - Toast variant.
 * @param {string} [options.size] - Toast size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.shadow] - Shadow level.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged toast classes.
 */
export function getToastClasses({
  variant = TOAST_DEFAULTS.variant,
  size = TOAST_DEFAULTS.size,
  radius = TOAST_DEFAULTS.radius,
  shadow = TOAST_DEFAULTS.shadow,
  className = '',
  disabled = false,
  loading = false,
}) {
  const variantConfig = getToastVariant(variant);
  const sizeConfig = getToastSize(size);

  return mergeClasses(
    'relative flex items-start w-full max-w-sm',
    variantConfig.background,
    variantConfig.border,
    variantConfig.text,
    sizeConfig.padding,
    sizeConfig.gap,
    getToastRadius(radius),
    getToastShadow(shadow),
    'border',
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets container position classes for toast container.
 *
 * @param {string} position - Toast position.
 * @param {string} [className] - Additional classes.
 * @returns {string} Merged position classes.
 */
export function getContainerPositionClasses(position = TOAST_DEFAULTS.position, className = '') {
  return mergeClasses(
    'fixed z-50 flex flex-col',
    getToastPosition(position),
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
  return variant ? Object.keys(TOAST_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(TOAST_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(TOAST_RADIUS).includes(radius) : false;
}

/**
 * Validates if a shadow is valid.
 *
 * @param {string} shadow - The shadow to check.
 * @returns {boolean} True if valid.
 */
export function isValidShadow(shadow) {
  return shadow ? Object.keys(TOAST_SHADOWS).includes(shadow) : false;
}

/**
 * Validates if a position is valid.
 *
 * @param {string} position - The position to check.
 * @returns {boolean} True if valid.
 */
export function isValidPosition(position) {
  return position ? Object.keys(TOAST_POSITIONS).includes(position) : false;
}

/* ---------------------------------- */
/* Interactive State Utilities        */
/* ---------------------------------- */

/**
 * Determines if a toast is interactive.
 *
 * @param {Object} options - Toast options.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {boolean} True if interactive.
 */
export function isInteractiveToast({ disabled = false, loading = false }) {
  return !disabled && !loading;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for toast components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.variant] - Toast variant.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {boolean} [state.loading] - Loading state.
 * @param {boolean} [state.open] - Open state.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  variant = TOAST_DEFAULTS.variant,
  disabled = false,
  loading = false,
  open = true,
}) {
  const getAriaLive = () => {
    if (variant === 'error') return 'assertive';
    if (variant === 'warning') return 'assertive';
    return 'polite';
  };

  return {
    getRole: () => 'alert',
    getAriaLive: getAriaLive,
    getAriaAtomic: () => true,
    getAriaDisabled: () => disabled || undefined,
    getAriaBusy: () => loading || undefined,
    getAriaHidden: () => !open || undefined,
    getTabIndex: () => (disabled ? -1 : 0),
  };
}

/* ---------------------------------- */
/* Re-exported Utilities              */
/* ---------------------------------- */

// Re-export token utilities for convenience
export {
  getToastVariant,
  getToastSize,
  getToastRadius,
  getToastShadow,
  getToastPosition,
  getToastProgressHeight,
};