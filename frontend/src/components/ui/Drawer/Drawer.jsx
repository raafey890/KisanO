/**
 * KisanO Design System — Drawer Package
 * Drawer
 *
 * The main Drawer component that orchestrates all drawer subcomponents.
 * Provides a convenient API for rendering drawers with headers, bodies,
 * footers, and loading states.
 *
 * Single Responsibility: Orchestrate Drawer subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Drawer/Drawer
 */

import { forwardRef, memo, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  DRAWER_DEFAULTS,
} from './drawerVariants';
import {
  resolveDefaultProps,
} from './drawerUtils';

import DrawerContainer from './DrawerContainer';
import DrawerHeader from './DrawerHeader';
import DrawerBody from './DrawerBody';
import DrawerFooter from './DrawerFooter';
import DrawerCloseButton from './DrawerCloseButton';
import DrawerLoader from './DrawerLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Drawer – the main drawer component with header, body, and footer.
 *
 * @component
 * @example
 * <Drawer
 *   open={isOpen}
 *   onClose={handleClose}
 *   title="Settings"
 *   description="Configure your preferences"
 *   position="right"
 *   size="md"
 * >
 *   <DrawerBody>Content here...</DrawerBody>
 * </Drawer>
 *
 * @example
 * <Drawer
 *   open={isOpen}
 *   onClose={handleClose}
 *   loading
 *   position="bottom"
 *   variant="primary"
 * >
 *   <DrawerHeader title="Loading..." />
 * </Drawer>
 */
const Drawer = memo(
  forwardRef(function Drawer(
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
      closeButton = DRAWER_DEFAULTS.showCloseButton,
      loader,
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
          position,
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
        position,
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
      <DrawerCloseButton
        onClick={handleClose}
        size={resolved.size}
        disabled={resolved.disabled}
        {...closeButtonProps}
      />
    );

    // Default loader.
    const defaultLoader = (
      <DrawerLoader
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
          <DrawerHeader
            title={title}
            description={description}
            icon={icon}
            size={resolved.size}
            variant={resolved.variant}
            position={resolved.position}
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
      resolved.position,
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
          <DrawerFooter
            variant={resolved.variant}
            size={resolved.size}
            disabled={resolved.disabled}
            loading={resolved.loading}
            {...footerProps}
          >
            {actions}
          </DrawerFooter>
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
      position: resolved.position,
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
      <DrawerContainer ref={ref} {...containerProps} {...rest}>
        {/* Header */}
        {headerContent}

        {/* Body or Loader */}
        {showLoader ? (
          loader || defaultLoader
        ) : (
          bodyContent && (
            <DrawerBody
              size={resolved.size}
              disabled={resolved.disabled}
              loading={resolved.loading}
              {...bodyProps}
            >
              {bodyContent}
            </DrawerBody>
          )
        )}

        {/* Footer */}
        {footerContent}
      </DrawerContainer>
    );
  }),
);

Drawer.displayName = 'Drawer';

Drawer.propTypes = {
  /** Drawer content (alternative to body slot). */
  children: PropTypes.node,
  /** Controlled open state. */
  open: PropTypes.bool,
  /** Default open state for uncontrolled mode. */
  defaultOpen: PropTypes.bool,
  /** Callback when drawer closes. */
  onClose: PropTypes.func,
  /** Callback when open state changes. */
  onOpenChange: PropTypes.func,
  /** Drawer title. */
  title: PropTypes.node,
  /** Drawer description. */
  description: PropTypes.node,
  /** Icon displayed in the header. */
  icon: PropTypes.node,
  /** Custom header content (overrides title/description/icon). */
  header: PropTypes.node,
  /** Body content. */
  body: PropTypes.node,
  /** Footer content. */
  footer: PropTypes.node,
  /** Actions rendered in footer (auto-wrapped with DrawerFooter). */
  actions: PropTypes.node,
  /** Whether to show the close button. */
  closeButton: PropTypes.bool,
  /** Custom loader (overrides default). */
  loader: PropTypes.node,
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
  /** Additional props for DrawerHeader. */
  headerProps: PropTypes.object,
  /** Additional props for DrawerBody. */
  bodyProps: PropTypes.object,
  /** Additional props for DrawerFooter. */
  footerProps: PropTypes.object,
  /** Additional props for DrawerCloseButton. */
  closeButtonProps: PropTypes.object,
  /** Additional props for DrawerLoader. */
  loaderProps: PropTypes.object,
};

export default Drawer;