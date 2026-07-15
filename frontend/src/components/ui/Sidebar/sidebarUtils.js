/**
 * KisanO Design System — Sidebar Package
 * Sidebar Utilities
 *
 * Production-ready utility functions for the Sidebar package.
 * Contains only pure utility functions based on the existing sidebarVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for sidebar styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Sidebar/sidebarUtils
 */

import {
  SIDEBAR_VARIANTS,
  SIDEBAR_SIZES,
  SIDEBAR_WIDTHS,
  SIDEBAR_SHADOWS,
  SIDEBAR_POSITIONS,
  SIDEBAR_DEFAULTS,
  getSidebarVariant,
  getSidebarSize,
  getSidebarWidth,
  getSidebarShadow,
  getSidebarPosition,
} from './sidebarVariants';

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
 * Resolves default props for sidebar components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Sidebar variant.
 * @param {string} [props.size] - Sidebar size.
 * @param {string} [props.width] - Sidebar width.
 * @param {string} [props.shadow] - Shadow level.
 * @param {string} [props.position] - Sidebar position.
 * @param {boolean} [props.collapsed] - Collapsed state.
 * @param {boolean} [props.open] - Open state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = SIDEBAR_DEFAULTS.variant,
  size = SIDEBAR_DEFAULTS.size,
  width = SIDEBAR_DEFAULTS.width,
  shadow = SIDEBAR_DEFAULTS.shadow,
  position = SIDEBAR_DEFAULTS.position,
  collapsed = SIDEBAR_DEFAULTS.collapsed,
  open = SIDEBAR_DEFAULTS.open,
}) {
  return {
    variant: SIDEBAR_VARIANTS[variant] ? variant : SIDEBAR_DEFAULTS.variant,
    size: SIDEBAR_SIZES[size] ? size : SIDEBAR_DEFAULTS.size,
    width: SIDEBAR_WIDTHS[width] ? width : SIDEBAR_DEFAULTS.width,
    shadow: SIDEBAR_SHADOWS[shadow] ? shadow : SIDEBAR_DEFAULTS.shadow,
    position: SIDEBAR_POSITIONS[position] ? position : SIDEBAR_DEFAULTS.position,
    collapsed,
    open,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete sidebar classes based on options.
 *
 * @param {Object} options - Sidebar options.
 * @param {string} [options.variant] - Sidebar variant.
 * @param {string} [options.size] - Sidebar size.
 * @param {string} [options.width] - Sidebar width.
 * @param {string} [options.shadow] - Shadow level.
 * @param {string} [options.position] - Sidebar position.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.collapsed] - Collapsed state.
 * @param {boolean} [options.open] - Open state.
 * @returns {string} Merged sidebar classes.
 */
export function getSidebarClasses({
  variant = SIDEBAR_DEFAULTS.variant,
  size = SIDEBAR_DEFAULTS.size,
  width = SIDEBAR_DEFAULTS.width,
  shadow = SIDEBAR_DEFAULTS.shadow,
  position = SIDEBAR_DEFAULTS.position,
  className = '',
  collapsed = false,
  open = true,
}) {
  const variantConfig = getSidebarVariant(variant);
  const sizeConfig = getSidebarSize(size);

  // Determine width based on collapsed state.
  const widthClass = collapsed ? SIDEBAR_WIDTHS.collapsed : getSidebarWidth(width);

  return mergeClasses(
    'fixed flex flex-col h-full z-40',
    getSidebarPosition(position),
    widthClass,
    sizeConfig.padding,
    sizeConfig.gap,
    variantConfig.background,
    variantConfig.text,
    variantConfig.border,
    getSidebarShadow(shadow),
    'transition-all duration-300 ease-in-out',
    !open && 'transform -translate-x-full',
    collapsed && 'overflow-hidden',
    className,
  );
}

/**
 * Gets container classes for sidebar wrapper.
 *
 * @param {Object} options - Container options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.open] - Open state.
 * @param {string} [options.position] - Sidebar position.
 * @returns {string} Merged container classes.
 */
export function getSidebarContainerClasses({
  className = '',
  open = true,
  position = SIDEBAR_DEFAULTS.position,
}) {
  return mergeClasses(
    'fixed inset-0 z-30',
    position === 'left' ? 'left-0' : 'right-0',
    !open && 'pointer-events-none',
    className,
  );
}

/**
 * Gets header classes for sidebar header.
 *
 * @param {Object} options - Header options.
 * @param {string} [options.size] - Sidebar size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.collapsed] - Collapsed state.
 * @returns {string} Merged header classes.
 */
export function getSidebarHeaderClasses({
  size = SIDEBAR_DEFAULTS.size,
  className = '',
  collapsed = false,
}) {
  const sizeConfig = getSidebarSize(size);

  return mergeClasses(
    'flex items-center',
    sizeConfig.gap,
    collapsed ? 'justify-center' : 'justify-between',
    'pb-4 border-b border-gray-200 dark:border-gray-700',
    className,
  );
}

/**
 * Gets content classes for sidebar content.
 *
 * @param {Object} options - Content options.
 * @param {string} [options.size] - Sidebar size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.collapsed] - Collapsed state.
 * @returns {string} Merged content classes.
 */
export function getSidebarContentClasses({
  size = SIDEBAR_DEFAULTS.size,
  className = '',
  collapsed = false,
}) {
  const sizeConfig = getSidebarSize(size);

  return mergeClasses(
    'flex-1 overflow-y-auto',
    sizeConfig.gap,
    'py-2',
    collapsed && 'overflow-hidden',
    className,
  );
}

/**
 * Gets item classes for sidebar items.
 *
 * @param {Object} options - Item options.
 * @param {string} [options.size] - Sidebar size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.active] - Active state.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.collapsed] - Collapsed state.
 * @returns {string} Merged item classes.
 */
export function getSidebarItemClasses({
  size = SIDEBAR_DEFAULTS.size,
  className = '',
  active = false,
  disabled = false,
  collapsed = false,
}) {
  const sizeConfig = getSidebarSize(size);

  return mergeClasses(
    'flex items-center rounded-md',
    'transition-colors duration-200',
    'cursor-pointer',
    sizeConfig.itemPadding,
    sizeConfig.itemText,
    sizeConfig.itemGap || sizeConfig.gap,
    active
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      : 'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    collapsed && 'justify-center',
    className,
  );
}

/**
 * Gets footer classes for sidebar footer.
 *
 * @param {Object} options - Footer options.
 * @param {string} [options.size] - Sidebar size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.collapsed] - Collapsed state.
 * @returns {string} Merged footer classes.
 */
export function getSidebarFooterClasses({
  size = SIDEBAR_DEFAULTS.size,
  className = '',
  collapsed = false,
}) {
  const sizeConfig = getSidebarSize(size);

  return mergeClasses(
    'flex items-center',
    sizeConfig.gap,
    collapsed ? 'justify-center' : 'justify-between',
    'pt-4 border-t border-gray-200 dark:border-gray-700',
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
  return variant ? Object.keys(SIDEBAR_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(SIDEBAR_SIZES).includes(size) : false;
}

/**
 * Validates if a width is valid.
 *
 * @param {string} width - The width to check.
 * @returns {boolean} True if valid.
 */
export function isValidWidth(width) {
  return width ? Object.keys(SIDEBAR_WIDTHS).includes(width) : false;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for sidebar components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.label] - Sidebar label.
 * @param {boolean} [state.open] - Open state.
 * @param {boolean} [state.collapsed] - Collapsed state.
 * @param {string} [state.position] - Sidebar position.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  label = '',
  open = true,
  collapsed = false,
  position = SIDEBAR_DEFAULTS.position,
}) {
  return {
    getRole: () => 'complementary',
    getAriaLabel: () => label || 'Sidebar navigation',
    getAriaHidden: () => !open || undefined,
    getAriaExpanded: () => !collapsed || undefined,
    getAriaOrientation: () => 'vertical',
    getTabIndex: () => (open ? 0 : -1),
  };
}

/* ---------------------------------- */
/* Re-exported Utilities              */
/* ---------------------------------- */

// Re-export token utilities for convenience
export {
  getSidebarVariant,
  getSidebarSize,
  getSidebarWidth,
  getSidebarShadow,
  getSidebarPosition,
};