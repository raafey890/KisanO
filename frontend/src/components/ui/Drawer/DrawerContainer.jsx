/**
 * KisanO Design System — Drawer Package
 * DrawerContainer
 *
 * The container component that wraps the drawer content and handles
 * open/close state, escape key, outside clicks, focus trapping,
 * body scroll locking, overlay rendering, and position-specific animations.
 *
 * Single Responsibility: Manage drawer positioning and interactions.
 * Does not render header, body, or footer content directly.
 *
 * @module components/ui/Drawer/DrawerContainer
 */

import { forwardRef, memo, useMemo, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import {
  DRAWER_DEFAULTS,
  getDrawerAnimation,
  getDrawerOverlay,
  getDrawerPositionTransform,
} from './drawerVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getDrawerContainerClasses,
  getDrawerOverlayClasses,
  getDrawerContentClasses,
  isInteractiveDrawer,
} from './drawerUtils';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * DrawerContainer – the main drawer wrapper with overlay and interactions.
 *
 * @component
 * @example
 * <DrawerContainer open={isOpen} onOpenChange={setOpen} position="right">
 *   <DrawerHeader>Title</DrawerHeader>
 *   <DrawerBody>Content</DrawerBody>
 *   <DrawerFooter>Actions</DrawerFooter>
 * </DrawerContainer>
 */
const DrawerContainer = memo(
  forwardRef(function DrawerContainer(
    {
      children,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      variant = DRAWER_DEFAULTS.variant,
      size = DRAWER_DEFAULTS.size,
      radius = DRAWER_DEFAULTS.radius,
      shadow = DRAWER_DEFAULTS.shadow,
      position = DRAWER_DEFAULTS.position,
      animation = DRAWER_DEFAULTS.animation,
      overlay = DRAWER_DEFAULTS.overlay,
      closeOnEscape = DRAWER_DEFAULTS.closeOnEscape,
      closeOnOutsideClick = DRAWER_DEFAULTS.closeOnOutsideClick,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      overlayClassName = '',
      containerClassName = '',
      role = 'dialog',
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
    const containerRef = useRef(null);
    const drawerRef = useRef(null);
    const previousFocusRef = useRef(null);
    const [internalOpen, setInternalOpen] = useState(defaultOpen);

    // Determine if controlled or uncontrolled.
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    // Handle open state change.
    const handleOpenChange = useCallback(
      (newOpen) => {
        if (!isControlled) {
          setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
      },
      [isControlled, onOpenChange],
    );

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          radius,
          shadow,
          position,
          animation,
          overlay,
          closeOnEscape,
          closeOnOutsideClick,
          disabled,
          loading,
        }),
      [
        variant,
        size,
        radius,
        shadow,
        position,
        animation,
        overlay,
        closeOnEscape,
        closeOnOutsideClick,
        disabled,
        loading,
      ],
    );

    // Determine if interactive.
    const interactive = useMemo(
      () => isInteractiveDrawer({ disabled: resolved.disabled, loading: resolved.loading }),
      [resolved.disabled, resolved.loading],
    );

    // Container classes.
    const containerClasses = useMemo(() => {
      const base = getDrawerContainerClasses(containerClassName);
      return responsive ? mergeClasses(base, resolveResponsiveClasses(responsive)) : base;
    }, [containerClassName, responsive]);

    // Overlay classes.
    const overlayClasses = useMemo(
      () => getDrawerOverlayClasses(resolved.overlay, overlayClassName),
      [resolved.overlay, overlayClassName],
    );

    // Drawer content classes.
    const contentClasses = useMemo(() => {
      const base = getDrawerContentClasses({
        position: resolved.position,
        size: resolved.size,
        className,
      });
      return responsive ? mergeClasses(base, resolveResponsiveClasses(responsive)) : base;
    }, [resolved.position, resolved.size, className, responsive]);

    // Position transform for animation.
    const positionTransform = useMemo(
      () => getDrawerPositionTransform(resolved.position),
      [resolved.position],
    );

    // Animation props - respect reduced motion.
    const animationConfig = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      const anim = getDrawerAnimation(resolved.animation);
      return {
        initial: { ...positionTransform.initial, ...anim.initial },
        animate: { ...positionTransform.animate, ...anim.animate },
        exit: { ...positionTransform.exit, ...anim.exit },
        transition: { ...anim.transition, duration: 0.25 },
      };
    }, [prefersReducedMotion, resolved.animation, positionTransform]);

    // Overlay animation props.
    const overlayAnimationConfig = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2, ease: 'easeOut' },
      };
    }, [prefersReducedMotion]);

    // Handle Escape key.
    useEffect(() => {
      if (!open || !interactive || !resolved.closeOnEscape) return;

      const handleEscape = (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          handleOpenChange(false);
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [open, interactive, resolved.closeOnEscape, handleOpenChange]);

    // Handle outside click.
    useEffect(() => {
      if (!open || !interactive || !resolved.closeOnOutsideClick) return;

      const handleOutsideClick = (event) => {
        if (drawerRef.current && !drawerRef.current.contains(event.target)) {
          handleOpenChange(false);
        }
      };

      // Use mousedown to capture clicks before they bubble.
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [open, interactive, resolved.closeOnOutsideClick, handleOpenChange]);

    // Focus trap.
    useEffect(() => {
      if (!open || !interactive) return;

      // Store the previously focused element.
      previousFocusRef.current = document.activeElement;

      // Focus the drawer when it opens.
      const focusableElements = drawerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (focusableElements && focusableElements.length > 0) {
        setTimeout(() => focusableElements[0].focus(), 0);
      } else if (drawerRef.current) {
        drawerRef.current.focus();
      }

      // Trap focus inside the drawer.
      const handleFocus = (event) => {
        if (!drawerRef.current?.contains(event.target)) {
          const firstFocusable = drawerRef.current?.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          if (firstFocusable) {
            firstFocusable.focus();
          }
        }
      };

      document.addEventListener('focusin', handleFocus);

      return () => {
        document.removeEventListener('focusin', handleFocus);
        // Restore focus when drawer closes.
        if (previousFocusRef.current) {
          setTimeout(() => previousFocusRef.current?.focus(), 0);
        }
      };
    }, [open, interactive]);

    // Body scroll lock.
    useEffect(() => {
      if (!open) return;

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }, [open]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-modal': true,
        'aria-labelledby': ariaLabelledBy,
        'aria-describedby': ariaDescribedBy,
        'aria-label': ariaLabel,
        'aria-disabled': resolved.disabled || undefined,
        'aria-busy': resolved.loading || undefined,
        tabIndex: -1,
      }),
      [role, ariaLabelledBy, ariaDescribedBy, ariaLabel, resolved.disabled, resolved.loading],
    );

    // Merge refs.
    const combinedRef = useCallback(
      (node) => {
        drawerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    // If not open, render nothing.
    if (!open) {
      return null;
    }

    return (
      <div
        ref={containerRef}
        className={containerClasses}
        {...rest}
      >
        {/* Overlay */}
        <motion.div
          className={overlayClasses}
          {...overlayAnimationConfig}
          onClick={() => {
            if (resolved.closeOnOutsideClick && interactive) {
              handleOpenChange(false);
            }
          }}
        />

        {/* Drawer Content */}
        <motion.div
          ref={combinedRef}
          className={contentClasses}
          {...animationConfig}
          {...ariaProps}
        >
          {children}
        </motion.div>
      </div>
    );
  }),
);

DrawerContainer.displayName = 'DrawerContainer';

DrawerContainer.propTypes = {
  /** Drawer content (Header, Body, Footer, etc.). */
  children: PropTypes.node,
  /** Controlled open state. */
  open: PropTypes.bool,
  /** Default open state for uncontrolled mode. */
  defaultOpen: PropTypes.bool,
  /** Callback when open state changes. */
  onOpenChange: PropTypes.func,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error', 'glass']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Drawer position. */
  position: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  /** Animation type. */
  animation: PropTypes.oneOf(['slide', 'fade', 'scale', 'none']),
  /** Overlay type. */
  overlay: PropTypes.oneOf(['default', 'blur', 'dark', 'transparent']),
  /** Close drawer when Escape key is pressed. */
  closeOnEscape: PropTypes.bool,
  /** Close drawer when clicking outside. */
  closeOnOutsideClick: PropTypes.bool,
  /** Disabled state. */
  disabled: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Responsive overrides. */
  responsive: PropTypes.shape({
    xs: PropTypes.string,
    sm: PropTypes.string,
    md: PropTypes.string,
    lg: PropTypes.string,
    xl: PropTypes.string,
  }),
  /** Additional CSS classes for the container. */
  className: PropTypes.string,
  /** Additional CSS classes for the overlay. */
  overlayClassName: PropTypes.string,
  /** Additional CSS classes for the drawer wrapper. */
  containerClassName: PropTypes.string,
  /** ARIA role. */
  role: PropTypes.string,
  /** ID of element labelling the drawer. */
  'aria-labelledby': PropTypes.string,
  /** ID of element describing the drawer. */
  'aria-describedby': PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default DrawerContainer;