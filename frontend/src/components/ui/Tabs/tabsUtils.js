/**
 * KisanO Design System — Tabs Package
 * Tabs Utilities
 *
 * Production-ready utility functions for the Tabs package.
 * Contains only pure utility functions based on the existing tabsVariants.js tokens.
 *
 * Single Responsibility: This module only provides utility functions
 * for tabs styling, validation, and composition - no design tokens or React components.
 *
 * @module components/ui/Tabs/tabsUtils
 */

import {
  TABS_VARIANTS,
  TABS_SIZES,
  TABS_RADIUS,
  TABS_INDICATORS,
  TABS_DEFAULTS,
  getTabsVariant,
  getTabsSize,
  getTabsRadius,
  getTabsIndicator,
} from './tabsVariants';

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
 * Resolves default props for tabs components.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.variant] - Tabs variant.
 * @param {string} [props.size] - Tabs size.
 * @param {string} [props.radius] - Border radius.
 * @param {string} [props.indicator] - Indicator type.
 * @param {string} [props.orientation] - Tabs orientation.
 * @param {boolean} [props.disabled] - Disabled state.
 * @param {boolean} [props.loading] - Loading state.
 * @returns {Object} Resolved props with defaults applied.
 */
export function resolveDefaultProps({
  variant = TABS_DEFAULTS.variant,
  size = TABS_DEFAULTS.size,
  radius = TABS_DEFAULTS.radius,
  indicator = TABS_DEFAULTS.indicator,
  orientation = TABS_DEFAULTS.orientation,
  disabled = TABS_DEFAULTS.disabled,
  loading = TABS_DEFAULTS.loading,
}) {
  return {
    variant: TABS_VARIANTS[variant] ? variant : TABS_DEFAULTS.variant,
    size: TABS_SIZES[size] ? size : TABS_DEFAULTS.size,
    radius: TABS_RADIUS[radius] ? radius : TABS_DEFAULTS.radius,
    indicator: TABS_INDICATORS[indicator] ? indicator : TABS_DEFAULTS.indicator,
    orientation,
    disabled,
    loading,
  };
}

/* ---------------------------------- */
/* Component Class Builders           */
/* ---------------------------------- */

/**
 * Gets complete tabs classes based on options.
 *
 * @param {Object} options - Tabs options.
 * @param {string} [options.variant] - Tabs variant.
 * @param {string} [options.size] - Tabs size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged tabs classes.
 */
export function getTabsClasses({
  variant = TABS_DEFAULTS.variant,
  size = TABS_DEFAULTS.size,
  radius = TABS_DEFAULTS.radius,
  className = '',
  disabled = false,
  loading = false,
}) {
  const variantConfig = getTabsVariant(variant);
  const sizeConfig = getTabsSize(size);

  return mergeClasses(
    'flex flex-col w-full',
    sizeConfig.gap,
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets container classes for tabs wrapper.
 *
 * @param {Object} options - Container options.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged container classes.
 */
export function getTabsContainerClasses({
  className = '',
  disabled = false,
  loading = false,
}) {
  return mergeClasses(
    'w-full',
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets list classes for tabs list.
 *
 * @param {Object} options - List options.
 * @param {string} [options.variant] - Tabs variant.
 * @param {string} [options.size] - Tabs size.
 * @param {string} [options.radius] - Border radius.
 * @param {string} [options.orientation] - Tabs orientation.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged list classes.
 */
export function getTabsListClasses({
  variant = TABS_DEFAULTS.variant,
  size = TABS_DEFAULTS.size,
  radius = TABS_DEFAULTS.radius,
  orientation = TABS_DEFAULTS.orientation,
  className = '',
  disabled = false,
  loading = false,
}) {
  const variantConfig = getTabsVariant(variant);
  const sizeConfig = getTabsSize(size);

  return mergeClasses(
    'flex relative',
    orientation === 'vertical' ? 'flex-col' : 'flex-row',
    sizeConfig.gap,
    variantConfig.border,
    getTabsRadius(radius),
    disabled && 'opacity-50',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets trigger classes for tabs trigger.
 *
 * @param {Object} options - Trigger options.
 * @param {string} [options.variant] - Tabs variant.
 * @param {string} [options.size] - Tabs size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.active] - Active state.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @param {string} [options.indicator] - Indicator type.
 * @returns {string} Merged trigger classes.
 */
export function getTabsTriggerClasses({
  variant = TABS_DEFAULTS.variant,
  size = TABS_DEFAULTS.size,
  className = '',
  active = false,
  disabled = false,
  loading = false,
  indicator = TABS_DEFAULTS.indicator,
}) {
  const variantConfig = getTabsVariant(variant);
  const sizeConfig = getTabsSize(size);
  const indicatorClass = getTabsIndicator(indicator);

  return mergeClasses(
    'inline-flex items-center justify-center',
    'relative',
    'font-medium',
    'transition-all duration-200 ease-in-out',
    'whitespace-nowrap',
    sizeConfig.padding,
    sizeConfig.text,
    sizeConfig.minHeight,
    sizeConfig.gap,
    variantConfig.background,
    variantConfig.text,
    variantConfig.border,
    variantConfig.hover,
    variantConfig.focus,
    active && variantConfig.active,
    active && indicatorClass,
    disabled && variantConfig.disabled,
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets content classes for tabs content panel.
 *
 * @param {Object} options - Content options.
 * @param {string} [options.size] - Tabs size.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.disabled] - Disabled state.
 * @param {boolean} [options.loading] - Loading state.
 * @returns {string} Merged content classes.
 */
export function getTabsContentClasses({
  size = TABS_DEFAULTS.size,
  className = '',
  disabled = false,
  loading = false,
}) {
  const sizeConfig = getTabsSize(size);

  return mergeClasses(
    'flex-1',
    sizeConfig.padding,
    disabled && 'opacity-50',
    loading && 'opacity-70',
    className,
  );
}

/**
 * Gets indicator classes for tabs indicator.
 *
 * @param {Object} options - Indicator options.
 * @param {string} [options.indicator] - Indicator type.
 * @param {string} [options.className] - Additional classes.
 * @param {boolean} [options.active] - Active state.
 * @param {string} [options.orientation] - Tabs orientation.
 * @returns {string} Merged indicator classes.
 */
export function getTabsIndicatorClasses({
  indicator = TABS_DEFAULTS.indicator,
  className = '',
  active = false,
  orientation = TABS_DEFAULTS.orientation,
}) {
  const indicatorClass = getTabsIndicator(indicator);

  if (indicator === 'none' || !active) {
    return '';
  }

  return mergeClasses(
    'absolute transition-all duration-300 ease-in-out',
    orientation === 'vertical'
      ? 'left-0 top-0 bottom-0 w-0.5 bg-blue-600'
      : 'bottom-0 left-0 right-0 h-0.5 bg-blue-600',
    indicatorClass,
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
  return variant ? Object.keys(TABS_VARIANTS).includes(variant) : false;
}

/**
 * Validates if a size is valid.
 *
 * @param {string} size - The size to check.
 * @returns {boolean} True if valid.
 */
export function isValidSize(size) {
  return size ? Object.keys(TABS_SIZES).includes(size) : false;
}

/**
 * Validates if a radius is valid.
 *
 * @param {string} radius - The radius to check.
 * @returns {boolean} True if valid.
 */
export function isValidRadius(radius) {
  return radius ? Object.keys(TABS_RADIUS).includes(radius) : false;
}

/* ---------------------------------- */
/* Accessibility Helpers              */
/* ---------------------------------- */

/**
 * Generates accessibility helpers for tabs components.
 *
 * @param {Object} state - Component state.
 * @param {string} [state.label] - Tabs label.
 * @param {boolean} [state.disabled] - Disabled state.
 * @param {string} [state.orientation] - Tabs orientation.
 * @param {number} [state.activeIndex] - Active tab index.
 * @param {number} [state.tabsCount] - Total number of tabs.
 * @returns {Object} Accessibility helper functions.
 */
export function getAccessibilityHelpers({
  label = '',
  disabled = false,
  orientation = TABS_DEFAULTS.orientation,
  activeIndex = -1,
  tabsCount = 0,
}) {
  return {
    getRole: () => 'tablist',
    getAriaLabel: () => label || 'Tabs',
    getAriaOrientation: () => orientation,
    getAriaDisabled: () => disabled || undefined,
    getAriaSelected: (index) => index === activeIndex,
    getAriaControls: (index) => `tabpanel-${index}`,
    getAriaPosInSet: (index) => index + 1,
    getAriaSetSize: () => tabsCount,
    getTabIndex: (index) => (disabled || index !== activeIndex ? -1 : 0),
  };
}

/* ---------------------------------- */
/* Re-exported Utilities              */
/* ---------------------------------- */

// Re-export token utilities for convenience
export {
  getTabsVariant,
  getTabsSize,
  getTabsRadius,
  getTabsIndicator,
};