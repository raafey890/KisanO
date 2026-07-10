/**
 * KisanO Design System — Modal Package
 * ModalContainer
 *
 * The main container component for Modals. It handles the overlay, backdrop,
 * positioning, sizing, and accessibility of the modal dialog. It does not
 * render the modal content itself — that is the responsibility of child
 * components (ModalHeader, ModalBody, ModalFooter, etc.).
 *
 * Single Responsibility: Render the modal container with overlay and
 * accessibility features. Does not handle content layout or business logic.
 *
 * @module components/ui/Modal/ModalContainer
 */

import { forwardRef, memo, useMemo, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import {
  
  MODAL_DEFAULTS,
} from './modalVariants';
import {
  mergeClasses,
  resolveDefaultProps,
  resolveResponsiveClasses,
  getModalSizeClasses,
  getModalVariantClasses,
  getModalRadiusClasses,
  getModalShadowClasses,
  getOverlayClasses,
} from './modalUtils';

/* ---------------------------------- */
/* Component‑specific tokens          */
/* ---------------------------------- */

/** Motion variants for the modal content. */
const CONTENT_MOTION = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
};

/** Motion variants for the overlay backdrop. */
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
 * ModalContainer – the main modal wrapper with overlay and accessibility.
 *
 * @component
 * @example
 * <ModalContainer
 *   open={isOpen}
 *   onClose={handleClose}
 *   size="md"
 *   centered
 * >
 *   <ModalHeader>Title</ModalHeader>
 *   <ModalBody>Content</ModalBody>
 *   <ModalFooter>Actions</ModalFooter>
 * </ModalContainer>
 */
const ModalContainer = memo(
  forwardRef(function ModalContainer(
    {
      children,
      open = false,
      onClose,
      variant = MODAL_DEFAULTS.variant,
      size = MODAL_DEFAULTS.size,
      radius = MODAL_DEFAULTS.radius,
      shadow = MODAL_DEFAULTS.shadow,
      centered = MODAL_DEFAULTS.centered,
      fullscreen = MODAL_DEFAULTS.fullscreen,
      scrollable = MODAL_DEFAULTS.scrollable,
      closeOnOverlayClick = true,
      closeOnEscape = true,
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
    const modalRef = useRef(null);

    // Resolve default props.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          radius,
          shadow,
          centered,
          fullscreen,
          scrollable,
          closeOnOverlayClick,
          closeOnEscape,
          disabled,
          loading,
        }),
      [
        variant,
        size,
        radius,
        shadow,
        centered,
        fullscreen,
        scrollable,
        closeOnOverlayClick,
        closeOnEscape,
        disabled,
        loading,
      ],
    );

    // Build modal container classes.
    const containerClasses = useMemo(() => {
      const base = mergeClasses(
        'fixed inset-0 z-50 flex',
        resolved.centered ? 'items-center justify-center' : 'items-start justify-center pt-16',
        resolved.fullscreen ? 'p-0' : 'p-4',
        containerClassName,
      );
      return base;
    }, [resolved.centered, resolved.fullscreen, containerClassName]);

    // Build overlay classes.
    const overlayClasses = useMemo(
      () =>
        mergeClasses(
          getOverlayClasses('default'),
          overlayClassName,
        ),
      [overlayClassName],
    );

    // Build modal content classes.
    const modalClasses = useMemo(() => {
      const base = mergeClasses(
        'relative w-full max-h-full',
        getModalVariantClasses(resolved.variant),
        getModalRadiusClasses(resolved.radius),
        getModalShadowClasses(resolved.shadow),
        resolved.fullscreen ? 'h-full max-w-full rounded-none' : getModalSizeClasses(resolved.size),
        resolved.scrollable ? 'overflow-y-auto' : 'overflow-hidden',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        loading && 'opacity-70',
        className,
      );
      return base;
    }, [
      resolved.variant,
      resolved.radius,
      resolved.shadow,
      resolved.size,
      resolved.fullscreen,
      resolved.scrollable,
      disabled,
      loading,
      className,
    ]);

    // Responsive overrides.
    const responsiveClasses = useMemo(
      () => (responsive ? resolveResponsiveClasses(responsive) : ''),
      [responsive],
    );

    const finalModalClasses = useMemo(
      () => mergeClasses(modalClasses, responsiveClasses),
      [modalClasses, responsiveClasses],
    );

    // Handle escape key.
    const handleEscape = useCallback(
      (event) => {
        if (event.key === 'Escape' && resolved.closeOnEscape && open) {
          onClose?.();
        }
      },
      [resolved.closeOnEscape, open, onClose],
    );

    // Handle overlay click.
    const handleOverlayClick = useCallback(
      (event) => {
        if (event.target === event.currentTarget && resolved.closeOnOverlayClick) {
          onClose?.();
        }
      },
      [resolved.closeOnOverlayClick, onClose],
    );

    // Set up escape key listener.
    useEffect(() => {
      if (!open) return;
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [open, handleEscape]);

    // Prevent body scroll when modal is open.
    useEffect(() => {
      if (!open) return;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }, [open]);

    // Focus management: trap focus inside modal.
    useEffect(() => {
      if (!open) return;
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableElements?.length) return;
      focusableElements[0]?.focus();
    }, [open]);

    // Motion props – respect reduced motion.
    const contentMotionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return CONTENT_MOTION;
    }, [prefersReducedMotion]);

    const overlayMotionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return OVERLAY_MOTION;
    }, [prefersReducedMotion]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-modal': true,
        'aria-labelledby': ariaLabelledBy,
        'aria-describedby': ariaDescribedBy,
        'aria-label': ariaLabel,
        'aria-disabled': disabled || undefined,
        'aria-busy': loading || undefined,
      }),
      [role, ariaLabelledBy, ariaDescribedBy, ariaLabel, disabled, loading],
    );

    // Merge refs (forwarded + internal).
    const combinedRef = useCallback(
      (node) => {
        modalRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    return (
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            className={containerClasses}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            {...rest}
          >
            {/* Overlay */}
            <motion.div
              className={overlayClasses}
              aria-hidden="true"
              onClick={handleOverlayClick}
              {...overlayMotionProps}
            />

            {/* Modal */}
            <motion.div
              ref={combinedRef}
              tabIndex={-1}
              className={finalModalClasses}
              {...contentMotionProps}
              {...ariaProps}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }),
);

ModalContainer.displayName = 'ModalContainer';

ModalContainer.propTypes = {
  /** Modal content (Header, Body, Footer, etc.) */
  children: PropTypes.node,
  /** Controls modal visibility. */
  open: PropTypes.bool,
  /** Callback when modal should close. */
  onClose: PropTypes.func,
  /** Visual variant of the modal. */
  variant: PropTypes.oneOf(['default', 'elevated', 'glass', 'outlined']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Centers the modal vertically. */
  centered: PropTypes.bool,
  /** Makes the modal fullscreen. */
  fullscreen: PropTypes.bool,
  /** Enables scrolling inside the modal. */
  scrollable: PropTypes.bool,
  /** Closes modal when overlay is clicked. */
  closeOnOverlayClick: PropTypes.bool,
  /** Closes modal when Escape key is pressed. */
  closeOnEscape: PropTypes.bool,
  /** Disables interactions. */
  disabled: PropTypes.bool,
  /** Shows loading state. */
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
  /** Additional CSS classes for the modal wrapper. */
  containerClassName: PropTypes.string,
  /** ARIA role. */
  role: PropTypes.string,
  /** ID of element labelling the modal. */
  'aria-labelledby': PropTypes.string,
  /** ID of element describing the modal. */
  'aria-describedby': PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default ModalContainer;