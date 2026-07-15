/**
 * KisanO Design System — Drawer Package
 * Drawer Utilities
 *
 * Production-ready utility functions for the Drawer package.
 * Contains only pure utility functions based on the existing drawerVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for drawer styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Drawer/drawerUtils
 */

import {
  DRAWER_VARIANTS,
  DRAWER_SIZES,
  DRAWER_RADIUS,
  DRAWER_SHADOWS,
  DRAWER_POSITIONS,
  DRAWER_ANIMATIONS,
  DRAWER_OVERLAYS,
  DRAWER_DEFAULTS,
  getDrawerVariant,
  getDrawerSize,
  getDrawerRadius,
  getDrawerShadow,
  getDrawerPosition,
  getDrawerPositionTransform,
  getDrawerAnimation,
  getDrawerOverlay,
} from './drawerVariants';

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
 * Resolves default props for drawer components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Drawer variant.
 * @param {string} [props.size] - Drawer size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.shadow] - Shadow level.
 * @param {string} [props.position] - Drawer position.
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
  variant = DRAWER_DEFAULTS.variant,
  size = DRAWER_DEFAULTS.size,
  radius = DRAWER_DEFAULTS.radius,
  shadow = DRAWER_DEFAULTS.shadow,
  position = DRAWER_DEFAULTS.position,
  animation = DRAWER_DEFAULTS.animation,
  overlay = DRAWER_DEFAULTS.overlay,
  closeOnEscape = DRAWER_DEFAULTS.closeOnEscape,
  closeOnOutsideClick = DRAWER_DEFAULTS.closeOnOutsideClick,
  showCloseButton = DRAWER_DEFAULTS.showCloseButton,
  loading = DRAWER_DEFAULTS.loading,
  disabled = DRAWER_DEFAULTS.disabled,
}) {
  return {
    variant: DRAWER_VARIANTS[variant] ? variant : DRAWER_DEFAULTS.variant,
    size: DRAWER_SIZES[size] ? size : DRAWER_DEFAULTS.size,
    radius: DRAWER_RADIUS[radius] ? radius : DRAWER_DEFAULTS.radius,
    shadow: DRAWER_SHADOWS[shadow] ? shadow : DRAWER_DEFAULTS.shadow,
    position: DRAWER_POSITIONS[position] ? position : DRAWER_DEFAULTS.position,
    animation: DRAWER_ANIMATIONS[animation] ? animation : DRAWER_DEFAULTS.animation,
    overlay: DRAWER_OVERLAYS[overlay] ? overlay : DRAWER_DEFAULTS.overlay,
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
 * Gets complete drawer classes based on options.
 *
 * @param {Object} options - Drawer options.
 * @param {string} [options.variant] - Drawer variant.
 * @param {string} [options.size] - Drawer size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.shadow] - Shadow level.
 * @param {string} [options.position] - Drawer position.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged drawer classes.
 */
export function getDrawerClasses({
  variant = DRAWER_DEFAULTS.variant,
  size = DRAWER_DEFAULTS.size,
  radius = DRAWER_DEFAULTS.radius,
  shadow = DRAWER_DEFAULTS.shadow,
  position = DRAWER_DEFAULTS.position,
  className = '',
  disabled = false,
  loading = false,
}) {
  const variantConfig = getDrawerVariant(variant);
  const sizeConfig = getDrawerSize(size);
  const positionClass = getDrawerPosition(position);

  return mergeClasses(
    'relative flex flex-col',
    positionClass,
    sizeConfig.size,
    sizeConfig.padding,
    sizeConfig.gap,
    variantConfig.background,
    variantConfig.text,
    variantConfig.border,
    getDrawerRadius(radius),
    getDrawerShadow(shadow),
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets container classes for drawer wrapper.
 *
 * @param {string} [className] - Additional classes.
 * @returns {string} Merged container classes.
 */
export function getDrawerContainerClasses(className = '') {
  return mergeClasses(
    'fixed inset-0 z-50 flex',
    className,
  );
}

/**
 * Gets overlay classes for drawer backdrop.
 *
 * @param {string} [overlay] - Overlay type.
 * @param {string} [className] - Additional classes.
 * @returns {string} Merged overlay classes.
 */
export function getDrawerOverlayClasses(overlay = DRAWER_DEFAULTS.overlay, className = '') {
  return mergeClasses(
    'fixed inset-0 z-40',
    getDrawerOverlay(overlay),
    className,
  );
}

/**
 * Gets content classes for drawer content wrapper.
 *
 * @param {Object} options - Content options.
 * @param {string} [options.position] - Drawer position.
 * @param {string} [options.size] - Drawer size.
 * @param {string} [options.className] - Additional classes.
 * @returns {string} Merged content classes.
 */
export function getDrawerContentClasses({
  position = DRAWER_DEFAULTS.position,
  size = DRAWER_DEFAULTS.size,
  className = '',
}) {
  const sizeConfig = getDrawerSize(size);
  const positionClass = getDrawerPosition(position);

  return mergeClasses(
    'relative z-50 flex flex-col',
    positionClass,
    sizeConfig.size,
    'max-h-[100dvh]',
    'overflow-hidden',
    className,
  );
}

/**
 * Gets header classes for drawer header.
 *
 * @param {Object} options - Header options.
 * @param {string} [options.variant] - Drawer variant.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged header classes.
 */
export function getDrawerHeaderClasses({
  variant = DRAWER_DEFAULTS.variant,
  className = '',
  disabled = false,
}) {
  const variantConfig = getDrawerVariant(variant);

  return mergeClasses(
    'flex items-center justify-between',
    'pb-4',
    variantConfig.header,
    disabled && 'opacity-50',
    className,
  );
}

/**
 * Gets body classes for drawer body.
 *
 * @param {Object} options - Body options.
 * @param {string} [options.size] - Drawer size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged body classes.
 */
export function getDrawerBodyClasses({
  size = DRAWER_DEFAULTS.size,
  className = '',
  disabled = false,
  loading = false,
}) {
  const sizeConfig = getDrawerSize(size);

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
 * Gets footer classes for drawer footer.
 *
 * @param {Object} options - Footer options.
 * @param {string} [options.variant] - Drawer variant.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged footer classes.
 */
export function getDrawerFooterClasses({
  variant = DRAWER_DEFAULTS.variant,
  className = '',
  disabled = false,
}) {
  const variantConfig = getDrawerVariant(variant);

  return mergeClasses(
    'flex items-center justify-end gap-3',
    'pt-4',
    variantConfig.footer,
    disabled && 'opacity-50',
    className,
  );
}

/**
 * Gets close button classes for drawer close button.
 *
 * @param {Object} options - Close button options.
 * @param {string} [options.size] - Drawer size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged close button classes.
 */
export function getDrawerCloseButtonClasses({
  size = DRAWER_DEFAULTS.size,
  className = '',
  disabled = false,
}) {
  const sizeConfig = getDrawerSize(size);

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
  return variant ? Object.keys(DRAWER_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(DRAWER_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(DRAWER_RADIUS).includes(radius) : false;
}

/**
 * Validates if a shadow is valid.
 *
 * @param {string} shadow - The shadow to check.
 * @returns {boolean} True if valid.
 */
export function isValidShadow(shadow) {
  return shadow ? Object.keys(DRAWER_SHADOWS).includes(shadow) : false;
}

/**
 * Validates if a position is valid.
 *
 * @param {string} position - The position to check.
 * @returns {boolean} True if valid.
 */
export function isValidPosition(position) {
  return position ? Object.keys(DRAWER_POSITIONS).includes(position) : false;
}

/**
 * Validates if an animation is valid.
 *
 * @param {string} animation - The animation to check.
 * @returns {boolean} True if valid.
 */
export function isValidAnimation(animation) {
  return animation ? Object.keys(DRAWER_ANIMATIONS).includes(animation) : false;
}

/**
 * Validates if an overlay is valid.
 *
 * @param {string} overlay - The overlay to check.
 * @returns {boolean} True if valid.
 */
export function isValidOverlay(overlay) {
  return overlay ? Object.keys(DRAWER_OVERLAYS).includes(overlay) : false;
}

/* ---------------------------------- */
/* State Helpers                      */
/* ---------------------------------- */

/**
 * Determines if a drawer is interactive.
 *
 * @param {Object} options - Drawer options.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {boolean} True if interactive.
 */
export function isInteractiveDrawer({ disabled = false, loading = false }) {
  return !disabled && !loading;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for drawer components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.title] - Drawer title.
 * @param {string} [state.description] - Drawer description.
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
    getAriaLabelledBy: () => (title ? 'drawer-title' : undefined),
    getAriaDescribedBy: () => (description ? 'drawer-description' : undefined),
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
  getDrawerVariant,
  getDrawerSize,
  getDrawerRadius,
  getDrawerShadow,
  getDrawerPosition,
  getDrawerPositionTransform,
  getDrawerAnimation,
  getDrawerOverlay,
};