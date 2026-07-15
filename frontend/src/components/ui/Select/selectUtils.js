/**
 * KisanO Design System — Select Package
 * Select Utilities
 *
 * Production-ready utility functions for the Select package.
 * Contains only pure utility functions based on the existing selectVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for select styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Select/selectUtils
 */

import {
  SELECT_VARIANTS,
  SELECT_SIZES,
  SELECT_RADIUS,
  SELECT_SHADOWS,
  SELECT_POSITIONS,
  SELECT_ANIMATIONS,
  SELECT_OPTION_STATES,
  SELECT_ICON_SIZES,
  SELECT_DEFAULTS,
  getSelectVariant,
  getSelectSize,
  getSelectRadius,
  getSelectShadow,
  getSelectPosition,
  getSelectAnimation,
  getSelectOptionState,
  getSelectIconSize,
} from './selectVariants';

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
 * Resolves default props for select components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Select variant.
 * @param {string} [props.size] - Select size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.shadow] - Shadow level.
 * @param {string} [props.position] - Select menu position.
 * @param {string} [props.animation] - Animation type.
 * @param {boolean} [props.closeOnSelect] - Close on select.
 * @param {boolean} [props.closeOnOutsideClick] - Close on outside click.
 * @param {boolean} [props.closeOnEscape] - Close on escape.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.loading] - Loading state.
 * @param {boolean} [props.multiple] - Multiple selection.
 * @param {boolean} [props.searchable] - Searchable.
 * @param {boolean} [props.clearable] - Clearable.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = SELECT_DEFAULTS.variant,
  size = SELECT_DEFAULTS.size,
  radius = SELECT_DEFAULTS.radius,
  shadow = SELECT_DEFAULTS.shadow,
  position = SELECT_DEFAULTS.position,
  animation = SELECT_DEFAULTS.animation,
  closeOnSelect = SELECT_DEFAULTS.closeOnSelect,
  closeOnOutsideClick = SELECT_DEFAULTS.closeOnOutsideClick,
  closeOnEscape = SELECT_DEFAULTS.closeOnEscape,
  disabled = SELECT_DEFAULTS.disabled,
  loading = SELECT_DEFAULTS.loading,
  multiple = SELECT_DEFAULTS.multiple,
  searchable = SELECT_DEFAULTS.searchable,
  clearable = SELECT_DEFAULTS.clearable,
}) {
  return {
    variant: SELECT_VARIANTS[variant] ? variant : SELECT_DEFAULTS.variant,
    size: SELECT_SIZES[size] ? size : SELECT_DEFAULTS.size,
    radius: SELECT_RADIUS[radius] ? radius : SELECT_DEFAULTS.radius,
    shadow: SELECT_SHADOWS[shadow] ? shadow : SELECT_DEFAULTS.shadow,
    position: SELECT_POSITIONS[position] ? position : SELECT_DEFAULTS.position,
    animation: SELECT_ANIMATIONS[animation] ? animation : SELECT_DEFAULTS.animation,
    closeOnSelect,
    closeOnOutsideClick,
    closeOnEscape,
    disabled,
    loading,
    multiple,
    searchable,
    clearable,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete select classes based on options.
 *
 * @param {Object} options - Select options.
 * @param {string} [options.variant] - Select variant.
 * @param {string} [options.size] - Select size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.shadow] - Shadow level.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged select classes.
 */
export function getSelectClasses({
  variant = SELECT_DEFAULTS.variant,
  size = SELECT_DEFAULTS.size,
  radius = SELECT_DEFAULTS.radius,
  shadow = SELECT_DEFAULTS.shadow,
  className = '',
  disabled = false,
  loading = false,
}) {
  const variantConfig = getSelectVariant(variant);
  const sizeConfig = getSelectSize(size);

  return mergeClasses(
    'relative w-full',
    variantConfig.background,
    variantConfig.text,
    variantConfig.border,
    variantConfig.hover,
    variantConfig.active,
    variantConfig.focus,
    getSelectRadius(radius),
    getSelectShadow(shadow),
    disabled && variantConfig.disabled,
    loading && 'opacity-70 cursor-progress',
    className,
  );
}

/**
 * Gets container classes for select wrapper.
 *
 * @param {string} [className] - Additional classes.
 * @returns {string} Merged container classes.
 */
export function getSelectContainerClasses(className = '') {
  return mergeClasses(
    'relative inline-block w-full',
    className,
  );
}

/**
 * Gets trigger classes for select trigger.
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
export function getSelectTriggerClasses({
  variant = SELECT_DEFAULTS.variant,
  size = SELECT_DEFAULTS.size,
  className = '',
  disabled = false,
  loading = false,
  open = false,
}) {
  const variantConfig = getSelectVariant(variant);
  const sizeConfig = getSelectSize(size);

  return mergeClasses(
    'flex items-center w-full',
    sizeConfig.triggerPadding || sizeConfig.padding,
    sizeConfig.minHeight,
    sizeConfig.text,
    sizeConfig.gap,
    variantConfig.background,
    variantConfig.text,
    variantConfig.border,
    variantConfig.hover,
    variantConfig.active,
    variantConfig.focus,
    getSelectRadius(SELECT_DEFAULTS.radius),
    'transition-all duration-200 ease-in-out',
    open && 'ring-2 ring-blue-500',
    disabled && variantConfig.disabled,
    loading && 'opacity-70 cursor-progress',
    className,
  );
}

/**
 * Gets menu classes for select menu.
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
export function getSelectMenuClasses({
  position = SELECT_DEFAULTS.position,
  radius = SELECT_DEFAULTS.radius,
  shadow = SELECT_DEFAULTS.shadow,
  className = '',
  disabled = false,
  loading = false,
}) {
  const positionClass = getSelectPosition(position);

  return mergeClasses(
    'absolute z-50 min-w-[200px]',
    positionClass,
    'bg-white',
    'border border-gray-200',
    getSelectRadius(radius),
    getSelectShadow(shadow),
    'py-1',
    'overflow-y-auto max-h-[300px]',
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets option classes for select options.
 *
 * @param {Object} options - Option options.
 * @param {string} [options.state] - Option state (default, selected, active, disabled, highlighted).
 * @param {string} [options.size] - Option size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged option classes.
 */
export function getSelectOptionClasses({
  state = 'default',
  size = SELECT_DEFAULTS.size,
  className = '',
  disabled = false,
}) {
  const sizeConfig = getSelectSize(size);
  const stateClasses = getSelectOptionState(state);

  return mergeClasses(
    'flex items-center w-full cursor-pointer',
    sizeConfig.optionPadding || sizeConfig.padding,
    sizeConfig.optionText || sizeConfig.text,
    sizeConfig.gap,
    stateClasses,
    'transition-colors duration-150 ease-in-out',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className,
  );
}

/**
 * Gets search classes for select search input.
 *
 * @param {Object} options - Search options.
 * @param {string} [options.size] - Search size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged search classes.
 */
export function getSelectSearchClasses({
  size = SELECT_DEFAULTS.size,
  className = '',
  disabled = false,
}) {
  const sizeConfig = getSelectSize(size);

  return mergeClasses(
    'flex items-center w-full',
    sizeConfig.padding,
    sizeConfig.text,
    sizeConfig.gap,
    'border-b border-gray-200',
    disabled && 'opacity-50 cursor-not-allowed',
    className,
  );
}

/**
 * Gets label classes for select label.
 *
 * @param {Object} options - Label options.
 * @param {string} [options.size] - Label size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @returns {string} Merged label classes.
 */
export function getSelectLabelClasses({
  size = SELECT_DEFAULTS.size,
  className = '',
  disabled = false,
}) {
  const sizeConfig = getSelectSize(size);

  return mergeClasses(
    'block font-medium text-gray-700 mb-1.5',
    sizeConfig.text,
    disabled && 'opacity-50 cursor-not-allowed',
    className,
  );
}

/**
 * Gets empty state classes for select menu.
 *
 * @param {string} [className] - Additional classes.
 * @returns {string} Merged empty classes.
 */
export function getSelectEmptyClasses(className = '') {
  return mergeClasses(
    'px-4 py-3 text-sm text-gray-500 text-center',
    className,
  );
}

/**
 * Gets group classes for select group.
 *
 * @param {string} [className] - Additional classes.
 * @returns {string} Merged group classes.
 */
export function getSelectGroupClasses(className = '') {
  return mergeClasses(
    'py-1',
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
  return variant ? Object.keys(SELECT_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(SELECT_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(SELECT_RADIUS).includes(radius) : false;
}

/**
 * Validates if a shadow is valid.
 *
 * @param {string} shadow - The shadow to check.
 * @returns {boolean} True if valid.
 */
export function isValidShadow(shadow) {
  return shadow ? Object.keys(SELECT_SHADOWS).includes(shadow) : false;
}

/**
 * Validates if a position is valid.
 *
 * @param {string} position - The position to check.
 * @returns {boolean} True if valid.
 */
export function isValidPosition(position) {
  return position ? Object.keys(SELECT_POSITIONS).includes(position) : false;
}

/**
 * Validates if an animation is valid.
 *
 * @param {string} animation - The animation to check.
 * @returns {boolean} True if valid.
 */
export function isValidAnimation(animation) {
  return animation ? Object.keys(SELECT_ANIMATIONS).includes(animation) : false;
}

/* ---------------------------------- */
/* State Helpers                      */
/* ---------------------------------- */

/**
 * Determines if a select is interactive.
 *
 * @param {Object} options - Select options.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {boolean} True if interactive.
 */
export function isInteractiveSelect({ disabled = false, loading = false }) {
  return !disabled && !loading;
}

/**
 * Determines if select should close on select.
 *
 * @param {Object} options - Select options.
 * @param {boolean} [options.closeOnSelect] - Close on select.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {boolean} True if should close.
 */
export function shouldCloseOnSelect({
  closeOnSelect = SELECT_DEFAULTS.closeOnSelect,
  disabled = false,
  loading = false,
}) {
  return closeOnSelect && !disabled && !loading;
}

/**
 * Determines if select should close on outside click.
 *
 * @param {Object} options - Select options.
 * @param {boolean} [options.closeOnOutsideClick] - Close on outside click.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {boolean} True if should close.
 */
export function shouldCloseOnOutsideClick({
  closeOnOutsideClick = SELECT_DEFAULTS.closeOnOutsideClick,
  disabled = false,
  loading = false,
}) {
  return closeOnOutsideClick && !disabled && !loading;
}

/**
 * Determines if select should close on escape.
 *
 * @param {Object} options - Select options.
 * @param {boolean} [options.closeOnEscape] - Close on escape.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {boolean} True if should close.
 */
export function shouldCloseOnEscape({
  closeOnEscape = SELECT_DEFAULTS.closeOnEscape,
  disabled = false,
  loading = false,
}) {
  return closeOnEscape && !disabled && !loading;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for select components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.label] - Select label.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {boolean} [state.open] - Open state.
 * @param {number} [state.activeIndex] - Active option index.
 * @param {number} [state.optionsCount] - Total options count.
 * @param {boolean} [state.multiple] - Multiple selection.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  label = '',
  disabled = false,
  open = false,
  activeIndex = -1,
  optionsCount = 0,
  multiple = false,
}) {
  return {
    getRole: () => (multiple ? 'listbox' : 'combobox'),
    getAriaLabel: () => label || 'Select',
    getAriaExpanded: () => open,
    getAriaDisabled: () => disabled || undefined,
    getAriaActiveDescendant: () => (activeIndex >= 0 ? `select-option-${activeIndex}` : undefined),
    getAriaControls: () => 'select-menu',
    getAriaHasPopup: () => 'listbox',
    getAriaMultiSelectable: () => multiple || undefined,
    getTabIndex: () => (disabled ? -1 : 0),
    getAriaSelected: (index) => index === activeIndex,
    getAriaPosInSet: (index) => index + 1,
    getAriaSetSize: () => optionsCount,
  };
}

/* ---------------------------------- */
/* Re-exported Utilities              */
/* ---------------------------------- */

// Re-export token utilities for convenience
export {
  getSelectVariant,
  getSelectSize,
  getSelectRadius,
  getSelectShadow,
  getSelectPosition,
  getSelectAnimation,
  getSelectOptionState,
  getSelectIconSize,
};