/**
 * KisanO Design System — Dialog Package
 * Dialog
 *
 * The main Dialog component that orchestrates all dialog subcomponents.
 * Provides a convenient API for rendering dialogs with headers, bodies,
 * footers, and loading states.
 *
 * Single Responsibility: Orchestrate Dialog subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Dialog/Dialog
 */

import { forwardRef, memo, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  DIALOG_DEFAULTS,
} from './dialogVariants';
import {
  resolveDefaultProps,
} from './dialogUtils';

import DialogContainer from './DialogContainer';
import DialogHeader from './DialogHeader';
import DialogBody from './DialogBody';
import DialogFooter from './DialogFooter';
import DialogCloseButton from './DialogCloseButton';
import DialogLoader from './DialogLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Dialog – the main dialog component with header, body, and footer.
 *
 * @component
 * @example
 * <Dialog
 *   open={isOpen}
 *   onClose={handleClose}
 *   title="Confirm Action"
 *   description="Are you sure you want to proceed?"
 *   footer={
 *     <>
 *       <Button variant="outline" onClick={handleClose}>Cancel</Button>
 *       <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
 *     </>
 *   }
 * />
 *
 * @example
 * <Dialog
 *   open={isOpen}
 *   onClose={handleClose}
 *   loading
 *   size="lg"
 *   variant="success"
 * >
 *   <DialogHeader title="Success!" />
 *   <DialogBody>Your changes have been saved.</DialogBody>
 * </Dialog>
 */
const Dialog = memo(
  forwardRef(function Dialog(
    {
      children,
      open: controlledOpen,
      defaultOpen = false,
      onClose,
      onOpenChange,
      title,
      description,
      icon,
      header,
      body,
      footer,
      actions,
      closeButton = DIALOG_DEFAULTS.showCloseButton,
      loader,
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
      headerProps,
      bodyProps,
      footerProps,
      closeButtonProps,
      loaderProps,
      ...rest
    },
    ref,
  ) {
    // Internal open state for uncontrolled mode.
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
        if (!newOpen) {
          onClose?.();
        }
      },
      [isControlled, onOpenChange, onClose],
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
          showCloseButton: closeButton,
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
        closeButton,
        disabled,
        loading,
      ],
    );

    // Determine if loading.
    const isLoading = resolved.loading;

    // Determine if interactive.
    const isInteractive = !resolved.disabled && !isLoading;

    // Handle close with safety.
    const handleClose = useCallback(() => {
      if (!isInteractive) return;
      handleOpenChange(false);
    }, [isInteractive, handleOpenChange]);

    // Default close button.
    const defaultCloseButton = resolved.showCloseButton && (
      <DialogCloseButton
        onClick={handleClose}
        size={resolved.size}
        disabled={resolved.disabled}
        {...closeButtonProps}
      />
    );

    // Default loader.
    const defaultLoader = (
      <DialogLoader
        size={resolved.size}
        variant="shimmer"
        animated={true}
        rows={3}
        type="text"
        {...loaderProps}
      />
    );

    // Build header content.
    const headerContent = useMemo(() => {
      if (header) return header;
      if (title || description || icon) {
        return (
          <DialogHeader
            title={title}
            description={description}
            icon={icon}
            size={resolved.size}
            variant={resolved.variant}
            actions={defaultCloseButton}
            disabled={resolved.disabled}
            loading={resolved.loading}
            {...headerProps}
          />
        );
      }
      return null;
    }, [
      header,
      title,
      description,
      icon,
      resolved.size,
      resolved.variant,
      resolved.disabled,
      resolved.loading,
      defaultCloseButton,
      headerProps,
    ]);

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
          <DialogFooter
            variant={resolved.variant}
            size={resolved.size}
            disabled={resolved.disabled}
            loading={resolved.loading}
            {...footerProps}
          >
            {actions}
          </DialogFooter>
        );
      }
      return null;
    }, [footer, actions, resolved.variant, resolved.size, resolved.disabled, resolved.loading, footerProps]);

    // Container props.
    const containerProps = {
      open,
      onOpenChange: handleOpenChange,
      variant: resolved.variant,
      size: resolved.size,
      radius: resolved.radius,
      shadow: resolved.shadow,
      animation: resolved.animation,
      overlay: resolved.overlay,
      closeOnEscape: resolved.closeOnEscape,
      closeOnOutsideClick: resolved.closeOnOutsideClick,
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
    };

    // Determine if we should show loader.
    const showLoader = isLoading;

    return (
      <DialogContainer ref={ref} {...containerProps} {...rest}>
        {/* Header */}
        {headerContent}

        {/* Body or Loader */}
        {showLoader ? (
          loader || defaultLoader
        ) : (
          bodyContent && (
            <DialogBody
              size={resolved.size}
              disabled={resolved.disabled}
              loading={resolved.loading}
              {...bodyProps}
            >
              {bodyContent}
            </DialogBody>
          )
        )}

        {/* Footer */}
        {footerContent}
      </DialogContainer>
    );
  }),
);

Dialog.displayName = 'Dialog';

Dialog.propTypes = {
  /** Dialog content (alternative to body slot). */
  children: PropTypes.node,
  /** Controlled open state. */
  open: PropTypes.bool,
  /** Default open state for uncontrolled mode. */
  defaultOpen: PropTypes.bool,
  /** Callback when dialog closes. */
  onClose: PropTypes.func,
  /** Callback when open state changes. */
  onOpenChange: PropTypes.func,
  /** Dialog title. */
  title: PropTypes.node,
  /** Dialog description. */
  description: PropTypes.node,
  /** Icon displayed in the header. */
  icon: PropTypes.node,
  /** Custom header content (overrides title/description/icon). */
  header: PropTypes.node,
  /** Body content. */
  body: PropTypes.node,
  /** Footer content. */
  footer: PropTypes.node,
  /** Actions rendered in footer (auto-wrapped with DialogFooter). */
  actions: PropTypes.node,
  /** Whether to show the close button. */
  closeButton: PropTypes.bool,
  /** Custom loader (overrides default). */
  loader: PropTypes.node,
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
  /** Additional props for DialogHeader. */
  headerProps: PropTypes.object,
  /** Additional props for DialogBody. */
  bodyProps: PropTypes.object,
  /** Additional props for DialogFooter. */
  footerProps: PropTypes.object,
  /** Additional props for DialogCloseButton. */
  closeButtonProps: PropTypes.object,
  /** Additional props for DialogLoader. */
  loaderProps: PropTypes.object,
};

export default Dialog;