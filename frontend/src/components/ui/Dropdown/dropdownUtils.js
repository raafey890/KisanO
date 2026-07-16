/**
 * KisanO Design System — Dropdown Package
 * Dropdown Utilities
 *
 * Production-ready utility functions for the Dropdown package.
 * Contains only pure utility functions based on the existing dropdownVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for dropdown styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Dropdown/dropdownUtils
 */

import {
  DROPDOWN_VARIANTS,
  DROPDOWN_SIZES,
  DROPDOWN_RADIUS,
  DROPDOWN_SHADOWS,
  DROPDOWN_POSITIONS,
  DROPDOWN_ANIMATIONS,
  DROPDOWN_ITEM_STATES,
  DROPDOWN_DEFAULTS,
  getDropdownVariant,
  getDropdownSize,
  getDropdownRadius,
  getDropdownShadow,
  getDropdownPosition,
  getDropdownAnimation,
} from './dropdownVariants';

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
 * Resolves default props for dropdown components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Dropdown variant.
 * @param {string} [props.size] - Dropdown size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.shadow] - Shadow level.
 * @param {string} [props.position] - Dropdown position.
 * @param {string} [props.animation] - Animation type.
 * @param {boolean} [props.closeOnSelect] - Close on select.
 * @param {boolean} [props.closeOnOutsideClick] - Close on outside click.
 * @param {boolean} [props.closeOnEscape] - Close on escape.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.loading] - Loading state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = DROPDOWN_DEFAULTS.variant,
  size = DROPDOWN_DEFAULTS.size,
  radius = DROPDOWN_DEFAULTS.radius,
  shadow = DROPDOWN_DEFAULTS.shadow,
  position = DROPDOWN_DEFAULTS.position,
  animation = DROPDOWN_DEFAULTS.animation,
  closeOnSelect = DROPDOWN_DEFAULTS.closeOnSelect,
  closeOnOutsideClick = DROPDOWN_DEFAULTS.closeOnOutsideClick,
  closeOnEscape = DROPDOWN_DEFAULTS.closeOnEscape,
  disabled = DROPDOWN_DEFAULTS.disabled,
  loading = DROPDOWN_DEFAULTS.loading,
}) {
  return {
    variant: DROPDOWN_VARIANTS[variant] ? variant : DROPDOWN_DEFAULTS.variant,
    size: DROPDOWN_SIZES[size] ? size : DROPDOWN_DEFAULTS.size,
    radius: DROPDOWN_RADIUS[radius] ? radius : DROPDOWN_DEFAULTS.radius,
    shadow: DROPDOWN_SHADOWS[shadow] ? shadow : DROPDOWN_DEFAULTS.shadow,
    position: DROPDOWN_POSITIONS[position] ? position : DROPDOWN_DEFAULTS.position,
    animation: DROPDOWN_ANIMATIONS[animation] ? animation : DROPDOWN_DEFAULTS.animation,
    closeOnSelect,
    closeOnOutsideClick,
    closeOnEscape,
    disabled,
    loading,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete dropdown classes based on options.
 *
 * @param {Object} options - Dropdown options.
 * @param {string} [options.variant] - Dropdown variant.
 * @param {string} [options.size] - Dropdown size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.shadow] - Shadow level.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged dropdown classes.
 */
export function getDropdownClasses({
  variant = DROPDOWN_DEFAULTS.variant,
  size = DROPDOWN_DEFAULTS.size,
  radius = DROPDOWN_DEFAULTS.radius,
  shadow = DROPDOWN_DEFAULTS.shadow,
  className = '',
  disabled = false,
  loading = false,
}) {
  const variantConfig = getDropdownVariant(variant);
  const sizeConfig = getDropdownSize(size);

  return mergeClasses(
    'relative inline-flex items-center justify-center',
    'w-full',
    sizeConfig.padding,
    sizeConfig.minHeight,
    sizeConfig.text,
    sizeConfig.gap,
    variantConfig.background,
    variantConfig.text,
    variantConfig.border,
    variantConfig.hover,
    variantConfig.active,
    variantConfig.focus,
    getDropdownRadius(radius),
    getDropdownShadow(shadow),
    'transition-all duration-200 ease-in-out',
    disabled && variantConfig.disabled,
    loading && 'opacity-70 cursor-progress',
    className,
  );
}

/**
 * Gets container classes for dropdown wrapper.
 *
 * @param {string} [className] - Additional classes.
 * @returns {string} Merged container classes.
 */
export function getDropdownContainerClasses(className = '') {
  return mergeClasses(
    'relative inline-block w-full',
    className,
  );
}

/**
 * Gets trigger classes for dropdown trigger button.
 *
 * @param {Object} options - Trigger options.
 * @param {string} [options.variant] - Trigger variant.
 * @param {string} [options.size] - Trigger size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @param {boolean} [options.open] - Open state.
 * @returns {string} Merged trigger classes.
 */
export function getDropdownTriggerClasses({
  variant = DROPDOWN_DEFAULTS.variant,
size = DROPDOWN_DEFAULTS.size,
radius = DROPDOWN_DEFAULTS.radius,
  className = '',
  disabled = false,
  loading = false,
  open = false,
}) {
  const variantConfig = getDropdownVariant(variant);
  const sizeConfig = getDropdownSize(size);

  return mergeClasses(
    'inline-flex items-center justify-between w-full',
    sizeConfig.padding,
    sizeConfig.minHeight,
    sizeConfig.text,
    sizeConfig.gap,
    variantConfig.background,
    variantConfig.text,
    variantConfig.border,
    variantConfig.hover,
    variantConfig.active,
    variantConfig.focus,
    getDropdownRadius(radius),
    'transition-all duration-200 ease-in-out',
    open && 'ring-2 ring-blue-500',
    disabled && variantConfig.disabled,
    loading && 'opacity-70 cursor-progress',
    className,
  );
}

/**
 * Gets menu classes for dropdown menu.
 *
 * @param {Object} options - Menu options.
 * @param {string} [options.position] - Menu position.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.shadow] - Shadow level.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged menu classes.
 */
export function getDropdownMenuClasses({
  position = DROPDOWN_DEFAULTS.position,
  radius = DROPDOWN_DEFAULTS.radius,
  shadow = DROPDOWN_DEFAULTS.shadow,
  className = '',
  disabled = false,
  loading = false,
}) {
  const positionClass = getDropdownPosition(position);
const variantConfig = getDropdownVariant(DROPDOWN_DEFAULTS.variant);
  return mergeClasses(
    'absolute z-50 min-w-[200px]',
    positionClass,
    variantConfig.background,
    variantConfig.border,
    getDropdownRadius(radius),
    getDropdownShadow(shadow),
    'py-1',
    'overflow-y-auto max-h-[300px]',
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets item classes for dropdown items.
 *
 * @param {Object} options - Item options.
 * @param {string} [options.state] - Item state (default, selected, active, disabled, danger, success, warning).
 * @param {string} [options.size] - Item size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged item classes.
 */
export function getDropdownItemClasses({
  state = 'default',
  size = DROPDOWN_DEFAULTS.size,
  className = '',
  disabled = false,
}) {
  const sizeConfig = getDropdownSize(size);
  const stateClasses = DROPDOWN_ITEM_STATES[state] || DROPDOWN_ITEM_STATES.default;

  return mergeClasses(
    'flex items-center w-full',
    sizeConfig.padding,
    sizeConfig.text,
    sizeConfig.gap,
    stateClasses,
    'transition-colors duration-150 ease-in-out',
    'cursor-pointer',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className,
  );
}

/**
 * Gets divider classes for dropdown dividers.
 *
 * @param {string} [className] - Additional classes.
 * @returns {string} Merged divider classes.
 */
export function getDropdownDividerClasses(className = '') {
  return mergeClasses(
    'h-px my-1 bg-gray-200',
    className,
  );
}

/**
 * Gets group classes for dropdown groups.
 *
 * @param {string} [className] - Additional classes.
 * @returns {string} Merged group classes.
 */
export function getDropdownGroupClasses(className = '') {
  return mergeClasses(
    'flex flex-col',
    className,
  );
}

/**
 * Gets label classes for dropdown labels.
 *
 * @param {Object} options - Label options.
 * @param {string} [options.size] - Label size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged label classes.
 */
export function getDropdownLabelClasses({
  size = DROPDOWN_DEFAULTS.size,
  className = '',
  disabled = false,
}) {
  const sizeConfig = getDropdownSize(size);

  return mergeClasses(
    'flex items-center w-full',
    sizeConfig.padding,
    sizeConfig.text,
    'text-gray-500 font-medium',
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
  return variant ? Object.keys(DROPDOWN_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(DROPDOWN_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(DROPDOWN_RADIUS).includes(radius) : false;
}

/**
 * Validates if a shadow is valid.
 *
 * @param {string} shadow - The shadow to check.
 * @returns {boolean} True if valid.
 */
export function isValidShadow(shadow) {
  return shadow ? Object.keys(DROPDOWN_SHADOWS).includes(shadow) : false;
}

/**
 * Validates if a position is valid.
 *
 * @param {string} position - The position to check.
 * @returns {boolean} True if valid.
 */
export function isValidPosition(position) {
  return position ? Object.keys(DROPDOWN_POSITIONS).includes(position) : false;
}

/**
 * Validates if an animation is valid.
 *
 * @param {string} animation - The animation to check.
 * @returns {boolean} True if valid.
 */
export function isValidAnimation(animation) {
  return animation ? Object.keys(DROPDOWN_ANIMATIONS).includes(animation) : false;
}

/* ---------------------------------- */
/* State Helpers                      */
/* ---------------------------------- */

/**
 * Determines if a dropdown is interactive.
 *
 * @param {Object} options - Dropdown options.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {boolean} True if interactive.
 */
export function isInteractiveDropdown({ disabled = false, loading = false }) {
  return !disabled && !loading;
}

/**
 * Determines if dropdown should close on select.
 *
 * @param {Object} options - Dropdown options.
 * @param {boolean} [options.closeOnSelect] - Close on select.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {boolean} True if should close.
 */
export function shouldCloseOnSelect({
  closeOnSelect = DROPDOWN_DEFAULTS.closeOnSelect,
  disabled = false,
  loading = false,
}) {
  return closeOnSelect && !disabled && !loading;
}

/**
 * Determines if dropdown should close on outside click.
 *
 * @param {Object} options - Dropdown options.
 * @param {boolean} [options.closeOnOutsideClick] - Close on outside click.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {boolean} True if should close.
 */
export function shouldCloseOnOutsideClick({
  closeOnOutsideClick = DROPDOWN_DEFAULTS.closeOnOutsideClick,
  disabled = false,
  loading = false,
}) {
  return closeOnOutsideClick && !disabled && !loading;
}

/**
 * Determines if dropdown should close on escape.
 *
 * @param {Object} options - Dropdown options.
 * @param {boolean} [options.closeOnEscape] - Close on escape.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {boolean} True if should close.
 */
export function shouldCloseOnEscape({
  closeOnEscape = DROPDOWN_DEFAULTS.closeOnEscape,
  disabled = false,
  loading = false,
}) {
  return closeOnEscape && !disabled && !loading;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for dropdown components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.label] - Dropdown label.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {boolean} [state.open] - Open state.
 * @param {number} [state.activeIndex] - Active item index.
 * @param {number} [state.itemsCount] - Total items count.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  label = '',
  disabled = false,
  open = false,
  activeIndex = -1,
  itemsCount = 0,
}) {
  return {
    getRole: () => 'combobox',
    getAriaLabel: () => label || 'Dropdown',
    getAriaExpanded: () => open,
    getAriaDisabled: () => disabled || undefined,
    getAriaActiveDescendant: () => (activeIndex >= 0 ? `dropdown-item-${activeIndex}` : undefined),
    getAriaControls: () => 'dropdown-menu',
    getAriaHasPopup: () => 'listbox',
    getTabIndex: () => (disabled ? -1 : 0),
    getAriaSelected: (index) => index === activeIndex,
    getAriaPosInSet: (index) => index + 1,
    getAriaSetSize: () => itemsCount,
  };
}

/* ---------------------------------- */
/* Re-exported Utilities              */
/* ---------------------------------- */

// Re-export token utilities for convenience
export {
  getDropdownVariant,
  getDropdownSize,
  getDropdownRadius,
  getDropdownShadow,
  getDropdownPosition,
  getDropdownAnimation,
};