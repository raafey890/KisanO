/**
 * KisanO Design System — Dialog Package
 * DialogContainer
 *
 * The container component that wraps the dialog content and handles
 * open/close state, escape key, outside clicks, focus trapping,
 * body scroll locking, and overlay rendering.
 *
 * Single Responsibility: Manage dialog positioning and interactions.
 * Does not render header, body, or footer content directly.
 *
 * @module components/ui/Dialog/DialogContainer
 */

import { forwardRef, memo, useMemo, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import {
  DIALOG_DEFAULTS,
  getDialogAnimation,
  getDialogOverlay,
} from './dialogVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getDialogContainerClasses,
  getDialogOverlayClasses,
  getDialogContentClasses,
  isInteractiveDialog,
} from './dialogUtils';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * DialogContainer – the main dialog wrapper with overlay and interactions.
 *
 * @component
 * @example
 * <DialogContainer open={isOpen} onOpenChange={setOpen}>
 *   <DialogHeader>Title</DialogHeader>
 *   <DialogBody>Content</DialogBody>
 *   <DialogFooter>Actions</DialogFooter>
 * </DialogContainer>
 */
const DialogContainer = memo(
  forwardRef(function DialogContainer(
    {
      children,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
      variant = DIALOG_DEFAULTS.variant,
      size = DIALOG_DEFAULTS.size,
      radius = DIALOG_DEFAULTS.radius,
      shadow = DIALOG_DEFAULTS.shadow,
      animation = DIALOG_DEFAULTS.animation,
      overlay = DIALOG_DEFAULTS.overlay,
      closeOnEscape = DIALOG_DEFAULTS.closeOnEscape,
      closeOnOutsideClick = DIALOG_DEFAULTS.closeOnOutsideClick,
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
    const dialogRef = useRef(null);
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
      () => isInteractiveDialog({ disabled: resolved.disabled, loading: resolved.loading }),
      [resolved.disabled, resolved.loading],
    );

    // Container classes.
    const containerClasses = useMemo(() => {
      const base = getDialogContainerClasses(containerClassName);
      return responsive ? mergeClasses(base, resolveResponsiveClasses(responsive)) : base;
    }, [containerClassName, responsive]);

    // Overlay classes.
    const overlayClasses = useMemo(
      () => getDialogOverlayClasses(resolved.overlay, overlayClassName),
      [resolved.overlay, overlayClassName],
    );

    // Dialog content classes.
    const contentClasses = useMemo(() => {
      const base = getDialogContentClasses({
        size: resolved.size,
        className,
      });
      return responsive ? mergeClasses(base, resolveResponsiveClasses(responsive)) : base;
    }, [resolved.size, className, responsive]);

    // Animation props - respect reduced motion.
    const animationConfig = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return getDialogAnimation(resolved.animation);
    }, [prefersReducedMotion, resolved.animation]);

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
        if (dialogRef.current && !dialogRef.current.contains(event.target)) {
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

      // Focus the dialog when it opens.
      const focusableElements = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (focusableElements && focusableElements.length > 0) {
        setTimeout(() => focusableElements[0].focus(), 0);
      } else if (dialogRef.current) {
        dialogRef.current.focus();
      }

      // Trap focus inside the dialog.
      const handleFocus = (event) => {
        if (!dialogRef.current?.contains(event.target)) {
          const firstFocusable = dialogRef.current?.querySelector(
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
        // Restore focus when dialog closes.
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
        dialogRef.current = node;
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

        {/* Dialog Content */}
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

DialogContainer.displayName = 'DialogContainer';

DialogContainer.propTypes = {
  /** Dialog content (Header, Body, Footer, etc.). */
  children: PropTypes.node,
  /** Controlled open state. */
  open: PropTypes.bool,
  /** Default open state for uncontrolled mode. */
  defaultOpen: PropTypes.bool,
  /** Callback when open state changes. */
  onOpenChange: PropTypes.func,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Animation type. */
  animation: PropTypes.oneOf(['fade', 'scale', 'slide', 'slideScale', 'none']),
  /** Overlay type. */
  overlay: PropTypes.oneOf(['default', 'blur', 'dark', 'transparent']),
  /** Close dialog when Escape key is pressed. */
  closeOnEscape: PropTypes.bool,
  /** Close dialog when clicking outside. */
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
  /** Additional CSS classes for the dialog wrapper. */
  containerClassName: PropTypes.string,
  /** ARIA role. */
  role: PropTypes.string,
  /** ID of element labelling the dialog. */
  'aria-labelledby': PropTypes.string,
  /** ID of element describing the dialog. */
  'aria-describedby': PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default DialogContainer;