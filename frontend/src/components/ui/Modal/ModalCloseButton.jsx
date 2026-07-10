/**
 * KisanO Design System — Modal Package
 * ModalCloseButton
 *
 * A dedicated close button for modals. Renders a circular button with
 * a close (X) icon by default. Designed to be placed in ModalHeader actions.
 *
 * Single Responsibility: Render a close button for modals.
 * Does not handle modal logic or positioning.
 *
 * @module components/ui/Modal/ModalCloseButton
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  MODAL_DEFAULTS,
} from './modalVariants';
import {
  mergeClasses,
} from './modalUtils';

/* ---------------------------------- */
/* Component‑specific tokens          */
/* ---------------------------------- */

/** Size presets for the button. */
const BUTTON_SIZES = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-7 w-7 text-sm',
  md: 'h-8 w-8 text-base',
  lg: 'h-9 w-9 text-lg',
  xl: 'h-10 w-10 text-xl',
};

/** Icon size presets. */
const ICON_SIZES = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
};

/** Default size when not provided. */
const DEFAULT_SIZE = MODAL_DEFAULTS.size || 'md';
const DEFAULT_VARIANT = MODAL_DEFAULTS.closeButtonVariant || 'ghost';

/** Variant classes. */
const VARIANT_CLASSES = {
  ghost: 'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
  filled: 'text-white bg-gray-500 hover:bg-gray-600',
  outlined: 'text-gray-500 border border-gray-300 hover:bg-gray-50',
  subtle: 'text-gray-400 hover:text-gray-600 hover:bg-gray-50',
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ModalCloseButton – a dedicated close button for modals.
 *
 * @component
 * @example
 * <ModalCloseButton onClick={onClose} size="md" />
 *
 * @example
 * <ModalCloseButton
 *   onClick={onClose}
 *   icon={<CustomIcon />}
 *   aria-label="Close dialog"
 * />
 */
const ModalCloseButton = memo(
  forwardRef(function ModalCloseButton(
    {
      onClick,
      icon,
      size = DEFAULT_SIZE,
      variant = DEFAULT_VARIANT,
      disabled = false,
      loading = false,
      autoFocus = false,
      className = '',
      'aria-label': ariaLabel = 'Close modal',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Resolve size classes.
    const sizeClasses = useMemo(
      () => BUTTON_SIZES[size] || BUTTON_SIZES[DEFAULT_SIZE],
      [size],
    );

    // Resolve icon size.
    const iconSize = useMemo(
      () => ICON_SIZES[size] || ICON_SIZES[DEFAULT_SIZE],
      [size],
    );

    // Resolve variant classes.
    const variantClasses = useMemo(
      () => VARIANT_CLASSES[variant] || VARIANT_CLASSES[DEFAULT_VARIANT],
      [variant],
    );

    // Base button classes.
    const buttonClasses = useMemo(() => {
      const base = mergeClasses(
        'inline-flex items-center justify-center',
        'rounded-full',
        sizeClasses,
        variantClasses,
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        'transition-colors duration-200',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        loading && 'opacity-70 cursor-progress',
        className,
      );
      return base;
    }, [sizeClasses, variantClasses, disabled, loading, className]);

    // Motion props.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return {
          whileHover: undefined,
          whileTap: undefined,
        };
      }
      return {
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
      };
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        type: 'button',
        'aria-label': ariaLabel,
        'aria-disabled': disabled || undefined,
        disabled,
        tabIndex: disabled ? -1 : 0,
      }),
      [ariaLabel, disabled],
    );

    // Default close icon (X).
    const defaultIcon = (
      <svg
        className={iconSize}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>
    );

    const buttonIcon = icon || defaultIcon;

    // Handle click with loading prevention.
    const handleClick = (event) => {
      if (disabled || loading) return;
      onClick?.(event);
    };

    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        onClick={handleClick}
        autoFocus={autoFocus}
        {...motionProps}
        {...ariaProps}
        {...rest}
      >
        {buttonIcon}
      </motion.button>
    );
  }),
);

ModalCloseButton.displayName = 'ModalCloseButton';

ModalCloseButton.propTypes = {
  /** Click handler. */
  onClick: PropTypes.func,
  /** Custom icon (defaults to close X). */
  icon: PropTypes.node,
  /** Size of the button. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Visual variant. */
  variant: PropTypes.oneOf(['ghost', 'filled', 'outlined', 'subtle']),
  /** Disables the button. */
  disabled: PropTypes.bool,
  /** Shows loading state. */
  loading: PropTypes.bool,
  /** Auto-focus the button on mount. */
  autoFocus: PropTypes.bool,
  /** Additional CSS classes. */
  className: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default ModalCloseButton;