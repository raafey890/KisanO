/**
 * KisanO Design System — Modal Package
 * ModalOverlay
 *
 * A full-screen overlay backdrop for modals, drawers, and other overlay
 * components. Supports multiple visual variants (default, dark, transparent,
 * blur) and handles click interactions with the overlay.
 *
 * Single Responsibility: Render a full-screen overlay backdrop.
 * Does not handle modal logic, positioning, or content.
 *
 * @module components/ui/Modal/ModalOverlay
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';


import {
  mergeClasses,
  resolveResponsiveClasses,
} from './modalUtils';

/* ---------------------------------- */
/* Component‑specific tokens          */
/* ---------------------------------- */

/** Variant classes for different overlay styles. */
const OVERLAY_VARIANTS = {
  default: 'bg-black/50',
  dark: 'bg-black/80',
  transparent: 'bg-transparent',
  blur: 'bg-black/40 backdrop-blur-sm',
};

/** Default variant when not provided. */
const DEFAULT_VARIANT = 'default';

/** Motion variants for overlay animation. */
const OVERLAY_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * ModalOverlay – a full-screen backdrop for modal components.
 *
 * @component
 * @example
 * <ModalOverlay visible={isOpen} onClick={handleClose} variant="blur" />
 */
const ModalOverlay = memo(
  forwardRef(function ModalOverlay(
    {
      visible = false,
      onClick,
      variant = DEFAULT_VARIANT,
      animated = true,
      disabled = false,
      responsive,
      className = '',
      children,
      role = 'presentation',
      'aria-hidden': ariaHidden = true,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Resolve variant classes.
    const variantClasses = useMemo(
      () => OVERLAY_VARIANTS[variant] || OVERLAY_VARIANTS[DEFAULT_VARIANT],
      [variant],
    );

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    // Base overlay classes.
    const overlayClasses = useMemo(() => {
      const base = mergeClasses(
        'fixed inset-0 z-40',
        variantClasses,
        disabled && 'pointer-events-none opacity-50 cursor-not-allowed',
        className,
      );
      return mergeClasses(base, responsiveClasses);
    }, [variantClasses, disabled, className, responsiveClasses]);

    // Determine if animation should be applied.
    const shouldAnimate = animated && !prefersReducedMotion;

    // Motion props.
    const motionProps = useMemo(() => {
      if (!shouldAnimate) {
        return { initial: false, animate: true, exit: false };
      }
      return OVERLAY_MOTION;
    }, [shouldAnimate]);

    // Handle overlay click.
    const handleClick = useCallback(
      (event) => {
        if (disabled) return;
        if (event.target === event.currentTarget) {
          onClick?.(event);
        }
      },
      [disabled, onClick],
    );

    // If not visible, don't render anything.
    if (!visible) return null;

    return (
      <motion.div
        ref={ref}
        className={overlayClasses}
        onClick={handleClick}
        role={role}
        aria-hidden={ariaHidden}
        {...motionProps}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }),
);

ModalOverlay.displayName = 'ModalOverlay';

ModalOverlay.propTypes = {
  /** Controls overlay visibility. */
  visible: PropTypes.bool,
  /** Click handler (typically to close the modal). */
  onClick: PropTypes.func,
  /** Visual variant of the overlay. */
  variant: PropTypes.oneOf(['default', 'dark', 'transparent', 'blur']),
  /** Whether to animate the overlay. */
  animated: PropTypes.bool,
  /** Disables click interactions and dims the overlay. */
  disabled: PropTypes.bool,
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
  /** Optional content to render inside the overlay. */
  children: PropTypes.node,
  /** ARIA role. */
  role: PropTypes.string,
  /** Hides the overlay from screen readers. */
  'aria-hidden': PropTypes.bool,
};

export default ModalOverlay;