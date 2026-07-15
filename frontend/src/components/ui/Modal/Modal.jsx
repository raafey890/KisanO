/**
 * KisanO Design System — Modal Package
 * Modal
 *
 * The main Modal component that orchestrates all modal subcomponents.
 * Provides a convenient slot‑based API for composing modal content,
 * and handles open/close state, loading states, accessibility, and animations.
 *
 * Single Responsibility: Orchestrate the Modal subcomponents.
 * It does not contain business logic, helper functions, or duplicate
 * styling logic — everything is delegated to the subcomponents and
 * shared utilities.
 *
 * @module components/ui/Modal/Modal
 */

import { forwardRef, memo, useMemo, useState, useCallback } from "react";

import PropTypes from 'prop-types';


import {
  MODAL_DEFAULTS,
} from './modalVariants';
import {
  
  resolveDefaultProps,
} from './modalUtils';

import ModalContainer from './ModalContainer';
import ModalHeader from './ModalHeader';
import ModalBody from './ModalBody';
import ModalFooter from './ModalFooter';
import ModalCloseButton from './ModalCloseButton';
import ModalLoader from './ModalLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Modal – the main container for modal content with built‑in slots.
 *
 * @component
 * @example
 * <Modal
 *   open={isOpen}
 *   onClose={handleClose}
 *   size="md"
 *   centered
 *   title="Confirm Action"
 *   body={<p>Are you sure you want to proceed?</p>}
 *   footer={
 *     <>
 *       <Button variant="outline" onClick={handleClose}>Cancel</Button>
 *       <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
 *     </>
 *   }
 * />
 */
const Modal = memo(
  forwardRef(function Modal(
    {
      open = false,
      onClose,
      children,
      title,
      subtitle,
      icon,
      header,
      body,
      footer,
      actions,
      closeButton = true,
      loader,
      size = MODAL_DEFAULTS.size,
      variant = MODAL_DEFAULTS.variant,
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
      headerProps,
      bodyProps,
      footerProps,
      closeButtonProps,
      loaderProps,
      ...rest
    },
    ref,
  ) {
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

    // Handle close with safety check.
    const handleClose = useCallback(() => {
      if (!resolved.disabled && !resolved.loading) {
        onClose?.();
      }
    }, [resolved.disabled, resolved.loading, onClose]);

    // Default close button.
    const defaultCloseButton = useMemo(
  () =>
    closeButton ? (
      <ModalCloseButton
        onClick={handleClose}
        size={resolved.size}
        disabled={resolved.disabled}
        {...closeButtonProps}
      />
    ) : null,
  [closeButton, handleClose, resolved.size, resolved.disabled, closeButtonProps],
);
      <ModalCloseButton
        onClick={handleClose}
        size={resolved.size}
        disabled={resolved.disabled}
        {...closeButtonProps}
      />
    

    // Default loader.
   const defaultLoader = useMemo(
  () => (
    <ModalLoader
      size={resolved.size}
      variant="shimmer"
      animated
      rows={4}
      type="text"
      {...loaderProps}
    />
  ),
  [resolved.size, loaderProps],
);
      <ModalLoader
        size={resolved.size}
        variant="shimmer"
        animated={true}
        rows={4}
        type="text"
        {...loaderProps}
      />
    

    // Build header content.
    const headerContent = useMemo(() => {
      if (header) return header;
      if (title || subtitle || icon) {
        return (
          <ModalHeader
            title={title}
            subtitle={subtitle}
            icon={icon}
            size={resolved.size}
            actions={defaultCloseButton}
            {...headerProps}
          />
        );
      }
      return null;
    }, [header, title, subtitle, icon, resolved.size, defaultCloseButton, headerProps]);

    // Build body content.
    const bodyContent = useMemo(() => {
      if (body) return body;
      if (children) return children;
      return null;
    }, [body, children]);

    // Build footer content.
    const footerContent = useMemo(() => {
      if (footer) return footer;
      if (actions) {
        return (
          <ModalFooter
            align="right"
            spacing="md"
            divider
            {...footerProps}
          >
            {actions}
          </ModalFooter>
        );
      }
      return null;
    }, [footer, actions, footerProps]);

    // Determine if we should show loader.
    const showLoader = resolved.loading;

    // Container props.
    const containerProps = useMemo(
  () => ({
    open,
    onClose: handleClose,
    variant: resolved.variant,
    size: resolved.size,
    radius: resolved.radius,
    shadow: resolved.shadow,
    centered: resolved.centered,
    fullscreen: resolved.fullscreen,
    scrollable: resolved.scrollable,
    closeOnOverlayClick: resolved.closeOnOverlayClick,
    closeOnEscape: resolved.closeOnEscape,
    disabled: resolved.disabled,
    loading: resolved.loading,
    responsive,
    className,
    overlayClassName,
    containerClassName,
    role,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-label': ariaLabel,
  }),
  [
    open,
    handleClose,
    resolved,
    responsive,
    className,
    overlayClassName,
    containerClassName,
    role,
    ariaLabelledBy,
    ariaDescribedBy,
    ariaLabel,
  ],
);
    return (
      <ModalContainer ref={ref} {...containerProps} {...rest}>
        {/* Header */}
        {headerContent}

        {/* Body or Loader */}
        {showLoader ? (
          loader || defaultLoader
        ) : (
          bodyContent && (
            <ModalBody
              scrollable={resolved.scrollable}
              disabled={resolved.disabled}
              loading={resolved.loading}
              {...bodyProps}
            >
              {bodyContent}
            </ModalBody>
          )
        )}

        {/* Footer */}
        {footerContent}
      </ModalContainer>
    );
  }),
);

Modal.displayName = 'Modal';

Modal.propTypes = {
  /** Controls modal visibility. */
  open: PropTypes.bool,
  /** Callback when modal should close. */
  onClose: PropTypes.func,
  /** Modal content (alternative to body slot). */
  children: PropTypes.node,
  /** Title of the modal. */
  title: PropTypes.node,
  /** Subtitle or description. */
  subtitle: PropTypes.node,
  /** Icon displayed in the header. */
  icon: PropTypes.node,
  /** Custom header content (overrides title/subtitle/icon). */
  header: PropTypes.node,
  /** Body content. */
  body: PropTypes.node,
  /** Footer content. */
  footer: PropTypes.node,
  /** Actions rendered in footer (auto-wrapped with ModalFooter). */
  actions: PropTypes.node,
  /** Whether to show the close button. */
  closeButton: PropTypes.bool,
  /** Custom loader (overrides default). */
  loader: PropTypes.node,
  /** Visual variant. */
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
  /** Additional props for ModalHeader. */
  headerProps: PropTypes.object,
  /** Additional props for ModalBody. */
  bodyProps: PropTypes.object,
  /** Additional props for ModalFooter. */
  footerProps: PropTypes.object,
  /** Additional props for ModalCloseButton. */
  closeButtonProps: PropTypes.object,
  /** Additional props for ModalLoader. */
  loaderProps: PropTypes.object,
};

export default Modal;