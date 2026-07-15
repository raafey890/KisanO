/**
 * KisanO Design System — Alert Package
 * Alert Utilities
 *
 * Production-ready utility functions for the Alert package.
 * Contains only pure utility functions based on the existing alertVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for alert styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Alert/alertUtils
 */

import {
  ALERT_VARIANTS,
  ALERT_SIZES,
  ALERT_RADIUS,
  ALERT_SHADOWS,
  ALERT_ANIMATIONS,
  ALERT_DEFAULTS,
  getAlertVariant,
  getAlertSize,
  getAlertRadius,
  getAlertShadow,
  getAlertIcon,
  getAlertAnimation,
} from './alertVariants';

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
 * Resolves default props for alert components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Alert variant.
 * @param {string} [props.size] - Alert size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.shadow] - Shadow level.
 * @param {string} [props.animation] - Animation type.
 * @param {boolean} [props.closeable] - Show close button.
 * @param {boolean} [props.dismissible] - Dismissible alert.
 * @param {boolean} [props.autoClose] - Auto close.
 * @param {number} [props.duration] - Auto close duration.
 * @param {boolean} [props.showIcon] - Show icon.
 * @param {boolean} [props.loading] - Loading state.
 * @param {boolean} [props.disabled] - Disabled state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = ALERT_DEFAULTS.variant,
  size = ALERT_DEFAULTS.size,
  radius = ALERT_DEFAULTS.radius,
  shadow = ALERT_DEFAULTS.shadow,
  animation = ALERT_DEFAULTS.animation,
  closeable = ALERT_DEFAULTS.closeable,
  dismissible = ALERT_DEFAULTS.dismissible,
  autoClose = ALERT_DEFAULTS.autoClose,
  duration = ALERT_DEFAULTS.duration,
  showIcon = ALERT_DEFAULTS.showIcon,
  loading = ALERT_DEFAULTS.loading,
  disabled = ALERT_DEFAULTS.disabled,
}) {
  return {
    variant: ALERT_VARIANTS[variant] ? variant : ALERT_DEFAULTS.variant,
    size: ALERT_SIZES[size] ? size : ALERT_DEFAULTS.size,
    radius: ALERT_RADIUS[radius] ? radius : ALERT_DEFAULTS.radius,
    shadow: ALERT_SHADOWS[shadow] ? shadow : ALERT_DEFAULTS.shadow,
    animation: ALERT_ANIMATIONS[animation] ? animation : ALERT_DEFAULTS.animation,
    closeable,
    dismissible,
    autoClose,
    duration,
    showIcon,
    loading,
    disabled,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete alert classes based on options.
 *
 * @param {Object} options - Alert options.
 * @param {string} [options.variant] - Alert variant.
 * @param {string} [options.size] - Alert size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.shadow] - Shadow level.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged alert classes.
 */
export function getAlertClasses({
  variant = ALERT_DEFAULTS.variant,
  size = ALERT_DEFAULTS.size,
  radius = ALERT_DEFAULTS.radius,
  shadow = ALERT_DEFAULTS.shadow,
  className = '',
  disabled = false,
  loading = false,
}) {
  const variantConfig = getAlertVariant(variant);
  const sizeConfig = getAlertSize(size);

  return mergeClasses(
    'relative flex items-start w-full',
    sizeConfig.padding,
    sizeConfig.gap,
    variantConfig.background,
    variantConfig.text,
    variantConfig.border,
    getAlertRadius(radius),
    getAlertShadow(shadow),
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70 cursor-progress',
    className,
  );
}

/**
 * Gets container classes for alert wrapper.
 *
 * @param {string} [className] - Additional classes.
 * @returns {string} Merged container classes.
 */
export function getAlertContainerClasses(className = '') {
  return mergeClasses(
    'w-full',
    className,
  );
}

/**
 * Gets header classes for alert header.
 *
 * @param {Object} options - Header options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged header classes.
 */
export function getAlertHeaderClasses({
  className = '',
  disabled = false,
}) {
  return mergeClasses(
    'flex-1 min-w-0',
    disabled && 'opacity-50',
    className,
  );
}

/**
 * Gets body classes for alert body.
 *
 * @param {Object} options - Body options.
 * @param {string} [options.size] - Alert size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged body classes.
 */
export function getAlertBodyClasses({
  size = ALERT_DEFAULTS.size,
  className = '',
  disabled = false,
}) {
  const sizeConfig = getAlertSize(size);

  return mergeClasses(
    'flex flex-col',
    sizeConfig.gap,
    disabled && 'opacity-50',
    className,
  );
}

/**
 * Gets actions classes for alert actions.
 *
 * @param {Object} options - Actions options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged actions classes.
 */
export function getAlertActionsClasses({
  className = '',
  disabled = false,
}) {
  return mergeClasses(
    'flex items-center gap-2 mt-2',
    disabled && 'opacity-50',
    className,
  );
}

/**
 * Gets icon classes for alert icon.
 *
 * @param {Object} options - Icon options.
 * @param {string} [options.variant] - Alert variant.
 * @param {string} [options.size] - Alert size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged icon classes.
 */
export function getAlertIconClasses({
  variant = ALERT_DEFAULTS.variant,
  size = ALERT_DEFAULTS.size,
  className = '',
  disabled = false,
}) {
  const variantConfig = getAlertVariant(variant);
  const sizeConfig = getAlertSize(size);

  return mergeClasses(
    'shrink-0',
    sizeConfig.icon,
    variantConfig.icon,
    disabled && 'opacity-50',
    className,
  );
}

/**
 * Gets close button classes for alert close button.
 *
 * @param {Object} options - Close button options.
 * @param {string} [options.size] - Alert size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged close button classes.
 */
export function getAlertCloseButtonClasses({
  size = ALERT_DEFAULTS.size,
  className = '',
  disabled = false,
}) {
  const sizeConfig = getAlertSize(size);

  return mergeClasses(
    'inline-flex items-center justify-center',
    'rounded-full',
    'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
    'focus:outline-none focus:ring-2 focus:ring-blue-500',
    'transition-colors duration-200',
    'shrink-0',
    disabled && 'opacity-50 cursor-not-allowed',
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
  return variant ? Object.keys(ALERT_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(ALERT_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(ALERT_RADIUS).includes(radius) : false;
}

/**
 * Validates if a shadow is valid.
 *
 * @param {string} shadow - The shadow to check.
 * @returns {boolean} True if valid.
 */
export function isValidShadow(shadow) {
  return shadow ? Object.keys(ALERT_SHADOWS).includes(shadow) : false;
}

/**
 * Validates if an animation is valid.
 *
 * @param {string} animation - The animation to check.
 * @returns {boolean} True if valid.
 */
export function isValidAnimation(animation) {
  return animation ? Object.keys(ALERT_ANIMATIONS).includes(animation) : false;
}

/* ---------------------------------- */
/* State Helpers                      */
/* ---------------------------------- */

/**
 * Determines if an alert is interactive.
 *
 * @param {Object} options - Alert options.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {boolean} True if interactive.
 */
export function isInteractiveAlert({ disabled = false, loading = false }) {
  return !disabled && !loading;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for alert components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.title] - Alert title.
 * @param {string} [state.message] - Alert message.
 * @param {string} [state.variant] - Alert variant.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {boolean} [state.loading] - Loading state.
 * @param {boolean} [state.open] - Open state.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  title = '',
  message = '',
  variant = ALERT_DEFAULTS.variant,
  disabled = false,
  loading = false,
  open = true,
}) {
  const getRole = () => {
    if (variant === 'error') return 'alert';
    if (variant === 'warning') return 'alert';
    return 'status';
  };

  return {
    getRole,
    getAriaLive: () => (variant === 'error' || variant === 'warning' ? 'assertive' : 'polite'),
    getAriaLabel: () => title || message || 'Alert',
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
  getAlertVariant,
  getAlertSize,
  getAlertRadius,
  getAlertShadow,
  getAlertIcon,
  getAlertAnimation,
};