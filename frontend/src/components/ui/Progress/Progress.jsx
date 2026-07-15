/**
 * KisanO Design System — Progress Package
 * Progress
 *
 * The main Progress component that orchestrates all progress subcomponents.
 * Provides a convenient API for rendering determinate and indeterminate
 * progress bars with labels, values, and accessibility.
 *
 * Single Responsibility: Orchestrate Progress subcomponents.
 * Does not contain business logic, helper functions, or duplicate styling.
 *
 * @module components/ui/Progress/Progress
 */

import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  PROGRESS_DEFAULTS,
} from './progressVariants';
import {
  mergeClasses,
  resolveResponsiveClasses,
  resolveDefaultProps,
} from './progressUtils';

import ProgressContainer from './ProgressContainer';
import ProgressBar from './ProgressBar';
import ProgressLabel from './ProgressLabel';
import ProgressValue from './ProgressValue';
import ProgressLoader from './ProgressLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Progress – the main progress component.
 *
 * @component
 * @example
 * <Progress value={75} max={100} />
 *
 * @example
 * <Progress value={50} label="Loading" showValue />
 *
 * @example
 * <Progress indeterminate variant="success" size="lg" />
 */
const Progress = memo(
  forwardRef(function Progress(
    {
      children,
      value = PROGRESS_DEFAULTS.value,
      max = PROGRESS_DEFAULTS.max,
      label,
      variant = PROGRESS_DEFAULTS.variant,
      size = PROGRESS_DEFAULTS.size,
      radius = PROGRESS_DEFAULTS.radius,
      animation = PROGRESS_DEFAULTS.animation,
      indeterminate = false,
      showValue = PROGRESS_DEFAULTS.showValue,
      showLabel = PROGRESS_DEFAULTS.showLabel,
      disabled = false,
      loading = false,
      responsive,
      className = '',
      containerClassName = '',
      barClassName = '',
      labelClassName = '',
      valueClassName = '',
      containerProps,
      barProps,
      labelProps,
      valueProps,
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
          radius,
          animation,
          value,
          max,
          showValue,
          showLabel,
          disabled,
          loading,
        }),
      [variant, size, radius, animation, value, max, showValue, showLabel, disabled, loading],
    );

    // Calculate percentage.
    const percentage = useMemo(() => {
      if (indeterminate) return 0;
      return Math.max(0, Math.min(100, (resolved.value / resolved.max) * 100));
    }, [resolved.value, resolved.max, indeterminate]);

    // Container props.
    const containerPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        disabled: resolved.disabled,
        loading: resolved.loading,
        className: containerClassName,
        ...containerProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.disabled,
        resolved.loading,
        containerClassName,
        containerProps,
      ],
    );

    // Bar props.
    const barPropsMerged = useMemo(
      () => ({
        variant: resolved.variant,
        size: resolved.size,
        radius: resolved.radius,
        animation: resolved.animation,
        value: resolved.value,
        max: resolved.max,
        disabled: resolved.disabled,
        loading: resolved.loading,
        indeterminate,
        className: barClassName,
        ...barProps,
      }),
      [
        resolved.variant,
        resolved.size,
        resolved.radius,
        resolved.animation,
        resolved.value,
        resolved.max,
        resolved.disabled,
        resolved.loading,
        indeterminate,
        barClassName,
        barProps,
      ],
    );

    // Label props.
    const labelPropsMerged = useMemo(
      () => ({
        size: resolved.size,
        variant: resolved.variant,
        disabled: resolved.disabled,
        className: labelClassName,
        ...labelProps,
      }),
      [resolved.size, resolved.variant, resolved.disabled, labelClassName, labelProps],
    );

    // Value props.
    const valuePropsMerged = useMemo(
      () => ({
        size: resolved.size,
        variant: resolved.variant,
        disabled: resolved.disabled,
        className: valueClassName,
        ...valueProps,
      }),
      [resolved.size, resolved.variant, resolved.disabled, valueClassName, valueProps],
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

    // Show loader.
    const showLoader = resolved.loading;

    // Render progress content.
    const renderContent = () => {
      if (showLoader) {
        return <ProgressLoader {...loaderPropsMerged} />;
      }

      return <ProgressBar {...barPropsMerged} />;
    };

    return (
      <ProgressContainer ref={ref} {...containerPropsMerged} {...rest}>
        {/* Label and Value */}
        {(showLabel || showValue) && (
          <div className="flex items-center justify-between">
            {showLabel && (label || children) && (
              <ProgressLabel {...labelPropsMerged}>
                {label || children}
              </ProgressLabel>
            )}
            {showValue && !indeterminate && (
              <ProgressValue {...valuePropsMerged}>
                {Math.round(percentage)}%
              </ProgressValue>
            )}
            {showValue && indeterminate && (
              <ProgressValue {...valuePropsMerged}>
                ...
              </ProgressValue>
            )}
          </div>
        )}

        {/* Progress Bar */}
        {renderContent()}
      </ProgressContainer>
    );
  }),
);

Progress.displayName = 'Progress';

Progress.propTypes = {
  /** Progress children (custom label). */
  children: PropTypes.node,
  /** Progress value. */
  value: PropTypes.number,
  /** Maximum value. */
  max: PropTypes.number,
  /** Label text. */
  label: PropTypes.node,
  /** Visual variant. */
  variant: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'info',
    'gradient',
  ]),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override. */
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  /** Animation type. */
  animation: PropTypes.oneOf(['pulse', 'slide', 'bounce', 'none']),
  /** Indeterminate state. */
  indeterminate: PropTypes.bool,
  /** Whether to show the percentage value. */
  showValue: PropTypes.bool,
  /** Whether to show the label. */
  showLabel: PropTypes.bool,
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
  /** Additional CSS classes for the bar. */
  barClassName: PropTypes.string,
  /** Additional CSS classes for the label. */
  labelClassName: PropTypes.string,
  /** Additional CSS classes for the value. */
  valueClassName: PropTypes.string,
  /** Additional props for ProgressContainer. */
  containerProps: PropTypes.object,
  /** Additional props for ProgressBar. */
  barProps: PropTypes.object,
  /** Additional props for ProgressLabel. */
  labelProps: PropTypes.object,
  /** Additional props for ProgressValue. */
  valueProps: PropTypes.object,
  /** Additional props for ProgressLoader. */
  loaderProps: PropTypes.object,
};

export default Progress;