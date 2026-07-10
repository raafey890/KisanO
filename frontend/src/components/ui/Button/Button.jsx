/**
 * KisanO Design System — Button Package
 * Button
 *
 * The main Button component that orchestrates all sub-components:
 * ButtonContainer, ButtonContent, ButtonIcon, ButtonLoader, and design tokens.
 *
 * Single Responsibility: This component orchestrates the complete button
 * functionality without implementing any sub-component logic.
 *
 * @module components/ui/Button/Button
 */
import { forwardRef, memo, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence } from 'framer-motion';
import { mergeClasses, isIconOnlyButton } from './buttonUtils';
import ButtonContainer from './ButtonContainer';
import ButtonContent from './ButtonContent';
import ButtonIcon from './ButtonIcon';
import ButtonLoader from './ButtonLoader';
import { getShadowClasses } from './buttonVariants';
/* ---------------------------------- */
/*Ripple effect component*/
const RippleEffect = memo(({ color = 'currentColor', isDark }) => {
  const baseColors = isDark 
    ? 'bg-white/30 backdrop-blur-sm' 
    : 'bg-black/10 backdrop-blur-sm';
  
  return (
    <span
      className={`absolute inset-0 rounded-inherit pointer-events-none ${baseColors}`}
      style={{
        animation: 'ripple 0.6s ease-out',
      }}
    />
  );
});
/* ---------------------------------- */
/*Helpers */
const isInteractive = ({ disabled, loading }) => !disabled && !loading;
const getRippleColor = (variant, disabled, isDark) => {
  if (disabled) return 'bg-gray-400/20';
  const variantColors = {
    primary: 'bg-white/30',
    secondary: 'bg-gray-900/20',
    outline: 'bg-gray-900/20',
    ghost: 'bg-gray-900/10',
    gradient: 'bg-white/30',
    success: 'bg-white/30',
    warning: 'bg-white/30',
    danger: 'bg-white/30',
  };
  return variantColors[variant] || variantColors.primary;
};
/* ---------------------------------- */
/*Motion variants*/
const BUTTON_VARIANTS = {
  rest: {
    scale: 1,
    y: 0,
    transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] },
  },
  hover: {
    scale: 1.02,
    y: -2,
    transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
  },
  tap: {
    scale: 0.96,
    y: 0,
    transition: { duration: 0.1, ease: [0.23, 1, 0.32, 1] },
  },
  focus: {
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)',
    transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] },
  },
  disabled: {
    scale: 1,
    opacity: 0.6,
    transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] },
  },
  loading: {
    scale: 1,
    transition: { duration: 0.15, ease: [0.23, 1, 0.32, 1] },
  },
};
/* ---------------------------------- */
/*CSS keyframes for ripple animation */
const RippleStyles = () => (
  <style jsx global>{`
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    .button-ripple {
      position: relative;
      overflow: hidden;
    }
    .button-ripple::after {
      content: '';
      position: absolute;
      border-radius: inherit;
      pointer-events: none;
      animation: ripple 0.6s ease-out;
    }
  `}</style>
);
/* ---------------------------------- */
/*Component */
const Button = memo(
  forwardRef(function Button(
    {
      children,
      variant = 'primary',
      size = 'md',
      shape = 'default',
      shadow,
      leftIcon,
      rightIcon,
      loading = false,
      loadingText = 'Loading...',
      disabled = false,
      fullWidth = false,
      type = 'button',
      onClick,
      className,
      iconOnly = false,
      ...rest
    },
    forwardedRef
  ) {
    const isInteractiveButton = useMemo(() => isInteractive({ disabled, loading }), [disabled, loading]);
    const iconOnlyState = useMemo(() => isIconOnlyButton({ 
      hasIcon: !!(leftIcon || rightIcon), 
      text: children ? String(children).trim() : '' 
    }), [leftIcon, rightIcon, children]);
    const resolvedIconOnly = useMemo(() => iconOnly || iconOnlyState, [iconOnly, iconOnlyState]);
    const rippleColor = useMemo(() => getRippleColor(variant, disabled, variant === 'primary'), [variant, disabled]);
    const variantStyles = useMemo(() => getVariantStyles(variant), [variant]);
    const sizeStyles = useMemo(() => getSizeStyles(size), [size]);
    const shapeStyles = useMemo(() => getShapeStyles(shape), [shape]);
    const shadowClasses = useMemo(
  () => (shadow ? getShadowClasses(shadow) : ''),
  [shadow]
);
    const isDarkVariant = useMemo(() => ['primary', 'secondary', 'ghost', 'danger'].includes(variant), [variant]);
    const isDisabledOrLoading = useMemo(() => disabled || loading, [disabled, loading]);
    const containerClasses = useMemo(() => mergeClasses(
      'relative inline-flex items-center justify-center',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
      resolvedIconOnly ? 'p-0' : `${sizeStyles.padding} ${shapeStyles}`,
      fullWidth && 'w-full',
      shadowClasses,
      className
    ), [resolvedIconOnly, sizeStyles, shapeStyles, fullWidth, shadowClasses, className]);
    const handleClick = useCallback((event) => {
      if (!isInteractiveButton) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    }, [isInteractiveButton, onClick]);
    const rippleStyles = useMemo(() => ({
      background: rippleColor,
      borderRadius: shapeStyles,
    }), [rippleColor, shapeStyles]);
    return (
      <>
        <RippleStyles />
        <ButtonContainer
          ref={forwardedRef}
          variant={variant}
          size={size}
          shape={shape}
          shadow={shadow}
          disabled={disabled}
          fullWidth={fullWidth}
          className={containerClasses}
          onClick={handleClick}
          {...rest}
        >
          <AnimatePresence mode="sync">
            {loading ? (
              <ButtonLoader
                loading={loading}
                type="spinner"
                size={size}
                text={loadingText}
                className="flex-1"
                disabled={disabled}
              />
            ) : (
              <>
                {leftIcon && (
                  <ButtonIcon
                    icon={leftIcon}
                    position="left"
                    size={size}
                    loading={loading}
                    disabled={disabled}
                  />
                )}
                <ButtonContent
                  children={children}
                  leftIcon={leftIcon}
                  rightIcon={rightIcon}
                  iconPosition={resolvedIconOnly ? 'left' : 'right'}
                  loading={loading}
                  className={mergeClasses(
                    resolvedIconOnly && 'sr-only',
                    !resolvedIconOnly && 'relative z-10 text-inherit'
                  )}
                />
                {rightIcon && (
                  <ButtonIcon
                    icon={rightIcon}
                    position="right"
                    size={size}
                    loading={loading}
                    disabled={disabled}
                  />
                )}
              </>
            )}
          </AnimatePresence>
          {isInteractiveButton && (
  <RippleEffect
    color={rippleColor}
    isDark={isDarkVariant}
  />
)}
        </ButtonContainer>
      </>
    );
  }),
);
Button.displayName = 'Button';
Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'gradient', 'success', 'warning', 'danger']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  shape: PropTypes.oneOf(['default', 'rounded', 'pill', 'square']),
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  className: PropTypes.string,
  iconOnly: PropTypes.bool,
};
export default Button;