/**
 * KisanO Design System — Alert Package
 * AlertContainer
 *
 * The container component that wraps the alert content and handles
 * styling, animations, and accessibility. Serves as the foundation
 * for all alert variants and states.
 *
 * Single Responsibility: Render the alert container with styling
 * and animations. Does not manage alert state or business logic.
 *
 * @module components/ui/Alert/AlertContainer
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, useReducedMotion } from 'framer-motion';

import {
  ALERT_DEFAULTS,
  getAlertAnimation,
} from './alertVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
  getAlertClasses,
  getAlertContainerClasses,
  isInteractiveAlert,
} from './alertUtils';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * AlertContainer – the main alert wrapper with styling and animations.
 *
 * @component
 * @example
 * <AlertContainer variant="success" size="md">
 *   <AlertIcon />
 *   <AlertBody>Success message</AlertBody>
 * </AlertContainer>
 */
const AlertContainer = memo(
  forwardRef(function AlertContainer(
    {
      children,
      variant = ALERT_DEFAULTS.variant,
      size = ALERT_DEFAULTS.size,
      radius = ALERT_DEFAULTS.radius,
      shadow = ALERT_DEFAULTS.shadow,
      animation = ALERT_DEFAULTS.animation,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      role = 'alert',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          radius,
          shadow,
          animation,
          disabled,
          loading,
        }),
      [variant, size, radius, shadow, animation, disabled, loading],
    );

    // Determine if interactive.
    const interactive = useMemo(
      () => isInteractiveAlert({ disabled: resolved.disabled, loading: resolved.loading }),
      [resolved.disabled, resolved.loading],
    );

    // Container classes.
    const containerClasses = useMemo(() => {
      const base = getAlertContainerClasses(className);
      return responsive ? mergeClasses(base, resolveResponsiveClasses(responsive)) : base;
    }, [className, responsive]);

    // Alert classes.
    const alertClasses = useMemo(
      () =>
        getAlertClasses({
          variant: resolved.variant,
          size: resolved.size,
          radius: resolved.radius,
          shadow: resolved.shadow,
          className: containerClasses,
          disabled: resolved.disabled,
          loading: resolved.loading,
        }),
      [
        resolved.variant,
        resolved.size,
        resolved.radius,
        resolved.shadow,
        containerClasses,
        resolved.disabled,
        resolved.loading,
      ],
    );

    // Animation props - respect reduced motion.
    const animationConfig = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return getAlertAnimation(resolved.animation);
    }, [prefersReducedMotion, resolved.animation]);

    // Accessibility attributes.
    const ariaProps = useMemo(
      () => ({
        role,
        'aria-label': ariaLabel || 'Alert',
        'aria-disabled': resolved.disabled || undefined,
        'aria-busy': resolved.loading || undefined,
      }),
      [role, ariaLabel, resolved.disabled, resolved.loading],
    );

    return (
      <motion.div
        ref={ref}
        className={alertClasses}
        {...animationConfig}
        {...ariaProps}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }),
);

AlertContainer.displayName = 'AlertContainer';

AlertContainer.propTypes = {
  /** Alert content (Icon, Body, Actions, etc.). */
  children: PropTypes.node,
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
  /** Additional CSS classes. */
  className: PropTypes.string,
  /** ARIA role. */
  role: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default AlertContainer;