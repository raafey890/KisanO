/**
 * KisanO Design System — Navbar Package
 * Navbar Utilities
 *
 * Production-ready utility functions for the Navbar package.
 * Contains only pure utility functions based on the existing navbarVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for navbar styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Navbar/navbarUtils
 */

import {
  NAVBAR_VARIANTS,
  NAVBAR_SIZES,
  NAVBAR_SHADOWS,
  NAVBAR_POSITIONS,
  NAVBAR_BACKDROPS,
  NAVBAR_DEFAULTS,
  getNavbarVariant,
  getNavbarSize,
  getNavbarShadow,
  getNavbarPosition,
  getNavbarBackdrop,
} from './navbarVariants';

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
 * Resolves default props for navbar components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Navbar variant.
 * @param {string} [props.size] - Navbar size.
 * @param {string} [props.shadow] - Shadow level.
 * @param {string} [props.position] - Navbar position.
 * @param {string} [props.backdrop] - Backdrop effect.
 * @param {boolean} [props.collapsed] - Collapsed state.
 * @param {boolean} [props.transparent] - Transparent state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = NAVBAR_DEFAULTS.variant,
  size = NAVBAR_DEFAULTS.size,
  shadow = NAVBAR_DEFAULTS.shadow,
  position = NAVBAR_DEFAULTS.position,
  backdrop = NAVBAR_DEFAULTS.backdrop,
  collapsed = NAVBAR_DEFAULTS.collapsed,
  transparent = NAVBAR_DEFAULTS.transparent,
}) {
  return {
    variant: NAVBAR_VARIANTS[variant] ? variant : NAVBAR_DEFAULTS.variant,
    size: NAVBAR_SIZES[size] ? size : NAVBAR_DEFAULTS.size,
    shadow: NAVBAR_SHADOWS[shadow] ? shadow : NAVBAR_DEFAULTS.shadow,
    position: NAVBAR_POSITIONS[position] ? position : NAVBAR_DEFAULTS.position,
    backdrop: NAVBAR_BACKDROPS[backdrop] ? backdrop : NAVBAR_DEFAULTS.backdrop,
    collapsed,
    transparent,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete navbar classes based on options.
 *
 * @param {Object} options - Navbar options.
 * @param {string} [options.variant] - Navbar variant.
 * @param {string} [options.size] - Navbar size.
 * @param {string} [options.shadow] - Shadow level.
 * @param {string} [options.position] - Navbar position.
 * @param {string} [options.backdrop] - Backdrop effect.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.collapsed] - Collapsed state.
 * @param {boolean} [options.transparent] - Transparent state.
 * @returns {string} Merged navbar classes.
 */
export function getNavbarClasses({
  variant = NAVBAR_DEFAULTS.variant,
  size = NAVBAR_DEFAULTS.size,
  shadow = NAVBAR_DEFAULTS.shadow,
  position = NAVBAR_DEFAULTS.position,
  backdrop = NAVBAR_DEFAULTS.backdrop,
  className = '',
  collapsed = false,
  transparent = false,
}) {
  const variantConfig = getNavbarVariant(variant);
  const sizeConfig = getNavbarSize(size);

  // Determine if transparent overrides background.
  const backgroundClass = transparent ? 'bg-transparent' : variantConfig.background;

  return mergeClasses(
    'flex items-center w-full',
    getNavbarPosition(position),
    sizeConfig.height,
    sizeConfig.padding,
    sizeConfig.gap,
    backgroundClass,
    variantConfig.text,
    variantConfig.border,
    getNavbarShadow(shadow),
    getNavbarBackdrop(backdrop),
    'transition-all duration-300 ease-in-out',
    collapsed && 'max-h-0 overflow-hidden',
    !collapsed && 'max-h-screen',
    className,
  );
}

/**
 * Gets container classes for navbar wrapper.
 *
 * @param {Object} options - Container options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.fluid] - Fluid container.
 * @returns {string} Merged container classes.
 */
export function getNavbarContainerClasses({
  className = '',
  fluid = false,
}) {
  return mergeClasses(
    'w-full mx-auto',
    fluid ? 'max-w-full' : 'max-w-7xl',
    'px-4 sm:px-6 lg:px-8',
    className,
  );
}

/**
 * Gets brand classes for navbar brand.
 *
 * @param {Object} options - Brand options.
 * @param {string} [options.size] - Navbar size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged brand classes.
 */
export function getNavbarBrandClasses({
  size = NAVBAR_DEFAULTS.size,
  className = '',
  disabled = false,
}) {
  const sizeConfig = getNavbarSize(size);

  return mergeClasses(
    'flex items-center gap-2',
    'font-semibold',
    sizeConfig.logo,
    'text-inherit',
    'no-underline hover:no-underline',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className,
  );
}

/**
 * Gets menu classes for navbar menu.
 *
 * @param {Object} options - Menu options.
 * @param {string} [options.size] - Navbar size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.open] - Whether menu is open.
 * @param {boolean} [options.collapsed] - Collapsed state.
 * @returns {string} Merged menu classes.
 */
export function getNavbarMenuClasses({
  size = NAVBAR_DEFAULTS.size,
  className = '',
  open = false,
  collapsed = false,
}) {
  const sizeConfig = getNavbarSize(size);

  return mergeClasses(
    'flex items-center',
    sizeConfig.gap,
    collapsed ? 'flex-col w-full' : 'flex-row',
    collapsed && !open && 'hidden',
    collapsed && open && 'flex',
    className,
  );
}

/**
 * Gets item classes for navbar items.
 *
 * @param {Object} options - Item options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.active] - Active state.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged item classes.
 */
export function getNavbarItemClasses({
  className = '',
  active = false,
  disabled = false,
}) {
  return mergeClasses(
    'inline-flex items-center',
    'px-3 py-2 rounded-md',
    'text-sm font-medium',
    'transition-colors duration-200',
    active && 'bg-blue-100 text-blue-700',
    !active && 'hover:bg-gray-100 hover:text-gray-900',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className,
  );
}

/**
 * Gets toggle classes for navbar toggle button.
 *
 * @param {Object} options - Toggle options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.open] - Whether menu is open.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged toggle classes.
 */
export function getNavbarToggleClasses({
  className = '',
  open = false,
  disabled = false,
}) {
  return mergeClasses(
    'inline-flex items-center justify-center',
    'p-2 rounded-md',
    'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
    'focus:outline-none focus:ring-2 focus:ring-blue-500',
    'transition-colors duration-200',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
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
  return variant ? Object.keys(NAVBAR_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(NAVBAR_SIZES).includes(size) : false;
}

/**
 * Validates if a shadow is valid.
 *
 * @param {string} shadow - The shadow to check.
 * @returns {boolean} True if valid.
 */
export function isValidShadow(shadow) {
  return shadow ? Object.keys(NAVBAR_SHADOWS).includes(shadow) : false;
}

/**
 * Validates if a position is valid.
 *
 * @param {string} position - The position to check.
 * @returns {boolean} True if valid.
 */
export function isValidPosition(position) {
  return position ? Object.keys(NAVBAR_POSITIONS).includes(position) : false;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for navbar components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.label] - Navbar label.
 * @param {boolean} [state.open] - Menu open state.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {number} [state.itemsCount] - Number of menu items.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  label = '',
  open = false,
  disabled = false,
  itemsCount = 0,
}) {
  return {
    getRole: () => 'navigation',
    getAriaLabel: () => label || 'Navigation',
    getAriaExpanded: () => open || undefined,
    getAriaDisabled: () => disabled || undefined,
    getAriaControls: () => 'navbar-menu',
    getAriaHasPopup: () => 'menu',
    getTabIndex: () => (disabled ? -1 : 0),
  };
}

/* ---------------------------------- */
/* Re-exported Utilities              */
/* ---------------------------------- */

// Re-export token utilities for convenience
export {
  getNavbarVariant,
  getNavbarSize,
  getNavbarShadow,
  getNavbarPosition,
  getNavbarBackdrop,
};