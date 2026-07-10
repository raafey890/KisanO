/**
 * KisanO Design System - Button Utilities
 * 
 * Production-ready utility functions for the Button package.
 * Provides comprehensive utility functions for button styling, validation,
 * and state management following KisanO Design System principles.
 * 
 * @author KisanO Design System Team
 * @version 1.0.0
 * @file buttonUtils.js
 * @since 2024-07-07
 */

import { 
  buttonTokens, 
  getVariantStyles, 
  getSizeStyles, 
  getShapeStyles, 
  getDisabledStyles, 
  getLoadingStyles, 
  getHoverStyles, 
  getFocusRingStyles 
} from './buttonVariants';

/**
 * Merge multiple className strings into a single className string.
 * Handles null, undefined, empty strings, and duplicates.
 * 
 * @param {...string} classNames - Class names to merge
 * @returns {string} Merged className string
 */
function mergeClasses(...classNames) {
  return classNames
    .filter(className => className && className.trim() !== '')
    .join(' ')
    .trim();
}

/**
 * Get complete button classes based on props and current state.
 * Combines variant, size, shape, and state classes into a single string.
 * 
 * @param {Object} props - Button properties
 * @param {boolean} props.isDisabled - Disabled state flag
 * @param {boolean} props.isLoading - Loading state flag
 * @param {boolean} props.isHovered - Hover state flag
 * @param {boolean} props.isFocused - Focus state flag
 * @param {string} props.variant - Button variant
 * @param {string} props.size - Button size
 * @param {string} props.shape - Button shape
 * @param {string} props.className - Additional custom classes
 * @param {string} props.baseClass - Base button class
 * @returns {string} Complete button classes string
 */
function getButtonClasses({
  isDisabled = false,
  isLoading = false,
  isHovered = false,
  isFocused = false,
  variant = 'primary',
  size = 'md',
  shape = 'default',
  className = '',
  baseClass = 'btn'
}) {
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);
  const shapeStyles = getShapeStyles(shape);
  const disabledStyles = getDisabledStyles(isDisabled);
  const loadingStyles = getLoadingStyles(isLoading);
  const hoverStyles = getHoverStyles(isHovered);
  
  return mergeClasses(
    baseClass,
    variantStyles.classes,
    sizeStyles.classes,
    shapeStyles,
    disabledStyles.classes,
    loadingStyles ? 'loading' : '',
    isHovered ? 'hovered' : '',
    isFocused ? 'focused' : '',
    className
  );
}

/**
 * Get variant-specific classes for button styling.
 * Extracts and returns variant-specific Tailwind utility classes.
 * 
 * @param {string} variant - Button variant name
 * @returns {Object} Variant-specific classes
 */
function getVariantClasses(variant) {
  const variantStyles = getVariantStyles(variant);
  return {
    background: variantStyles.backgroundColor,
    text: variantStyles.textColor,
    border: variantStyles.borderColor,
    shadow: variantStyles.shadow,
    hover: variantStyles.hoverBackgroundColor
  };
}

/**
 * Get size-specific classes for button dimensions.
 * Extracts and returns size-specific Tailwind utility classes.
 * 
 * @param {string} size - Button size
 * @returns {Object} Size-specific classes
 */
function getSizeClasses(size) {
  const sizeStyles = getSizeStyles(size);
  return {
    padding: sizeStyles.padding,
    fontSize: sizeStyles.fontSize,
    height: sizeStyles.height,
    borderRadius: sizeStyles.borderRadius,
    iconSize: sizeStyles.iconSize,
    gap: sizeStyles.gap
  };
}

/**
 * Get shape-specific classes for button border radius.
 * Returns the appropriate shape classes for the given shape type.
 * 
 * @param {string} shape - Button shape
 * @returns {string} Shape classes
 */
function getShapeClasses(shape) {
  const shapeStyles = getShapeStyles(shape);
  return shapeStyles;
}

/**
 * Get shadow-specific classes for button elevation.
 * Returns the appropriate shadow classes based on variant and state.
 * 
 * @param {string} variant - Button variant
 * @param {boolean} isHovered - Hover state flag
 * @returns {string} Shadow classes
 */
function getShadowClasses(variant, isHovered = false) {
  const variantStyles = getVariantStyles(variant);
  return isHovered ? variantStyles.hoverShadow : variantStyles.shadow;
}

/**
 * Get disabled state classes for button appearance.
 * Returns appropriate Tailwind classes for disabled state styling.
 * 
 * @param {boolean} isDisabled - Disabled state flag
 * @returns {Object} Disabled state classes
 */
function getDisabledClasses(isDisabled) {
  return getDisabledStyles(isDisabled);
}

/**
 * Get loading state classes for button appearance.
 * Returns appropriate Tailwind classes for loading state styling.
 * 
 * @param {boolean} isLoading - Loading state flag
 * @returns {string} Loading state classes
 */
function getLoadingClasses(isLoading) {
  return getLoadingStyles(isLoading) ? 'loading' : '';
}

/**
 * Get focus ring classes for accessibility.
 * Returns appropriate focus ring classes for keyboard navigation.
 * 
 * @param {string} variant - Button variant
 * @returns {string} Focus ring classes
 */
function getFocusRingClasses(variant) {
  const focusRingStyles = getFocusRingStyles(variant);
  return focusRingStyles.className || '';
}

/**
 * Get icon size based on button size.
 * Returns appropriate icon size for the given button size.
 * 
 * @param {string} size - Button size
 * @returns {string} Icon size classes
 */
function getIconSize(size) {
  const sizeStyles = getSizeStyles(size);
  return sizeStyles.iconSize || 'icon-md';
}

/**
 * Get icon spacing based on button size.
 * Returns appropriate icon spacing for the given button size.
 * 
 * @param {string} size - Button size
 * @returns {string} Icon spacing classes
 */
function getIconSpacing(size) {
  const sizeStyles = getSizeStyles(size);
  return sizeStyles.gap || 'gap-2';
}

/**
 * Get button state information for conditional rendering.
 * Returns an object with all relevant button state information.
 * 
 * @param {Object} props - Button properties
 * @returns {Object} Button state information
 */
function getButtonState({
  isDisabled = false,
  isLoading = false,
  isHovered = false,
  isFocused = false,
  hasIcon = false,
  text = ''
}) {
  return {
    isDisabled,
    isLoading,
    isHovered,
    isFocused,
    isIconOnly: isIconOnlyButton({ hasIcon, text }),
    isInteractive: !isDisabled && !isLoading,
    ariaAttributes: {
      'aria-disabled': isDisabled,
      'aria-busy': isLoading,
      'aria-expanded': false
    }
  };
}

/**
 * Check if button is icon-only (contains only icon, no text).
 * Used for accessibility and responsive layout adjustments.
 * 
 * @param {Object} props - Button properties
 * @param {boolean} props.hasIcon - Has icon flag
 * @param {string} props.text - Button text
 * @returns {boolean} Icon-only button flag
 */
function isIconOnlyButton({ hasIcon = false, text = '' }) {
  return hasIcon && (!text || text.trim() === '');
}

/**
 * Validate button variant against allowed variants.
 * Returns true if variant is valid, false otherwise.
 * 
 * @param {string} variant - Button variant to validate
 * @returns {boolean} Variant validation result
 */
function isValidVariant(variant) {
  const validVariants = Object.keys(buttonTokens.variants);
  return validVariants.includes(variant);
}

/**
 * Validate button size against allowed sizes.
 * Returns true if size is valid, false otherwise.
 * 
 * @param {string} size - Button size to validate
 * @returns {boolean} Size validation result
 */
function isValidSize(size) {
  const validSizes = Object.keys(buttonTokens.sizes);
  return validSizes.includes(size);
}

/**
 * Validate button shape against allowed shapes.
 * Returns true if shape is valid, false otherwise.
 * 
 * @param {string} shape - Button shape to validate
 * @returns {boolean} Shape validation result
 */
function isValidShape(shape) {
  const validShapes = Object.keys(buttonTokens.shapes);
  return validShapes.includes(shape);
}

/**
 * Resolve default values for button props.
 * Provides sensible defaults for all button properties.
 * 
 * @param {Object} props - Button properties
 * @returns {Object} Resolved button properties
 */
function resolveDefaultProps({
  variant = 'primary',
  size = 'md',
  shape = 'default',
  isDisabled = false,
  isLoading = false,
  isHovered = false,
  isFocused = false,
  className = '',
  baseClass = 'btn'
}) {
  return {
    variant: isValidVariant(variant) ? variant : 'primary',
    size: isValidSize(size) ? size : 'md',
    shape: isValidShape(shape) ? shape : 'default',
    isDisabled,
    isLoading,
    isHovered,
    isFocused,
    className,
    baseClass
  };
}

/**
 * Enhanced className merging with responsiveness support.
 * Supports responsive className merging with breakpoints.
 * 
 * @param {string} baseClasses - Base classes
 * @param {Object} responsiveClasses - Responsive classes object
 * @param {string} breakpoint - Breakpoint prefix
 * @returns {string} Enhanced className string
 */
function mergeResponsiveClasses(baseClasses, responsiveClasses, breakpoint = '') {
  return mergeClasses(
    baseClasses,
    ...Object.entries(responsiveClasses).map(
      ([breakpoint, classes]) => `${breakpoint}:${classes}`
    )
  );
}

/**
 * Safely resolve theme-based values with fallback support.
 * Provides safe fallback handling for theme-based properties.
 * 
 * @param {Object} theme - Theme object
 * @param {string} path - Property path
 * @param {*} fallback - Fallback value
 * @returns {*} Resolved value with fallback
 */
function resolveThemeValue(theme, path, fallback) {
  const keys = path.split('.');
  let value = theme;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return fallback;
    }
  }
  
  return value !== undefined ? value : fallback;
}

/**
 * Button accessibility helper for screen readers.
 * Provides accessibility-focused helper functions for button accessibility.
 * 
 * @param {Object} state - Button state
 * @returns {Object} Accessibility helpers
 */
function getAccessibilityHelpers(state) {
  return {
    getAriaLabel: () => {
      if (state.isIconOnly) {
        return 'Button with icon only';
      }
      return state.text || 'Button';
    },
    getRole: () => 'button',
    getTabIndex: () => state.isInteractive ? 0 : -1,
    getScreenReaderText: () => {
      const baseText = state.text || 'Button';
      const stateText = state.isLoading ? 'Loading' : 
                       state.isDisabled ? 'Disabled' : 
                       state.isHovered ? 'Hovered' : '';
      
      return stateText ? `${baseText}, ${stateText}` : baseText;
    }
  };
}

// Public API exports
export {
  mergeClasses,
  getButtonClasses,
  getVariantClasses,
  getSizeClasses,
  getShapeClasses,
  getShadowClasses,
  getDisabledClasses,
  getLoadingClasses,
  getFocusRingClasses,
  getIconSize,
  getIconSpacing,
  getButtonState,
  isIconOnlyButton,
  isValidVariant,
  isValidSize,
  isValidShape,
  resolveDefaultProps,
  mergeResponsiveClasses,
  resolveThemeValue,
  getAccessibilityHelpers
};