/**
 * KisanO Design System — Alert Package
 * Alert
 *
 * The main Alert component that orchestrates all alert subcomponents.
 * Provides a convenient API for rendering alerts with icons, messages,
 * actions, and loading states.
 *
 * Single Responsibility: Orchestrate Alert subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Alert/Alert
 */

import { forwardRef, memo, useMemo, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  ALERT_DEFAULTS,
} from './alertVariants';
import {
  resolveDefaultProps,
  isInteractiveAlert,
} from './alertUtils';

import AlertContainer from './AlertContainer';
import AlertHeader from './AlertHeader';
import AlertBody from './AlertBody';
import AlertActions from './AlertActions';
import AlertIcon from './AlertIcon';
import AlertCloseButton from './AlertCloseButton';
import AlertLoader from './AlertLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Alert – the main alert component with icon, message, and actions.
 *
 * @component
 * @example
 * <Alert
 *   variant="success"
 *   title="Success!"
 *   message="Your changes have been saved."
 *   onClose={handleClose}
 * />
 *
 * @example
 * <Alert
 *   variant="error"
 *   message="Something went wrong."
 *   actions={<Button onClick={handleRetry}>Retry</Button>}
 *   closeable
 * />
 */
const Alert = memo(
  forwardRef(function Alert(
    {
      children,
      title,
      message,
      icon,
      actions,
      variant = ALERT_DEFAULTS.variant,
      size = ALERT_DEFAULTS.size,
      radius = ALERT_DEFAULTS.radius,
      shadow = ALERT_DEFAULTS.shadow,
      animation = ALERT_DEFAULTS.animation,
      closeable = ALERT_DEFAULTS.closeable,
      dismissible = ALERT_DEFAULTS.dismissible,
      autoClose = ALERT_DEFAULTS.autoClose,
      duration = ALERT_DEFAULTS.duration,
      showIcon = ALERT_DEFAULTS.showIcon,
      loading = false,
      disabled = false,
      responsive,
      className = '',
      onClose,
      role = 'alert',
      'aria-label': ariaLabel,
      closeButtonProps,
      loaderProps,
      iconProps,
      actionsProps,
      bodyProps,
      ...rest
    },
    ref,
  ) {
    const [isVisible, setIsVisible] = useState(true);
    const [internalLoading, setInternalLoading] = useState(loading);

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          radius,
          shadow,
          animation,
          closeable,
          dismissible,
          autoClose,
          duration,
          showIcon,
          loading: internalLoading,
          disabled,
        }),
      [
        variant,
        size,
        radius,
        shadow,
        animation,
        closeable,
        dismissible,
        autoClose,
        duration,
        showIcon,
        internalLoading,
        disabled,
      ],
    );

    // Determine if interactive.
    const interactive = useMemo(
      () => isInteractiveAlert({ disabled: resolved.disabled, loading: resolved.loading }),
      [resolved.disabled, resolved.loading],
    );

    // Handle close.
    const handleClose = useCallback(() => {
      if (!interactive) return;
      setIsVisible(false);
      onClose?.();
    }, [interactive, onClose]);

    // Auto close timer.
    useEffect(() => {
      if (!resolved.autoClose || resolved.loading || resolved.disabled || !isVisible) {
        return;
      }

      const timer = setTimeout(() => {
        handleClose();
      }, resolved.duration);

      return () => clearTimeout(timer);
    }, [resolved.autoClose, resolved.duration, resolved.loading, resolved.disabled, isVisible, handleClose]);

    // Show loader when loading prop changes.
    useEffect(() => {
      setInternalLoading(loading);
    }, [loading]);

    // If not visible, render nothing.
    if (!isVisible) {
      return null;
    }

    // Determine if we should show loader.
    const showLoader = resolved.loading;

    // Default loader.
    const defaultLoader = (
      <AlertLoader
        size={resolved.size}
        variant="shimmer"
        rows={2}
        {...loaderProps}
      />
    );

    // Default close button.
    const defaultCloseButton = resolved.closeable && (
      <AlertCloseButton
        onClick={handleClose}
        size={resolved.size}
        disabled={resolved.disabled}
        {...closeButtonProps}
      />
    );

    // Build icon content.
    const iconContent = useMemo(() => {
      if (icon) return icon;
      if (resolved.showIcon) {
        return <AlertIcon variant={resolved.variant} size={resolved.size} disabled={resolved.disabled} {...iconProps} />;
      }
      return null;
    }, [icon, resolved.variant, resolved.size, resolved.disabled, resolved.showIcon, iconProps]);

    // Build header content.
    const headerContent = useMemo(() => {
      if (children) return children;
      if (title || message) {
        return (
          <AlertHeader
            title={title}
            message={message}
            size={resolved.size}
            disabled={resolved.disabled}
            loading={resolved.loading}
            {...bodyProps}
          />
        );
      }
      return null;
    }, [children, title, message, resolved.size, resolved.disabled, resolved.loading, bodyProps]);

    // Build actions content.
    const actionsContent = useMemo(() => {
      if (actions) {
        return (
          <AlertActions
            size={resolved.size}
            disabled={resolved.disabled}
            loading={resolved.loading}
            {...actionsProps}
          >
            {actions}
          </AlertActions>
        );
      }
      return null;
    }, [actions, resolved.size, resolved.disabled, resolved.loading, actionsProps]);

    // Container props.
    const containerProps = {
      variant: resolved.variant,
      size: resolved.size,
      radius: resolved.radius,
      shadow: resolved.shadow,
      animation: resolved.animation,
      disabled: resolved.disabled,
      loading: resolved.loading,
      responsive,
      className,
      role,
      'aria-label': ariaLabel || title || message || 'Alert',
    };

    return (
      <AlertContainer ref={ref} {...containerProps} {...rest}>
        {/* Icon */}
        {iconContent}

        {/* Content or Loader */}
        {showLoader ? (
          defaultLoader
        ) : (
          <div className="flex-1 min-w-0">
            {headerContent}
            {actionsContent}
          </div>
        )}

        {/* Close Button */}
        {defaultCloseButton}
      </AlertContainer>
    );
  }),
);

Alert.displayName = 'Alert';

Alert.propTypes = {
  /** Alert content (alternative to title/message). */
  children: PropTypes.node,
  /** Alert title. */
  title: PropTypes.node,
  /** Alert message. */
  message: PropTypes.node,
  /** Custom icon (overrides default). */
  icon: PropTypes.node,
  /** Action elements (buttons, etc.). */
  actions: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info']),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Shadow level. */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Animation type. */
  animation: PropTypes.oneOf(['slide', 'fade', 'scale', 'none']),
  /** Whether to show the close button. */
  closeable: PropTypes.bool,
  /** Whether the alert is dismissible. */
  dismissible: PropTypes.bool,
  /** Auto close the alert. */
  autoClose: PropTypes.bool,
  /** Auto close duration in milliseconds. */
  duration: PropTypes.number,
  /** Whether to show the icon. */
  showIcon: PropTypes.bool,
  /** Loading state. */
  loading: PropTypes.bool,
  /** Disabled state. */
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
  /** Called when alert closes. */
  onClose: PropTypes.func,
  /** ARIA role. */
  role: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
  /** Additional props for AlertCloseButton. */
  closeButtonProps: PropTypes.object,
  /** Additional props for AlertLoader. */
  loaderProps: PropTypes.object,
  /** Additional props for AlertIcon. */
  iconProps: PropTypes.object,
  /** Additional props for AlertActions. */
  actionsProps: PropTypes.object,
  /** Additional props for AlertBody. */
  bodyProps: PropTypes.object,
};

export default Alert;