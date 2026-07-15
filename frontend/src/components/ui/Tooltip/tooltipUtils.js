/**
 * KisanO Design System — Tooltip Package
 * Tooltip Utilities
 *
 * Production-ready utility functions for the Tooltip package.
 * Contains only pure utility functions based on the existing tooltipVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for tooltip styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Tooltip/tooltipUtils
 */

import {
  TOOLTIP_VARIANTS,
  TOOLTIP_SIZES,
  TOOLTIP_RADIUS,
  TOOLTIP_SHADOWS,
  TOOLTIP_POSITIONS,
  TOOLTIP_ARROW_SIZES,
  TOOLTIP_DEFAULTS,
  getTooltipVariant,
  getTooltipSize,
  getTooltipRadius,
  getTooltipShadow,
  getTooltipPosition,
  getTooltipArrowSize,
  getTooltipArrowOffset,
} from './tooltipVariants';

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
 * Resolves default props for tooltip components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Tooltip variant.
 * @param {string} [props.size] - Tooltip size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.shadow] - Shadow level.
 * @param {string} [props.position] - Tooltip position.
 * @param {string} [props.arrowSize] - Arrow size.
 * @param {boolean} [props.arrow] - Show arrow.
 * @param {number} [props.delay] - Open delay.
 * @param {number} [props.closeDelay] - Close delay.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {string} [props.animation] - Animation preset.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = TOOLTIP_DEFAULTS.variant,
  size = TOOLTIP_DEFAULTS.size,
  radius = TOOLTIP_DEFAULTS.radius,
  shadow = TOOLTIP_DEFAULTS.shadow,
  position = TOOLTIP_DEFAULTS.position,
  arrowSize = TOOLTIP_DEFAULTS.arrowSize,
  arrow = TOOLTIP_DEFAULTS.arrow,
  delay = TOOLTIP_DEFAULTS.delay,
  closeDelay = TOOLTIP_DEFAULTS.closeDelay,
  disabled = TOOLTIP_DEFAULTS.disabled,
  animation = TOOLTIP_DEFAULTS.animation,
}) {
  return {
    variant: TOOLTIP_VARIANTS[variant] ? variant : TOOLTIP_DEFAULTS.variant,
    size: TOOLTIP_SIZES[size] ? size : TOOLTIP_DEFAULTS.size,
    radius: TOOLTIP_RADIUS[radius] ? radius : TOOLTIP_DEFAULTS.radius,
    shadow: TOOLTIP_SHADOWS[shadow] ? shadow : TOOLTIP_DEFAULTS.shadow,
    position: TOOLTIP_POSITIONS[position] ? position : TOOLTIP_DEFAULTS.position,
    arrowSize: TOOLTIP_ARROW_SIZES[arrowSize] ? arrowSize : TOOLTIP_DEFAULTS.arrowSize,
    arrow,
    delay,
    closeDelay,
    disabled,
    animation,
  };
}

/**
 * Gets complete tooltip classes based on props.
 *
 * @param {Object} options - Tooltip options.
 * @param {string} [options.variant] - Tooltip variant.
 * @param {string} [options.size] - Tooltip size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.shadow] - Shadow level.
 * @param {string} [options.position] - Tooltip position.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.animation] - Animation enabled.
 * @returns {string} Merged tooltip classes.
 */
export function getTooltipClasses({
  variant = TOOLTIP_DEFAULTS.variant,
  size = TOOLTIP_DEFAULTS.size,
  radius = TOOLTIP_DEFAULTS.radius,
  shadow = TOOLTIP_DEFAULTS.shadow,
  position = TOOLTIP_DEFAULTS.position,
  className = '',
  disabled = false,
  animation = true,
}) {
  const variantConfig = getTooltipVariant(variant);
  const sizeConfig = getTooltipSize(size);
  const positionClass = getTooltipPosition(position);

  return mergeClasses(
    'relative z-50',
    'inline-flex flex-col items-center',
    positionClass,
    variantConfig.background,
    variantConfig.text,
    variantConfig.border,
    sizeConfig.padding,
    sizeConfig.fontSize,
    sizeConfig.maxWidth,
    getTooltipRadius(radius),
    getTooltipShadow(shadow),
    variantConfig.shadow,
    'pointer-events-none',
    disabled && 'opacity-50 cursor-not-allowed',
    animation && 'transition-all duration-200 ease-in-out',
    className,
  );
}

/**
 * Gets tooltip container classes for positioning wrapper.
 *
 * @param {string} [className] - Additional classes.
 * @returns {string} Merged container classes.
 */
export function getTooltipContainerClasses(className = '') {
  return mergeClasses(
    'inline-block relative',
    className,
  );
}

/**
 * Gets tooltip arrow classes.
 *
 * @param {Object} options - Arrow options.
 * @param {string} [options.position] - Tooltip position.
 * @param {string} [options.arrowSize] - Arrow size.
 * @param {string} [options.variant] - Tooltip variant.
 * @param {string} [options.className] - Additional classes.
 * @returns {string} Merged arrow classes.
 */
export function getTooltipArrowClasses({
  position = TOOLTIP_DEFAULTS.position,
  arrowSize = TOOLTIP_DEFAULTS.arrowSize,
  variant = TOOLTIP_DEFAULTS.variant,
  className = '',
}) {
  const variantConfig = getTooltipVariant(variant);
  const arrowSizeClass = getTooltipArrowSize(arrowSize);
  const arrowOffsetClass = getTooltipArrowOffset(position);

  return mergeClasses(
    'absolute block',
    arrowSizeClass,
    arrowOffsetClass,
    variantConfig.background,
    variantConfig.border,
    'border-t border-l',
    'pointer-events-none',
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
  return variant ? Object.keys(TOOLTIP_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(TOOLTIP_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(TOOLTIP_RADIUS).includes(radius) : false;
}

/**
 * Validates if a shadow is valid.
 *
 * @param {string} shadow - The shadow to check.
 * @returns {boolean} True if valid.
 */
export function isValidShadow(shadow) {
  return shadow ? Object.keys(TOOLTIP_SHADOWS).includes(shadow) : false;
}

/**
 * Validates if a position is valid.
 *
 * @param {string} position - The position to check.
 * @returns {boolean} True if valid.
 */
export function isValidPosition(position) {
  return position ? Object.keys(TOOLTIP_POSITIONS).includes(position) : false;
}

/**
 * Validates if an arrow size is valid.
 *
 * @param {string} arrowSize - The arrow size to check.
 * @returns {boolean} True if valid.
 */
export function isValidArrowSize(arrowSize) {
  return arrowSize ? Object.keys(TOOLTIP_ARROW_SIZES).includes(arrowSize) : false;
}

/* ---------------------------------- */
/* Interactive State Utilities        */
/* ---------------------------------- */

/**
 * Determines if a tooltip is interactive.
 *
 * @param {Object} options - Tooltip options.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {boolean} True if interactive.
 */
export function isInteractiveTooltip({ disabled = false }) {
  return !disabled;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for tooltip components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.content] - Tooltip content.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {boolean} [state.open] - Open state.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  content = '',
  disabled = false,
  open = false,
}) {
  return {
    getRole: () => 'tooltip',
    getAriaLabel: () => content || 'Tooltip',
    getAriaHidden: () => !open || undefined,
    getAriaDisabled: () => disabled || undefined,
    getTabIndex: () => (disabled ? -1 : 0),
  };
}

/* ---------------------------------- */
/* Re-exported Utilities              */
/* ---------------------------------- */

// Re-export token utilities for convenience
export {
  getTooltipVariant,
  getTooltipSize,
  getTooltipRadius,
  getTooltipShadow,
  getTooltipPosition,
  getTooltipArrowSize,
  getTooltipArrowOffset,
};