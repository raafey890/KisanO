/**
 * KisanO Design System — Dialog Package
 * Dialog Utilities
 *
 * Production-ready utility functions for the Dialog package.
 * Contains only pure utility functions based on the existing dialogVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for dialog styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Dialog/dialogUtils
 */

import {
  DIALOG_VARIANTS,
  DIALOG_SIZES,
  DIALOG_RADIUS,
  DIALOG_SHADOWS,
  DIALOG_ANIMATIONS,
  DIALOG_OVERLAYS,
  DIALOG_DEFAULTS,
  getDialogVariant,
  getDialogSize,
  getDialogRadius,
  getDialogShadow,
  getDialogAnimation,
  getDialogOverlay,
} from './dialogVariants';

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
 * Resolves default props for dialog components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Dialog variant.
 * @param {string} [props.size] - Dialog size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.shadow] - Shadow level.
 * @param {string} [props.animation] - Animation type.
 * @param {string} [props.overlay] - Overlay type.
 * @param {boolean} [props.closeOnEscape] - Close on escape.
 * @param {boolean} [props.closeOnOutsideClick] - Close on outside click.
 * @param {boolean} [props.showCloseButton] - Show close button.
 * @param {boolean} [props.loading] - Loading state.
 * @param {boolean} [props.disabled] - Disabled state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = DIALOG_DEFAULTS.variant,
  size = DIALOG_DEFAULTS.size,
  radius = DIALOG_DEFAULTS.radius,
  shadow = DIALOG_DEFAULTS.shadow,
  animation = DIALOG_DEFAULTS.animation,
  overlay = DIALOG_DEFAULTS.overlay,
  closeOnEscape = DIALOG_DEFAULTS.closeOnEscape,
  closeOnOutsideClick = DIALOG_DEFAULTS.closeOnOutsideClick,
  showCloseButton = DIALOG_DEFAULTS.showCloseButton,
  loading = DIALOG_DEFAULTS.loading,
  disabled = DIALOG_DEFAULTS.disabled,
}) {
  return {
    variant: DIALOG_VARIANTS[variant] ? variant : DIALOG_DEFAULTS.variant,
    size: DIALOG_SIZES[size] ? size : DIALOG_DEFAULTS.size,
    radius: DIALOG_RADIUS[radius] ? radius : DIALOG_DEFAULTS.radius,
    shadow: DIALOG_SHADOWS[shadow] ? shadow : DIALOG_DEFAULTS.shadow,
    animation: DIALOG_ANIMATIONS[animation] ? animation : DIALOG_DEFAULTS.animation,
    overlay: DIALOG_OVERLAYS[overlay] ? overlay : DIALOG_DEFAULTS.overlay,
    closeOnEscape,
    closeOnOutsideClick,
    showCloseButton,
    loading,
    disabled,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete dialog classes based on options.
 *
 * @param {Object} options - Dialog options.
 * @param {string} [options.variant] - Dialog variant.
 * @param {string} [options.size] - Dialog size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.shadow] - Shadow level.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged dialog classes.
 */
export function getDialogClasses({
  variant = DIALOG_DEFAULTS.variant,
  size = DIALOG_DEFAULTS.size,
  radius = DIALOG_DEFAULTS.radius,
  shadow = DIALOG_DEFAULTS.shadow,
  className = '',
  disabled = false,
  loading = false,
}) {
  const variantConfig = getDialogVariant(variant);
  const sizeConfig = getDialogSize(size);

  return mergeClasses(
    'relative flex flex-col',
    'w-full',
    sizeConfig.width,
    sizeConfig.padding,
    sizeConfig.gap,
    variantConfig.background,
    variantConfig.text,
    variantConfig.border,
    getDialogRadius(radius),
    getDialogShadow(shadow),
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets container classes for dialog wrapper.
 *
 * @param {string} [className] - Additional classes.
 * @returns {string} Merged container classes.
 */
export function getDialogContainerClasses(className = '') {
  return mergeClasses(
    'fixed inset-0 z-50 flex items-center justify-center p-4',
    className,
  );
}

/**
 * Gets overlay classes for dialog backdrop.
 *
 * @param {string} [overlay] - Overlay type.
 * @param {string} [className] - Additional classes.
 * @returns {string} Merged overlay classes.
 */
export function getDialogOverlayClasses(overlay = DIALOG_DEFAULTS.overlay, className = '') {
  return mergeClasses(
    'fixed inset-0 z-40',
    getDialogOverlay(overlay),
    className,
  );
}

/**
 * Gets content classes for dialog content wrapper.
 *
 * @param {Object} options - Content options.
 * @param {string} [options.size] - Dialog size.
 * @param {string} [options.className] - Additional classes.
 * @returns {string} Merged content classes.
 */
export function getDialogContentClasses({
  size = DIALOG_DEFAULTS.size,
  className = '',
}) {
  const sizeConfig = getDialogSize(size);

  return mergeClasses(
    'relative z-50 flex flex-col',
    'w-full',
    sizeConfig.width,
    'max-h-[90vh]',
    'overflow-hidden',
    className,
  );
}

/**
 * Gets header classes for dialog header.
 *
 * @param {Object} options - Header options.
 * @param {string} [options.variant] - Dialog variant.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged header classes.
 */
export function getDialogHeaderClasses({
  variant = DIALOG_DEFAULTS.variant,
  className = '',
  disabled = false,
}) {
  const variantConfig = getDialogVariant(variant);

  return mergeClasses(
    'flex items-center justify-between',
    'pb-4',
    variantConfig.header,
    disabled && 'opacity-50',
    className,
  );
}

/**
 * Gets body classes for dialog body.
 *
 * @param {Object} options - Body options.
 * @param {string} [options.size] - Dialog size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged body classes.
 */
export function getDialogBodyClasses({
  size = DIALOG_DEFAULTS.size,
  className = '',
  disabled = false,
  loading = false,
}) {
  const sizeConfig = getDialogSize(size);

  return mergeClasses(
    'flex-1',
    sizeConfig.gap,
    'overflow-y-auto',
    disabled && 'opacity-50',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets footer classes for dialog footer.
 *
 * @param {Object} options - Footer options.
 * @param {string} [options.variant] - Dialog variant.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged footer classes.
 */
export function getDialogFooterClasses({
  variant = DIALOG_DEFAULTS.variant,
  className = '',
  disabled = false,
}) {
  const variantConfig = getDialogVariant(variant);

  return mergeClasses(
    'flex items-center justify-end gap-3',
    'pt-4',
    variantConfig.footer,
    disabled && 'opacity-50',
    className,
  );
}

/**
 * Gets close button classes for dialog close button.
 *
 * @param {Object} options - Close button options.
 * @param {string} [options.size] - Dialog size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged close button classes.
 */
export function getDialogCloseButtonClasses({
  size = DIALOG_DEFAULTS.size,
  className = '',
  disabled = false,
}) {
  const sizeConfig = getDialogSize(size);

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
  return variant ? Object.keys(DIALOG_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(DIALOG_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(DIALOG_RADIUS).includes(radius) : false;
}

/**
 * Validates if a shadow is valid.
 *
 * @param {string} shadow - The shadow to check.
 * @returns {boolean} True if valid.
 */
export function isValidShadow(shadow) {
  return shadow ? Object.keys(DIALOG_SHADOWS).includes(shadow) : false;
}

/**
 * Validates if an animation is valid.
 *
 * @param {string} animation - The animation to check.
 * @returns {boolean} True if valid.
 */
export function isValidAnimation(animation) {
  return animation ? Object.keys(DIALOG_ANIMATIONS).includes(animation) : false;
}

/**
 * Validates if an overlay is valid.
 *
 * @param {string} overlay - The overlay to check.
 * @returns {boolean} True if valid.
 */
export function isValidOverlay(overlay) {
  return overlay ? Object.keys(DIALOG_OVERLAYS).includes(overlay) : false;
}

/* ---------------------------------- */
/* State Helpers                      */
/* ---------------------------------- */

/**
 * Determines if a dialog is interactive.
 *
 * @param {Object} options - Dialog options.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {boolean} True if interactive.
 */
export function isInteractiveDialog({ disabled = false, loading = false }) {
  return !disabled && !loading;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for dialog components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.title] - Dialog title.
 * @param {string} [state.description] - Dialog description.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {boolean} [state.loading] - Loading state.
 * @param {boolean} [state.open] - Open state.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  title = '',
  description = '',
  disabled = false,
  loading = false,
  open = false,
}) {
  return {
    getRole: () => 'dialog',
    getAriaModal: () => true,
    getAriaLabelledBy: () => (title ? 'dialog-title' : undefined),
    getAriaDescribedBy: () => (description ? 'dialog-description' : undefined),
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
  getDialogVariant,
  getDialogSize,
  getDialogRadius,
  getDialogShadow,
  getDialogAnimation,
  getDialogOverlay,
};