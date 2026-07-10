/**
 * KisanO Design System — Modal Package
 * Modal Utilities
 *
 * Production-ready utility functions for the Modal package.
 * Contains only pure utility functions based on the existing modalVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for modal styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Modal/modalUtils
 */

import {
  MODAL_VARIANTS,
  MODAL_SIZES,
  MODAL_RADIUS,
  MODAL_SHADOWS,
  MODAL_OVERLAY_VARIANTS,
  MODAL_DEFAULTS,
  
} from './modalVariants';

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
 * Resolves default props for modal components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Modal variant.
 * @param {string} [props.size] - Modal size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.shadow] - Shadow level.
 * @param {boolean} [props.centered] - Centered modal.
 * @param {boolean} [props.fullscreen] - Fullscreen modal.
 * @param {boolean} [props.scrollable] - Scrollable modal.
 * @param {boolean} [props.closeOnOverlayClick] - Close on overlay click.
 * @param {boolean} [props.closeOnEscape] - Close on Escape key.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.loading] - Loading state.
 * @param {boolean} [props.animation] - Animation enabled.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = MODAL_DEFAULTS.variant,
  size = MODAL_DEFAULTS.size,
  radius = MODAL_DEFAULTS.radius,
  shadow = MODAL_DEFAULTS.shadow,
  centered = MODAL_DEFAULTS.centered,
  fullscreen = MODAL_DEFAULTS.fullscreen,
  scrollable = MODAL_DEFAULTS.scrollable,
  closeOnOverlayClick = MODAL_DEFAULTS.closeOnOverlayClick,
  closeOnEscape = MODAL_DEFAULTS.closeOnEscape,
  disabled = MODAL_DEFAULTS.disabled,
  loading = MODAL_DEFAULTS.loading,
  animation = MODAL_DEFAULTS.animation,
}) {
  return {
    variant: MODAL_VARIANTS[variant] ? variant : MODAL_DEFAULTS.variant,
    size: MODAL_SIZES[size] ? size : MODAL_DEFAULTS.size,
    radius: MODAL_RADIUS[radius] ? radius : MODAL_DEFAULTS.radius,
    shadow: MODAL_SHADOWS[shadow] ? shadow : MODAL_DEFAULTS.shadow,
    centered,
    fullscreen,
    scrollable,
    closeOnOverlayClick,
    closeOnEscape,
    disabled,
    loading,
    animation,
  };
}

/**
 * Gets complete modal classes based on props.
 *
 * @param {Object} options - Modal options.
 * @param {string} [options.variant] - Modal variant.
 * @param {string} [options.size] - Modal size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.shadow] - Shadow level.
 * @param {string} [options.className] - Additional classes.
 * @returns {string} Merged modal classes.
 */
export function getModalSizeClasses(size) {
  return MODAL_SIZES[size] || MODAL_SIZES[MODAL_DEFAULTS.size];
}

export function getModalVariantClasses(variant) {
  const config = MODAL_VARIANTS[variant] || MODAL_VARIANTS[MODAL_DEFAULTS.variant];
  return `${config.background} ${config.border} ${config.shadow} ${config.text}`;
}

export function getModalRadiusClasses(radius) {
  return MODAL_RADIUS[radius] || MODAL_RADIUS[MODAL_DEFAULTS.radius];
}

export function getModalShadowClasses(shadow) {
  return MODAL_SHADOWS[shadow] || MODAL_SHADOWS[MODAL_DEFAULTS.shadow];
}

export function getModalOverlayClasses(variant) {
  return MODAL_OVERLAY_VARIANTS[variant] || MODAL_OVERLAY_VARIANTS.default;
}

export function getModalClasses({
  variant = MODAL_DEFAULTS.variant,
  size = MODAL_DEFAULTS.size,
  radius = MODAL_DEFAULTS.radius,
  shadow = MODAL_DEFAULTS.shadow,
  className = '',
}) {
  return mergeClasses(
    getModalVariantClasses(variant),
    getModalRadiusClasses(radius),
    getModalShadowClasses(shadow),
    getModalSizeClasses(size),
    className,
  );
}

/**
 * Gets overlay classes based on variant.
 *
 * @param {string} [variant] - Overlay variant.
 * @param {string} [className] - Additional classes.
 * @returns {string} Merged overlay classes.
 */
export function getOverlayClasses(variant = 'default', className = '') {
  return mergeClasses(
    'fixed inset-0 z-40',
    getModalOverlayClasses(variant),
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
  return variant ? Object.keys(MODAL_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(MODAL_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(MODAL_RADIUS).includes(radius) : false;
}

/**
 * Validates if a shadow is valid.
 *
 * @param {string} shadow - The shadow to check.
 * @returns {boolean} True if valid.
 */
export function isValidShadow(shadow) {
  return shadow ? Object.keys(MODAL_SHADOWS).includes(shadow) : false;
}

/**
 * Validates if an overlay variant is valid.
 *
 * @param {string} variant - The overlay variant to check.
 * @returns {boolean} True if valid.
 */
export function isValidOverlayVariant(variant) {
  return variant ? Object.keys(MODAL_OVERLAY_VARIANTS).includes(variant) : false;
}

/* ---------------------------------- */
/* Interactive State Utilities        */
/* ---------------------------------- */

/**
 * Determines if a modal is interactive.
 *
 * @param {Object} options - Modal options.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {boolean} True if interactive.
 */
export function isInteractiveModal({ disabled = false, loading = false }) {
  return !disabled && !loading;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for modal components.
 *
 * @param {Object} state - Component state.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {boolean} [state.loading] - Loading state.
 * @param {boolean} [state.open] - Open state.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({ disabled = false, loading = false, open = false }) {
  return {
    getRole: () => 'dialog',
    getAriaModal: () => true,
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
