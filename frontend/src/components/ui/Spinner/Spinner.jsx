/**
 * KisanO Design System — Spinner Package
 * Spinner
 *
 * The main Spinner component that orchestrates all spinner subcomponents.
 * Provides a convenient API for rendering ring, dots, and pulse spinners
 * with loading text and accessibility support.
 *
 * Single Responsibility: Orchestrate Spinner subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Spinner/Spinner
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  SPINNER_DEFAULTS,
} from './spinnerVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
} from './spinnerUtils';

import SpinnerContainer from './SpinnerContainer';
import SpinnerRing from './SpinnerRing';
import SpinnerDots from './SpinnerDots';
import SpinnerPulse from './SpinnerPulse';
import SpinnerLoader from './SpinnerLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Spinner – the main spinner component.
 *
 * @component
 * @example
 * <Spinner />
 *
 * @example
 * <Spinner type="dots" variant="primary" size="lg" label="Loading..." />
 *
 * @example
 * <Spinner type="pulse" variant="success" speed="fast" />
 */
const Spinner = memo(
  forwardRef(function Spinner(
    {
      children,
      type = 'ring',
      variant = SPINNER_DEFAULTS.variant,
      size = SPINNER_DEFAULTS.size,
      speed = SPINNER_DEFAULTS.speed,
      animation = SPINNER_DEFAULTS.animation,
      label = 'Loading...',
      disabled = false,
      loading = true,
      responsive,
      className = '',
      containerClassName = '',
      ringClassName = '',
      dotsClassName = '',
      pulseClassName = '',
      containerProps,
      ringProps,
      dotsProps,
      pulseProps,
      loaderProps,
      ...rest
    },
    ref,
  ) {
    // Resolve defaults.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          speed,
          animation,
          disabled,
          loading,
        }),
      [variant, size, speed, animation, disabled, loading],
    );

    // Determine if loading.
    const isLoading = resolved.loading && !resolved.disabled;

    // Container props.
    const containerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        loading: isLoading,
        className: containerClassName,
        ...containerProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.disabled,
        isLoading,
        containerClassName,
        containerProps,
      ],
    );

    // Ring props.
    const ringPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        speed: resolved.speed,
        disabled: resolved.disabled,
        loading: isLoading,
        className: ringClassName,
        ...ringProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.speed,
        resolved.disabled,
        isLoading,
        ringClassName,
        ringProps,
      ],
    );

    // Dots props.
    const dotsPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        speed: resolved.speed,
        disabled: resolved.disabled,
        loading: isLoading,
        className: dotsClassName,
        ...dotsProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.speed,
        resolved.disabled,
        isLoading,
        dotsClassName,
        dotsProps,
      ],
    );

    // Pulse props.
    const pulsePropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        speed: resolved.speed,
        disabled: resolved.disabled,
        loading: isLoading,
        className: pulseClassName,
        ...pulseProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.speed,
        resolved.disabled,
        isLoading,
        pulseClassName,
        pulseProps,
      ],
    );

    // Loader props.
    const loaderPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        variant: 'shimmer',
        disabled: resolved.disabled,
        ...loaderProps,
      }),
      [resolved.size, resolved.disabled, loaderProps],
    );

    // Render spinner content.
    const renderContent = () => {
      if (!isLoading) {
        return null;
      }

      switch (type) {
        case 'dots':
          return <SpinnerDots {...dotsPropsMerged} />;
        case 'pulse':
          return <SpinnerPulse {...pulsePropsMerged} />;
        case 'ring':
        default:
          return <SpinnerRing {...ringPropsMerged} />;
      }
    };

    // Render label.
    const renderLabel = () => {
      if (!isLoading || !label) return null;
      return (
        <span className={mergeClasses(
          'font-medium',
          getSpinnerSize(resolved.size).text,
          resolved.variant === 'white' ? 'text-white' : 'text-gray-600 dark:text-gray-400',
        )}>
          {label}
        </span>
      );
    };

    return (
      <SpinnerContainer ref={ref} {...containerPropsMerged} {...rest}>
        {renderContent()}
        {renderLabel()}
        {children}
      </SpinnerContainer>
    );
  }),
);

Spinner.displayName = 'Spinner';

Spinner.propTypes = {
  /** Spinner children (custom). */
  children: PropTypes.node,
  /** Spinner type. */
  type: PropTypes.oneOf(['ring', 'dots', 'pulse']),
  /** Visual variant. */
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'info',
    'white',
    'dark',
  ]),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  /** Speed preset. */
  speed: PropTypes.oneOf(['slow', 'normal', 'fast', 'faster']),
  /** Animation type. */
  animation: PropTypes.oneOf(['spin', 'pulse', 'bounce', 'fade', 'none']),
  /** Loading label. */
  label: PropTypes.string,
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
  /** Additional CSS classes for the container wrapper. */
  containerClassName: PropTypes.string,
  /** Additional CSS classes for the ring spinner. */
  ringClassName: PropTypes.string,
  /** Additional CSS classes for the dots spinner. */
  dotsClassName: PropTypes.string,
  /** Additional CSS classes for the pulse spinner. */
  pulseClassName: PropTypes.string,
  /** Additional props for SpinnerContainer. */
  containerProps: PropTypes.object,
  /** Additional props for SpinnerRing. */
  ringProps: PropTypes.object,
  /** Additional props for SpinnerDots. */
  dotsProps: PropTypes.object,
  /** Additional props for SpinnerPulse. */
  pulseProps: PropTypes.object,
  /** Additional props for SpinnerLoader. */
  loaderProps: PropTypes.object,
};

export default Spinner;