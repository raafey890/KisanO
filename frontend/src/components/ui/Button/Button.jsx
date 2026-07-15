/**
 * KisanO Design System - Button Component
 * 
 * Production-ready Button component that composes all sub-components
 * following KisanO Design System principles.
 * 
 * @author KisanO Design System Team
 * @version 1.0.0
 * @file Button.jsx
 * @since 2024-07-07
 */

import React, { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';

// Import sub-components
import ButtonContainer from './ButtonContainer';
import ButtonContent from './ButtonContent';
import ButtonIcon from './ButtonIcon';
import ButtonLoader from './ButtonLoader';

// Import utilities
import {
  isValidVariant,
  isValidSize,
  isValidShape,
  isIconOnlyButton,
  getButtonState,
  getAccessibilityHelpers,
  mergeClasses,
} from './buttonUtils';

/**
 * Button Component - KisanO Design System
 * 
 * The main Button component that composes all sub-components
 * for a complete, accessible, and customizable button experience.
 * 
 * @param {Object} props
 * @param {string} props.variant - Button variant (primary, secondary, outline, ghost, gradient, success, danger, warning)
 * @param {string} props.size - Button size (xs, sm, md, lg, xl)
 * @param {string} props.shape - Button shape (default, rounded, pill, square)
 * @param {React.ReactNode} props.children - Button text/content
 * @param {React.ReactNode} props.leftIcon - Icon on the left side
 * @param {React.ReactNode} props.rightIcon - Icon on the right side
 * @param {string} props.iconPosition - Icon position (left, right)
 * @param {boolean} props.loading - Loading state
 * @param {string} props.loadingText - Text to show during loading
 * @param {string} props.loaderType - Loader type (spinner, dots, pulse, circle)
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.readOnly - Read-only state
 * @param {boolean} props.error - Error state
 * @param {boolean} props.success - Success state
 * @param {boolean} props.warning - Warning state
 * @param {boolean} props.fullWidth - Full width button
 * @param {boolean} props.animate - Enable animations
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.id - HTML id attribute
 * @param {function} props.onClick - Click handler
 * @param {function} props.onFocus - Focus handler
 * @param {function} props.onBlur - Blur handler
 * @param {function} props.onMouseEnter - Mouse enter handler
 * @param {function} props.onMouseLeave - Mouse leave handler
 * @param {function} props.onKeyDown - Key down handler
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {string} props.ariaLabel - ARIA label for accessibility
 * @param {Object} props.ariaDescribedBy - ARIA described by
 * @param {Object} props.ariaExpanded - ARIA expanded state
 * @param {Object} props.ariaControls - ARIA controls
 * @param {Object} props.ariaHaspopup - ARIA has popup
 * @param {Object} props.ariaPressed - ARIA pressed state
 * @param {Object} props.dataAttributes - Data attributes
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element} Rendered Button component
 */
const Button = forwardRef(function Button(
  {
    // Variant and styling
    variant = 'primary',
    size = 'md',
    shape = 'default',
    
    // Content
    children,
    leftIcon,
    rightIcon,
    iconPosition = 'left',
    
    // States
    loading = false,
    loadingText,
    loaderType = 'spinner',
    disabled = false,
    readOnly = false,
    error = false,
    success = false,
    warning = false,
    
    // Layout
    fullWidth = false,
    animate = true,
    
    // Customization
    className = '',
    id,
    
    // Events
    onClick,
    onFocus,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    onKeyDown,
    
    // HTML attributes
    type = 'button',
    
    // Accessibility
    ariaLabel,
    ariaDescribedBy,
    ariaExpanded,
    ariaControls,
    ariaHaspopup,
    ariaPressed,
    
    // Additional data attributes
    dataAttributes = {},
    
    // All other props
    ...rest
  },
  ref
) {
  // Validate props
  const validVariant = isValidVariant(variant) ? variant : 'primary';
  const validSize = isValidSize(size) ? size : 'md';
  const validShape = isValidShape(shape) ? shape : 'default';
  
  // Determine if icon-only button
  const hasIcon = !!(leftIcon || rightIcon);
  const isIconOnly = isIconOnlyButton({ 
    hasIcon, 
    text: children ? String(children).trim() : '' 
  });
  
  // Get button state
  const buttonState = getButtonState({
    isDisabled: disabled,
    isLoading: loading,
    isHovered: false,
    isFocused: false,
    hasIcon,
    text: children ? String(children).trim() : '',
  });
  
  // Get accessibility helpers
  const accessHelpers = getAccessibilityHelpers({
    ...buttonState,
    text: children ? String(children).trim() : '',
    isIconOnly,
  });
  
  // Determine button text to display
  const displayText = loading && loadingText ? loadingText : children;
  
  // Determine if we should show loader
  const showLoader = loading && !isIconOnly;
  
  // Determine if we should show content
  const showContent = !loading || !isIconOnly;
  
  // Merge data attributes
  const mergedDataAttributes = {
    'data-variant': validVariant,
    'data-size': validSize,
    'data-shape': validShape,
    'data-loading': loading || undefined,
    'data-disabled': disabled || undefined,
    'data-readonly': readOnly || undefined,
    'data-error': error || undefined,
    'data-success': success || undefined,
    'data-warning': warning || undefined,
    'data-icon-only': isIconOnly || undefined,
    ...dataAttributes,
  };
  
  // Build ARIA attributes
  const ariaAttributes = {
    'aria-label': ariaLabel || accessHelpers.getAriaLabel(),
    'aria-describedby': ariaDescribedBy,
    'aria-expanded': ariaExpanded,
    'aria-controls': ariaControls,
    'aria-haspopup': ariaHaspopup,
    'aria-pressed': ariaPressed,
  };
  
  // Filter out undefined ARIA attributes
  const filteredAriaAttributes = Object.fromEntries(
    Object.entries(ariaAttributes).filter(([_, value]) => value !== undefined)
  );
  
  // Merge all props for container
  const containerProps = {
    variant: validVariant,
    size: validSize,
    shape: validShape,
    error,
    success,
    warning,
    loading,
    disabled,
    readOnly,
    fullWidth,
    animate,
    className,
    id,
    ref,
    onClick,
    onFocus,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    onKeyDown,
    ...filteredAriaAttributes,
    ...mergedDataAttributes,
    ...rest,
  };
  
  return (
    <ButtonContainer {...containerProps}>
      {showLoader && (
        <ButtonLoader
          loading={loading}
          type={loaderType}
          size={validSize}
          text={loadingText}
          className="mr-2"
        />
      )}
      
      {showContent && (
        <ButtonContent
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          iconPosition={iconPosition}
          loading={loading}
        >
          {displayText}
        </ButtonContent>
      )}
    </ButtonContainer>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  // Variant and styling
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'gradient', 'success', 'danger', 'warning']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  shape: PropTypes.oneOf(['default', 'rounded', 'pill', 'square']),
  
  // Content
  children: PropTypes.node,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  
  // States
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  loaderType: PropTypes.oneOf(['spinner', 'dots', 'pulse', 'circle']),
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  error: PropTypes.bool,
  success: PropTypes.bool,
  warning: PropTypes.bool,
  
  // Layout
  fullWidth: PropTypes.bool,
  animate: PropTypes.bool,
  
  // Customization
  className: PropTypes.string,
  id: PropTypes.string,
  
  // Events
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onKeyDown: PropTypes.func,
  
  // HTML attributes
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  
  // Accessibility
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  ariaExpanded: PropTypes.bool,
  ariaControls: PropTypes.string,
  ariaHaspopup: PropTypes.oneOf(['true', 'false', 'menu', 'listbox', 'tree', 'grid', 'dialog']),
  ariaPressed: PropTypes.oneOf(['true', 'false', 'mixed']),
  
  // Additional data attributes
  dataAttributes: PropTypes.object,
};

Button.defaultProps = {
  variant: 'primary',
  size: 'md',
  shape: 'default',
  iconPosition: 'left',
  loading: false,
  loaderType: 'spinner',
  disabled: false,
  readOnly: false,
  error: false,
  success: false,
  warning: false,
  fullWidth: false,
  animate: true,
  className: '',
  type: 'button',
};

export default Button;