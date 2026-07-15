/**
 * KisanO Design System — Drawer Package
 * DrawerCloseButton
 *
 * A dedicated close button for drawers. Renders a circular button with
 * a close (X) icon by default. Designed to be placed in DrawerHeader actions.
 *
 * Single Responsibility: Render a close button for drawers.
 * Does not handle drawer logic or positioning.
 *
 * @module components/ui/Drawer/DrawerCloseButton
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  DRAWER_DEFAULTS,
  getDrawerSize,
} from './drawerVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  getDrawerCloseButtonClasses,
} from './drawerUtils';

/* ---------------------------------- */
/* Component-specific tokens          */
/* ---------------------------------- */

/** Size presets for the close button. */
const BUTTON_SIZES = {
  xs: 'h-6 w-6',
  sm: 'h-7 w-7',
  md: 'h-8 w-8',
  lg: 'h-9 w-9',
  xl: 'h-10 w-10',
  full: 'h-10 w-10',
};

/** Icon size presets. */
const ICON_SIZES = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
  full: 'h-6 w-6',
};

/** Motion variants. */
const CLOSE_BUTTON_MOTION = {
  initial: { opacity: 0, scale: 0.8, rotate: -90 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  exit: { opacity: 0, scale: 0.8, rotate: 90 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * DrawerCloseButton – a dedicated close button for drawers.
 *
 * @component
 * @example
 * <DrawerCloseButton onClick={onClose} size="md" />
 *
 * @example
 * <DrawerCloseButton
 *   onClick={onClose}
 *   icon={<CustomIcon />}
 *   aria-label="Close drawer"
 * />
 */
const DrawerCloseButton = memo(
  forwardRef(function DrawerCloseButton(
    {
      onClick,
      icon,
      size = DRAWER_DEFAULTS.size,
      variant = DRAWER_DEFAULTS.variant,
      disabled = false,
      loading = false,
      autoFocus = false,
      responsive,
      className = '',
      'aria-label': ariaLabel = 'Close drawer',
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Resolve button size.
    const buttonSize = useMemo(
      () => BUTTON_SIZES[size] || BUTTON_SIZES.md,
      [size],
    );

    // Resolve icon size.
    const iconSize = useMemo(
      () => ICON_SIZES[size] || ICON_SIZES.md,
      [size],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Close button classes.
    const buttonClasses = useMemo(() => {
      const base = getDrawerCloseButtonClasses({
        size,
        className,
        disabled,
      });
      return mergeClasses(base, responsiveClasses);
    }, [size, className, disabled, responsiveClasses]);

    // Motion props - respect reduced motion.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return {
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
        ...CLOSE_BUTTON_MOTION,
      };
    }, [prefersReducedMotion]);

    // Handle click with safety.
    const handleClick = useCallback(
      (event) => {
        if (disabled || loading) return;
        onClick?.(event);
      },
      [disabled, loading, onClick],
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

DrawerCloseButton.displayName = 'DrawerCloseButton';

DrawerCloseButton.propTypes = {
  /** Click handler. */
  onClick: PropTypes.func,
  /** Custom icon (defaults to close X). */
  icon: PropTypes.node,
  /** Size of the button. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full']),
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error', 'glass']),
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Auto-focus the button on mount. */
  autoFocus: PropTypes.bool,
  /** Responsive overrides. */
  responsive: PropTypes.shape({
    xs: PropTypes.string,
    sm: PropTypes.string,
    md: PropTypes.string,
    lg: PropTypes.string,
    xl: PropTypes.string,
  }),
  /** Additional CSS classes. */
  className: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default DrawerCloseButton;